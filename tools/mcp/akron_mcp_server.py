#!/usr/bin/env python3
"""
Akron MCP Server Utilities
=========================

Provides three MCP-facing roles:
 - filesystem-audit
 - digital-mirror
 - akron-integrity

Each role exposes a small set of tools that the Warp MCP client can call.
The server speaks a minimal JSON-RPC protocol over stdio (Content-Length framed)
so it can be addressed directly via `mcp call`.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import logging
import os
import re
import stat
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple

LOGGER = logging.getLogger("akron-mcp")


# --------------------------------------------------------------------------- #
# JSON-RPC framing helpers
# --------------------------------------------------------------------------- #

def _read_message(stream) -> Optional[Dict[str, Any]]:
    """Read a JSON-RPC message framed with Content-Length headers."""
    headers: Dict[str, str] = {}
    while True:
        line = stream.readline()
        if not line:
            return None
        if isinstance(line, bytes):
            line = line.decode("utf-8", errors="ignore")
        line = line.rstrip("\r\n")
        if not line:
            break
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        headers[key.strip().lower()] = value.strip()
    length = int(headers.get("content-length", "0"))
    if length <= 0:
        return {}
    payload = stream.read(length)
    if isinstance(payload, bytes):
        payload = payload.decode("utf-8", errors="ignore")
    try:
        return json.loads(payload)
    except json.JSONDecodeError:
        LOGGER.exception("Failed to decode JSON payload: %s", payload[:200])
        return None


def _write_message(stream, message: Dict[str, Any]) -> None:
    """Write a JSON-RPC message with Content-Length framing."""
    encoded = json.dumps(message, ensure_ascii=False)
    data = encoded.encode("utf-8")
    header = f"Content-Length: {len(data)}\r\n\r\n".encode("utf-8")
    stream.write(header)
    stream.write(data)
    stream.flush()


def _rpc_error(message_id: Any, code: int, message: str) -> Dict[str, Any]:
    return {
        "jsonrpc": "2.0",
        "id": message_id,
        "error": {"code": code, "message": message},
    }


# --------------------------------------------------------------------------- #
# Filesystem helpers
# --------------------------------------------------------------------------- #

def sha1sum(path: Path, max_bytes: int = 2_000_000) -> Optional[str]:
    """Compute a cheap SHA1 fingerprint (first N bytes) for matching."""
    h = hashlib.sha1()
    try:
        with path.open("rb") as handle:
            remaining = max_bytes
            while remaining > 0:
                chunk = handle.read(min(remaining, 65536))
                if not chunk:
                    break
                h.update(chunk)
                remaining -= len(chunk)
        return h.hexdigest()
    except OSError:
        return None


def _gather_strings(obj: Any) -> Iterable[str]:
    """Recursively walk JSON-like structures and yield string leaves."""
    if isinstance(obj, dict):
        for value in obj.values():
            yield from _gather_strings(value)
    elif isinstance(obj, list):
        for item in obj:
            yield from _gather_strings(item)
    elif isinstance(obj, str):
        yield obj


PATH_PATTERN = re.compile(r"(/[^\"\s]+)")


def extract_paths_from_manifest(manifest: Path) -> List[str]:
    """Best effort extraction of filesystem references from a manifest."""
    paths: List[str] = []
    try:
        text = manifest.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return paths

    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        data = None

    if data is not None:
        for candidate in _gather_strings(data):
            if "/" in candidate or candidate.startswith("~"):
                paths.append(candidate)
    else:
        for match in PATH_PATTERN.finditer(text):
            paths.append(match.group(1))

    return paths


def _resolve_candidates(
    reference: str,
    manifest_path: Optional[Path],
    default_root: Optional[Path],
) -> List[Path]:
    """Return possible concrete paths that may satisfy the reference."""
    candidates: List[Path] = []
    reference_path = Path(reference)

    if reference_path.is_absolute():
        candidates.append(reference_path)
    if reference.startswith("~"):
        candidates.append(Path(reference).expanduser())
    if manifest_path:
        candidates.append((manifest_path.parent / reference).expanduser())
    if default_root:
        candidates.append((default_root / reference).expanduser())

    # Deduplicate while preserving order
    seen: set = set()
    unique: List[Path] = []
    for candidate in candidates:
        candidate = candidate.resolve(strict=False)
        key = str(candidate)
        if key not in seen:
            seen.add(key)
            unique.append(candidate)
    return unique


def collect_broken_symlinks(root: Path, limit: int = 10_000) -> List[str]:
    broken: List[str] = []
    try:
        for path in root.rglob("*"):
            if not path.is_symlink():
                continue
            try:
                path.resolve(strict=True)
            except FileNotFoundError:
                broken.append(str(path))
                if len(broken) >= limit:
                    break
    except PermissionError:
        LOGGER.warning("Permission error scanning %s", root)
    return broken


def scan_for_candidates(
    filename: str,
    search_roots: Iterable[Path],
    max_results: int = 5,
) -> List[Dict[str, Any]]:
    """Search for candidate files matching by normalized name."""
    filename_lower = filename.lower()
    found: List[Dict[str, Any]] = []
    for root in search_roots:
        if not root.exists():
            continue
        try:
            for path in root.rglob("*"):
                if not path.is_file():
                    continue
                if path.name.lower() != filename_lower:
                    continue
                found.append(
                    {
                        "path": str(path),
                        "size": path.stat().st_size,
                        "mtime": path.stat().st_mtime,
                        "sha1": sha1sum(path),
                    }
                )
                if len(found) >= max_results:
                    return found
        except (PermissionError, OSError):
            LOGGER.debug("Skipping restricted subtree %s", root)
    return found


# --------------------------------------------------------------------------- #
# Tool implementations
# --------------------------------------------------------------------------- #

def _tool_audit_missing_files(arguments: Dict[str, Any]) -> Dict[str, Any]:
    root = Path(arguments.get("root", "/Volumes/Akron")).expanduser()
    manifests = [
        Path(p).expanduser() for p in arguments.get("manifests", []) if p
    ]
    export = arguments.get("export")
    include_broken_symlinks = bool(arguments.get("includeBrokenSymlinks", True))

    if not root.exists():
        raise ValueError(f"Root {root} does not exist")

    report: Dict[str, Any] = {
        "root": str(root),
        "timestamp": time.time(),
        "missingManifestEntries": [],
        "inspectedManifests": [str(p) for p in manifests],
        "brokenSymlinks": [],
    }

    missing_entries: List[Dict[str, Any]] = []
    for manifest in manifests:
        references = extract_paths_from_manifest(manifest)
        for reference in references:
            tried = _resolve_candidates(reference, manifest, root)
            existing = next((p for p in tried if p.exists()), None)
            if existing:
                continue
            missing_entries.append(
                {
                    "manifest": str(manifest),
                    "reference": reference,
                    "checkedPaths": [str(p) for p in tried],
                }
            )

    report["missingManifestEntries"] = missing_entries

    if include_broken_symlinks:
        report["brokenSymlinks"] = collect_broken_symlinks(root)

    report["summary"] = {
        "manifestCount": len(manifests),
        "missingManifestEntries": len(missing_entries),
        "brokenSymlinkCount": len(report["brokenSymlinks"]),
    }

    if export:
        export_path = Path(export).expanduser()
        export_path.parent.mkdir(parents=True, exist_ok=True)
        export_path.write_text(json.dumps(report, indent=2))
        report["exported"] = str(export_path)

    return {
        "content": [
            {
                "type": "json",
                "json": report,
            }
        ]
    }


def _tool_remap_stale_links(arguments: Dict[str, Any]) -> Dict[str, Any]:
    manifest_path = Path(arguments["manifest"]).expanduser()
    search_roots = [
        Path(p).expanduser() for p in arguments.get("searchRoots", [])
    ]
    export = arguments.get("export")
    max_candidates = int(arguments.get("maxCandidates", 5))
    if not search_roots:
        # Default search base: parent of manifest & Akron volume
        search_roots = [manifest_path.parent, Path("/Volumes/Akron")]

    references = extract_paths_from_manifest(manifest_path)
    missing = []
    suggestions = []
    for reference in references:
        tried = _resolve_candidates(reference, manifest_path, None)
        if any(p.exists() for p in tried):
            continue
        missing.append(reference)
        candidates = scan_for_candidates(Path(reference).name, search_roots, max_candidates)
        suggestions.append(
            {
                "reference": reference,
                "candidates": candidates,
            }
        )

    report = {
        "manifest": str(manifest_path),
        "missing": missing,
        "suggestions": suggestions,
        "summary": {
            "totalReferences": len(references),
            "missingCount": len(missing),
        },
    }

    if export:
        export_path = Path(export).expanduser()
        export_path.parent.mkdir(parents=True, exist_ok=True)
        export_path.write_text(json.dumps(report, indent=2))
        report["exported"] = str(export_path)

    return {
        "content": [
            {
                "type": "json",
                "json": report,
            }
        ]
    }


def _tool_rebuild_symbolic_chain(arguments: Dict[str, Any]) -> Dict[str, Any]:
    manifests = [Path(p).expanduser() for p in arguments.get("manifests", [])]
    search_roots = [
        Path(p).expanduser() for p in arguments.get("searchRoots", [])
    ]
    export = arguments.get("export")
    if not search_roots:
        search_roots = [Path("/Volumes/Akron"), Path("/Users/jbear/FIELD-LIVING")]

    chain: List[Dict[str, Any]] = []
    for manifest in manifests:
        references = extract_paths_from_manifest(manifest)
        node = {
            "manifest": str(manifest),
            "references": len(references),
            "reconstructions": [],
        }
        for reference in references:
            candidates = scan_for_candidates(Path(reference).name, search_roots, 3)
            if candidates:
                node["reconstructions"].append(
                    {
                        "reference": reference,
                        "candidates": candidates,
                    }
                )
        chain.append(node)

    report = {
        "manifests": [str(m) for m in manifests],
        "symbolicChain": chain,
        "summary": {
            "manifestCount": len(manifests),
            "linksRecovered": sum(len(n["reconstructions"]) for n in chain),
        },
        "timestamp": time.time(),
    }

    if export:
        export_path = Path(export).expanduser()
        export_path.parent.mkdir(parents=True, exist_ok=True)
        export_path.write_text(json.dumps(report, indent=2))
        report["exported"] = str(export_path)

    return {
        "content": [
            {
                "type": "json",
                "json": report,
            }
        ]
    }


def _tool_verify_mount(arguments: Dict[str, Any]) -> Dict[str, Any]:
    volume = Path(arguments.get("volume", "/Volumes/Akron")).expanduser()

    status: Dict[str, Any] = {
        "volume": str(volume),
        "exists": volume.exists(),
        "isMount": os.path.ismount(str(volume)),
        "accessible": False,
        "stat": None,
    }

    if volume.exists():
        try:
            info = os.stat(str(volume))
            status["stat"] = {
                "mode": stat.filemode(info.st_mode),
                "uid": info.st_uid,
                "gid": info.st_gid,
                "mtime": info.st_mtime,
            }
            status["accessible"] = True
        except PermissionError:
            status["stat"] = "permission-denied"

    try:
        vfs = os.statvfs(str(volume))
        status["filesystem"] = {
            "blockSize": vfs.f_frsize,
            "totalBlocks": vfs.f_blocks,
            "availableBlocks": vfs.f_bavail,
            "freeBytes": vfs.f_frsize * vfs.f_bavail,
        }
    except OSError:
        status["filesystem"] = None

    return {
        "content": [
            {
                "type": "json",
                "json": {
                    "timestamp": time.time(),
                    "status": status,
                },
            }
        ]
    }


# --------------------------------------------------------------------------- #
# MCP server
# --------------------------------------------------------------------------- #

@dataclass
class ToolDefinition:
    name: str
    description: str
    input_schema: Dict[str, Any]
    handler: Any


class AkronMCPServer:
    def __init__(self, role: str):
        self.role = role
        self.server_info = {
            "filesystem-audit": {
                "name": "filesystem-audit",
                "version": "0.1.0",
                "description": "Filesystem audit and manifest reconciliation tools for Akron.",
            },
            "digital-mirror": {
                "name": "digital-mirror",
                "version": "0.1.0",
                "description": "Digital mirror reconstruction utilities for FIELD manifests.",
            },
            "akron-integrity": {
                "name": "akron-integrity",
                "version": "0.1.0",
                "description": "Akron volume health checks and mount validation.",
            },
        }[role]
        self.tools = self._build_tools(role)
        LOGGER.debug("Server initialised in %s role with %d tools", role, len(self.tools))

    def _build_tools(self, role: str) -> Dict[str, ToolDefinition]:
        tools: Dict[str, ToolDefinition] = {}
        if role == "filesystem-audit":
            tools["auditMissingFiles"] = ToolDefinition(
                name="auditMissingFiles",
                description="Scan manifests and the Akron volume to find missing or broken references.",
                input_schema={
                    "type": "object",
                    "properties": {
                        "root": {"type": "string", "description": "Root directory to scan."},
                        "manifests": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "List of manifest files to analyse.",
                        },
                        "export": {"type": "string", "description": "Optional path to write JSON report."},
                        "includeBrokenSymlinks": {"type": "boolean"},
                    },
                    "required": ["root"],
                },
                handler=_tool_audit_missing_files,
            )
            tools["remapStaleLinks"] = ToolDefinition(
                name="remapStaleLinks",
                description="Attempt to match missing manifest references to existing files.",
                input_schema={
                    "type": "object",
                    "properties": {
                        "manifest": {"type": "string"},
                        "searchRoots": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "Roots to search for potential matches.",
                        },
                        "export": {"type": "string"},
                        "maxCandidates": {"type": "integer", "minimum": 1, "default": 5},
                    },
                    "required": ["manifest"],
                },
                handler=_tool_remap_stale_links,
            )
            tools["mirrorMountStatus"] = ToolDefinition(
                name="mirrorMountStatus",
                description="Confirm the current state of the Akron mirror mount.",
                input_schema={
                    "type": "object",
                    "properties": {
                        "volume": {"type": "string", "description": "Volume path to inspect."}
                    },
                },
                handler=_tool_verify_mount,
            )
        elif role == "digital-mirror":
            tools["remapStaleLinks"] = ToolDefinition(
                name="remapStaleLinks",
                description="Specialised remapping of ghost references using Akron + FIELD checkpoints.",
                input_schema={
                    "type": "object",
                    "properties": {
                        "manifest": {"type": "string"},
                        "searchRoots": {"type": "array", "items": {"type": "string"}},
                        "export": {"type": "string"},
                        "maxCandidates": {"type": "integer", "default": 5},
                    },
                    "required": ["manifest"],
                },
                handler=_tool_remap_stale_links,
            )
            tools["rebuildSymbolicChain"] = ToolDefinition(
                name="rebuildSymbolicChain",
                description="Cross-hash manifests to rebuild symbolic bridge nodes.",
                input_schema={
                    "type": "object",
                    "properties": {
                        "manifests": {"type": "array", "items": {"type": "string"}},
                        "searchRoots": {"type": "array", "items": {"type": "string"}},
                        "export": {"type": "string"},
                    },
                },
                handler=_tool_rebuild_symbolic_chain,
            )
        elif role == "akron-integrity":
            tools["verifyMount"] = ToolDefinition(
                name="verifyMount",
                description="Validate the Akron volume mount state and filesystem health.",
                input_schema={
                    "type": "object",
                    "properties": {
                        "volume": {"type": "string", "description": "Volume path to inspect."},
                    },
                },
                handler=_tool_verify_mount,
            )
        return tools

    # JSON-RPC dispatch ----------------------------------------------------- #
    def serve(self) -> None:
        stdin = sys.stdin.buffer
        stdout = sys.stdout.buffer
        initialised = False

        while True:
            message = _read_message(stdin)
            if message is None:
                break

            method = message.get("method")
            msg_id = message.get("id")
            LOGGER.debug("Received %s", method)

            if method == "initialize":
                response = {
                    "jsonrpc": "2.0",
                    "id": msg_id,
                    "result": {
                        "serverInfo": {
                            "name": self.server_info["name"],
                            "version": self.server_info["version"],
                            "description": self.server_info["description"],
                        },
                        "capabilities": {"tools": {}},
                    },
                }
                _write_message(stdout, response)
                initialized_notice = {
                    "jsonrpc": "2.0",
                    "method": "initialized",
                    "params": {"role": self.role},
                }
                _write_message(stdout, initialized_notice)
                initialised = True
                continue

            if method in ("shutdown", "exit"):
                _write_message(stdout, {"jsonrpc": "2.0", "id": msg_id, "result": None})
                break

            if not initialised:
                _write_message(stdout, _rpc_error(msg_id, -32002, "Server not initialised"))
                continue

            if method in ("tools/list", "listTools", "list_tools"):
                payload = {
                    "jsonrpc": "2.0",
                    "id": msg_id,
                    "result": {
                        "tools": [
                            {
                                "name": tool.name,
                                "description": tool.description,
                                "inputSchema": tool.input_schema,
                            }
                            for tool in self.tools.values()
                        ]
                    },
                }
                _write_message(stdout, payload)
                continue

            if method in ("tools/call", "callTool", "call_tool"):
                params = message.get("params") or {}
                tool_name = params.get("name")
                arguments = params.get("arguments") or {}
                tool = self.tools.get(tool_name)
                if not tool:
                    _write_message(stdout, _rpc_error(msg_id, -32601, f"Unknown tool: {tool_name}"))
                    continue
                try:
                    result = tool.handler(arguments)
                except Exception as exc:  # pylint: disable=broad-except
                    LOGGER.exception("Tool %s failed", tool_name)
                    _write_message(
                        stdout,
                        _rpc_error(msg_id, -32001, f"{tool_name} failed: {exc}"),
                    )
                    continue

                payload = {
                    "jsonrpc": "2.0",
                    "id": msg_id,
                    "result": result,
                }
                _write_message(stdout, payload)
                continue

            # Unknown request; respond with JSON-RPC error
            if msg_id is not None:
                _write_message(stdout, _rpc_error(msg_id, -32601, f"Unknown method {method}"))


# --------------------------------------------------------------------------- #
# CLI entrypoint
# --------------------------------------------------------------------------- #

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Akron MCP server entrypoint")
    parser.add_argument(
        "--role",
        choices=["filesystem-audit", "digital-mirror", "akron-integrity"],
        default=os.environ.get("AKRON_MCP_ROLE", "filesystem-audit"),
    )
    parser.add_argument(
        "--log-level",
        default=os.environ.get("AKRON_MCP_LOG_LEVEL", "INFO"),
    )
    parser.add_argument(
        "--action",
        help="Run a tool once (debug/testing) and exit, e.g. auditMissingFiles",
    )
    parser.add_argument(
        "--arguments",
        help="JSON encoded arguments for --action mode",
    )
    return parser.parse_args()


def run_action(server: AkronMCPServer, action: str, arguments: str) -> int:
    tool = server.tools.get(action)
    if not tool:
        print(f"Unknown action: {action}", file=sys.stderr)
        return 1
    args = {}
    if arguments:
        try:
            args = json.loads(arguments)
        except json.JSONDecodeError as exc:
            print(f"Invalid JSON for arguments: {exc}", file=sys.stderr)
            return 1
    try:
        result = tool.handler(args)
        print(json.dumps(result, indent=2))
        return 0
    except Exception as exc:  # pylint: disable=broad-except
        print(f"Action {action} failed: {exc}", file=sys.stderr)
        return 1


def main() -> int:
    args = parse_args()
    logging.basicConfig(
        level=getattr(logging, args.log_level.upper(), logging.INFO),
        format="%(asctime)s %(levelname)s %(message)s",
    )

    server = AkronMCPServer(args.role)

    if args.action:
        return run_action(server, args.action, args.arguments or "{}")

    server.serve()
    return 0


if __name__ == "__main__":
    sys.exit(main())

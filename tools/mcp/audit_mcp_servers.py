#!/usr/bin/env python3
"""
Audit MCP manifests and report command/workdir readiness.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Tuple


CATEGORY_RULES: List[Tuple[str, str]] = [
    ("core", "field-git"),
    ("core", "living memory"),
    ("core", "akron"),
    ("support", "monitor"),
    ("support", "bridge"),
    ("support", "registry"),
    ("support", "observer"),
    ("support", "flow"),
    ("legacy", "legacy"),
    ("legacy", "prototype"),
    ("legacy", "experimental"),
]


def classify(name: str, filename: str) -> str:
    name_lower = name.lower()
    file_lower = filename.lower()

    if file_lower == "git.json":
        return "core"

    for category, token in CATEGORY_RULES:
        if token in name_lower or token in file_lower:
            return category

    return "unknown"


def command_status(command: str | None) -> str:
    if not command:
        return ""
    if os.path.isabs(command):
        return "✅" if os.access(command, os.X_OK) else "⚠️ missing"
    return "✅" if shutil_which(command) else "⚠️ missing"


def shutil_which(cmd: str) -> bool:
    from shutil import which

    return which(cmd) is not None


def audit_manifest(manifest_path: Path) -> Dict[str, str]:
    with manifest_path.open(encoding="utf-8") as handle:
        data = json.load(handle)

    name = data.get("name") or manifest_path.stem
    cmd = data.get("command")
    endpoint = data.get("server_url") or data.get("url") or data.get("endpoint")
    workdir = data.get("workingDirectory")
    args = data.get("args") or []
    script_arg = next((arg for arg in args if arg.endswith(".py")), "")

    category = classify(name, manifest_path.name)
    status = {
        "name": name,
        "manifest": manifest_path.name,
        "category": category,
        "command": cmd or "",
        "command_status": command_status(cmd),
        "workdir": workdir or "",
        "workdir_status": "✅" if workdir and Path(workdir).is_dir() else ("⚠️ missing" if workdir else ""),
        "script": "",
        "script_status": "",
        "endpoint": endpoint or "",
    }

    if script_arg:
        resolved = Path(script_arg)
        if not resolved.is_absolute() and workdir:
            resolved = Path(workdir) / script_arg
        status["script"] = str(resolved)
        status["script_status"] = "✅" if resolved.exists() else "⚠️ missing"

    return status


def print_report(statuses: List[Dict[str, str]]) -> int:
    totals = {"core": 0, "support": 0, "legacy": 0, "unknown": 0}
    exit_code = 0

    for status in statuses:
        category = status["category"]
        totals[category] = totals.get(category, 0) + 1

        print(f"• {status['name']:<24} ({category})")
        print(f"  Manifest: {status['manifest']}")
        if status["command"]:
            print(f"  Command : {status['command']} {status['command_status']}")
            if status["command_status"].startswith("⚠️"):
                exit_code = 1
        if status["workdir"]:
            print(f"  Workdir : {status['workdir']} {status['workdir_status']}")
            if status["workdir_status"].startswith("⚠️"):
                exit_code = 1
        if status["script"]:
            print(f"  Script  : {status['script']} {status['script_status']}")
            if status["script_status"].startswith("⚠️"):
                exit_code = 1
        if status["endpoint"]:
            print(f"  Endpoint: {status['endpoint']}")
        print()

    print("Summary:")
    for key in ["core", "support", "legacy", "unknown"]:
        print(f"  {key.capitalize():<8}: {totals.get(key, 0)}")

    return exit_code


def main() -> int:
    parser = argparse.ArgumentParser(description="Audit MCP manifest directory.")
    parser.add_argument(
        "manifest_directory",
        nargs="?",
        default=Path.home() / ".warp" / "mcp-servers",
        type=Path,
        help="Directory containing MCP manifest JSON files.",
    )
    args = parser.parse_args()

    root: Path = args.manifest_directory.expanduser()
    if not root.is_dir():
        print(f"❌ Manifest directory not found: {root}")
        return 1

    manifests = sorted(
        p for p in root.glob("*.json") if p.name not in {"index.json", "index_clean.json"}
    )
    if not manifests:
        print(f"⚠️ No manifests found in {root}")
        return 1

    print(f"🔍 Auditing MCP manifests in {root}\n")
    statuses = []
    for manifest in manifests:
        try:
            statuses.append(audit_manifest(manifest))
        except Exception as exc:
            print(f"❌ Failed to audit {manifest.name}: {exc}")
            statuses.append(
                {
                    "name": manifest.stem,
                    "manifest": manifest.name,
                    "category": "unknown",
                    "command": "",
                    "command_status": "⚠️ parse error",
                    "workdir": "",
                    "workdir_status": "",
                    "script": "",
                    "script_status": "",
                    "endpoint": "",
                }
            )
            exit_code = 1

    return print_report(statuses)


if __name__ == "__main__":
    sys.exit(main())

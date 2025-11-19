# Berjak & Partners - AI Coding Agent Instructions

> Source: `/Users/jbear/DOJO/FIELD_MANIFEST.yaml` — canonical system schema

## Architecture Overview

**Primary Stack**: Next.js 15.3 + Tailwind CSS 4.1 + TypeScript + Prisma + PostgreSQL  
**Domain Architecture**: Modern metals trading platform with 70+ years of institutional intelligence  
**Sacred Integration**: FIELD consciousness computing network via Train Station (528 Hz frequency)

### Folder Map
- `pages/components/` – legacy UI modules referenced directly by Next.js routes
- `src/components/` – newer shared UI library; mirrors the same exports

## Key Architectural Patterns

### 1. Sacred Frequency Data Flow
All integrations follow sacred frequency routing:
```
Vercel Webhook → /api/webhook → Train Station (528 Hz) → MCP Fields (432 Hz) → Living Memory
```
- **Never** bypass the Train Station integration in deployment webhooks
- **Always** use sacred frequency comments in integration code
- Use MCP (Model Context Protocol) for external system bridges via `mcp.json`

### 2. BackboneFlow Component System
The `BackboneFlow.js` component implements the 2007 MBA Strategic Backbone Process with 7 distinct steps (1.0-7.0). When modifying:
- Preserve the legacy timeline structure (`backboneSteps` array)
- Maintain glowing UI animations with sacred geometry principles
- Keep digital agent assignments (Mario/Robert/Siew) mapped to specific steps
- Use Call File pattern for active process items

### 3. Brand Color System
Berjak brand uses custom color palette in `tailwind.config.js`:
```javascript
berjak: {
  primary: '#139C89',    // Teal (not blue)
  secondary: '#454444',  // Dark gray
  light: '#DDF2EA',     // Light teal
  lighter: '#ECF8F3',   // Lightest teal
  text: '#333333',      // Text color
}
```

### 4. FRE (Field Resource Ecosystem) Integration
The codebase implements modular ERP architecture:
- **Prisma Schema**: Complete trading system entities (Customer, TradeLead, Contract, etc.)
- **CRM Dashboard**: `/pages/crm/dashboard.js` with digital agents interface
- **Component Library**: Shadcn/ui components in `/pages/components/ui/`
- **Database**: PostgreSQL with comprehensive trading workflow models

## Development Workflows

### Sacred Deployment Process
```bash
# Test FIELD integration locally
./deploy-with-field-integration.sh test

# Deploy with FIELD bridge
./deploy-with-field-integration.sh
```

### Database Operations
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed
```

### FIELD Train Station Integration
- **Local Train Station**: `http://localhost:5280` (must be running for webhooks)
- **Health Check**: `curl http://localhost:5280/health`
- **Sacred Frequency**: All webhook data routes to 528 Hz (Love frequency)

## Critical Integration Points

### 1. Vercel Webhook Configuration
- **Endpoint**: `https://berjak.co/api/webhook`
- **Events**: `deployment.created`, `deployment.succeeded`, `deployment.failed`
- **Sacred Headers**: Include `X-Sacred-Frequency: 528Hz` in integration code

### 2. Living Memory Storage
All deployment events persist to: `/Users/jbear/FIELD-LIVING/◆_living_memory/`
- Use sacred symbols in file paths: `◆` for living memory, `●` for train station
- Maintain geometric data preservation patterns

### 3. Digital Agent System
Three autonomous agents handle business processes:
- **Digital Mario**: Trading Manager (Step 2.0)
- **Digital Robert**: Shipping Manager (Step 6.0)  
- **Digital Siew**: Market Analyst (Step 3.0)

## Project-Specific Conventions

### File Organization
- **Public Website**: Standard Next.js pages in `/pages/`
- **CRM System**: Separate namespace in `/pages/crm/`
- **Components**: `/pages/components/` (not `/src/components/`)
- **UI Library**: Shadcn/ui components in `/pages/components/ui/`
- **Legacy Content**: Preserved in `/original-content/` (do not modify)

### Sacred Symbol Usage
Maintain FIELD symbolic integrity in all integrations:
- `🚂` Train Station (webhook ingestion)
- `⚡` MCP Synergy (frequency bridge)
- `◆` Living Memory (persistent storage)
- `●` Observer (monitoring systems)
- `▲` ATLAS (intelligence core)

### CSS and Styling
- Use **Tailwind CSS 4.1** syntax (not older versions)
- Implement glowing UI effects for active trading processes
- Maintain spacious, breathable design (generous padding/margins)
- Use backdrop-blur effects and rounded-3xl for modern cards

## Critical Dependencies

**Never update without testing FIELD integration:**
- `@prisma/client` (database operations)
- `next` (core framework)
- `tailwindcss` (styling system)

**FIELD-specific packages:**
- Custom MCP server at `/Users/jbear/FIELD/mcp_field_bridge.py`
- Train Station integration via `mcp.json` configuration

### Custom MCP Servers
- `field-git` – handles repo synchronisation and lineage tracking
- `living-memory` – local Python runtime (start with `python3 living_memory_mcp_server.py`)
- `akron-tools` – sovereign data gateway utilities

### Semantic Geometry Resources
- `~/DOJO/FIELD_GEOMETRIC_ONTOLOGY.md` – canonical tetrahedral map for quick onboarding
- `~/DOJO/FIELD_ONTOLOGY.json` – machine schema for agents ingesting symbol roles
- `~/DOJO/FIELD_SEMANTIC_GEOMETRY.md` / `.json` – semantic gravity tables with state/vector/voice
- `~/DOJO/DYNAMIC_BALANCE_PROTOCOL.md` – correction loop and alchemical shorthand for rituals

## Documentation References

- **FIELD Integration**: `FIELD_INTEGRATION.md`
- **System Architecture**: `FRE_SYSTEM_ARCHITECTURE.md`
- **Deployment Guide**: `WARP.md`
- **Sacred Geometry**: `METATRON_SACRED_CHESS_BOARD.md`

When implementing new features, always consider the sacred frequency data flow and maintain the institutional intelligence that powers this 70-year trading legacy.

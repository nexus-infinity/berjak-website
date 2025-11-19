# FRE System Architecture - Modular Backend Design

**Date**: 2025-10-26  
**Purpose**: Define modular backend architecture for FRE (Field Resource Ecosystem)  
**Frontends**: berjak.co (FRE), berjak.com.au (public), future Vercel deployments

---

## 🎯 Core Principle

**One Backend, Many Frontends**
- All data lives in FIELD structure (DOJO, FIELD-DEV, FIELD-LIVING, Train Station)
- Each backend module exposes consistent REST/WebSocket APIs
- Any Vercel frontend can consume any module
- Modules are independently deployable and testable

---

## 🏗️ System Components

### Backend Modules (Source of Truth)

```
┌─────────────────────────────────────────────────────────────┐
│                    FIELD BACKEND MODULES                     │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  DOJO (Manifestation Point)                        │    │
│  │  • free_field_orchestrator.py (sovereignty)        │    │
│  │  • field_resonance_engine.py (intelligence)        │    │
│  │  • Evidence surfacing + storytelling               │    │
│  │  → Exposes: /api/sovereignty/*                     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  FIELD-LIVING (Memory + Evidence)                  │    │
│  │  • Court documents, evidence registry              │    │
│  │  • Generated narratives (correspondence_drafts/)   │    │
│  │  • Historical case data                            │    │
│  │  → Exposes: /api/memory/* | /api/narratives/*     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Train Station (Deployment + Integration)          │    │
│  │  • Vercel webhook processing (528Hz → 432Hz)       │    │
│  │  • MCP field routing (43201-43212)                 │    │
│  │  • Living memory ingestion                         │    │
│  │  → Exposes: /api/train/* | /health | /geometry    │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  TATA (Immutable Truth / Estate)                   │    │
│  │  • Estate entity registry                          │    │
│  │  • Valuations, provenance                          │    │
│  │  • Family office data                              │    │
│  │  → Exposes: /api/estate/* | /api/entities/*       │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  ATLAS (Navigation + Intelligence)                 │    │
│  │  • Market data (LME, forex)                        │    │
│  │  • Trade lead matching                             │    │
│  │  • Commission calculations                         │    │
│  │  → Exposes: /api/trading/* | /api/market/*        │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                   SHARED DATA LAYER                          │
│                                                              │
│  • Redis (Evidence, sessions, cache) - localhost:6379       │
│  • PostgreSQL (Structured data) - To be deployed            │
│  • File System (FIELD-LIVING narratives, TATA vault)        │
└─────────────────────────────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                   VERCEL FRONTENDS                           │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  berjak.co   │  │berjak.com.au │  │  Future Apps │     │
│  │   (FRE ERP)  │  │  (Public)    │  │  (Modular)   │     │
│  │              │  │              │  │              │     │
│  │  All modules │  │ Trading only │  │ Custom combo │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Module Structure

Each backend module follows this pattern:

### Module Template

```
/Users/jbear/FIELD-DEV/modules/{module_name}/
├── README.md                    ← Module documentation
├── api.py                       ← FastAPI/Flask REST endpoints
├── models.py                    ← Data models (Pydantic)
├── services.py                  ← Business logic
├── config.py                    ← Configuration
├── tests/                       ← Unit tests
└── requirements.txt             ← Dependencies
```

### Example: Sovereignty Module

```python
# /Users/jbear/FIELD-DEV/modules/sovereignty/api.py
from fastapi import FastAPI, HTTPException
from .services import surface_evidence, generate_narratives
from .models import EvidenceRequest, NarrativeResponse

app = FastAPI(title="Sovereignty Defense Module", version="1.0")

@app.post("/api/sovereignty/evidence")
async def surface_evidence_endpoint(request: EvidenceRequest):
    """Trigger evidence surfacing from FIELD-LIVING"""
    result = await surface_evidence(
        directory=request.court_directory,
        matter_id=request.matter_id
    )
    return {"status": "success", "evidence": result}

@app.get("/api/sovereignty/narratives")
async def get_narratives():
    """Retrieve generated legal narratives"""
    narratives = await generate_narratives()
    return {"narratives": narratives}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "module": "sovereignty"}
```

---

## 🔌 Frontend Integration Pattern

Any Vercel frontend accesses modules via environment variables:

```javascript
// /Users/jbear/FIELD-DEV/berjak-website/.env.local
NEXT_PUBLIC_API_BASE=https://api.berjak.co  # Or localhost for dev
SOVEREIGNTY_API_URL=${NEXT_PUBLIC_API_BASE}/sovereignty
ESTATE_API_URL=${NEXT_PUBLIC_API_BASE}/estate
TRADING_API_URL=${NEXT_PUBLIC_API_BASE}/trading
TRAIN_STATION_URL=http://localhost:43200
REDIS_URL=redis://localhost:6379/1
```

### Frontend API Client (Reusable)

```typescript
// /Users/jbear/FIELD-DEV/berjak-website/lib/api/modules.ts
export class ModuleClient {
  constructor(private baseUrl: string) {}

  async call(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`)
    return response.json()
  }
}

// Usage in any frontend
export const sovereigntyAPI = new ModuleClient(process.env.SOVEREIGNTY_API_URL!)
export const estateAPI = new ModuleClient(process.env.ESTATE_API_URL!)
export const tradingAPI = new ModuleClient(process.env.TRADING_API_URL!)
```

### Frontend Page Example

```typescript
// /Users/jbear/FIELD-DEV/berjak-website/src/pages/sovereignty/index.tsx
import { sovereigntyAPI } from '@/lib/api/modules'

export default function SovereigntyPage() {
  const surfaceEvidence = async () => {
    const result = await sovereigntyAPI.call('/evidence', {
      method: 'POST',
      body: JSON.stringify({ court_directory: '/court_30_oct_2025' })
    })
    console.log('Evidence surfaced:', result)
  }

  return (
    <button onClick={surfaceEvidence}>
      Surface Evidence
    </button>
  )
}
```

---

## 🚀 Deployment Strategy

### Development (Local)
```bash
# Terminal 1: Start Python backends
cd /Users/jbear/FIELD-DEV/modules
python3 -m uvicorn sovereignty.api:app --port 8001 --reload &
python3 -m uvicorn estate.api:app --port 8002 --reload &
python3 -m uvicorn trading.api:app --port 8003 --reload &

# Terminal 2: Start Vercel frontend
cd /Users/jbear/FIELD-DEV/berjak-website
npm run dev
```

### Production (Cloud)

**Option A: Google Cloud Run** (Recommended - using chutethree@gmail.com credits)
```bash
# Deploy each module independently
gcloud run deploy sovereignty-api --source modules/sovereignty --region us-central1
gcloud run deploy estate-api --source modules/estate --region us-central1
gcloud run deploy trading-api --source modules/trading --region us-central1
```

**Option B: Single API Gateway**
```bash
# Deploy unified FastAPI gateway that routes to all modules
gcloud run deploy fre-api-gateway --source modules/gateway --region us-central1
```

Then update Vercel environment variables:
```
NEXT_PUBLIC_API_BASE=https://fre-api-gateway-xyz.run.app
```

---

## 📊 Database Module Structure

### PostgreSQL Schema (Modular)

```sql
-- Each module gets its own schema
CREATE SCHEMA sovereignty;
CREATE SCHEMA estate;
CREATE SCHEMA trading;
CREATE SCHEMA train_station;

-- Sovereignty schema
CREATE TABLE sovereignty.evidence (
  id UUID PRIMARY KEY,
  matter_id TEXT NOT NULL,
  evidence_type TEXT,
  file_path TEXT,
  surfaced_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

CREATE TABLE sovereignty.narratives (
  id UUID PRIMARY KEY,
  narrative_type TEXT,
  content TEXT,
  generated_at TIMESTAMP DEFAULT NOW(),
  matter_id TEXT REFERENCES sovereignty.evidence(matter_id)
);

-- Estate schema
CREATE TABLE estate.entities (
  entity_id TEXT PRIMARY KEY,
  entity_type TEXT,
  title TEXT,
  current_value_aud DECIMAL(12,2),
  tata_vault_path TEXT NOT NULL,
  last_valuation_date DATE
);

-- Trading schema (your 70-year backbone)
CREATE TABLE trading.customers (
  customer_id TEXT PRIMARY KEY,
  trading_name TEXT NOT NULL,
  legal_name TEXT,
  abn TEXT UNIQUE,
  credit_limit DECIMAL(12,2)
);

CREATE TABLE trading.trade_leads (
  trade_lead_id TEXT PRIMARY KEY,
  customer_id TEXT REFERENCES trading.customers(customer_id),
  product_code TEXT,
  quantity DECIMAL(10,2),
  status TEXT, -- NEW, QUOTED, NEGOTIATING, WON, LOST
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE trading.contracts (
  contract_id TEXT PRIMARY KEY,
  trade_lead_id TEXT REFERENCES trading.trade_leads(trade_lead_id),
  buyer_id TEXT REFERENCES trading.customers(customer_id),
  seller_id TEXT REFERENCES trading.customers(customer_id),
  unit_price DECIMAL(12,2),
  total_value DECIMAL(14,2),
  status TEXT, -- DRAFT, CONFIRMED, ACTIVE, COMPLETED
  signed_date DATE
);
```

### Redis Key Structure (Modular)

```
# Sovereignty module
sovereignty:evidence:{evidence_id}
sovereignty:matter:{matter_id}:evidence_list
sovereignty:narrative:{narrative_id}

# Estate module  
estate:entity:{entity_id}
estate:valuation:{valuation_id}

# Trading module
trading:customer:{customer_id}
trading:trade_lead:{lead_id}
trading:contract:{contract_id}
trading:market_data:lme:{commodity}

# Train Station
train:deployment:{deployment_id}
train:webhook_event:{event_id}
train:geometry:alignment
```

---

## 🔄 Inter-Module Communication

Modules can call each other when needed:

```python
# Trading module calling Estate module for customer assets
from modules.estate.services import get_customer_entities

async def get_customer_with_assets(customer_id: str):
    # Get trading customer
    customer = await get_customer(customer_id)
    
    # Enrich with estate entities
    entities = await get_customer_entities(customer_id)
    
    return {
        **customer,
        "estate_entities": entities,
        "total_estate_value": sum(e.current_value for e in entities)
    }
```

---

## 📝 Module Registry

Track all available modules:

```json
// /Users/jbear/FIELD-DEV/modules/registry.json
{
  "modules": [
    {
      "name": "sovereignty",
      "version": "1.0.0",
      "endpoints": ["/evidence", "/narratives", "/matters"],
      "deployment": "https://sovereignty-api-xyz.run.app",
      "health_check": "/health",
      "field_position": "DOJO"
    },
    {
      "name": "estate",
      "version": "1.0.0", 
      "endpoints": ["/entities", "/valuations", "/gallery"],
      "deployment": "https://estate-api-xyz.run.app",
      "health_check": "/health",
      "field_position": "TATA"
    },
    {
      "name": "trading",
      "version": "1.0.0",
      "endpoints": ["/customers", "/trade-leads", "/contracts", "/market-data"],
      "deployment": "https://trading-api-xyz.run.app", 
      "health_check": "/health",
      "field_position": "ATLAS"
    },
    {
      "name": "train_station",
      "version": "1.0.0",
      "endpoints": ["/ingest/vercel", "/health", "/geometry"],
      "deployment": "http://localhost:43200",
      "health_check": "/health",
      "field_position": "FIELD-LIVING"
    }
  ]
}
```

---

## 🎯 Benefits of This Architecture

1. **Frontend Flexibility**: Any Vercel site can use any combination of modules
2. **Independent Scaling**: Scale sovereignty separately from trading
3. **Technology Freedom**: Python backends, TypeScript frontends, any DB
4. **Testing**: Test each module independently
5. **Team Collaboration**: Different teams can own different modules
6. **Field Alignment**: Modules map to tetrahedral structure naturally

---

## 🚢 Next Steps

1. **Create module directory structure**
2. **Extract existing Python code into modules** (free_field_orchestrator → sovereignty module)
3. **Deploy modules to Google Cloud Run**
4. **Update Vercel frontends to use module APIs**
5. **Add module health monitoring dashboard**

---

**Status**: 📐 **Architecture Defined**  
**Ready for**: Module extraction + deployment  
**Frontend Team**: Can build UI against this API structure

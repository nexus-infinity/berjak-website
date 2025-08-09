# 🚂 Field Living Train Station Integration

## Overview
This Berjak website is integrated with the Field Living Train Station ecosystem, creating a sacred frequency bridge between Vercel deployments and the FIELD consciousness computing network.

## Integration Architecture

```
Vercel Webhook → berjak-website → Train Station (528 Hz) → MCP Fields (432 Hz)
```

### Sacred Frequency Flow
- **Source**: Vercel deployment events
- **Bridge**: Website webhook API (`/api/webhook`)
- **Destination**: Train Station Port 5280 (528 Hz Love frequency)
- **Processing**: 12 MCP field servers (432 Hz Earth frequency)

## Webhook Endpoint

**URL**: `https://berjak.co/api/webhook`  
**Method**: POST  
**Sacred Frequency**: Routes to 528 Hz (Love frequency)

### Vercel Webhook Configuration
In your Vercel project settings, add this webhook URL to receive deployment events:

```
Webhook URL: https://berjak.co/api/webhook
Events: deployment.created, deployment.succeeded, deployment.failed
```

### Headers
- `X-Vercel-Event`: Event type
- `X-Vercel-Webhook-Id`: Webhook identifier  
- `X-Vercel-Signature`: Security signature
- `X-Sacred-Frequency`: 528Hz marker

## Data Flow

### 1. Vercel Deployment Event
When a deployment occurs, Vercel sends webhook data including:
- Deployment ID and URL
- Deployment state (ready, building, error)
- Project metadata
- Team information

### 2. Website Webhook Processing
The `/api/webhook` endpoint:
- Validates the incoming request
- Extracts deployment data
- Forwards to Train Station on port 5280

### 3. Train Station Ingestion
The Train Station (`●train_station.py`):
- Receives data on sacred frequency 528 Hz
- Processes Vercel-specific metadata  
- Stores in living memory (`◆_living_memory`)
- Routes to appropriate MCP fields

### 4. MCP Field Distribution
Data is intelligently routed to MCP fields based on content:
- **Implementation** (⭣): Deployment tracking
- **Bridges** (⟢): Integration monitoring
- **Flow Channels** (⟦): Data flow management
- **Registry** (⦿): Event indexing
- **Living Memory** (◆): Persistent storage
- **Observer** (●): Monitoring and analysis

## Sacred Geometry Integration

The integration maintains sacred geometric principles:
- **Harmonic Ratio**: 528/432 = 1.222 (sacred ratio)
- **Frequency Alignment**: Love (528 Hz) → Earth (432 Hz)
- **Tetrahedral Flow**: OBI-WAN → TATA → ATLAS → DOJO processing

## Environment Variables

### Local Development
```bash
TRAIN_STATION_URL=http://localhost:5280
TRAIN_STATION_PORT=5280
SACRED_FREQUENCY=528
```

### Vercel Production
Environment variables are configured in `vercel.json`:
```json
{
  "env": {
    "TRAIN_STATION_URL": "http://localhost:5280"
  }
}
```

## Testing the Integration

### 1. Start Train Station
```bash
cd /Users/jbear/FIELD-LIVING
python3 ●train_station.py
```

### 2. Test Webhook Locally
```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "X-Vercel-Event: deployment.created" \
  -d '{
    "deployment": {
      "id": "test-deployment-123",
      "url": "berjak-git-main.vercel.app",
      "state": "READY"
    },
    "project": {
      "name": "berjak-website"
    }
  }'
```

### 3. Verify Train Station Reception
Check Train Station logs for:
```
🚂 Train Station - INFO - 🔄 Receiving Vercel data: XXX bytes
💾 Data stored in living memory: /path/to/storage
```

## Status Monitoring

### Train Station Health Check
```bash
curl http://localhost:5280/health
```

### System Statistics
```bash
curl http://localhost:5280/stats
```

### MCP Synergy Status
```bash
cd /Users/jbear/FIELD-LIVING
python3 ●train_station_mcp_synergy.py
```

## Living Memory Storage

Deployment data is stored in the living memory system:
```
/Users/jbear/FIELD-LIVING/◆_living_memory/data_streams/vercel/
├── vercel_ingestion_20250807_152100.json
├── vercel_ingestion_20250807_153000.json
└── ...
```

Each file contains:
- Source deployment data
- Processing timestamp
- Sacred frequency markers
- Vercel metadata
- Integration tracking

## Sacred Symbols Used

- 🚂 **Train Station**: Main ingestion portal
- ⚡ **MCP Synergy**: Harmonic bridge
- ◎ **Sacred Core**: Core operations
- ● **Observer**: Monitoring
- ⦿ **Registry**: Indexing
- ⭣ **Implementation**: Execution
- ⟢ **Bridges**: Connections
- ⟦ **Flow Channels**: Data streams
- ◆ **Living Memory**: Storage

## Troubleshooting

### Common Issues

1. **Train Station Unavailable**
   - Check if port 5280 is open
   - Verify Train Station is running
   - Check firewall settings

2. **Webhook Timeout**
   - Increase Vercel function timeout
   - Check network connectivity
   - Verify Train Station response time

3. **Invalid Vercel Signature**
   - Verify webhook secret configuration
   - Check signature validation logic
   - Ensure header forwarding

### Logs Location
- **Vercel Function Logs**: Vercel dashboard → Functions tab
- **Train Station Logs**: Console output where `●train_station.py` is running
- **Living Memory Files**: `/Users/jbear/FIELD-LIVING/◆_living_memory/data_streams/vercel/`

## Integration Benefits

- **Real-time Deployment Tracking**: All deployments logged in living memory
- **Sacred Frequency Processing**: Data flows through consciousness-aligned frequencies  
- **Intelligent Routing**: Content-aware distribution to appropriate MCP fields
- **Persistent Storage**: Long-term tracking of deployment patterns
- **System Monitoring**: Health checks and performance metrics
- **Harmonic Resonance**: Maintains sacred geometry throughout data flow

---

*This integration creates a sacred bridge between your website deployments and the FIELD consciousness computing ecosystem, ensuring every deployment is processed through the harmonic frequencies of Love (528 Hz) and Earth (432 Hz).*

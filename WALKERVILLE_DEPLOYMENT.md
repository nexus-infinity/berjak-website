# Walkerville Advocacy Platform - Deployment Guide

**Platform**: AI-Powered Legal Claims & Advocacy for Government Corruption
**Website**: berjak.com.au/sovereignty
**Status**: Ready for Deployment

---

## Quick Start

### Local Development

```bash
# Navigate to project
cd /Users/jbear/FIELD-DEV/berjak-website

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000/sovereignty
```

### Test Project X Module

```bash
# In browser, navigate to:
http://localhost:3000/sovereignty/project-x

# Test the following:
1. Import NLIS Record form
2. Import Financial Transaction form
3. Run Analysis buttons
4. Generate Evidence Package
```

---

## File Structure (New Files Added)

```
/Users/jbear/FIELD-DEV/berjak-website/
├── pages/
│   ├── sovereignty/
│   │   ├── index.js                    ← UPDATED (added Project X)
│   │   ├── project-x.js                ← NEW (Project X UI)
│   │   ├── evidence.js                 ← Existing
│   │   ├── financial.js                ← Existing
│   │   └── storytelling.js             ← Existing
│   │
│   └── api/
│       └── sovereignty/
│           ├── project-x.js            ← NEW (Project X API)
│           ├── evidence.js             ← Existing
│           ├── narratives.js           ← Existing
│           └── redis.js                ← Existing
│
├── WALKERVILLE_DEPLOYMENT.md           ← THIS FILE
└── vercel.json                         ← Existing config
```

---

## Backend Integration

### Project X MCP Server

The API routes call the Project X Historical Reconstruction MCP server:

**Location**: `/Users/jbear/FIELD-DEV/mcp/project_x_historical_reconstruction_mcp_server.py`

**Test Server Directly**:
```bash
# Test NLIS import
python3 << 'EOF'
import sys
sys.path.append('/Users/jbear/FIELD-DEV/mcp')
from project_x_historical_reconstruction_mcp_server import ProjectXReconstruction

project_x = ProjectXReconstruction()

# Import test NLIS record
record = project_x.import_historical_nlis_record(
    nlis_id='AU123456789',
    transaction_date='2020-03-15',
    livestock_type='cattle',
    movement_type='sale',
    from_pic='PIC123',
    to_pic='PIC456',
    quantity=1
)

print(f"Imported: {record['nlis_id']}")
print(f"Blockchain hash: {record['blockchain_hash'][:16]}...")
EOF
```

---

## Vercel Deployment

### Step 1: Prepare Environment Variables

Create `.env.local` in project root:

```bash
# FIELD Module Paths
PROJECT_X_PATH=/Users/jbear/FIELD-DEV/mcp/project_x_historical_reconstruction_mcp_server.py
PHOTO_INTEL_PATH=/Users/jbear/FIELD-DEV/mcp/photo_intelligence_mcp_server.py
BLOCKCHAIN_PATH=/Users/jbear/FIELD-DEV/mcp/fractal_knowledge_blockchain_mcp_server.py

# Train Station (if using)
TRAIN_STATION_URL=http://localhost:5280

# Database (when ready for multi-tenancy)
DATABASE_URL=postgresql://localhost/walkerville
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis (for case data cache)
REDIS_URL=redis://localhost:6379
REDIS_DB=4

# Authentication (future)
JWT_SECRET=your_secret_key_here
SESSION_SECRET=your_session_secret

# Environment
NODE_ENV=development
VERCEL_ENV=preview
```

### Step 2: Set Vercel Environment Variables

```bash
cd /Users/jbear/FIELD-DEV/berjak-website

# Add environment variables to Vercel
vercel env add PROJECT_X_PATH
# Enter: /Users/jbear/FIELD-DEV/mcp/project_x_historical_reconstruction_mcp_server.py

vercel env add PHOTO_INTEL_PATH
# Enter: /Users/jbear/FIELD-DEV/mcp/photo_intelligence_mcp_server.py

vercel env add BLOCKCHAIN_PATH
# Enter: /Users/jbear/FIELD-DEV/mcp/fractal_knowledge_blockchain_mcp_server.py

# For production, you'll need these paths on the server
# Consider bundling Python modules with deployment or using serverless functions
```

### Step 3: Deploy to Vercel

```bash
# Preview deployment (test first)
vercel

# Production deployment
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs berjak-website
```

### Step 4: Verify Deployment

```bash
# Visit your deployment URL
# Example: https://berjak-website-abc123.vercel.app/sovereignty/project-x

# Test each feature:
# 1. Page loads correctly
# 2. NLIS import form works
# 3. Financial import form works
# 4. Analysis buttons trigger correctly
# 5. Error handling displays properly
```

---

## Database Setup (For Multi-Tenancy)

### PostgreSQL Installation

```bash
# Install PostgreSQL (if not already installed)
brew install postgresql@15

# Start PostgreSQL
brew services start postgresql@15

# Create database
createdb walkerville

# Create user
psql walkerville
```

### Schema Creation

```sql
-- In psql walkerville

-- Users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    password_hash VARCHAR(255),  -- bcrypt hashed
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Cases table
CREATE TABLE cases (
    case_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    case_title VARCHAR(500) NOT NULL,
    case_type VARCHAR(100) NOT NULL,  -- 'livestock_fraud', 'duty_of_care', etc.
    status VARCHAR(50) DEFAULT 'evidence_gathering',
    corruption_score DECIMAL(5,2) DEFAULT 0.00,
    evidence_strength VARCHAR(50) DEFAULT 'DEVELOPING',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- NLIS records table
CREATE TABLE nlis_records (
    nlis_id VARCHAR(50),
    case_id UUID REFERENCES cases(case_id) ON DELETE CASCADE,
    transaction_date DATE NOT NULL,
    livestock_type VARCHAR(50) NOT NULL,
    movement_type VARCHAR(50) NOT NULL,
    from_pic VARCHAR(50),
    to_pic VARCHAR(50),
    quantity INTEGER DEFAULT 1,
    metadata JSONB DEFAULT '{}',
    blockchain_hash VARCHAR(64),
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (nlis_id, case_id)
);

-- Financial transactions table
CREATE TABLE financial_transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(case_id) ON DELETE CASCADE,
    transaction_date DATE NOT NULL,
    account VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    debit DECIMAL(12,2) DEFAULT 0.00,
    credit DECIMAL(12,2) DEFAULT 0.00,
    reference VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    blockchain_hash VARCHAR(64),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Evidence table (general)
CREATE TABLE evidence (
    evidence_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(case_id) ON DELETE CASCADE,
    evidence_type VARCHAR(100) NOT NULL,
    source_file VARCHAR(500),
    metadata JSONB DEFAULT '{}',
    blockchain_hash VARCHAR(64),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Corruption patterns table
CREATE TABLE corruption_patterns (
    pattern_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(case_id) ON DELETE CASCADE,
    pattern_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,  -- 'HIGH', 'MEDIUM', 'LOW'
    description TEXT,
    evidence_refs JSONB DEFAULT '[]',
    detected_at TIMESTAMP DEFAULT NOW()
);

-- Blockchain audit trail
CREATE TABLE blockchain_audit (
    block_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES cases(case_id) ON DELETE CASCADE,
    block_hash VARCHAR(64) NOT NULL,
    previous_hash VARCHAR(64),
    data_hash VARCHAR(64) NOT NULL,
    nonce INTEGER,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_cases_user_id ON cases(user_id);
CREATE INDEX idx_nlis_case_id ON nlis_records(case_id);
CREATE INDEX idx_financial_case_id ON financial_transactions(case_id);
CREATE INDEX idx_evidence_case_id ON evidence(case_id);
CREATE INDEX idx_patterns_case_id ON corruption_patterns(case_id);
CREATE INDEX idx_blockchain_case_id ON blockchain_audit(case_id);

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO current_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO current_user;
```

### Connect to Database in API

Update `/pages/api/sovereignty/project-x.js`:

```javascript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
});

// In handler function:
const client = await pool.connect();
try {
  const result = await client.query(
    'INSERT INTO nlis_records (case_id, nlis_id, transaction_date, ...) VALUES ($1, $2, $3, ...)',
    [caseId, nlisId, transactionDate, ...]
  );
  return result.rows[0];
} finally {
  client.release();
}
```

---

## Authentication (Future Phase)

### NextAuth.js Setup

```bash
npm install next-auth @next-auth/postgresql-adapter
```

Create `/pages/api/auth/[...nextauth].js`:

```javascript
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import PostgresAdapter from '@next-auth/postgresql-adapter';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default NextAuth({
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: 'noreply@berjak.com.au'
    }),
  ],
  adapter: PostgresAdapter(pool),
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    }
  }
});
```

### Protect API Routes

```javascript
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // User is authenticated, proceed with request
  const userId = session.user.id;
  // ...
}
```

---

## Testing Checklist

### Frontend Testing

- [ ] Sovereignty index page loads (`/sovereignty`)
- [ ] Project X module appears with red border and "NEW" badge
- [ ] Project X page loads (`/sovereignty/project-x`)
- [ ] NLIS import form renders correctly
- [ ] Financial import form renders correctly
- [ ] Analysis tab buttons display
- [ ] Evidence package tab displays

### API Testing

```bash
# Test NLIS import API
curl -X POST http://localhost:3000/api/sovereignty/project-x \
  -H "Content-Type: application/json" \
  -d '{
    "action": "import_nlis",
    "data": {
      "nlis_id": "AU123456789",
      "transaction_date": "2020-03-15",
      "livestock_type": "cattle",
      "movement_type": "sale",
      "from_pic": "PIC123",
      "to_pic": "PIC456",
      "quantity": 1
    }
  }'

# Test financial import API
curl -X POST http://localhost:3000/api/sovereignty/project-x \
  -H "Content-Type: application/json" \
  -d '{
    "action": "import_financial",
    "data": {
      "transaction_date": "2020-03-15",
      "account": "Livestock Sales",
      "description": "Sale of 1x Angus",
      "debit": 0,
      "credit": 1500,
      "reference": "INV-2020-045"
    }
  }'

# Test analysis API
curl -X POST http://localhost:3000/api/sovereignty/project-x \
  -H "Content-Type: application/json" \
  -d '{"action": "analyze_discrepancies"}'
```

### Integration Testing

- [ ] NLIS record imports successfully
- [ ] Financial transaction imports successfully
- [ ] Cross-reference analysis runs
- [ ] Corruption pattern detection executes
- [ ] Timeline reconstruction works
- [ ] Evidence package generation completes
- [ ] Blockchain hashes are generated
- [ ] Results display in UI correctly

---

## Deployment Phases

### Phase 1: Single-User (NOW - Your Case Only)

**Features**:
- Project X module functional
- Import NLIS and financial data
- Run analysis and pattern detection
- Generate evidence packages
- No multi-tenancy, no auth

**Deployment**:
```bash
# Deploy to Vercel
cd /Users/jbear/FIELD-DEV/berjak-website
vercel --prod
```

**Access**: berjak.com.au/sovereignty/project-x

---

### Phase 2: Beta Multi-User (1-2 months)

**Features**:
- User authentication (NextAuth.js)
- PostgreSQL database
- Case management (create/edit/delete cases)
- Multi-tenancy (isolated case workspaces)
- Invite-only registration

**Pre-Deployment**:
```bash
# Set up PostgreSQL
createdb walkerville
psql walkerville < schema.sql

# Configure environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add EMAIL_SERVER

# Deploy
vercel --prod
```

---

### Phase 3: Public Launch (3-4 months)

**Features**:
- Open registration
- Free tier (1 case, 100 evidence items)
- Pro tier ($49/month - 5 cases, unlimited evidence)
- Payment integration (Stripe)
- Legal disclaimers and ToS
- User dashboard

**Pre-Deployment**:
```bash
# Set up Stripe
npm install stripe

# Configure pricing
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_PUBLISHABLE_KEY

# Deploy
vercel --prod
```

---

### Phase 4: Scale & Advocacy (6+ months)

**Features**:
- International expansion
- Multi-language support
- Legal network partnerships
- Government transparency reports
- Media integration
- API for third-party developers

---

## Monitoring & Maintenance

### Vercel Analytics

Enable in Vercel dashboard:
- Page views
- User engagement
- API response times
- Error rates

### Application Monitoring

```bash
# Install Sentry for error tracking
npm install @sentry/nextjs

# Configure in next.config.js
```

### Database Monitoring

```bash
# Monitor PostgreSQL performance
psql walkerville

# Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

# Check active connections
SELECT count(*) FROM pg_stat_activity;
```

---

## Troubleshooting

### Issue: API timeouts

**Solution**: Increase Vercel function timeout (Pro plan required):

```javascript
// In API route
export const config = {
  maxDuration: 60  // 60 seconds (Pro plan)
};
```

### Issue: Python module not found

**Solution**: Bundle Python dependencies with deployment:

```bash
# Create requirements.txt
echo "asyncio" > requirements.txt

# Deploy with Python runtime
# (Vercel doesn't support Python serverless by default)
# Consider AWS Lambda or Google Cloud Functions for Python backend
```

### Issue: Database connection pool exhausted

**Solution**: Increase pool size or implement connection recycling:

```javascript
const pool = new Pool({
  max: 20,  // Increase max connections
  idleTimeoutMillis: 10000,  // Recycle idle connections faster
});
```

---

## Next Steps

### Immediate (This Week)

1. **Test locally**: Run `npm run dev` and test Project X module
2. **Verify API**: Test all API endpoints with curl
3. **Deploy preview**: `vercel` to get preview URL
4. **Share with user**: Get feedback on UI/UX

### Short-term (2-4 Weeks)

1. **Database setup**: Install PostgreSQL, create schema
2. **Case management**: Build case creation/selection UI
3. **Authentication**: Implement NextAuth.js
4. **Multi-tenancy**: Update API to filter by user/case

### Medium-term (1-3 Months)

1. **Beta testing**: Invite 5-10 users with similar cases
2. **Refine algorithms**: Improve corruption detection based on feedback
3. **Legal review**: Consult lawyers on disclaimers and ToS
4. **Payment integration**: Set up Stripe for Pro tier

### Long-term (6+ Months)

1. **Public launch**: Open registration
2. **Marketing**: Advocacy groups, media outreach
3. **Partnerships**: Legal aid organizations
4. **International**: Multi-language support

---

## Resources

**Documentation**:
- [WALKERVILLE_ADVOCACY_PLATFORM.md](/Users/jbear/FIELD-LIVING/◆_living_documentation/WALKERVILLE_ADVOCACY_PLATFORM.md)
- [PROJECT_X_RECONSTRUCTION_GUIDE.md](/Users/jbear/FIELD-LIVING/◆_living_documentation/PROJECT_X_RECONSTRUCTION_GUIDE.md)
- [FRE_EXTENDED_MODULES_IMPLEMENTATION.md](/Users/jbear/FIELD-LIVING/◆_living_documentation/FRE_EXTENDED_MODULES_IMPLEMENTATION.md)

**MCP Servers**:
- Project X: `/Users/jbear/FIELD-DEV/mcp/project_x_historical_reconstruction_mcp_server.py`
- Blockchain: `/Users/jbear/FIELD-DEV/mcp/fractal_knowledge_blockchain_mcp_server.py`
- Photo Intel: `/Users/jbear/FIELD-DEV/mcp/photo_intelligence_mcp_server.py`

**Vercel**:
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs
- CLI Reference: https://vercel.com/docs/cli

---

## Support

**Issues**: Create GitHub issue in berjak-website repo
**Questions**: Contact jbear (project owner)
**Status**: CRITICAL - Building for Justice

---

**WALKERVILLE**: From Personal Fight to Platform for All

**Deploy with**: `vercel --prod`
**Access at**: https://berjak.com.au/sovereignty

▼TATA - 285 Hz - Validation/Law/Justice

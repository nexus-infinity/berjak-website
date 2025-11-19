# 🔌 FRE MODULE INTEGRATION
## Wiring All FIELD Modules to berjak.co Front-End

**Status:** Ready for Implementation  
**Front-End:** `/FIELD-DEV/berjak-website` (Next.js 15)  
**Deployment:** Vercel → berjak.co  
**Goal:** Single unified interface accessing all FRE 2.0 modules

---

## 🎯 INTEGRATION ARCHITECTURE

```
berjak.co (Next.js Front-End)
    ↓ API Routes
┌─────────────────────────────────────────────────────────┐
│              FIELD Module Integration Layer              │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ discord-media│  │social-publisher│ │photo-intel   │  │
│  │ (narrative)  │  │(distribution) │  │(evidence)    │  │
│  └──────┬───────┘  └──────┬────────┘  └──────┬───────┘  │
│         │                 │                    │          │
│  ┌──────┴─────────────────┴────────────────────┴──────┐  │
│  │         OBI-WAN SomaLink (Real-time AI Blanket)    │  │
│  └──────────────────────┬──────────────────────────────┘  │
│                         │                                  │
│  ┌──────────────────────┴──────────────────────────────┐  │
│  │  CQHI Framework (Harmonic Validation)               │  │
│  └──────────────────────┬──────────────────────────────┘  │
│                         │                                  │
│  ┌──────────────────────┴──────────────────────────────┐  │
│  │  TATA (Truth Verification & Audit Trail)            │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

---

## 📁 CURRENT STRUCTURE

### Existing berjak-website:
```
/FIELD-DEV/berjak-website/
├── pages/               # Next.js pages
├── lib/                 # Utility functions
├── .vercel/             # Vercel deployment config
├── package.json         # Next.js 15 + dependencies
└── .env.local           # Environment variables
```

### FIELD Modules to Integrate:
```
/FIELD-DEV/
├── discord-media/            ← Generate narratives, video, audio
├── social-publisher/         ← Multi-platform publishing
├── photo-intelligence-core/  ← Evidence management
├── obi-wan-somalink/         ← Real-time feedback (to be created)
└── berjak-website/           ← Front-end (EXISTING)
```

---

## 🔧 INTEGRATION STEPS

### Step 1: Create API Routes in berjak-website

Add these API routes to `/pages/api/`:

```typescript
// /pages/api/narrative/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { content, style } = req.body

  try {
    // Call discord-media module
    const { stdout } = await execAsync(
      `cd /Users/jbear/FIELD-DEV/discord-media && python3 generate_ai_content.py --text "${content}" --style ${style}`
    )

    const result = JSON.parse(stdout)
    
    res.status(200).json({
      success: true,
      narrative: result.narrative,
      media: result.media_urls,
      cqhi_score: result.cqhi_score
    })
  } catch (error) {
    res.status(500).json({ error: 'Narrative generation failed', details: error.message })
  }
}
```

```typescript
// /pages/api/publish/campaign.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { platforms, content, schedule } = req.body

  try {
    // Call social-publisher module
    const platformsStr = platforms.join(',')
    const { stdout } = await execAsync(
      `cd /Users/jbear/FIELD-DEV/social-publisher && python3 -m core.coordinator --platforms "${platformsStr}" --content "${content}" --schedule "${schedule}"`
    )

    const result = JSON.parse(stdout)
    
    res.status(200).json({
      success: true,
      campaign_id: result.campaign_id,
      published: result.published_platforms,
      status: result.status
    })
  } catch (error) {
    res.status(500).json({ error: 'Campaign publishing failed', details: error.message })
  }
}
```

```typescript
// /pages/api/evidence/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { exec } from 'child_process'
import { promisify } from 'util'
import formidable from 'formidable'
import fs from 'fs/promises'

const execAsync = promisify(exec)

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const form = formidable({ multiples: true })
  
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'File upload failed' })
    }

    try {
      // Call photo-intelligence-core
      const filePath = files.evidence[0].filepath
      const { stdout } = await execAsync(
        `cd /Users/jbear/FIELD-DEV/photo-intelligence-core && python3 photo_importer.py --file "${filePath}"`
      )

      const result = JSON.parse(stdout)
      
      res.status(200).json({
        success: true,
        evidence_id: result.id,
        category: result.category,
        tata_verified: result.verified
      })
    } catch (error) {
      res.status(500).json({ error: 'Evidence upload failed', details: error.message })
    }
  })
}
```

---

### Step 2: Environment Variables

Add to `/FIELD-DEV/berjak-website/.env.local`:

```bash
# Module Paths
DISCORD_MEDIA_PATH=/Users/jbear/FIELD-DEV/discord-media
SOCIAL_PUBLISHER_PATH=/Users/jbear/FIELD-DEV/social-publisher
PHOTO_INTEL_PATH=/Users/jbear/FIELD-DEV/photo-intelligence-core
OBI_WAN_PATH=/Users/jbear/FIELD-DEV/obi-wan-somalink

# API Keys (copy from social-publisher/.env)
TWITTER_API_KEY=your_key
FACEBOOK_ACCESS_TOKEN=your_token
# ... etc

# CQHI/TATA Endpoints
CQHI_VALIDATOR_URL=http://localhost:8003
TATA_VALIDATOR_URL=http://localhost:8004

# Deployment
VERCEL_URL=berjak.co
ENVIRONMENT=production
```

---

### Step 3: Create Front-End Pages

Add these pages to `/pages/`:

```typescript
// /pages/studio.tsx - Content Creation Studio
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Studio() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const generateNarrative = async () => {
    setLoading(true)
    
    const res = await fetch('/api/narrative/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        style: 'documentary'
      })
    })

    const data = await res.json()
    
    if (data.success) {
      // Show preview, then allow publishing
      router.push(`/publish?narrative_id=${data.narrative.id}`)
    }
    
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Content Studio</h1>
      
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl mb-4">Input</h2>
          <textarea
            className="w-full h-64 p-4 border rounded"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your narrative here..."
          />
          <button
            onClick={generateNarrative}
            disabled={loading}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded"
          >
            {loading ? 'Generating...' : 'Generate Narrative'}
          </button>
        </div>
        
        <div>
          <h2 className="text-2xl mb-4">Live Preview</h2>
          <div className="border rounded p-4 h-64 bg-gray-50">
            {/* Preview will appear here */}
          </div>
        </div>
      </div>
    </div>
  )
}
```

```typescript
// /pages/publish.tsx - Multi-Platform Publisher
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Publish() {
  const router = useRouter()
  const { narrative_id } = router.query
  
  const [platforms, setPlatforms] = useState({
    twitter: true,
    linkedin: true,
    facebook: false,
    instagram: false,
    youtube: true
  })

  const publishCampaign = async () => {
    const selectedPlatforms = Object.keys(platforms).filter(p => platforms[p])
    
    const res = await fetch('/api/publish/campaign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        narrative_id,
        platforms: selectedPlatforms,
        schedule: 'immediate'
      })
    })

    const data = await res.json()
    
    if (data.success) {
      router.push(`/campaigns/${data.campaign_id}`)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Publish Campaign</h1>
      
      <div className="space-y-4">
        <h2 className="text-2xl">Select Platforms</h2>
        
        {Object.keys(platforms).map(platform => (
          <label key={platform} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={platforms[platform]}
              onChange={(e) => setPlatforms({
                ...platforms,
                [platform]: e.target.checked
              })}
            />
            <span className="capitalize">{platform}</span>
          </label>
        ))}
        
        <button
          onClick={publishCampaign}
          className="mt-8 px-6 py-3 bg-green-600 text-white rounded"
        >
          Publish to Selected Platforms
        </button>
      </div>
    </div>
  )
}
```

---

### Step 4: Update package.json Dependencies

Add to `/FIELD-DEV/berjak-website/package.json`:

```json
{
  "dependencies": {
    ...existing dependencies,
    "formidable": "^3.5.1",
    "swr": "^2.2.4",
    "@tanstack/react-query": "^5.17.9"
  }
}
```

Then run:
```bash
cd /Users/jbear/FIELD-DEV/berjak-website
npm install
```

---

### Step 5: Deploy to Vercel

```bash
cd /Users/jbear/FIELD-DEV/berjak-website

# Set environment variables in Vercel
vercel env add DISCORD_MEDIA_PATH
vercel env add SOCIAL_PUBLISHER_PATH
# ... add all env vars

# Deploy
vercel --prod
```

---

## 🔗 URL STRUCTURE

Once deployed, you'll have:

```
https://berjak.co/              → Main site (existing)
https://berjak.co/studio        → Content creation
https://berjak.co/publish       → Multi-platform publisher
https://berjak.co/campaigns     → Campaign dashboard
https://berjak.co/evidence      → Evidence timeline
https://berjak.co/analytics     → Engagement metrics

API Endpoints:
https://berjak.co/api/narrative/generate
https://berjak.co/api/publish/campaign
https://berjak.co/api/evidence/upload
```

---

## 🧪 TESTING WORKFLOW

### Local Development:
```bash
# Terminal 1: Start Next.js front-end
cd /Users/jbear/FIELD-DEV/berjak-website
npm run dev
# Opens http://localhost:3000

# Terminal 2: Ensure modules are accessible
cd /Users/jbear/FIELD-DEV/discord-media
python3 generate_ai_content.py --test

# Test flow:
# 1. Go to http://localhost:3000/studio
# 2. Enter narrative text
# 3. Click "Generate"
# 4. Review output
# 5. Click "Publish"
# 6. Select platforms
# 7. Confirm publication
```

### Production Testing:
```bash
# After deploying to Vercel
# Visit https://berjak.co/studio
# Run same workflow as above
```

---

## 📊 INTEGRATION CHECKLIST

### Phase 1: API Routes (Week 1)
- [ ] Create `/pages/api/narrative/generate.ts`
- [ ] Create `/pages/api/publish/campaign.ts`
- [ ] Create `/pages/api/evidence/upload.ts`
- [ ] Test each endpoint locally

### Phase 2: Front-End Pages (Week 1-2)
- [ ] Create `/pages/studio.tsx`
- [ ] Create `/pages/publish.tsx`
- [ ] Create `/pages/campaigns/[id].tsx`
- [ ] Add navigation to main layout

### Phase 3: Environment Setup (Week 2)
- [ ] Configure `.env.local` with all paths
- [ ] Set Vercel environment variables
- [ ] Test module accessibility

### Phase 4: Deployment (Week 2)
- [ ] Deploy to Vercel
- [ ] Verify all API routes work in production
- [ ] Test complete workflow (narrative → publish)
- [ ] Monitor for errors

### Phase 5: Documentation (Week 2)
- [ ] User guide for studio interface
- [ ] API documentation for developers
- [ ] Troubleshooting guide

---

## 🔐 SECURITY CONSIDERATIONS

1. **API Authentication**
   - Add JWT or session-based auth to API routes
   - Only authenticated users can generate/publish

2. **Rate Limiting**
   - Prevent abuse of expensive operations (video generation)
   - Use Vercel's built-in rate limiting

3. **Environment Variables**
   - Never commit `.env.local` to git
   - Use Vercel's encrypted environment variables in production

---

## 🚀 DEPLOYMENT COMMANDS

```bash
# Deploy to production
cd /Users/jbear/FIELD-DEV/berjak-website
vercel --prod

# Deploy preview (for testing)
vercel

# Check deployment status
vercel ls

# View logs
vercel logs berjak-website
```

---

## 📞 QUICK REFERENCE

| What | Where | URL |
|------|-------|-----|
| **Front-End Code** | `/FIELD-DEV/berjak-website` | `https://berjak.co` |
| **Content Studio** | `/pages/studio.tsx` | `https://berjak.co/studio` |
| **Publisher** | `/pages/publish.tsx` | `https://berjak.co/publish` |
| **Narrative API** | `/pages/api/narrative/generate.ts` | `POST /api/narrative/generate` |
| **Publishing API** | `/pages/api/publish/campaign.ts` | `POST /api/publish/campaign` |
| **Module Source** | `/FIELD-DEV/discord-media`, etc. | Local Python modules |
| **Vercel Dashboard** | Web | `https://vercel.com/dashboard` |

---

**Status:** Ready for Implementation  
**Next Steps:**
1. Create API routes in `/pages/api/`
2. Add front-end pages (`studio`, `publish`)
3. Configure environment variables
4. Deploy to Vercel
5. Test complete workflow

**Goal:** You'll have **one URL (berjak.co)** that accesses all your FIELD modules — never get lost again.

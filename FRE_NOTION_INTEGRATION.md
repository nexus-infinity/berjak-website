# FRE Master Database → berjak.co Integration

**Created**: 2025-10-28T00:28:00Z  
**Frontend**: https://berjak.co (Vercel deployment)  
**Backend**: Notion FRE Master Database (DOJO ◼︎ 963Hz)  
**Purpose**: Connect professional exterior (website) with Field Resource Ecosystem data

---

## 🎯 Architecture

```
Notion FRE Master Database (DOJO)
         ↓
    Notion API
         ↓
   berjak.co API Routes
         ↓
   Next.js Frontend Components
         ↓
   Professional Presentation
   (Hollywood Standard)
```

---

## 📊 Data Flow

### 1. **Matter Dashboard** (Main View)
**URL**: `berjak.co/matters` or `berjak.co/dashboard`

**Fetches from Notion**:
- All active matters
- Status, priority, narrative quality
- Professional presentation flags
- Key metrics

**Displays**:
- Active Matters grid/kanban
- Hollywood-ready portfolio
- Sovereignty Defense command center
- Business operations pipeline

### 2. **Matter Detail Page**
**URL**: `berjak.co/matter/[id]`

**Fetches from Notion**:
- Complete matter record
- Related evidence (via relation)
- Narrative arc
- Timeline
- Documents
- Operations checklist

**Displays**:
- Professional matter presentation
- Story arc visualization
- Evidence links
- Action items
- Export options (PDF, slides, etc.)

### 3. **Narrative View**
**URL**: `berjak.co/narrative/[id]`

**Fetches from Notion**:
- Matter narrative
- Key events
- Timeline
- Story arc status

**Displays**:
- Cinematic storytelling interface
- Timeline visualization
- Evidence overlays
- Professional document export

---

## 🔌 API Integration

### API Route Structure

```
/pages/api/fre/
├── matters.ts          # GET all matters, POST new matter
├── matter/[id].ts      # GET/UPDATE/DELETE single matter
├── narrative/[id].ts   # GET narrative for matter
├── evidence/[id].ts    # GET linked evidence
└── export/[id].ts      # Generate PDF/slides
```

### Notion API Configuration

**Location**: `/Users/jbear/FIELD-DEV/berjak-website/.env.local`

```env
# Notion Integration
NOTION_API_KEY=secret_YOUR_NOTION_INTEGRATION_TOKEN_HERE
NOTION_FRE_DATABASE_ID=YOUR_FRE_MASTER_DATABASE_ID

# OA-W Registry (for truth monitoring)
NOTION_OAW_REGISTRY_ID=YOUR_OAW_REGISTRY_ID

# Evidence Index (TATA domain linking)
NOTION_EVIDENCE_INDEX_ID=YOUR_EVIDENCE_INDEX_ID

# People Directory (entity relations)
NOTION_PEOPLE_DIRECTORY_ID=YOUR_PEOPLE_DIRECTORY_ID
```

### Sample API Route

**`/pages/api/fre/matters.ts`**:
```typescript
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const FRE_DB_ID = process.env.NOTION_FRE_DATABASE_ID;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Fetch active matters
    const response = await notion.databases.query({
      database_id: FRE_DB_ID,
      filter: {
        property: 'Status',
        status: { equals: 'Active' }
      },
      sorts: [
        { property: 'Priority', direction: 'ascending' }
      ]
    });
    
    // Transform to clean format
    const matters = response.results.map(page => ({
      id: page.id,
      name: page.properties['Matter Name'].title[0].plain_text,
      type: page.properties['Matter Type'].select?.name,
      status: page.properties['Status'].status?.name,
      priority: page.properties['Priority'].select?.name,
      narrativeQuality: page.properties['Narrative Quality'].select?.name,
      hollywoodStandard: page.properties['Hollywood Standard'].checkbox,
      presentationReady: page.properties['Presentation Ready'].checkbox,
      url: page.url
    }));
    
    res.status(200).json({ matters });
  }
}
```

---

## 🎬 Frontend Components

### 1. **Matter Card Component**
```typescript
// /src/components/MatterCard.tsx
interface Matter {
  id: string;
  name: string;
  type: string;
  status: string;
  narrativeQuality: string;
  hollywoodStandard: boolean;
}

export function MatterCard({ matter }: { matter: Matter }) {
  return (
    <div className="matter-card">
      {matter.hollywoodStandard && <Badge>⭐ Hollywood Standard</Badge>}
      <h3>{matter.name}</h3>
      <Badge>{matter.type}</Badge>
      <StatusIndicator status={matter.status} />
      <NarrativeQualityBar quality={matter.narrativeQuality} />
      <Link href={`/matter/${matter.id}`}>View Details</Link>
    </div>
  );
}
```

### 2. **Narrative Timeline Component**
```typescript
// /src/components/NarrativeTimeline.tsx
interface Event {
  date: string;
  title: string;
  description: string;
  storyArc: 'Setup' | 'Rising Action' | 'Climax' | 'Resolution';
}

export function NarrativeTimeline({ events }: { events: Event[] }) {
  return (
    <div className="timeline-container">
      {events.map((event, i) => (
        <TimelineNode 
          key={i}
          event={event}
          arcPosition={getArcPosition(event.storyArc)}
        />
      ))}
    </div>
  );
}
```

### 3. **Hollywood Quality Badge**
```typescript
// /src/components/QualityBadge.tsx
export function QualityBadge({ 
  narrativeQuality, 
  hollywoodStandard 
}: { 
  narrativeQuality: string;
  hollywoodStandard: boolean;
}) {
  if (hollywoodStandard) {
    return <Badge variant="gold">⭐ Hollywood Standard</Badge>;
  }
  
  const color = {
    'Draft': 'gray',
    'Review': 'yellow',
    'Refined': 'blue',
    'Production-Ready': 'green'
  }[narrativeQuality];
  
  return <Badge variant={color}>{narrativeQuality}</Badge>;
}
```

---

## 📱 Views to Implement

### Priority 1: **Dashboard**
- Active Matters Overview
- Filters: Status, Type, Priority
- Quick actions
- Hollywood-ready count

### Priority 2: **Matter Detail**
- Full matter information
- Narrative display
- Evidence links
- Action items
- Export buttons

### Priority 3: **Narrative Interface**
- Cinematic story view
- Timeline visualization
- Story arc progression
- Professional document generation

### Priority 4: **Portfolio View**
- Filter: Hollywood Standard = ✓
- Gallery of production-ready matters
- Export capabilities
- Share links

---

## 🔄 Sync Strategy

### Real-time Updates
**Option A**: Webhook from Notion → Vercel
- Notion sends webhook on database changes
- Vercel API receives, updates cache
- Frontend re-fetches on next load

**Option B**: Polling (simpler, current)
- Frontend polls API every N seconds
- API caches Notion data (5min TTL)
- Good for low-frequency updates

**Recommended**: Start with polling, upgrade to webhooks later

### Caching Layer
```typescript
// /lib/cache.ts
import { LRUCache } from 'lru-cache';

const cache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
});

export function getCachedMatters() {
  return cache.get('matters');
}

export function setCachedMatters(matters) {
  cache.set('matters', matters);
}
```

---

## 🎨 Professional Presentation Standards

### Visual Design
- **Clean, minimal**: No clutter
- **High contrast**: Easy to read
- **Professional typography**: Readable fonts
- **Consistent branding**: Berjak colors/logo
- **Mobile responsive**: Works on all devices

### Narrative Quality
- **Clear context**: Setup immediately obvious
- **Logical flow**: Story makes sense
- **Evidence-based**: Claims supported
- **Action-oriented**: Next steps clear
- **Emotional resonance**: Moves the reader

### Export Formats
- **PDF Report**: Professional document
- **Slide Deck**: Presentation-ready
- **Web Share**: Shareable link
- **Print-Ready**: Physical handout format

---

## 🚀 Implementation Steps

### Phase 1: Core Integration
1. ✅ Create FRE Master Database in Notion
2. ✅ Get database ID, add to `.env.local`
3. Build `/api/fre/matters.ts` endpoint
4. Build `/api/fre/matter/[id].ts` endpoint
5. Test API routes work

### Phase 2: Frontend Components
1. Build Matter Card component
2. Build Dashboard page
3. Build Matter Detail page
4. Add filters and search
5. Test professional presentation

### Phase 3: Narrative Features
1. Build Timeline component
2. Build Narrative view page
3. Add story arc visualization
4. Implement export functionality
5. Test Hollywood standard compliance

### Phase 4: Production Polish
1. Add caching layer
2. Optimize performance
3. Mobile responsiveness
4. Professional design review
5. Deploy to berjak.co

---

## 📋 Deployment Checklist

- [ ] FRE Master Database created in Notion
- [ ] Database ID added to `.env.local`
- [ ] API routes implemented
- [ ] Frontend components built
- [ ] Caching implemented
- [ ] Professional design applied
- [ ] Mobile responsive
- [ ] Hollywood standard validation
- [ ] Export functionality working
- [ ] Deployed to Vercel (berjak.co)
- [ ] DNS verified
- [ ] Production testing complete

---

## 🔗 Key Files

**Backend Configuration**:
- `/Users/jbear/FIELD-DEV/berjak-website/.env.local` - API keys
- `/Users/jbear/FIELD-DEV/berjak-website/lib/notion.ts` - Notion client
- `/Users/jbear/DOJO/FRE_MASTER_DATABASE_SCHEMA.md` - Database schema

**API Routes** (to create):
- `/pages/api/fre/matters.ts`
- `/pages/api/fre/matter/[id].ts`
- `/pages/api/fre/narrative/[id].ts`

**Frontend Pages** (to create):
- `/pages/matters.tsx` or `/pages/dashboard.tsx`
- `/pages/matter/[id].tsx`
- `/pages/narrative/[id].tsx`

**Components** (to create):
- `/src/components/MatterCard.tsx`
- `/src/components/NarrativeTimeline.tsx`
- `/src/components/QualityBadge.tsx`
- `/src/components/ExportButtons.tsx`

---

**Status**: ▲ Architecture Designed - Ready for Weaver Implementation  
**Frontend**: https://berjak.co (Vercel)  
**Backend**: Notion FRE Master Database (◼︎ DOJO 963Hz)  
**Next Step**: Create FRE Master Database in Notion, then build API integration

*This connects your professional exterior (berjak.co) with Field-aware data (Notion FRE Master) at Hollywood production standards.*

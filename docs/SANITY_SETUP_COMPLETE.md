# Sanity Studio Setup - Complete Documentation

This is the complete setup guide for the Group Design System with Sanity CMS integration following best practices.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Quick Start](#quick-start)
4. [Architecture](#architecture)
5. [File Reference](#file-reference)
6. [API Routes](#api-routes)
7. [Content Management](#content-management)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

**Group Design System** is a modern knowledge base for documenting design systems. It combines:

- **Next.js 14** - Frontend framework
- **Sanity Studio** - Visual content editor
- **shadcn/ui** - Beautiful UI components
- **GROQ** - Query language for Sanity

### Key Features

✅ **Visual Editor** - Non-developer friendly content management  
✅ **Standalone Studio** - Separate from main app (clean architecture)  
✅ **Best Practices** - Proper error handling, caching, validation  
✅ **Type-Safe** - TypeScript definitions for all content types  
✅ **Scalable** - Ready for growth and team collaboration  
✅ **Performance** - Optimized API routes with caching  
✅ **Security** - Environment variables, token management  

---

## 📁 Project Structure

```
/Users/macbookpro/Documents/Git/
│
├── shadcn-showcase/                        ← MAIN APP (Next.js)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.js                     # Home page
│   │   │   ├── globals.css                 # Tailwind styles
│   │   │   ├── layout.js                   # Root layout
│   │   │   └── api/                        # API routes
│   │   │       ├── components/
│   │   │       │   ├── route.js            # GET /api/components
│   │   │       │   └── [slug]/route.js     # GET /api/components/[slug]
│   │   │       ├── foundations/route.js    # GET /api/foundations
│   │   │       └── resources/route.js      # GET /api/resources
│   │   └── components/
│   │       ├── SanityPortableText.jsx      # Rich text renderer
│   │       └── ui/                         # shadcn/ui components
│   │
│   ├── lib/
│   │   ├── sanity.client.js                # Sanity SDK setup
│   │   ├── sanity.queries.js               # GROQ queries
│   │   ├── sanity.utils.js                 # Helper functions
│   │   └── api-helpers.js                  # API utilities
│   │
│   ├── .env.local                          # Your env vars (create this)
│   ├── .env.example                        # Template (commit this)
│   ├── ENV_SETUP.md                        # App env guide
│   ├── SANITY_SETUP.md                     # Integration guide
│   └── package.json
│
├── studio-group-design-system/             ← SANITY STUDIO
│   ├── sanity.config.js                    # Studio configuration
│   ├── schemaTypes/
│   │   ├── component.js                    # Component document type
│   │   ├── foundation.js                   # Foundation document type
│   │   ├── resource.js                     # Resource document type
│   │   ├── types.ts                        # TypeScript definitions
│   │   └── index.js                        # Exports all types
│   │
│   ├── .env.local.example                  # Optional local env
│   ├── ENV_SETUP.md                        # Studio env guide
│   ├── STUDIO_SETUP.md                     # Studio guide
│   ├── STUDIO_ACCESS.md                    # Access instructions
│   └── package.json
│
├── group-design-system/                    # Empty folder for future use
│
├── ENV_CONFIGURATION.md                    # Master env guide
└── SANITY_SETUP_COMPLETE.md               # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ installed
- Sanity account (free at https://www.sanity.io)
- API token from Sanity dashboard

### 5-Minute Setup

#### Step 1: Setup Environment

```bash
cd shadcn-showcase

# Create .env.local from template
cp .env.example .env.local
```

#### Step 2: Get Sanity API Token

1. Go to https://manage.sanity.io
2. Select project: `q8ijpuq2`
3. Settings → API → Tokens
4. Click "Add API token"
   - Name: `Next.js`
   - Permissions: `Editor`
5. Copy token

#### Step 3: Add Token

Edit `.env.local`:
```bash
SANITY_API_TOKEN=sk_production_YOUR_TOKEN_HERE
```

#### Step 4: Start Development

```bash
npm install
npm run dev
```

Opens at http://localhost:3000

#### Step 5: Access Sanity Studio

Visit: https://q8ijpuq2.sanity.studio

Log in with Sanity account and start creating content!

---

## 🏗️ Architecture

### Data Flow

```
┌─────────────────────────────────────────┐
│      Sanity Studio                      │
│   (Visual Content Editor)               │
│   https://q8ijpuq2.sanity.studio        │
└──────────────┬──────────────────────────┘
               │
               │ Create/Edit/Publish Content
               ↓
┌─────────────────────────────────────────┐
│      Sanity Cloud                       │
│   (Document & Content Storage)          │
│   project: q8ijpuq2                     │
└──────────────┬──────────────────────────┘
               │
               │ GROQ Queries
               ↓
┌─────────────────────────────────────────┐
│   Next.js API Routes                    │
│   /api/components                       │
│   /api/foundations                      │
│   /api/resources                        │
└──────────────┬──────────────────────────┘
               │
               │ JSON Response
               ↓
┌─────────────────────────────────────────┐
│   Next.js Frontend                      │
│   http://localhost:3000                 │
│   Beautiful UI with shadcn/ui           │
└─────────────────────────────────────────┘
```

### Request Flow (Detailed)

```
Client Request → Next.js App Server
                     ↓
                API Route Handler
                 (with error handling)
                     ↓
              Sanity Query (GROQ)
                     ↓
         Sanity Cloud Database
                     ↓
              JSON Response Data
                     ↓
         Cache Headers Applied
         (s-maxage, stale-while-revalidate)
                     ↓
              Browser Receives
            (with cache metadata)
```

---

## 📚 File Reference

### Client Setup (`lib/sanity.client.js`)

**Purpose:** Initialize Sanity SDK with proper error handling

**Key Features:**
- Environment variable validation
- CDN optimization for production
- Safe query wrapper with error handling
- Image URL builder for media

**Usage:**
```javascript
import { client, sanityFetch, urlFor } from '@/lib/sanity.client'

// Fetch data
const data = await sanityFetch(query, params)

// Build image URL
const imageUrl = urlFor(imageObject).url()
```

### Queries (`lib/sanity.queries.js`)

**Purpose:** Define all GROQ queries with caching strategy

**Queries Included:**
- `componentsQuery` - All components
- `componentBySlugQuery` - Single component
- `foundationsQuery` - All foundations
- `foundationBySlugQuery` - Single foundation
- `resourcesQuery` - All resources
- And more...

**Caching Config:**
```javascript
REVALIDATE_SECONDS = {
  COMPONENTS: 60,      // 1 minute
  FOUNDATIONS: 3600,   // 1 hour
  RESOURCES: 3600,     // 1 hour
}
```

### Utilities (`lib/sanity.utils.js`)

**Purpose:** Helper functions for data fetching and manipulation

**Functions:**
- `getAllComponents()` - Fetch all components
- `getComponentBySlug(slug)` - Fetch specific component
- `groupBy(items, property)` - Group array by property
- `sortBy(items, property, order)` - Sort array
- `filterByStatus(items, status)` - Filter by status

### API Helpers (`lib/api-helpers.js`)

**Purpose:** Standardized error handling and response formatting

**Functions:**
- `successResponse(data, options)` - Format success response
- `errorResponse(message, statusCode, details)` - Format error
- `withErrorHandling(handler)` - Wrap route with error handling
- `getCacheConfig(contentType)` - Get cache headers
- `validateParams(params, required)` - Validate query params

**Cache Configurations:**
```javascript
CACHE_CONFIG = {
  SHORT: 'public, s-maxage=60, stale-while-revalidate=300',
  MEDIUM: 'public, s-maxage=300, stale-while-revalidate=3600',
  LONG: 'public, s-maxage=3600, stale-while-revalidate=86400',
  NONE: 'no-cache, no-store, must-revalidate',
  PRIVATE: 'private, max-age=3600',
}
```

---

## 🔌 API Routes

### GET /api/components

**Description:** Fetch all published components

**Response:**
```json
{
  "data": [
    {
      "_id": "...",
      "name": "Button",
      "slug": { "current": "button" },
      "description": "...",
      "status": "published"
    }
  ],
  "status": "success",
  "timestamp": "2024-08-10T...",
  "meta": {
    "count": 18,
    "contentType": "components"
  }
}
```

**Cache:** 5 minutes

### GET /api/components/[slug]

**Description:** Fetch specific component with full details

**Parameters:**
- `slug` - Component slug (e.g., "button")

**Response:**
```json
{
  "data": {
    "_id": "...",
    "name": "Button",
    "slug": { "current": "button" },
    "description": "...",
    "overview": [...],
    "props": [...],
    "examples": [...]
  },
  "status": "success"
}
```

**Cache:** 1 minute

### GET /api/foundations?category=typography

**Description:** Fetch all foundations (optionally filtered by category)

**Query Parameters:**
- `category` (optional) - Filter by category

**Categories:**
- principles
- governance
- design-tokens
- typography
- colours
- elevation
- motion
- usability
- accessibility
- ux-writing

**Cache:** 1 hour

### GET /api/resources?resourceType=guide

**Description:** Fetch all resources (optionally filtered by type)

**Query Parameters:**
- `resourceType` (optional) - link, document, tool, guide

**Cache:** 1 hour

---

## 📝 Content Management

### Creating Components

1. Open Sanity Studio: https://q8ijpuq2.sanity.studio
2. Click "Components"
3. Click "Create new"
4. Fill in fields:
   - **Name** - Component name
   - **Slug** - Auto-generated (optional override)
   - **Description** - Brief description
   - **Overview** - Rich content with formatting
   - **Specifications** - Detailed specs
   - **Documentation** - Full documentation
   - **Props** - Property definitions
   - **Examples** - Code usage examples
   - **Status** - Draft or Published
5. Click "Publish"

### Creating Foundations

1. Click "Foundations"
2. Click "Create new"
3. Select category from dropdown
4. Fill in content
5. Publish

### Creating Resources

1. Click "Resources"
2. Click "Create new"
3. Choose resource type (link, document, tool, guide)
4. Add content and URL
5. Publish

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub (without .env.local)
2. Connect to Vercel
3. Go to Settings → Environment Variables
4. Add all variables from .env.local
5. Redeploy

### Netlify

1. Connect Git repository
2. Go to Site Settings → Build & Deploy → Environment
3. Add environment variables
4. Redeploy

### Docker

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=q8ijpuq2
ENV NEXT_PUBLIC_SANITY_DATASET=production

CMD ["npm", "start"]
```

Run with environment variables:
```bash
docker build -t group-design-system .
docker run -e SANITY_API_TOKEN=sk_production_... -p 3000:3000 group-design-system
```

---

## 🔍 API Response Examples

### Success Response

```json
{
  "data": { /* content */ },
  "status": "success",
  "timestamp": "2024-08-10T15:30:00.000Z",
  "meta": {
    "count": 18,
    "contentType": "components"
  }
}
```

### Error Response

```json
{
  "error": "Component not found",
  "status": "error",
  "timestamp": "2024-08-10T15:30:00.000Z",
  "details": "Slug 'invalid' does not match any published component"
}
```

---

## 📊 Environment Variables

### Required

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=q8ijpuq2
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=sk_production_YOUR_TOKEN
```

### Optional

```bash
DEBUG=true                    # Enable debug logging
NODE_ENV=development          # (auto-set)
```

See `ENV_CONFIGURATION.md` for complete details.

---

## 🐛 Troubleshooting

### "Sanity not configured"

**Problem:** NEXT_PUBLIC_SANITY_PROJECT_ID is missing

**Solution:**
```bash
# Check .env.local exists
ls -la .env.local

# Verify it has project ID
cat .env.local | grep SANITY_PROJECT_ID

# Restart dev server
npm run dev
```

### "API token is invalid"

**Problem:** Token is expired or malformed

**Solution:**
1. Generate new token from Sanity dashboard
2. Copy entire token (no spaces)
3. Ensure it starts with `sk_production_`
4. Update .env.local
5. Restart dev server

### "Component not found (404)"

**Problem:** Invalid slug or component not published

**Solution:**
1. Verify component is published in Sanity Studio
2. Check slug matches exactly
3. Slugs are lowercase with hyphens
4. Wait a few seconds for Sanity CDN to update

### "Network error connecting to Sanity"

**Problem:** Connection issue or Sanity outage

**Solution:**
1. Check internet connection
2. Verify Sanity status: https://status.sanity.io
3. Try again in a few seconds
4. Check project ID and dataset

---

## 📈 Performance Optimization

### Caching Strategy

- **Components (1 min)** - Frequently updated during development
- **Foundations (1 hour)** - Stable reference content
- **Resources (1 hour)** - External links (rarely change)
- **Detail pages (1 min)** - Individual items

### Image Optimization

```javascript
import { urlFor } from '@/lib/sanity.client'

// Auto-optimized image URL
const url = urlFor(imageObject)
  .width(800)
  .height(600)
  .fit('max')
  .auto('format')
  .url()
```

### Query Optimization

```javascript
// Only fetch needed fields
export const slimQuery = groq`
  *[_type == "component" && status == "published"] {
    _id,
    name,
    slug,
  }
`
```

---

## 🔒 Security Best Practices

✅ **DO**
- Keep API tokens secret
- Use .env.local (never commit)
- Rotate tokens regularly
- Use minimal required permissions
- Use HTTPS in production

❌ **DON'T**
- Commit .env.local to git
- Share API tokens
- Log tokens to console
- Use admin tokens in frontend
- Hardcode secrets

---

## 📚 File Structure Summary

```
Documentation:
├── ENV_CONFIGURATION.md         ← Master env guide
├── SANITY_SETUP_COMPLETE.md    ← This file
├── shadcn-showcase/
│   ├── ENV_SETUP.md            ← App env guide
│   └── SANITY_SETUP.md         ← Integration guide
└── studio-group-design-system/
    ├── ENV_SETUP.md            ← Studio env guide
    ├── STUDIO_SETUP.md         ← Studio guide
    └── STUDIO_ACCESS.md        ← Access instructions

Code:
├── shadcn-showcase/
│   ├── lib/sanity.client.js    ← SDK setup
│   ├── lib/sanity.queries.js   ← GROQ queries
│   ├── lib/sanity.utils.js     ← Helpers
│   ├── lib/api-helpers.js      ← API utilities
│   └── src/app/api/            ← API routes
└── studio-group-design-system/
    ├── sanity.config.js        ← Studio config
    └── schemaTypes/            ← Content types
```

---

## 🎓 Learning Resources

- **Sanity Docs:** https://www.sanity.io/docs
- **Next.js Docs:** https://nextjs.org/docs
- **GROQ Docs:** https://www.sanity.io/docs/groq
- **shadcn/ui:** https://ui.shadcn.com
- **Portable Text:** https://www.sanity.io/docs/portable-text

---

## ✅ Verification Checklist

- [ ] .env.local created with API token
- [ ] Dev server started: `npm run dev`
- [ ] App loads at http://localhost:3000
- [ ] Studio accessible at https://q8ijpuq2.sanity.studio
- [ ] API route works: http://localhost:3000/api/components
- [ ] Content created in Sanity Studio
- [ ] Content appears in app
- [ ] Build succeeds: `npm run build`

---

## 🎯 Next Steps

1. ✅ Add API token to .env.local
2. ✅ Start dev server
3. ✅ Create first component in Sanity
4. ✅ Verify it appears in API
5. ✅ Build for production
6. ✅ Deploy to Vercel/Netlify
7. ✅ Set environment variables in platform
8. ✅ Monitor in production

---

## 📞 Support

- **Issues:** Check troubleshooting section above
- **Sanity Support:** https://www.sanity.io/help
- **Community:** https://slack.sanity.io
- **Documentation:** See resources above

---

## 📝 License

MIT

---

**Last Updated:** August 10, 2024  
**Setup Status:** ✅ Complete  
**Project ID:** q8ijpuq2  
**Studio URL:** https://q8ijpuq2.sanity.studio

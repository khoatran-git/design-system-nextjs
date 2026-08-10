# Environment Variables - Complete Setup Guide

This guide covers environment variable setup for both the Next.js app and Sanity Studio.

## Project Structure

```
Git/
├── shadcn-showcase/                    ← Next.js App
│   ├── .env.example
│   ├── .env.local                      ← You create this
│   └── ENV_SETUP.md                    ← App-specific guide
│
└── group-design-system/         ← Sanity Studio
    ├── .env.example
    ├── .env.local.example
    ├── .env.local                      ← Optional, you create if needed
    └── ENV_SETUP.md                    ← Studio-specific guide
```

---

## Quick Start (5 Minutes)

### For Next.js App

```bash
cd shadcn-showcase

# 1. Create .env.local from template
cp .env.example .env.local

# 2. Get API token from Sanity:
#    https://manage.sanity.io → q8ijpuq2 → Settings → API → Tokens
#    Click "Add API token" → Editor permissions → Copy token

# 3. Edit .env.local and add your token:
#    SANITY_API_TOKEN=sk_production_YOUR_TOKEN_HERE

# 4. Restart dev server
npm run dev
```

### For Sanity Studio

```bash
cd group-design-system

# Optional: Create .env.local if you want to customize
cp .env.local.example .env.local

# Run locally (optional - cloud studio works without this)
npm run dev
# Opens at http://localhost:3333

# Or access cloud studio directly
# https://q8ijpuq2.sanity.studio
```

---

## Environment Variables by Component

### Next.js App (.env.local)

**Required:**
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=q8ijpuq2
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=sk_production_YOUR_TOKEN
```

**Optional:**
```bash
DEBUG=true                    # Enable debug logging
NODE_ENV=development         # (auto-set by npm run dev)
```

### Sanity Studio (.env.local)

**Optional (has defaults):**
```bash
SANITY_STUDIO_PROJECT_ID=q8ijpuq2
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_URL=https://q8ijpuq2.sanity.studio
```

---

## Sanity Project Details

| Setting | Value |
|---------|-------|
| **Project ID** | `q8ijpuq2` |
| **Dataset** | `production` |
| **API Version** | `2024-01-01` |
| **Studio URL** | https://q8ijpuq2.sanity.studio |
| **Dashboard** | https://manage.sanity.io |

---

## Getting Your API Token

### Step 1: Open Sanity Dashboard
Go to: https://manage.sanity.io

### Step 2: Select Project
Click on project ID: `q8ijpuq2`

### Step 3: Open Settings
Click the gear icon → "Settings"

### Step 4: Go to API
Click "API" in left sidebar

### Step 5: Create Token
- Scroll to "Tokens"
- Click "Add API token"
- Name: `Next.js` (or your app name)
- Permissions: `Editor` (read/write)
- Click "Create"

### Step 6: Copy Token
Copy immediately (won't show again)

Token format: `sk_production_XXXXXXXXXXXXX`

---

## Variable Visibility

### Public Variables (Exposed to Browser)

These are safe to see in browser - no secrets!

```javascript
// ✅ OK in browser
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
process.env.NEXT_PUBLIC_SANITY_DATASET
process.env.NEXT_PUBLIC_SANITY_API_VERSION
```

### Private Variables (Server Only)

Keep these secret - never sent to browser!

```javascript
// ✅ Server-side only
process.env.SANITY_API_TOKEN

// ❌ Undefined in browser
if (typeof window === 'undefined') {
  console.log(process.env.SANITY_API_TOKEN) // ✅ Works
} else {
  console.log(process.env.SANITY_API_TOKEN) // ❌ undefined
}
```

---

## Security Checklist

- [ ] Copy .env.example to .env.local
- [ ] Add your API token to SANITY_API_TOKEN
- [ ] .env.local is in .gitignore (do NOT commit)
- [ ] Token starts with `sk_production_`
- [ ] Token was generated with Editor permissions
- [ ] Dev server restarted after adding token
- [ ] No API tokens in git history
- [ ] Different tokens for dev/staging/production

---

## Deployment Environments

### Local Development

```bash
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=q8ijpuq2
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk_production_YOUR_DEV_TOKEN
```

### Staging/Preview

```bash
# Set in deployment platform
# Vercel: Project Settings → Environment Variables
# Netlify: Site Settings → Build & Deploy → Environment

NEXT_PUBLIC_SANITY_PROJECT_ID=q8ijpuq2
NEXT_PUBLIC_SANITY_DATASET=staging        # or production
SANITY_API_TOKEN=sk_production_YOUR_STAGING_TOKEN
```

### Production

```bash
# Set in deployment platform
NEXT_PUBLIC_SANITY_PROJECT_ID=q8ijpuq2
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk_production_YOUR_PROD_TOKEN
```

---

## Platform-Specific Instructions

### Vercel

1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add each variable:
   - Name: `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - Value: `q8ijpuq2`
5. Select which environments (Production/Preview/Development)
6. Redeploy

### Netlify

1. Go to Netlify Dashboard
2. Select your site
3. Site Settings → Build & Deploy → Environment
4. Edit variables
5. Add each variable
6. Redeploy

### Docker

Add to Dockerfile:
```dockerfile
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=q8ijpuq2
ENV NEXT_PUBLIC_SANITY_DATASET=production
ARG SANITY_API_TOKEN
ENV SANITY_API_TOKEN=$SANITY_API_TOKEN
```

Or pass at runtime:
```bash
docker run -e NEXT_PUBLIC_SANITY_PROJECT_ID=q8ijpuq2 ...
```

---

## Verification

### Check App Setup

Visit: http://localhost:3000/api/health

Should return:
```json
{
  "projectId": "q8ijpuq2",
  "dataset": "production",
  "hasToken": true
}
```

### Test API Endpoints

```bash
# Components API
curl http://localhost:3000/api/components

# Foundations API
curl http://localhost:3000/api/foundations

# Resources API
curl http://localhost:3000/api/resources
```

---

## Troubleshooting

### Environment variables not loading

```bash
# 1. Restart dev server
npm run dev

# 2. Check .env.local exists
ls -la .env.local

# 3. Verify file format (no spaces around =)
cat .env.local

# 4. Hard refresh browser
Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

### "Cannot authenticate with Sanity"

```bash
# 1. Verify token format
# Should start with: sk_production_

# 2. Generate new token from Sanity dashboard
# https://manage.sanity.io → Settings → API → Tokens

# 3. Make sure token has Editor permissions

# 4. Copy entire token (no spaces)
```

### "Project not found"

```bash
# 1. Verify project ID is correct: q8ijpuq2

# 2. Check it's not wrapped in quotes in .env.local
# ❌ Wrong: NEXT_PUBLIC_SANITY_PROJECT_ID="q8ijpuq2"
# ✅ Right: NEXT_PUBLIC_SANITY_PROJECT_ID=q8ijpuq2
```

---

## Environment Variable Files to Update

| File | Purpose | Required |
|------|---------|----------|
| `shadcn-showcase/.env.local` | App config + token | ✅ Yes |
| `group-design-system/.env.local` | Studio config | ❌ No |

---

## Next Steps

1. **Update .env.local in shadcn-showcase**
   - Copy .env.example
   - Add API token

2. **Restart dev server**
   ```bash
   npm run dev
   ```

3. **Test the setup**
   - Visit http://localhost:3000
   - Check /api/components endpoint
   - Look for data in console

4. **Deploy to production**
   - Set same variables in deployment platform
   - No .env.local files in git

---

## Resources

- **Sanity API Tokens:** https://www.sanity.io/docs/http-api-authentication
- **Next.js Env Vars:** https://nextjs.org/docs/basic-features/environment-variables
- **Vercel Deployment:** https://vercel.com/docs/projects/environment-variables
- **Netlify Deployment:** https://docs.netlify.com/configure-builds/environment-variables/

---

## Quick Reference

```bash
# Show all env vars (development)
env | grep SANITY

# Validate .env.local syntax
node -e "require('dotenv').config()"

# Export to another machine
cat .env.local | ssh user@server "cat > app/.env.local"
```

---

## Questions?

- **App setup:** See `shadcn-showcase/ENV_SETUP.md`
- **Studio setup:** See `group-design-system/ENV_SETUP.md`
- **Sanity docs:** https://www.sanity.io/docs

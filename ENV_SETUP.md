# Environment Variables Setup

This guide explains how to configure environment variables for the Group Design System Next.js app with Sanity CMS.

## Overview

The app requires two types of environment variables:
- **Public variables** (NEXT_PUBLIC_*) - Exposed to browser
- **Private variables** - Server-only, never sent to browser

## Quick Setup

### Step 1: Create .env.local

Copy the example file:
```bash
cp .env.example .env.local
```

### Step 2: Get Your Sanity API Token

1. Go to https://manage.sanity.io
2. Select your project (q8ijpuq2)
3. Go to Settings → API → Tokens
4. Click "Add API token"
   - Name: `Next.js`
   - Permissions: Select appropriate level (Editor/Viewer)
   - Click "Create"
5. Copy the token (starts with `sk_production_`)

### Step 3: Add Token to .env.local

Edit `.env.local` and paste your token:
```
SANITY_API_TOKEN=sk_production_YOUR_TOKEN_HERE
```

### Step 4: Restart Dev Server

```bash
npm run dev
```

The server will reload with new environment variables.

---

## Environment Variables Reference

### Public Variables (Exposed to Browser)

#### NEXT_PUBLIC_SANITY_PROJECT_ID
- **Description:** Your Sanity project ID
- **Value:** `q8ijpuq2`
- **Required:** Yes
- **Visible to:** Browser
- **Usage:** Client-side Sanity queries

#### NEXT_PUBLIC_SANITY_DATASET
- **Description:** Sanity dataset name
- **Value:** `production`
- **Required:** Yes
- **Default:** `production`
- **Visible to:** Browser
- **Usage:** Specifies which dataset to query

#### NEXT_PUBLIC_SANITY_API_VERSION
- **Description:** Sanity API version
- **Value:** `2024-01-01`
- **Required:** No
- **Default:** `2024-01-01`
- **Visible to:** Browser
- **Usage:** Ensures API compatibility

---

### Private Variables (Server-Only)

#### SANITY_API_TOKEN
- **Description:** API token for authenticated requests
- **Format:** Starts with `sk_production_` or `sk_`
- **Required:** Yes (for protected operations)
- **Visible to:** Server only
- **Usage:** Publishing, draft content access
- **How to get:**
  1. https://manage.sanity.io → Project → Settings → API
  2. Click "Add API token"
  3. Select permissions (Editor/Viewer)
  4. Copy token

---

## File Structure

```
shadcn-showcase/
├── .env.example          ← Template (commit to git)
├── .env.local           ← Your actual vars (DO NOT commit)
├── .env.local.example   ← Optional detailed template
└── .gitignore           ← Ensures .env.local is ignored
```

---

## Development vs Production

### Development (.env.local)

```bash
# Development - all settings
NEXT_PUBLIC_SANITY_PROJECT_ID=q8ijpuq2
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=sk_production_YOUR_TOKEN

# Optional: Enable debug logging
DEBUG=true
```

### Production (Environment variables)

Set these in your deployment platform:
- **Vercel:** Project Settings → Environment Variables
- **Netlify:** Site Settings → Build & Deploy → Environment
- **Other:** Set in deployment configuration

---

## How to Get Your Sanity API Token

### Method 1: Web Dashboard (Recommended)

1. Open https://manage.sanity.io
2. Select your project
3. Click Settings (gear icon)
4. Click "API"
5. Scroll to "Tokens"
6. Click "Add API token"
7. Enter details:
   - **Token name:** `Next.js` (or your app name)
   - **Permissions:** Choose based on use case:
     - `Editor` - Read/write (for content management)
     - `Viewer` - Read-only (for public content)
8. Click "Create"
9. Copy the token immediately (won't show again)

### Method 2: CLI

```bash
sanity tokens create
```

---

## Token Permissions Guide

### Viewer Token
- **Permissions:** Read-only
- **Use case:** Fetching published content only
- **Security:** Safe to expose publicly

### Editor Token
- **Permissions:** Read and write
- **Use case:** Publishing content, creating documents
- **Security:** Keep private - server-only

### Administrator Token
- **Permissions:** Full access
- **Use case:** Schema modifications, user management
- **Security:** Never share - keep highly secure

---

## Security Best Practices

### DO ✅

- ✅ Keep SANITY_API_TOKEN secret
- ✅ Use .env.local (never commit)
- ✅ Generate separate tokens per environment
- ✅ Rotate tokens regularly
- ✅ Use minimal required permissions
- ✅ Keep .env.local in .gitignore

### DON'T ❌

- ❌ Never commit .env.local to git
- ❌ Never share API tokens
- ❌ Don't use same token for dev/prod
- ❌ Don't use admin tokens in apps
- ❌ Don't log tokens to console
- ❌ Don't commit tokens to repository

---

## Troubleshooting

### "NEXT_PUBLIC_SANITY_PROJECT_ID not set"

**Problem:** Environment variables not loaded

**Solutions:**
1. Restart dev server: `npm run dev`
2. Check .env.local file exists
3. Verify file contains correct values
4. No spaces around `=` sign

### "Unauthorized - invalid API token"

**Problem:** Token is invalid or expired

**Solutions:**
1. Generate new token from Sanity dashboard
2. Check token starts with `sk_`
3. Verify token has correct permissions
4. Copy entire token (no spaces)

### "Failed to connect to Sanity"

**Problem:** Network error or wrong project ID

**Solutions:**
1. Check project ID is correct: `q8ijpuq2`
2. Verify internet connection
3. Check Sanity status: https://status.sanity.io
4. Try clearing node_modules: `rm -rf node_modules && npm install`

### Environment variables not updating in browser

**Problem:** Hot reload not picking up changes

**Solutions:**
1. Restart dev server: `npm run dev`
2. Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. Clear Next.js cache: `rm -rf .next`

---

## Environment Variables in Different Contexts

### Client-Side Code
```javascript
// Browser - use NEXT_PUBLIC_* variables
console.log(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) // ✅ Works
console.log(process.env.SANITY_API_TOKEN) // ❌ undefined
```

### Server-Side Code
```javascript
// Server - can use all variables
console.log(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) // ✅ Works
console.log(process.env.SANITY_API_TOKEN) // ✅ Works
```

### API Routes
```javascript
// API routes (server-side)
export async function GET() {
  const token = process.env.SANITY_API_TOKEN // ✅ Available
  // ...
}
```

---

## Deployment

### Vercel

1. Push code to GitHub (without .env.local)
2. Go to Vercel Dashboard
3. Select your project
4. Go to Settings → Environment Variables
5. Add all environment variables from .env.local
6. Redeploy

### Netlify

1. Push code to GitHub (without .env.local)
2. Go to Netlify Dashboard
3. Select your site
4. Go to Site Settings → Build & Deploy → Environment
5. Click "Edit variables"
6. Add all environment variables
7. Redeploy

### Self-Hosted

Set environment variables in your hosting platform:
- Docker: Use ENV in Dockerfile or --env flags
- Linux/Unix: Export in shell: `export VARIABLE=value`
- Windows: Set System Environment Variables

---

## Verification

Test that environment variables are loaded correctly:

```bash
# Create a test route
# src/app/api/health/route.js

export async function GET() {
  return Response.json({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    hasToken: !!process.env.SANITY_API_TOKEN,
  })
}
```

Then visit: http://localhost:3000/api/health

Should show:
```json
{
  "projectId": "q8ijpuq2",
  "dataset": "production",
  "hasToken": true
}
```

---

## Next Steps

1. ✅ Copy .env.example to .env.local
2. ✅ Generate API token from Sanity
3. ✅ Add token to .env.local
4. ✅ Restart dev server
5. ✅ Test API routes
6. ✅ Deploy to production

---

## Resources

- [Sanity API Tokens](https://www.sanity.io/docs/http-api-authentication)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Managing Secrets Securely](https://www.sanity.io/docs/security)

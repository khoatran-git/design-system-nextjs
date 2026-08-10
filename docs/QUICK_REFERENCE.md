# Quick Reference - Sanity Setup

## 🚀 Quick Start (Copy-Paste)

```bash
# 1. Enter app directory
cd /Users/macbookpro/Documents/Git/shadcn-showcase

# 2. Create environment file
cp .env.example .env.local

# 3. Add your API token to .env.local
# SANITY_API_TOKEN=sk_production_YOUR_TOKEN

# 4. Start dev server
npm install
npm run dev

# Opens at http://localhost:3000
```

## 🔑 Getting API Token

1. Go to: https://manage.sanity.io
2. Project: q8ijpuq2 → Settings → API → Tokens
3. "Add API token" → Name: "Next.js" → Permissions: "Editor"
4. Copy token → Paste into .env.local

## 📍 Key URLs

| Purpose | URL |
|---------|-----|
| **App** | http://localhost:3000 |
| **Studio** | https://q8ijpuq2.sanity.studio |
| **Dashboard** | https://manage.sanity.io |
| **API Docs** | https://www.sanity.io/docs |
| **Status** | https://status.sanity.io |

## 📁 Important Files

| File | Purpose |
|------|---------|
| `.env.local` | Your credentials (DO NOT commit) |
| `.env.example` | Template (commit this) |
| `lib/sanity.client.js` | SDK setup |
| `lib/sanity.queries.js` | GROQ queries |
| `src/app/api/` | API routes |

## 🔗 API Endpoints

```bash
# All components
GET /api/components

# Single component
GET /api/components/button

# All foundations
GET /api/foundations?category=typography

# All resources
GET /api/resources?resourceType=guide
```

## 💾 Project Details

```
Project ID:    q8ijpuq2
Dataset:       production
API Version:   2024-01-01
Studio URL:    https://q8ijpuq2.sanity.studio
Node:          20+ required
```

## 📋 Content Types

| Type | URL in Studio | How to Create |
|------|---------------|---------------|
| Component | Components | New → Fill fields → Publish |
| Foundation | Foundations | New → Select category → Publish |
| Resource | Resources | New → Add URL → Publish |

## 🛠️ Common Commands

```bash
# Start development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# View Sanity data in browser
# Visit: http://localhost:3000/api/components
```

## ❌ Common Issues

| Problem | Solution |
|---------|----------|
| "Not configured" | Add NEXT_PUBLIC_SANITY_PROJECT_ID to .env.local |
| "Invalid token" | Generate new token from Sanity dashboard |
| "Component not found" | Check it's published in Sanity |
| Port in use | Kill process or use different port |
| Env vars not loading | Restart dev server: `npm run dev` |

## ✅ Verification

```bash
# Check env vars are loaded
curl http://localhost:3000/api/health

# Should show:
# { "projectId": "q8ijpuq2", "hasToken": true }

# Test components API
curl http://localhost:3000/api/components

# Should return JSON array of components
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| ENV_CONFIGURATION.md | Environment variables setup |
| SANITY_SETUP_COMPLETE.md | Complete setup guide |
| shadcn-showcase/ENV_SETUP.md | App-specific env guide |
| group-design-system/STUDIO_SETUP.md | Studio guide |

## 🔒 Security

```bash
# ✅ DO
- Keep .env.local secret
- Never commit .env.local
- Rotate tokens regularly
- Use appropriate permissions

# ❌ DON'T
- Share API tokens
- Log secrets to console
- Use admin tokens in frontend
- Hardcode secrets in code
```

## 🚢 Deploy to Vercel

1. Push to GitHub (without .env.local)
2. Connect to Vercel
3. Add environment variables:
   - NEXT_PUBLIC_SANITY_PROJECT_ID
   - NEXT_PUBLIC_SANITY_DATASET
   - NEXT_PUBLIC_SANITY_API_VERSION
   - SANITY_API_TOKEN
4. Deploy

## 💡 Tips

- Studio is already deployed to cloud (no local setup needed)
- Generate separate tokens for dev/staging/prod
- Use Editor permissions for content creation
- Keep your API token secure
- Monitor API usage in Sanity dashboard

## 🆘 Help

- **Sanity Docs:** https://www.sanity.io/docs
- **Community:** https://slack.sanity.io
- **Status:** https://status.sanity.io
- **This Project:** See full docs above

---

**Project:** Group Design System  
**Setup:** ✅ Complete  
**Last Updated:** August 10, 2024

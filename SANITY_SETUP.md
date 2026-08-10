# Sanity Studio Setup Guide for Group Design System

## 🚀 Quick Setup (5 minutes)

### Step 1: Create a Sanity Project

1. Go to https://www.sanity.io
2. Click **"Get started"** or **Sign in** (create free account if needed)
3. Create a new project:
   - **Project name**: `Group Design System`
   - **Dataset name**: `production`
   - **Project template**: Choose `Blank project`
   - **TypeScript**: Yes
4. Click **"Create project"**

### Step 2: Get Your Project ID

After project is created:

1. Go to project settings (gear icon in sidebar)
2. Copy your **Project ID** (you'll see it in the URL too: `https://sanity.io/manage/PROJECT_ID/...`)
3. Copy the **API Token** (generate one if needed):
   - Click "API" in sidebar
   - Click "Add API token"
   - Name it: `Next.js`
   - Select permissions: `Editor`
   - Copy the token

### Step 3: Update Environment Variables

Create a `.env.local` file in your Next.js project root:

```bash
cd /Users/macbookpro/Documents/Git/shadcn-showcase
cat > .env.local << 'EOF'
NEXT_PUBLIC_SANITY_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=YOUR_API_TOKEN
EOF
```

Replace:
- `YOUR_PROJECT_ID` - Your Sanity project ID
- `YOUR_API_TOKEN` - Your Sanity API token

### Step 4: Deploy Sanity Studio

In your Sanity project dashboard:

1. Click **"Deployment"** in sidebar
2. Click **"Deploy to Vercel"** or **"Deploy free"**
3. Follow the prompts
4. Your Studio will be available at: `https://YOUR_PROJECT_ID.sanity.studio`

### Step 5: Access Your Studio

1. Go to `https://YOUR_PROJECT_ID.sanity.studio`
2. Log in with your Sanity account
3. You'll see the visual editor with all your schema types:
   - **Components** - Create/edit component documentation
   - **Foundations** - Create/edit foundation guidelines
   - **Resources** - Create/edit resources

---

## 📝 Using Sanity Studio

### Creating Component Documentation

1. In Studio, click **Components**
2. Click **"Create new"**
3. Fill in:
   - **Component Name**: e.g., "Button"
   - **Slug**: Auto-generated from name
   - **Description**: Brief description
   - **Overview Content**: Rich text with images, code blocks
   - **Specifications**: Detailed specs
   - **Documentation**: Full documentation
   - **Props**: List of properties with types
   - **Examples**: Code examples
   - **Related Components**: Link to other components
   - **Status**: Set to "published"
4. Click **Publish**

### Creating Foundations

1. Click **Foundations**
2. Click **"Create new"**
3. Fill in:
   - **Foundation Name**: e.g., "Typography"
   - **Category**: Choose from list (Typography, Colors, Motion, etc.)
   - **Description**: Brief description
   - **Content**: Rich text, images, code blocks
   - **Status**: Set to "published"
4. Click **Publish**

### Creating Resources

1. Click **Resources**
2. Click **"Create new"**
3. Fill in:
   - **Title**: e.g., "Design System Guide"
   - **Description**: What this resource is about
   - **Resource Type**: Link, Document, Tool, or Guide
   - **URL**: Link to resource
   - **Content**: Additional info
   - **Status**: Set to "published"
4. Click **Publish**

---

## 🔗 How It Works

### Data Flow

```
1. Create content in Sanity Studio (https://YOUR_PROJECT_ID.sanity.studio)
   ↓
2. Content stored in Sanity Cloud
   ↓
3. Next.js fetches via API routes (/api/components, /api/foundations, etc.)
   ↓
4. Display in Group Design System website (http://localhost:3000)
```

### API Endpoints

Your Next.js app has API routes to fetch data:

- `GET /api/components` - Get all components
- `GET /api/components/[slug]` - Get specific component
- `GET /api/foundations` - Get all foundations
- `GET /api/resources` - Get all resources

### Portable Text Editor

In Sanity Studio, when editing content fields, you get:

- **Rich text** - Bold, italic, underline, links
- **Headings** - H1, H2, H3, H4
- **Lists** - Bullets and numbered
- **Code blocks** - With syntax highlighting
- **Images** - Upload and optimize
- **Quotes** - Blockquote styling
- **Custom blocks** - Color palettes, typography scales

---

## ⚙️ Configuration Details

### Schema Types

#### Component
Fields for documenting UI components with properties, usage examples, and related items.

#### Foundation
Fields for design system foundations like typography, colors, motion, accessibility guidelines.

#### Resource
Fields for external resources, guides, links, and tools.

### Portable Text Features

The editor supports:
- **Text formatting**: Bold, italic, underline, code
- **Blocks**: Paragraphs, headings, lists, quotes, code blocks
- **Media**: Images with hotspot selection
- **Links**: Internal and external
- **Tables**: Coming soon with extensions

---

## 🛠️ Troubleshooting

### 1. "Project ID not found"

Make sure you updated `.env.local`:
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=YOUR_ACTUAL_PROJECT_ID
```

Then restart your dev server:
```bash
npm run dev
```

### 2. "API Token Error"

Generate a new token:
1. Go to Sanity dashboard
2. Click "API" → "Tokens"
3. Add new token with "Editor" permissions
4. Update `.env.local` with new token

### 3. Can't access Sanity Studio

1. Check your Studio URL is correct: `https://YOUR_PROJECT_ID.sanity.studio`
2. Make sure you're logged into your Sanity account
3. Check project is deployed in Sanity dashboard

### 4. Changes not showing in Next.js

1. The data is cached - changes take a few seconds
2. Hard refresh your browser (Cmd+Shift+R on Mac)
3. Check API is working: `curl http://localhost:3000/api/components`

---

## 📱 Team Collaboration

Sanity allows multiple editors:

1. In Sanity dashboard, go to **Settings** → **Members**
2. Click **"Invite member"**
3. Enter email address
4. They'll get access to edit content in Studio

---

## 🚀 Next Steps

1. **Create Sanity project** (https://www.sanity.io)
2. **Update .env.local** with your Project ID and API Token
3. **Deploy Sanity Studio** (free deployment available)
4. **Start creating content** in the visual editor
5. **Access website** at http://localhost:3000 to see published content

---

## 📚 Resources

- [Sanity Docs](https://www.sanity.io/docs)
- [Portable Text Docs](https://www.sanity.io/docs/portable-text)
- [Next.js + Sanity Integration](https://www.sanity.io/guides/sanity-nextjs-integration)
- [Sanity Schemas](https://www.sanity.io/docs/schema-types)

---

## Questions?

Check the Sanity Community: https://slack.sanity.io

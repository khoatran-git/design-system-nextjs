# shadcn/ui Components Showcase

A beautiful showcase website displaying all available shadcn/ui components organized by category.

## Features

- 📦 Organized components by category (Forms, Navigation, Feedback, etc.)
- 🎨 Modern, clean UI built with shadcn/ui components
- 📱 Responsive design for all screen sizes
- 🌙 Dark mode support via Tailwind CSS
- ⚡ Fast and lightweight with Next.js

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the showcase.

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles and Tailwind CSS
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/
│   ├── ui/              # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   └── separator.tsx
│   └── ComponentsGrid.tsx # Components showcase grid
└── lib/
    └── utils.ts         # Utility functions
```

## Components Included

The showcase displays 45+ shadcn/ui components organized into categories:

- **Forms**: Button, Input, Checkbox, Radio Group, Select, Textarea, etc.
- **Navigation**: Breadcrumb, Menu, Tabs, Pagination, Sidebar, etc.
- **Data Display**: Badge, Table, Data Table, etc.
- **Feedback**: Alert, Dialog, Toast, Progress, Skeleton, etc.
- **Disclosure**: Accordion, Collapsible, Hover Card, Popover, etc.
- **Layout**: Card, Separator, Scroll Area, etc.
- **Media**: Avatar, Carousel, etc.

## Customization

### Adding New Components

1. Create a new component in `src/components/ui/`
2. Add the component to the `components` array in `src/components/ComponentsGrid.tsx`

### Theming

Edit the CSS variables in `src/app/globals.css` to customize colors and styles.

## Building

```bash
# Build for production
npm run build

# Start production server
npm start
```

## License

MIT

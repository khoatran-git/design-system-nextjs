import InteractiveDemo from '../components/InteractiveDemo'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">shadcn/ui</h1>
              <p className="text-muted-foreground mt-2">Interactive Components Showcase</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">v1.0</Badge>
              <a href="https://github.com/khoatran-git/design-system" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">GitHub</Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Beautifully designed components built with Radix UI and Tailwind CSS.
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Accessible, customizable, and open source. All components fully interactive and functional.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="#components">View Components</a>
              </Button>
              <a href="https://github.com/khoatran-git/design-system" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg">View on GitHub</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Components Section */}
      <section id="components" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Interactive Components</h2>
          <InteractiveDemo />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-muted-foreground">
            Built with Next.js 14, Radix UI, and Tailwind CSS. All components fully interactive.
          </p>
        </div>
      </footer>
    </main>
  )
}

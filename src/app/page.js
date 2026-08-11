'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { ChevronDown } from 'lucide-react'
import SimpleContentRenderer from '../components/PortableTextComponents'

export default function Home() {
  const router = useRouter()
  const [components, setComponents] = useState([])
  const [foundations, setFoundations] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [expandedMenu, setExpandedMenu] = useState('components')
  const [expandedFoundations, setExpandedFoundations] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use API endpoints instead of direct Sanity calls
        const [componentsResponse, foundationsResponse] = await Promise.all([
          fetch('/api/components'),
          fetch('/api/foundations')
        ])
        
        const componentsData = await componentsResponse.json()
        const foundationsData = await foundationsResponse.json()
        
        // Extract components from API response
        const components = componentsData.data || []
        const foundations = foundationsData.data || []
        
        // Extract unique categories from components
        const uniqueCategories = [...new Set(
          components
            .map(comp => comp.category)
            .filter(Boolean)
        )]
        
        setComponents(components)
        setFoundations(foundations)
        setCategories(uniqueCategories.map(cat => ({ category: cat })))
        
        // Set first component as selected by default
        if (components && components.length > 0) {
          setSelectedComponent(components[0])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const FOUNDATIONS_ITEMS = [
    { label: 'Principles', slug: 'principles' },
    { label: 'Governance', slug: 'governance' },
  ]

  const DESIGN_SYSTEM_ITEMS = [
    { label: 'Design tokens', slug: 'design-tokens' },
    { label: 'Typography', slug: 'typography' },
    { label: 'Colours', slug: 'colours' },
    { label: 'Elevation', slug: 'elevation' },
    { label: 'Motion', slug: 'motion' },
    { label: 'Usability', slug: 'usability' },
    { label: 'Accessibility', slug: 'accessibility' },
    { label: 'UX Writing', slug: 'ux-writing' },
  ]

  // Group components by category
  const componentsByCategory = components.reduce((acc, component) => {
    const category = component.category || 'Uncategorized'
    if (!acc[category]) acc[category] = []
    acc[category].push(component)
    return acc
  }, {})

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading design system...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Debug comment - force deployment */}
      {/* Top Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Group Design System</h1>
              <p className="text-sm text-muted-foreground">The ultimate design system</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">v1.0</Badge>
              <a href="https://github.com/khoatran-git/design-system-nextjs" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">GitHub</Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Independently Scrollable */}
        <aside className="w-64 border-r bg-muted/30 flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-background flex-shrink-0">
            <h2 className="text-sm font-semibold">Menu</h2>
          </div>
          
          {/* Scrollable Navigation */}
          <nav className="p-4 space-y-2 overflow-y-auto flex-1">
            {/* Get Started */}
            <button
              className="w-full text-left px-3 py-2.5 rounded-md text-sm transition-all duration-200 text-foreground hover:bg-accent hover:text-accent-foreground active:bg-primary active:text-primary-foreground"
            >
              Get Started
            </button>

            {/* Foundations (Collapsible) */}
            <div>
              <button
                onClick={() => setExpandedFoundations(!expandedFoundations)}
                className="w-full text-left px-3 py-2.5 rounded-md text-sm transition-all duration-200 text-foreground hover:bg-accent hover:text-accent-foreground flex items-center justify-between"
              >
                <span>Foundations</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${expandedFoundations ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Foundations List (Nested) */}
              {expandedFoundations && (
                <div className="pl-4 mt-1 space-y-1 border-l border-border">
                  {foundations.map((foundation) => (
                    <button
                      key={foundation.slug.current}
                      onClick={() => router.push(`/foundations/${foundation.slug.current}`)}
                      className="w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      {foundation.title}
                    </button>
                  ))}
                  
                  {foundations.length === 0 && (
                    <div className="text-xs text-muted-foreground px-3 py-2">
                      No foundations found. Add some in your Sanity Studio!
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Components (Collapsible) */}
            <div>
              <button
                onClick={() => setExpandedMenu(expandedMenu === 'components' ? null : 'components')}
                className="w-full text-left px-3 py-2.5 rounded-md text-sm transition-all duration-200 text-foreground hover:bg-accent hover:text-accent-foreground flex items-center justify-between"
              >
                <span>Components ({components.length})</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${expandedMenu === 'components' ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Components List (Nested) */}
              {expandedMenu === 'components' && (
                <div className="pl-4 mt-1 space-y-1 border-l border-border">
                  {Object.entries(componentsByCategory).map(([category, categoryComponents]) => (
                    <div key={category}>
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 py-1">
                        {category}
                      </div>
                      {categoryComponents.map((comp) => (
                        <button
                          key={comp._id}
                          onClick={() => setSelectedComponent(comp)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                            selectedComponent?._id === comp._id
                              ? 'bg-primary text-primary-foreground font-medium'
                              : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                          }`}
                        >
                          {comp.title}
                        </button>
                      ))}
                    </div>
                  ))}
                  
                  {components.length === 0 && (
                    <div className="text-xs text-muted-foreground px-3 py-2">
                      No components found. Add some in your Sanity Studio!
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Resources */}
            <button
              className="w-full text-left px-3 py-2.5 rounded-md text-sm transition-all duration-200 text-foreground hover:bg-accent hover:text-accent-foreground active:bg-primary active:text-primary-foreground"
            >
              Resources
            </button>
          </nav>
        </aside>

        {/* Main Content Area - Independently Scrollable */}
        <main className="flex-1 overflow-y-auto">
          {selectedComponent ? (
            <div className="min-h-full">
              {/* Banner Section */}
              <div className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="px-8 py-12">
                  <div className="max-w-4xl">
                    <div className="flex items-center gap-3 mb-4">
                      <h1 className="text-4xl font-bold tracking-tight">{selectedComponent.title}</h1>
                      <Badge>{selectedComponent.category || 'Component'}</Badge>
                      <Badge variant="outline">{selectedComponent.status}</Badge>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                      {selectedComponent.description || 'No description provided'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs Section */}
              <div className="px-8 py-8 max-w-4xl">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 max-w-md">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="code">Code</TabsTrigger>
                    <TabsTrigger value="whats-new">What's new</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-6">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">Overview</h3>
                      {(selectedComponent.overviewContent && selectedComponent.overviewContent.length > 0) || 
                       (selectedComponent.content && selectedComponent.content.length > 0) ? (
                        <div className="prose prose-gray max-w-none">
                          <SimpleContentRenderer content={selectedComponent.overviewContent || selectedComponent.content || []} />
                        </div>
                      ) : (
                        <div className="p-6 border rounded-lg bg-muted/50 text-muted-foreground text-center">
                          No overview content available. Add overview content in your Sanity Studio!
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="code" className="mt-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Code Examples</h3>
                      {selectedComponent.codeContent && selectedComponent.codeContent.length > 0 ? (
                        <div className="prose prose-gray max-w-none">
                          <SimpleContentRenderer content={selectedComponent.codeContent} />
                        </div>
                      ) : (
                        <div className="p-6 border rounded-lg bg-muted/50 text-muted-foreground text-center">
                          No code examples available. Add code content in your Sanity Studio!
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="whats-new" className="mt-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">What's New</h3>
                      {selectedComponent.whatsNewContent && selectedComponent.whatsNewContent.length > 0 ? (
                        <div className="prose prose-gray max-w-none">
                          <SimpleContentRenderer content={selectedComponent.whatsNewContent} />
                        </div>
                      ) : (
                        <div className="p-6 border rounded-lg bg-muted/50 text-muted-foreground text-center">
                          <div className="space-y-2">
                            <p className="font-medium">No recent updates</p>
                            <p className="text-sm">Add changelog entries in your Sanity Studio to track component updates.</p>
                            <p className="text-xs text-muted-foreground/60">Last updated: {selectedComponent._createdAt ? new Date(selectedComponent._createdAt).toLocaleDateString() : 'Unknown'}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Footer Info */}
                <div className="mt-12 pt-8 border-t">
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Last updated: {selectedComponent._createdAt ? new Date(selectedComponent._createdAt).toLocaleDateString() : 'Unknown'}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Welcome to Group Design System</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {components.length > 0 
                    ? 'Select a component from the sidebar to get started.' 
                    : 'No components found. Add some components in your Sanity Studio to get started!'
                  }
                </p>
                {components.length === 0 && (
                  <a 
                    href="https://design-system-sanity.vercel.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button>Open Sanity Studio</Button>
                  </a>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

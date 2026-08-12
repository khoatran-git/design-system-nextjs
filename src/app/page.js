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
  const [getStartedPages, setGetStartedPages] = useState([])
  const [resources, setResources] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedContent, setSelectedContent] = useState(null)
  const [selectedContentType, setSelectedContentType] = useState('component') // 'component', 'foundation', 'resource', 'getStarted'
  const [expandedMenu, setExpandedMenu] = useState('components')
  const [expandedFoundations, setExpandedFoundations] = useState(false)
  const [expandedGetStarted, setExpandedGetStarted] = useState(false)
  const [expandedResources, setExpandedResources] = useState(false)
  const [loading, setLoading] = useState(true)
  const [contentLoading, setContentLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(Date.now())

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Add cache-busting parameter to ensure fresh data
        const timestamp = lastRefresh
        
        // Use API endpoints instead of direct Sanity calls
        const [componentsResponse, foundationsResponse, getStartedResponse, resourcesResponse] = await Promise.all([
          fetch(`/api/components?t=${timestamp}`),
          fetch(`/api/foundations?t=${timestamp}`),
          fetch(`/api/get-started?t=${timestamp}`),
          fetch(`/api/resources?refresh=true&t=${timestamp}`)
        ])
        
        const componentsData = await componentsResponse.json()
        const foundationsData = await foundationsResponse.json()
        const getStartedData = await getStartedResponse.json()
        const resourcesData = await resourcesResponse.json()
        
        // Extract components from API response
        const components = componentsData.data || []
        const foundations = foundationsData.data || []
        const getStartedPages = getStartedData.data || []
        const resources = resourcesData.data || []
        
        // Extract unique categories from components
        const uniqueCategories = [...new Set(
          components
            .map(comp => comp.category)
            .filter(Boolean)
        )]
        
        setComponents(components)
        setFoundations(foundations)
        setGetStartedPages(getStartedPages)
        setResources(resources)
        setCategories(uniqueCategories.map(cat => ({ category: cat })))
        
        // Set first component as selected by default
        if (components && components.length > 0) {
          setSelectedContent(components[0])
          setSelectedContentType('component')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [lastRefresh])

  // Function to refresh data
  const refreshData = () => {
    setLastRefresh(Date.now())
    setLoading(true)
  }

  // Function to load individual content by type and slug
  const loadContent = async (type, slug) => {
    if (!slug) return
    
    setContentLoading(true)
    try {
      const timestamp = Date.now()
      const response = await fetch(`/api/${type}/${slug}?refresh=true&t=${timestamp}`)
      const data = await response.json()
      
      if (response.ok) {
        setSelectedContent(data.data)
        setSelectedContentType(type.replace('-', ''))
      }
    } catch (error) {
      console.error(`Error loading ${type} content:`, error)
    } finally {
      setContentLoading(false)
    }
  }

  // Content selection handlers
  const selectComponent = (component) => {
    setSelectedContent(component)
    setSelectedContentType('component')
  }

  const selectFoundation = (foundation) => {
    loadContent('foundations', foundation.slug.current)
  }

  const selectGetStarted = (page) => {
    loadContent('get-started', page.slug.current)
  }

  const selectResource = (resource) => {
    loadContent('resources', resource.slug.current)
  }

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

  // Group components by category, skip uncategorized
  const componentsByCategory = components.reduce((acc, component) => {
    const category = component.category
    if (category) { // Only include components with categories
      if (!acc[category]) acc[category] = []
      acc[category].push(component)
    }
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
              <button 
                onClick={refreshData}
                className="px-2 py-1 text-xs border rounded bg-muted hover:bg-accent"
                title="Refresh data"
              >
                🔄
              </button>
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
            <div>
              <button
                onClick={() => setExpandedGetStarted(!expandedGetStarted)}
                className="w-full text-left px-3 py-2.5 rounded-md text-sm transition-all duration-200 text-foreground hover:bg-accent hover:text-accent-foreground flex items-center justify-between"
              >
                <span>Get Started</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${expandedGetStarted ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Get Started List (Nested) */}
              {expandedGetStarted && (
                <div className="pl-4 mt-1 space-y-1 border-l border-border">
                  {getStartedPages.map((page) => (
                    <button
                      key={page.slug.current}
                      onClick={() => selectGetStarted(page)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                        selectedContent?._id === page._id
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      {page.title}
                    </button>
                  ))}
                  
                  {getStartedPages.length === 0 && (
                    <div className="text-xs text-muted-foreground px-3 py-2">
                      No get started pages found. Add some in your Sanity Studio!
                    </div>
                  )}
                </div>
              )}
            </div>

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
                      onClick={() => selectFoundation(foundation)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                        selectedContent?._id === foundation._id
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
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
                <span>Components</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${expandedMenu === 'components' ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Components List (Nested) */}
              {expandedMenu === 'components' && (
                <div className="pl-4 mt-1 space-y-1 border-l border-border">
                  {/* Components with categories */}
                  {Object.entries(componentsByCategory).map(([category, categoryComponents]) => (
                    <div key={category}>
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 py-1">
                        {category}
                      </div>
                      {categoryComponents.map((comp) => (
                        <button
                          key={comp._id}
                          onClick={() => selectComponent(comp)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                            selectedContent?._id === comp._id
                              ? 'bg-primary text-primary-foreground font-medium'
                              : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                          }`}
                        >
                          {comp.title}
                        </button>
                      ))}
                    </div>
                  ))}
                  
                  {/* Components without categories */}
                  {components.filter(comp => !comp.category).map((comp) => (
                    <button
                      key={comp._id}
                      onClick={() => selectComponent(comp)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                        selectedContent?._id === comp._id
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      {comp.title}
                    </button>
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
            <div>
              <button
                onClick={() => setExpandedResources(!expandedResources)}
                className="w-full text-left px-3 py-2.5 rounded-md text-sm transition-all duration-200 text-foreground hover:bg-accent hover:text-accent-foreground flex items-center justify-between"
              >
                <span>Resources</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${expandedResources ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Resources List (Nested) */}
              {expandedResources && (
                <div className="pl-4 mt-1 space-y-1 border-l border-border">
                  {resources.map((resource) => (
                    <button
                      key={resource.slug.current}
                      onClick={() => selectResource(resource)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                        selectedContent?._id === resource._id
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      {resource.title}
                    </button>
                  ))}
                  
                  {resources.length === 0 && (
                    <div className="text-xs text-muted-foreground px-3 py-2">
                      No resources found. Add some in your Sanity Studio!
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>
        </aside>

        {/* Main Content Area - Independently Scrollable */}
        <main className="flex-1 overflow-y-auto">
          {selectedContent ? (
            <div className="min-h-full">
              {contentLoading && (
                <div className="absolute top-4 right-4 z-50">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              )}
              
              {/* Banner Section */}
              <div className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="px-8 py-12">
                  <div className="max-w-4xl">
                    <div className="mb-4">
                      <h1 className="text-4xl font-bold tracking-tight">{selectedContent.title}</h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                      {selectedContent.description || 'No description provided'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Content based on type */}
              {selectedContentType === 'component' ? (
                <ComponentContent content={selectedContent} />
              ) : selectedContentType === 'foundation' ? (
                <FoundationContent content={selectedContent} />
              ) : selectedContentType === 'getstarted' ? (
                <GetStartedContent content={selectedContent} />
              ) : selectedContentType === 'resource' ? (
                <ResourceContent content={selectedContent} />
              ) : null}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Welcome to Group Design System</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {components.length > 0 
                    ? 'Select an item from the sidebar to get started.' 
                    : 'No content found. Add some content in your Sanity Studio!'
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

// Content Components for different types  
const ComponentContent = ({ content }) => (
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
          {(content.overviewContent && content.overviewContent.length > 0) || 
           (content.content && content.content.length > 0) ? (
            <div className="prose prose-gray max-w-none">
              <SimpleContentRenderer content={content.overviewContent || content.content || []} />
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
          {content.codeContent && content.codeContent.length > 0 ? (
            <div className="prose prose-gray max-w-none">
              <SimpleContentRenderer content={content.codeContent} />
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
          {content.whatsNewContent && content.whatsNewContent.length > 0 ? (
            <div className="prose prose-gray max-w-none">
              <SimpleContentRenderer content={content.whatsNewContent} />
            </div>
          ) : (
            <div className="p-6 border rounded-lg bg-muted/50 text-muted-foreground text-center">
              <div className="space-y-2">
                <p className="font-medium">No recent updates</p>
                <p className="text-sm">Add changelog entries in your Sanity Studio to track component updates.</p>
                <p className="text-xs text-muted-foreground/60">Last updated: {content._createdAt ? new Date(content._createdAt).toLocaleDateString() : 'Unknown'}</p>
              </div>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>

    <div className="mt-12 pt-8 border-t">
      <div className="text-center text-sm text-muted-foreground">
        <p>Last updated: {content._createdAt ? new Date(content._createdAt).toLocaleDateString() : 'Unknown'}</p>
      </div>
    </div>
  </div>
)

const FoundationContent = ({ content }) => (
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
          {content.content && content.content.length > 0 ? (
            <div className="prose prose-gray max-w-none">
              <SimpleContentRenderer content={content.content} />
            </div>
          ) : (
            <div className="p-6 border rounded-lg bg-muted/50 text-muted-foreground text-center">
              <div className="space-y-2">
                <p className="font-medium">No overview content available</p>
                <p className="text-sm">Add rich content in your Sanity Studio to get started!</p>
              </div>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="code" className="mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Code Examples</h3>
          <div className="p-6 border rounded-lg bg-muted/50 text-muted-foreground text-center">
            <div className="space-y-2">
              <p className="font-medium">No code examples available</p>
              <p className="text-sm">Code examples coming soon for foundation guidelines.</p>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="whats-new" className="mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">What's New</h3>
          <div className="p-6 border rounded-lg bg-muted/50 text-muted-foreground text-center">
            <div className="space-y-2">
              <p className="font-medium">No recent updates</p>
              <p className="text-sm">Check back later for foundation updates and improvements.</p>
              <p className="text-xs text-muted-foreground/60">
                Last updated: {content._updatedAt ? new Date(content._updatedAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>

    <div className="mt-12 pt-8 border-t">
      <div className="text-center text-sm text-muted-foreground">
        <p>Last updated: {content._updatedAt ? new Date(content._updatedAt).toLocaleDateString() : 'Unknown'}</p>
      </div>
    </div>
  </div>
)

const GetStartedContent = ({ content }) => (
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
          {content.content && content.content.length > 0 ? (
            <div className="prose prose-gray max-w-none">
              <SimpleContentRenderer content={content.content} />
            </div>
          ) : (
            <div className="p-6 border rounded-lg bg-muted/50 text-muted-foreground text-center">
              <div className="space-y-2">
                <p className="font-medium">No overview content available</p>
                <p className="text-sm">Add rich content in your Sanity Studio to get started!</p>
              </div>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="code" className="mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Code Examples</h3>
          <div className="p-6 border rounded-lg bg-muted/50 text-muted-foreground text-center">
            <div className="space-y-2">
              <p className="font-medium">No code examples available</p>
              <p className="text-sm">Code examples coming soon for this page.</p>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="whats-new" className="mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">What's New</h3>
          <div className="p-6 border rounded-lg bg-muted/50 text-muted-foreground text-center">
            <div className="space-y-2">
              <p className="font-medium">No recent updates</p>
              <p className="text-sm">Check back later for page updates.</p>
              <p className="text-xs text-muted-foreground/60">
                Last updated: {content._updatedAt ? new Date(content._updatedAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>

    <div className="mt-12 pt-8 border-t">
      <div className="text-center text-sm text-muted-foreground">
        <p>Last updated: {content._updatedAt ? new Date(content._updatedAt).toLocaleDateString() : 'Unknown'}</p>
      </div>
    </div>
  </div>
)

const ResourceContent = ({ content }) => (
  <div className="px-8 py-8 max-w-4xl">
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3 max-w-md">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="code">Downloads & Links</TabsTrigger>
        <TabsTrigger value="whats-new">What's new</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Overview</h3>
          {content.content && content.content.length > 0 ? (
            <div className="prose prose-gray max-w-none">
              <SimpleContentRenderer content={content.content} />
            </div>
          ) : (
            <div className="p-6 border rounded-lg bg-muted/50 text-muted-foreground text-center">
              <div className="space-y-2">
                <p className="font-medium">No overview content available</p>
                <p className="text-sm">Add rich content in your Sanity Studio to get started!</p>
              </div>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="code" className="mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Downloads & Links</h3>
          <div className="p-6 border rounded-lg bg-muted/50 text-muted-foreground text-center">
            <div className="space-y-2">
              <p className="font-medium">No downloads available</p>
              <p className="text-sm">Resource downloads and links coming soon.</p>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="whats-new" className="mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">What's New</h3>
          <div className="p-6 border rounded-lg bg-muted/50 text-muted-foreground text-center">
            <div className="space-y-2">
              <p className="font-medium">No recent updates</p>
              <p className="text-sm">Check back later for resource updates.</p>
              <p className="text-xs text-muted-foreground/60">
                Last updated: {content._updatedAt ? new Date(content._updatedAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>

    <div className="mt-12 pt-8 border-t">
      <div className="text-center text-sm text-muted-foreground">
        <p>Last updated: {content._updatedAt ? new Date(content._updatedAt).toLocaleDateString() : 'Unknown'}</p>
      </div>
    </div>
  </div>
)

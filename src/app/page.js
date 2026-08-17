'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '../components/theme-toggle'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Checkbox } from '../components/ui/checkbox'
import { Label } from '../components/ui/label'
import { Separator } from '../components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { ChevronDown } from 'lucide-react'
import SimpleContentRenderer from '../components/PortableTextComponents'

export default function Home() {
  const router = useRouter()
  const [components, setComponents] = useState([])
  const [foundations, setFoundations] = useState([])
  const [styles, setStyles] = useState([])
  const [getStartedPages, setGetStartedPages] = useState([])
  const [resources, setResources] = useState([])
  const [patterns, setPatterns] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedContent, setSelectedContent] = useState(null)
  const [selectedContentType, setSelectedContentType] = useState('component') // 'component', 'foundation', 'style', 'resource', 'getStarted', 'pattern'
  const [expandedMenu, setExpandedMenu] = useState('components')
  const [expandedFoundations, setExpandedFoundations] = useState(false)
  const [expandedStyles, setExpandedStyles] = useState(false)
  const [expandedGetStarted, setExpandedGetStarted] = useState(false)
  const [expandedResources, setExpandedResources] = useState(false)
  const [expandedPatterns, setExpandedPatterns] = useState(false)
  const [loading, setLoading] = useState(true)
  const [contentLoading, setContentLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(Date.now())

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Add cache-busting parameter and headers to ensure fresh data
        const timestamp = lastRefresh
        const fetchOptions = {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        }
        
        // Use API endpoints instead of direct Sanity calls
        const [componentsResponse, foundationsResponse, stylesResponse, getStartedResponse, resourcesResponse, patternsResponse] = await Promise.all([
          fetch(`/api/components?t=${timestamp}&refresh=true`, fetchOptions),
          fetch(`/api/foundations?t=${timestamp}&refresh=true`, fetchOptions),
          fetch(`/api/styles?t=${timestamp}&refresh=true`, fetchOptions),
          fetch(`/api/get-started?t=${timestamp}&refresh=true`, fetchOptions),
          fetch(`/api/resources?refresh=true&t=${timestamp}`, fetchOptions),
          fetch(`/api/patterns?refresh=true&t=${timestamp}`, fetchOptions)
        ])
        
        const componentsData = await componentsResponse.json()
        const foundationsData = await foundationsResponse.json()
        const stylesData = await stylesResponse.json()
        const getStartedData = await getStartedResponse.json()
        const resourcesData = await resourcesResponse.json()
        const patternsData = await patternsResponse.json()
        
        // Extract components from API response
        const components = componentsData.data || []
        const foundations = foundationsData.data || []
        const styles = stylesData.data || []
        const getStartedPages = getStartedData.data || []
        const resources = resourcesData.data || []
        const patterns = patternsData.data || []
        
        // Log fetch status for debugging in development
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Data refreshed at:', new Date().toLocaleTimeString())
          console.log('📊 Loaded:', {
            components: components?.length || 0,
            foundations: foundations?.length || 0,
            styles: styles?.length || 0,
            patterns: patterns?.length || 0,
            resources: resources?.length || 0,
            getStarted: getStartedPages?.length || 0
          })
          console.log('🎨 Styles data:', styles)
        }
        
        // Extract unique categories from components
        const uniqueCategories = [...new Set(
          components
            .map(comp => comp.category)
            .filter(Boolean)
        )]
        
        setComponents(components)
        setFoundations(foundations)
        setStyles(styles)
        setGetStartedPages(getStartedPages)
        setResources(resources)
        setPatterns(patterns)
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

  // Function to refresh data with aggressive cache busting
  const refreshData = () => {
    const timestamp = Date.now()
    setLastRefresh(timestamp)
    setLoading(true)
    
    // Clear any browser cache for our API endpoints
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('api')) {
            caches.delete(name)
          }
        })
      })
    }
  }

  // Function to load individual content by type and slug
  const loadContent = async (type, slug) => {
    if (!slug) return
    
    setContentLoading(true)
    try {
      const timestamp = Date.now()
      const fetchOptions = {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      }
      const response = await fetch(`/api/${type}/${slug}?refresh=true&t=${timestamp}`, fetchOptions)
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

  const selectStyle = (style) => {
    loadContent('styles', style.slug.current)
  }

  const selectGetStarted = (page) => {
    loadContent('get-started', page.slug.current)
  }

  const selectResource = (resource) => {
    loadContent('resources', resource.slug.current)
  }

  const selectPattern = (pattern) => {
    loadContent('patterns', pattern.slug.current)
  }

  // Group foundations by category for the new structure
  const foundationsByCategory = foundations.reduce((acc, foundation) => {
    const category = foundation.category || 'Other'
    if (!acc[category]) acc[category] = []
    acc[category].push(foundation)
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
    <div className="h-screen bg-background flex flex-col">
      {/* Debug comment - force deployment */}
      {/* Top Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">The Design Dictionary</h1>
              <p className="text-sm text-muted-foreground">A comprehensive design source of truth</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs">v1.0</Badge>
              <button 
                onClick={refreshData}
                className="px-3 py-1.5 text-xs border rounded-md bg-background hover:bg-muted transition-colors flex items-center gap-1.5"
                title="Force refresh all content from Sanity"
                disabled={loading}
              >
                <span className={loading ? 'animate-spin' : ''}>🔄</span>
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <ThemeToggle />
              <a href="https://github.com/khoatran-git/design-system-nextjs" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">GitHub</Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left Sidebar - Independently Scrollable */}
        <aside className="w-64 border-r bg-background flex flex-col overflow-hidden">
          <div className="p-4 border-b flex-shrink-0">
            <h2 className="text-sm font-semibold text-muted-foreground">Navigation</h2>
          </div>
          
          {/* Scrollable Navigation */}
          <nav className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-1">
            {/* Get Started */}
            <div>
              <button
                onClick={() => setExpandedGetStarted(!expandedGetStarted)}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors text-foreground hover:bg-muted flex items-center justify-between"
              >
                <span className="font-medium">Get Started</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${expandedGetStarted ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Get Started List (Nested) */}
              {expandedGetStarted && (
                <div className="pl-4 mt-2 space-y-1 border-l-2 border-border ml-2">
                  {getStartedPages.map((page) => (
                    <button
                      key={page.slug.current}
                      onClick={() => selectGetStarted(page)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedContent?._id === page._id
                          ? 'bg-accent text-accent-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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

            <Separator className="my-3" />

            {/* Foundations (Collapsible) */}
            <div>
              <button
                onClick={() => setExpandedFoundations(!expandedFoundations)}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors text-foreground hover:bg-muted flex items-center justify-between"
              >
                <span className="font-medium">Foundations</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${expandedFoundations ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Foundations List (Nested) */}
              {expandedFoundations && (
                <div className="pl-4 mt-2 space-y-3 border-l-2 border-border ml-2">
                  {/* Group foundations by Philosophy and Design categories */}
                  {Object.entries(foundationsByCategory)
                    .sort(([a], [b]) => {
                      // Sort Philosophy first, then Design, then others
                      if (a === 'Philosophy') return -1
                      if (b === 'Philosophy') return 1
                      if (a === 'Design') return -1
                      if (b === 'Design') return 1
                      return a.localeCompare(b)
                    })
                    .map(([category, categoryFoundations], index) => (
                    <div key={category}>
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 py-1">
                        {category}
                      </div>
                      <div className="space-y-1">
                        {categoryFoundations
                          .sort((a, b) => (a.order || 0) - (b.order || 0)) // Sort by order within category
                          .map((foundation) => (
                          <button
                            key={foundation.slug.current}
                            onClick={() => selectFoundation(foundation)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                              selectedContent?._id === foundation._id
                                ? 'bg-accent text-accent-foreground font-medium'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                          >
                            {foundation.title}
                          </button>
                        ))}
                      </div>
                      {/* Add separator between categories except for the last one */}
                      {index < Object.entries(foundationsByCategory).length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))}
                  
                  {foundations.length === 0 && (
                    <div className="text-xs text-muted-foreground px-3 py-2">
                      No foundations found. Add some in your Sanity Studio!
                    </div>
                  )}
                </div>
              )}
            </div>

            <Separator className="my-3" />

            {/* Styles */}
            <div>
              <button
                onClick={() => setExpandedStyles(!expandedStyles)}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors text-foreground hover:bg-muted flex items-center justify-between"
              >
                <span className="font-medium">Styles</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${expandedStyles ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Styles List (Nested) */}
              {expandedStyles && (
                <div className="pl-4 mt-2 space-y-1 border-l-2 border-border ml-2">
                  {styles.map((style) => (
                    <button
                      key={style.slug.current}
                      onClick={() => selectStyle(style)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedContent?._id === style._id
                          ? 'bg-accent text-accent-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <span>{style.title}</span>
                    </button>
                  ))}
                  
                  {styles.length === 0 && (
                    <div className="text-xs text-muted-foreground px-3 py-2">
                      No styles found. Add some in your Sanity Studio!
                    </div>
                  )}
                </div>
              )}
            </div>

            <Separator className="my-3" />

            {/* Components (Collapsible) */}
            <div>
              <button
                onClick={() => setExpandedMenu(expandedMenu === 'components' ? null : 'components')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors text-foreground hover:bg-muted flex items-center justify-between"
              >
                <span className="font-medium">Components</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${expandedMenu === 'components' ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Components List (Nested) - No Categories */}
              {expandedMenu === 'components' && (
                <div className="pl-4 mt-2 space-y-1 border-l-2 border-border ml-2">
                  {components.map((comp) => (
                    <button
                      key={comp._id}
                      onClick={() => selectComponent(comp)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedContent?._id === comp._id
                          ? 'bg-accent text-accent-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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

            <Separator className="my-3" />

            {/* Patterns */}
            <div>
              <button
                onClick={() => setExpandedPatterns(!expandedPatterns)}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors text-foreground hover:bg-muted flex items-center justify-between"
              >
                <span className="font-medium">Patterns</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${expandedPatterns ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Patterns List (Nested) */}
              {expandedPatterns && (
                <div className="pl-4 mt-2 space-y-1 border-l-2 border-border ml-2">
                  {patterns.map((pattern) => (
                    <button
                      key={pattern.slug.current}
                      onClick={() => selectPattern(pattern)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedContent?._id === pattern._id
                          ? 'bg-accent text-accent-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <span>{pattern.title}</span>
                    </button>
                  ))}
                  
                  {patterns.length === 0 && (
                    <div className="text-xs text-muted-foreground px-3 py-2">
                      No patterns found. Add some in your Sanity Studio!
                    </div>
                  )}
                </div>
              )}
            </div>

            <Separator className="my-3" />

            {/* Resources */}
            <div>
              <button
                onClick={() => setExpandedResources(!expandedResources)}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors text-foreground hover:bg-muted flex items-center justify-between"
              >
                <span className="font-medium">Resources</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${expandedResources ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Resources List (Nested) */}
              {expandedResources && (
                <div className="pl-4 mt-2 space-y-1 border-l-2 border-border ml-2">
                  {resources.map((resource) => (
                    <button
                      key={resource.slug.current}
                      onClick={() => selectResource(resource)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedContent?._id === resource._id
                          ? 'bg-accent text-accent-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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
            </div>
          </nav>
        </aside>

        {/* Main Content Area - Independently Scrollable */}
        <main className="flex-1 overflow-y-auto min-h-0">
          {selectedContent ? (
            <div className="min-h-full">
              {contentLoading && (
                <div className="absolute top-4 right-4 z-50">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              )}
              
              {/* Banner Section */}
              <div className="border-b bg-muted/20">
                <div className="px-8 py-8">
                  <div className="max-w-4xl">
                    <div className="mb-4">
                      <h1 className="text-3xl font-bold tracking-tight text-foreground">{selectedContent.title}</h1>
                    </div>
                    <p className="text-base text-muted-foreground max-w-2xl">
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
              ) : selectedContentType === 'style' ? (
                <StyleContent content={selectedContent} />
              ) : selectedContentType === 'getstarted' ? (
                <GetStartedContent content={selectedContent} />
              ) : selectedContentType === 'resource' ? (
                <ResourceContent content={selectedContent} />
              ) : selectedContentType === 'pattern' ? (
                <PatternContent content={selectedContent} />
              ) : null}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Welcome to The Design Dictionary</h2>
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
          
          {/* Interactive Demo Section for Buttons */}
          {content.title === 'Buttons' && (
            <div className="space-y-4">
              <h4 className="text-md font-semibold">Interactive Demo</h4>
              <div className="p-6 border rounded-lg bg-background">
                <div className="space-y-6">
                  <div>
                    <h5 className="text-sm font-medium mb-3">Button Variants</h5>
                    <div className="flex flex-wrap gap-3">
                      <Button>Default</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="destructive">Destructive</Button>
                      <Button variant="link">Link</Button>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium mb-3">Button Sizes</h5>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button size="sm">Small</Button>
                      <Button size="default">Default</Button>
                      <Button size="lg">Large</Button>
                      <Button size="icon">🚀</Button>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium mb-3">Loading & Disabled States</h5>
                    <div className="flex flex-wrap gap-3">
                      <Button disabled>Disabled</Button>
                      <Button>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Loading...
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Demo Section for Checkboxes */}
          {content.title === 'Checkboxes' && (
            <div className="space-y-4">
              <h4 className="text-md font-semibold">Interactive Demo</h4>
              <div className="p-6 border rounded-lg bg-background">
                <div className="space-y-6">
                  <div>
                    <h5 className="text-sm font-medium mb-3">Basic Checkboxes</h5>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Accept terms and conditions
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="newsletter" defaultChecked />
                        <Label htmlFor="newsletter" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Subscribe to newsletter
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="disabled-checkbox" disabled />
                        <Label htmlFor="disabled-checkbox" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Disabled checkbox
                        </Label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium mb-3">Checkbox Group</h5>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Select your interests:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="design" />
                          <Label htmlFor="design" className="text-sm">Design</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="development" />
                          <Label htmlFor="development" className="text-sm">Development</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="marketing" />
                          <Label htmlFor="marketing" className="text-sm">Marketing</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="research" />
                          <Label htmlFor="research" className="text-sm">Research</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
          {content.title === 'Buttons' ? (
            <div className="prose prose-gray max-w-none">
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-semibold mb-3">Installation</h4>
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-lg">
                    <code>npx shadcn@latest add button</code>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold mb-3">Usage</h4>
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-lg">
                    <pre>{`import { Button } from "@/components/ui/button"

<Button variant="outline">Button</Button>`}</pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold mb-3">Variants</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 font-medium">Default</p>
                      <div className="bg-slate-950 text-slate-50 p-4 rounded-lg">
                        <code>{`<Button>Button</Button>`}</code>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 font-medium">Outline</p>
                      <div className="bg-slate-950 text-slate-50 p-4 rounded-lg">
                        <code>{`<Button variant="outline">Button</Button>`}</code>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 font-medium">Secondary</p>
                      <div className="bg-slate-950 text-slate-50 p-4 rounded-lg">
                        <code>{`<Button variant="secondary">Button</Button>`}</code>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 font-medium">Ghost</p>
                      <div className="bg-slate-950 text-slate-50 p-4 rounded-lg">
                        <code>{`<Button variant="ghost">Button</Button>`}</code>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 font-medium">Destructive</p>
                      <div className="bg-slate-950 text-slate-50 p-4 rounded-lg">
                        <code>{`<Button variant="destructive">Button</Button>`}</code>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 font-medium">Link</p>
                      <div className="bg-slate-950 text-slate-50 p-4 rounded-lg">
                        <code>{`<Button variant="link">Button</Button>`}</code>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold mb-3">Sizes</h4>
                  <p className="mb-3">Use the size prop to change the size of the button.</p>
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-lg">
                    <pre>{`<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>`}</pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold mb-3">With Icon</h4>
                  <p className="mb-3">Remember to add the data-icon="inline-start" or data-icon="inline-end" attribute to the icon for the correct spacing.</p>
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-lg">
                    <pre>{`import { Mail } from "lucide-react"

<Button>
  <Mail className="mr-2 h-4 w-4" />
  Login with Email
</Button>`}</pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold mb-3">As Child</h4>
                  <p className="mb-3">You can use the asChild prop on Button to make another component look like a button.</p>
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-lg">
                    <pre>{`<Button asChild>
  <Link href="/login">Login</Link>
</Button>`}</pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold mb-3">API Reference</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Prop</th>
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Type</th>
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Default</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">variant</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">"default" | "outline" | "ghost" | "destructive" | "secondary" | "link"</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">"default"</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">size</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">"default"</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">asChild</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">boolean</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">false</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : content.title === 'Checkboxes' ? (
            <div className="prose prose-gray max-w-none">
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-semibold mb-3">Installation</h4>
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-lg">
                    <code>npx shadcn@latest add checkbox</code>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold mb-3">Usage</h4>
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-lg">
                    <pre>{`import { Checkbox } from "@/components/ui/checkbox"

<Checkbox id="terms" />
<Label htmlFor="terms">Accept terms and conditions</Label>`}</pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold mb-3">Examples</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 font-medium">Basic Checkbox</p>
                      <div className="bg-slate-950 text-slate-50 p-4 rounded-lg">
                        <pre>{`import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">
    Accept terms and conditions
  </Label>
</div>`}</pre>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 font-medium">Disabled</p>
                      <div className="bg-slate-950 text-slate-50 p-4 rounded-lg">
                        <pre>{`<div className="flex items-center space-x-2">
  <Checkbox id="terms2" disabled />
  <Label htmlFor="terms2">
    Accept terms and conditions
  </Label>
</div>`}</pre>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 font-medium">With Text</p>
                      <div className="bg-slate-950 text-slate-50 p-4 rounded-lg">
                        <pre>{`<div className="items-top flex space-x-2">
  <Checkbox id="terms1" />
  <div className="grid gap-1.5 leading-none">
    <Label
      htmlFor="terms1"
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      Accept terms and conditions
    </Label>
    <p className="text-xs text-muted-foreground">
      You agree to our Terms of Service and Privacy Policy.
    </p>
  </div>
</div>`}</pre>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold mb-3">Form Integration</h4>
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-lg">
                    <pre>{`import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const FormSchema = z.object({
  mobile: z.boolean().default(false).optional(),
})

function CheckboxForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mobile: true,
    },
  })

  return (
    <Form>
      <FormField
        control={form.control}
        name="mobile"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Mobile notifications
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
    </Form>
  )
}`}</pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold mb-3">API Reference</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Prop</th>
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Type</th>
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Default</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">checked</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">boolean</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">false</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">onCheckedChange</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{`(checked: boolean) => void`}</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">-</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">disabled</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">boolean</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">false</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : content.codeContent && content.codeContent.length > 0 ? (
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

const PatternContent = ({ content }) => (
  <div className="px-8 py-8 max-w-4xl">
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3 max-w-md">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="code">Code Examples</TabsTrigger>
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
              <p className="font-medium">Pattern code examples coming soon</p>
              <p className="text-sm">Interactive pattern demos and code snippets will be available here.</p>
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
              <p className="text-sm">Check back later for pattern updates and improvements.</p>
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

// Style Content Component
const StyleContent = ({ content }) => (
  <div className="px-8 py-8 max-w-4xl">
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Style Guide</h3>
      
      {(content.content && content.content.length > 0) ? (
        <div className="prose prose-gray max-w-none">
          <SimpleContentRenderer content={content.content} />
        </div>
      ) : (
        <div className="text-muted-foreground">
          <p>No style content available yet. Add some content in your Sanity Studio!</p>
        </div>
      )}
    </div>
  </div>
)
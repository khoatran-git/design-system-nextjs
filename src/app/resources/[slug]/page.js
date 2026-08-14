'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Badge } from '../../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { ChevronDown } from 'lucide-react'
import SimpleContentRenderer from '../../../components/PortableTextComponents'

export default function ResourcePage() {
  const params = useParams()
  const router = useRouter()
  const [resource, setResource] = useState(null)
  const [foundations, setFoundations] = useState([])
  const [getStartedPages, setGetStartedPages] = useState([])
  const [resources, setResources] = useState([])
  const [components, setComponents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedMenu, setExpandedMenu] = useState('components')
  const [expandedFoundations, setExpandedFoundations] = useState(false)
  const [expandedGetStarted, setExpandedGetStarted] = useState(false)
  const [expandedResources, setExpandedResources] = useState(true) // Start expanded

  useEffect(() => {
    const fetchData = async () => {
      if (!params?.slug) {
        setError('Resource not found')
        setLoading(false)
        return
      }

      try {
        // Fetch resource data and sidebar data in parallel
        const [resourceResponse, foundationsResponse, getStartedResponse, resourcesResponse, componentsResponse] = await Promise.all([
          fetch(`/api/resources/${params.slug}`),
          fetch('/api/foundations'),
          fetch('/api/get-started'),
          fetch('/api/resources'),
          fetch('/api/components')
        ])
        
        const resourceData = await resourceResponse.json()
        const foundationsData = await foundationsResponse.json()
        const getStartedData = await getStartedResponse.json()
        const resourcesData = await resourcesResponse.json()
        const componentsData = await componentsResponse.json()

        if (!resourceResponse.ok) {
          throw new Error(resourceData.error || 'Failed to fetch resource')
        }

        setResource(resourceData.data)
        setFoundations(foundationsData.data || [])
        setGetStartedPages(getStartedData.data || [])
        setResources(resourcesData.data || [])
        setComponents(componentsData.data || [])
      } catch (error) {
        console.error('Error fetching resource:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.slug])

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
          <p className="text-muted-foreground">Loading resource...</p>
        </div>
      </div>
    )
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Resource Not Found</h2>
          <p className="text-muted-foreground mb-6">
            {error || 'The resource you are looking for does not exist.'}
          </p>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">The Design Dictionary</h1>
              <p className="text-sm text-muted-foreground">A comprehensive design system reference</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">v1.0</Badge>
              <a href="https://github.com/khoatran-git/design-system-nextjs" target="_blank" rel="noopener noreferrer">
                <button className="px-3 py-1 border rounded-md text-sm">GitHub</button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
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

              {expandedGetStarted && (
                <div className="pl-4 mt-1 space-y-1 border-l border-border">
                  {getStartedPages.map((page) => (
                    <button
                      key={page.slug.current}
                      onClick={() => router.push(`/get-started/${page.slug.current}`)}
                      className="w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      {page.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Foundations */}
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
                </div>
              )}
            </div>

            {/* Components */}
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
                          onClick={() => router.push('/')}
                          className="w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 text-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                          {comp.title}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resources (Collapsible) */}
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
                  {resources.map((resourceItem) => (
                    <button
                      key={resourceItem.slug.current}
                      onClick={() => router.push(`/resources/${resourceItem.slug.current}`)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                        params.slug === resourceItem.slug.current
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      {resourceItem.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full">
            {/* Banner Section */}
            <div className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
              <div className="px-8 py-12">
                <div className="max-w-4xl">
                  <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-4xl font-bold tracking-tight">{resource.title}</h1>
                    <Badge>{resource.resourceType || 'Resource'}</Badge>
                    <Badge variant="outline">{resource.status}</Badge>
                  </div>
                  <p className="text-lg text-muted-foreground max-w-2xl">
                    {resource.description || 'No description provided'}
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
                    {resource.content && resource.content.length > 0 ? (
                      <div className="prose prose-gray max-w-none">
                        <SimpleContentRenderer content={resource.content} />
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
                          Last updated: {resource._updatedAt ? new Date(resource._updatedAt).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Footer Info */}
              <div className="mt-12 pt-8 border-t">
                <div className="text-center text-sm text-muted-foreground">
                  <p>Last updated: {resource._updatedAt ? new Date(resource._updatedAt).toLocaleDateString() : 'Unknown'}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
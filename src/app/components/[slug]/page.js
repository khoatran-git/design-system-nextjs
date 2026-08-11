'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { ArrowLeft } from 'lucide-react'
import SimpleContentRenderer from '../../../components/PortableTextComponents'

export default function ComponentPage() {
  const params = useParams()
  const [component, setComponent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchComponent = async () => {
      if (!params.slug) return

      try {
        setLoading(true)
        // Use API endpoint instead of direct Sanity call
        const response = await fetch(`/api/components/${params.slug}`)
        const result = await response.json()
        
        if (result.data) {
          setComponent(result.data)
        } else {
          setError('Component not found')
        }
      } catch (err) {
        console.error('Error fetching component:', err)
        setError('Failed to load component')
      } finally {
        setLoading(false)
      }
    }

    fetchComponent()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading component...</p>
        </div>
      </div>
    )
  }

  if (error || !component) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Component Not Found</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold tracking-tight">{component.title}</h1>
                <p className="text-sm text-muted-foreground">{component.category || 'Component'}</p>
              </div>
            </div>
            <Badge variant={component.status === 'published' ? 'default' : 'secondary'}>
              {component.status}
            </Badge>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl font-bold tracking-tight">{component.title}</h1>
              <Badge>{component.category || 'Component'}</Badge>
            </div>
            {component.description && (
              <p className="text-xl text-muted-foreground">
                {component.description}
              </p>
            )}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-lg">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="whats-new">What's new</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                  {component.content && component.content.length > 0 ? (
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <SimpleContentRenderer content={component.content} />
                    </div>
                  ) : (
                    <div className="p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center">
                      <p className="text-muted-foreground">No overview content available</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Add rich content in your Sanity Studio to see it here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="code" className="mt-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Code Examples</h2>
                  <div className="p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center">
                    <p className="text-muted-foreground">Code examples will be displayed here</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Add code blocks in your Sanity Studio content to show examples
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="whats-new" className="mt-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">What's New</h2>
                  <div className="p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center">
                    <div className="space-y-3">
                      <p className="text-muted-foreground font-medium">No recent updates</p>
                      <p className="text-sm text-muted-foreground">
                        Component changelog and recent updates will appear here
                      </p>
                      <p className="text-xs text-muted-foreground/60">
                        Last updated: {component._createdAt 
                          ? new Date(component._createdAt).toLocaleDateString()
                          : 'Unknown'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { sanityFetch } from '../../../../lib/sanity.client'
import { componentBySlugQuery } from '../../../../lib/sanity.queries'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { ArrowLeft } from 'lucide-react'
import PortableTextRenderer from '../../../components/PortableTextComponents'

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
        const data = await sanityFetch(componentBySlugQuery, { slug: params.slug })
        
        if (data) {
          setComponent(data)
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
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-lg">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="meta">Meta</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="mt-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Rich Content</h2>
                  {component.content && component.content.length > 0 ? (
                    <PortableTextRenderer content={component.content} />
                  ) : (
                    <div className="p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center">
                      <p className="text-muted-foreground">No rich content available</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Add content in your Sanity Studio to see it here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="overview" className="mt-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Component Overview</h2>
                  {component.description ? (
                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                      <p className="text-lg leading-relaxed">{component.description}</p>
                    </div>
                  ) : (
                    <div className="p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center">
                      <p className="text-muted-foreground">No description available</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Component Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 border rounded-lg">
                      <h3 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wide">Title</h3>
                      <p className="text-lg">{component.title}</p>
                    </div>
                    
                    <div className="p-6 border rounded-lg">
                      <h3 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wide">Category</h3>
                      <p className="text-lg">{component.category || 'Uncategorized'}</p>
                    </div>
                    
                    <div className="p-6 border rounded-lg">
                      <h3 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wide">Status</h3>
                      <Badge variant={component.status === 'published' ? 'default' : 'secondary'} className="text-sm">
                        {component.status}
                      </Badge>
                    </div>
                    
                    <div className="p-6 border rounded-lg">
                      <h3 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wide">URL Slug</h3>
                      <p className="text-lg font-mono">{component.slug?.current || 'No slug'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="meta" className="mt-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Metadata</h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="p-6 border rounded-lg">
                      <h3 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wide">Document ID</h3>
                      <p className="text-sm font-mono">{component._id}</p>
                    </div>
                    
                    <div className="p-6 border rounded-lg">
                      <h3 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wide">Created</h3>
                      <p className="text-sm">
                        {component._createdAt 
                          ? new Date(component._createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
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
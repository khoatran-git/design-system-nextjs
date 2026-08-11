'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Badge } from '../../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import SimpleContentRenderer from '../../../components/PortableTextComponents'

export default function FoundationPage() {
  const params = useParams()
  const [foundation, setFoundation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFoundation = async () => {
      if (!params?.slug) {
        setError('Foundation not found')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/foundations/${params.slug}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch foundation')
        }

        setFoundation(data.data)
      } catch (error) {
        console.error('Error fetching foundation:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFoundation()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading foundation...</p>
        </div>
      </div>
    )
  }

  if (error || !foundation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Foundation Not Found</h2>
          <p className="text-muted-foreground mb-6">
            {error || 'The foundation you are looking for does not exist.'}
          </p>
          <a href="/">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
              Back to Home
            </button>
          </a>
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
              <h1 className="text-2xl font-bold tracking-tight">Group Design System</h1>
              <p className="text-sm text-muted-foreground">The ultimate design system</p>
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

      {/* Main Content */}
      <main className="flex-1">
        {/* Banner Section */}
        <div className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="px-8 py-12">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl font-bold tracking-tight">{foundation.title}</h1>
                <Badge>{foundation.category || 'Foundation'}</Badge>
                <Badge variant="outline">{foundation.status}</Badge>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {foundation.description || 'No description provided'}
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
                {foundation.content && foundation.content.length > 0 ? (
                  <div className="prose prose-gray max-w-none">
                    <SimpleContentRenderer content={foundation.content} />
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
                      Last updated: {foundation._updatedAt ? new Date(foundation._updatedAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer Info */}
          <div className="mt-12 pt-8 border-t">
            <div className="text-center text-sm text-muted-foreground">
              <p>Last updated: {foundation._updatedAt ? new Date(foundation._updatedAt).toLocaleDateString() : 'Unknown'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
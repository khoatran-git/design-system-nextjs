import { NextResponse } from 'next/server'
import { sanityFetch } from '@/lib/sanity.client'

export async function GET() {
  try {
    // Query ALL components regardless of status to debug
    const allComponents = await sanityFetch(`
      *[_type == "simpleComponent"] | order(_createdAt desc) {
        _id,
        title,
        slug,
        status,
        category,
        _createdAt,
      }
    `)
    
    return NextResponse.json({
      success: true,
      message: 'All components (regardless of status)',
      totalCount: allComponents?.length || 0,
      components: allComponents || [],
      statusBreakdown: {
        draft: allComponents?.filter(c => c.status === 'draft').length || 0,
        review: allComponents?.filter(c => c.status === 'review').length || 0,
        published: allComponents?.filter(c => c.status === 'published').length || 0,
        deprecated: allComponents?.filter(c => c.status === 'deprecated').length || 0,
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
}
import { NextResponse } from 'next/server'
import { sanityFetch } from '@/lib/sanity.client'

export async function GET() {
  try {
    // Debug query to see all components regardless of status
    const allComponents = await sanityFetch(`
      *[_type == "simpleComponent"] {
        _id,
        title,
        status,
        category,
        description,
        slug
      }
    `)

    // Debug query to see published components only
    const publishedComponents = await sanityFetch(`
      *[_type == "simpleComponent" && status == "published"] {
        _id,
        title,
        status,
        category,
        description,
        slug
      }
    `)

    return NextResponse.json({
      success: true,
      debug: {
        totalComponents: allComponents?.length || 0,
        publishedComponents: publishedComponents?.length || 0,
        allComponents: allComponents || [],
        publishedOnly: publishedComponents || []
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    })
  }
}
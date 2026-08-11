import { sanityFetch } from '../../../../lib/sanity.client'
import { componentsQuery, contentStatsQuery } from '../../../../lib/sanity.queries'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test basic connection
    const [components, stats] = await Promise.all([
      sanityFetch(componentsQuery),
      sanityFetch(contentStatsQuery)
    ])

    return NextResponse.json({
      success: true,
      message: 'Sanity connection successful!',
      data: {
        components: components || [],
        stats: stats || {},
        connection: {
          projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
          apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
        }
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Sanity connection error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Sanity connection failed',
      error: error.message,
      connection: {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'Missing',
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'Missing',
        apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || 'Missing',
      },
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
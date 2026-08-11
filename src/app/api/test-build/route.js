import { NextResponse } from 'next/server'
import { sanityFetch } from '@/lib/sanity.client'
import { componentsQuery } from '@/lib/sanity.queries'

export async function GET() {
  try {
    // Test basic data fetching
    const components = await sanityFetch(componentsQuery)
    
    return NextResponse.json({
      success: true,
      message: 'Build test successful',
      dataFetched: components ? components.length : 0,
      buildTime: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Build test failed',
      error: error.message,
      buildTime: new Date().toISOString()
    })
  }
}
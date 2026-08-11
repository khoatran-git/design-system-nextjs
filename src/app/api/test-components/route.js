import { NextResponse } from 'next/server'
import { sanityFetch } from '@/lib/sanity.client'
import { componentsQuery } from '@/lib/sanity.queries'

export async function GET() {
  try {
    console.log('Testing components query:', componentsQuery)
    
    // Test the components query
    const components = await sanityFetch(componentsQuery)
    
    console.log('Components result:', components)
    
    return NextResponse.json({
      success: true,
      query: componentsQuery,
      componentCount: components?.length || 0,
      components: components || [],
      hasContent: components?.map(c => ({ 
        title: c.title, 
        hasContent: !!(c.content && c.content.length > 0) 
      })) || [],
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Components query error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      query: componentsQuery,
      timestamp: new Date().toISOString()
    })
  }
}
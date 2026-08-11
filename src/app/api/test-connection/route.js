import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

export async function GET() {
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    
    if (!projectId) {
      return NextResponse.json({
        success: false,
        error: 'NEXT_PUBLIC_SANITY_PROJECT_ID not configured',
        env: {
          projectId,
          dataset,
          hasToken: !!process.env.SANITY_API_TOKEN
        }
      })
    }

    // Create client without token for public data
    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      useCdn: false // Disable CDN for debugging
    })

    // Try to fetch any documents
    const result = await client.fetch(`*[_type == "simpleComponent"][0...5]`)
    
    return NextResponse.json({
      success: true,
      message: 'Connection successful',
      data: {
        projectId,
        dataset,
        documentCount: result?.length || 0,
        documents: result || []
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET
    })
  }
}
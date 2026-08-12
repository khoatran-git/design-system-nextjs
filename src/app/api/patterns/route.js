import { client } from '../../../lib/sanity.client'
import { successResponse, errorResponse } from '../../../lib/api-helpers'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const refresh = searchParams.get('refresh')
    
    // Add cache-busting parameter when refresh is requested
    const cacheControl = refresh ? 'no-cache' : 'public, s-maxage=60, stale-while-revalidate=300'
    
    const query = `*[_type == "pattern"] | order(order asc, _createdAt asc) {
      _id,
      _createdAt,
      _updatedAt,
      title,
      slug,
      description,
      content,
      patternType,
      complexity,
      order,
      status
    }`
    
    const patterns = await client.fetch(query, {}, {
      cache: refresh ? 'no-store' : 'default',
      next: refresh ? { revalidate: 0 } : { revalidate: 60 }
    })
    
    // Filter published patterns only
    const publishedPatterns = patterns.filter(pattern => pattern.status === 'published')
    
    return successResponse(publishedPatterns, {
      cacheControl,
      meta: {
        count: publishedPatterns.length,
        contentType: 'patterns'
      }
    })
    
  } catch (error) {
    console.error('Error fetching patterns:', error)
    return errorResponse('Failed to fetch patterns', 500)
  }
}
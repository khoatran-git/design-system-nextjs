import { client } from '@/lib/sanity.client'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(request, { params }) {
  try {
    const { slug } = params
    const { searchParams } = new URL(request.url)
    const refresh = searchParams.get('refresh')
    
    // Add cache-busting parameter when refresh is requested
    const cacheControl = refresh ? 'no-cache' : 'public, s-maxage=60, stale-while-revalidate=300'
    
    const query = `*[_type == "pattern" && slug.current == $slug][0]{
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
    
    const pattern = await client.fetch(query, { slug }, {
      cache: refresh ? 'no-store' : 'default',
      next: refresh ? { revalidate: 0 } : { revalidate: 60 }
    })
    
    if (!pattern) {
      return errorResponse('Pattern not found', 404)
    }
    
    if (pattern.status !== 'published') {
      return errorResponse('Pattern not available', 404)
    }
    
    return successResponse(pattern, {
      cacheControl,
      meta: {
        contentType: 'pattern',
        slug: pattern.slug?.current
      }
    })
    
  } catch (error) {
    console.error('Error fetching pattern:', error)
    return errorResponse('Failed to fetch pattern', 500)
  }
}
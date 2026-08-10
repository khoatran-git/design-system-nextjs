import { client } from '@/lib/sanity.client'
import { componentBySlugQuery } from '@/lib/sanity.queries'
import {
  successResponse,
  errorResponse,
  withErrorHandling,
  getCacheConfig,
} from '@/lib/api-helpers'

/**
 * GET /api/components/[slug]
 * Fetch specific component by slug
 * 
 * Parameters:
 * - slug: Component slug (e.g., "button")
 * 
 * Cache: 1 minute (detailed pages refresh frequently during development)
 */
export const GET = withErrorHandling(async (request, { params }) => {
  try {
    const { slug } = params

    if (!slug) {
      return errorResponse('Slug parameter is required', 400)
    }

    const component = await client.fetch(componentBySlugQuery, { slug })

    if (!component) {
      return errorResponse('Component not found', 404)
    }

    return successResponse(component, {
      cacheControl: getCacheConfig('detail'),
      meta: {
        slug,
        contentType: 'component-detail',
      },
    })
  } catch (error) {
    return errorResponse(
      'Failed to fetch component',
      500,
      process.env.NODE_ENV === 'development' ? error.message : undefined
    )
  }
})

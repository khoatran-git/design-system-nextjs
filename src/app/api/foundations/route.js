import { client } from '@/lib/sanity.client'
import { foundationsQuery, foundationBySlugQuery, foundationsByCategoryQuery } from '@/lib/sanity.queries'
import {
  successResponse,
  errorResponse,
  withErrorHandling,
  getCacheConfig,
  getQueryParams,
  validateParams,
} from '@/lib/api-helpers'

/**
 * GET /api/foundations
 * Fetch all published foundations with optional category filtering
 * 
 * Query parameters:
 * - category (optional): Filter by foundation category
 * 
 * Cache: 1 hour (foundations are stable content)
 */
export const GET = withErrorHandling(async (request) => {
  try {
    const params = getQueryParams(request)
    const { category } = params

    let foundations

    if (category) {
      // Validate category parameter
      const validation = validateParams(params, ['category'])
      if (!validation.valid) {
        return errorResponse('Invalid parameters', 400, validation.errors)
      }

      foundations = await client.fetch(foundationsByCategoryQuery, { category })
    } else {
      foundations = await client.fetch(foundationsQuery)
    }

    return successResponse(foundations, {
      cacheControl: getCacheConfig('foundations'),
      meta: {
        count: foundations?.length || 0,
        contentType: 'foundations',
        ...(category && { category }),
      },
    })
  } catch (error) {
    return errorResponse(
      'Failed to fetch foundations',
      500,
      process.env.NODE_ENV === 'development' ? error.message : undefined
    )
  }
})

/**
 * Get foundation by slug helper
 */
export async function getFoundationRoute(slug) {
  try {
    if (!slug) {
      return errorResponse('Slug parameter is required', 400)
    }

    const foundation = await client.fetch(foundationBySlugQuery, { slug })

    if (!foundation) {
      return errorResponse('Foundation not found', 404)
    }

    return successResponse(foundation, {
      cacheControl: getCacheConfig('detail'),
      meta: {
        slug,
        contentType: 'foundation',
      },
    })
  } catch (error) {
    return errorResponse(
      'Failed to fetch foundation',
      500,
      process.env.NODE_ENV === 'development' ? error.message : undefined
    )
  }
}

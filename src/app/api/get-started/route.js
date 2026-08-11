import { client } from '@/lib/sanity.client'
import { getStartedQuery, getStartedBySlugQuery } from '@/lib/sanity.queries'
import {
  successResponse,
  errorResponse,
  withErrorHandling,
  getCacheConfig,
  getQueryParams,
} from '@/lib/api-helpers'

/**
 * GET /api/get-started
 * Fetch all published get started pages
 * 
 * Cache: 1 hour (get started content is stable)
 */
export const GET = withErrorHandling(async (request) => {
  try {
    const getStartedPages = await client.fetch(getStartedQuery)

    return successResponse(getStartedPages, {
      cacheControl: getCacheConfig('get-started'),
      meta: {
        count: getStartedPages?.length || 0,
        contentType: 'get-started',
      },
    })
  } catch (error) {
    return errorResponse(
      'Failed to fetch get started pages',
      500,
      process.env.NODE_ENV === 'development' ? error.message : undefined
    )
  }
})

/**
 * Get get started page by slug helper
 */
export async function getGetStartedRoute(slug) {
  try {
    if (!slug) {
      return errorResponse('Slug parameter is required', 400)
    }

    const getStartedPage = await client.fetch(getStartedBySlugQuery, { slug })

    if (!getStartedPage) {
      return errorResponse('Get started page not found', 404)
    }

    return successResponse(getStartedPage, {
      cacheControl: getCacheConfig('detail'),
      meta: {
        slug,
        contentType: 'get-started',
      },
    })
  } catch (error) {
    return errorResponse(
      'Failed to fetch get started page',
      500,
      process.env.NODE_ENV === 'development' ? error.message : undefined
    )
  }
}
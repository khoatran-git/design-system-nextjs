import { client } from '@/lib/sanity.client'
import { componentsQuery, componentBySlugQuery } from '@/lib/sanity.queries'
import {
  successResponse,
  errorResponse,
  withErrorHandling,
  getCacheConfig,
  getQueryParams,
} from '@/lib/api-helpers'

/**
 * GET /api/components
 * Fetch all published components
 * 
 * Query parameters:
 * - limit (optional): Number of results to return
 * - offset (optional): Number of results to skip
 * 
 * Cache: 5 minutes (revalidate frequently during development)
 */
export const GET = withErrorHandling(async (request) => {
  try {
    const components = await client.fetch(componentsQuery)

    return successResponse(components, {
      cacheControl: getCacheConfig('components'),
      meta: {
        count: components?.length || 0,
        contentType: 'components',
      },
    })
  } catch (error) {
    return errorResponse(
      'Failed to fetch components',
      500,
      process.env.NODE_ENV === 'development' ? error.message : undefined
    )
  }
})

/**
 * GET /api/components/[slug]
 * Fetch specific component by slug
 */
export async function getComponentRoute(slug) {
  try {
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
        contentType: 'component',
      },
    })
  } catch (error) {
    return errorResponse(
      'Failed to fetch component',
      500,
      process.env.NODE_ENV === 'development' ? error.message : undefined
    )
  }
}

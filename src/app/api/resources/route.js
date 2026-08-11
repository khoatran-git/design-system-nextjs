import { client } from '@/lib/sanity.client'
import { resourcesQuery, resourceBySlugQuery, resourcesByTypeQuery } from '@/lib/sanity.queries'
import {
  successResponse,
  errorResponse,
  withErrorHandling,
  getCacheConfig,
  getQueryParams,
  validateParams,
  shouldBypassCache,
} from '@/lib/api-helpers'

/**
 * GET /api/resources
 * Fetch all published resources with optional type filtering
 * 
 * Query parameters:
 * - type (optional): Filter by resource type (link, document, tool, guide)
 * 
 * Cache: 1 hour (resources are stable content)
 */
export const GET = withErrorHandling(async (request) => {
  try {
    const params = getQueryParams(request)
    const { resourceType } = params
    const bypassCache = shouldBypassCache(request)

    let resources

    if (resourceType) {
      // Validate resourceType parameter
      const validation = validateParams(params, ['resourceType'])
      if (!validation.valid) {
        return errorResponse('Invalid parameters', 400, validation.errors)
      }

      const validTypes = ['link', 'document', 'tool', 'guide']
      if (!validTypes.includes(resourceType)) {
        return errorResponse(
          'Invalid resource type',
          400,
          `Must be one of: ${validTypes.join(', ')}`
        )
      }

      resources = await client.fetch(resourcesByTypeQuery, { resourceType })
    } else {
      resources = await client.fetch(resourcesQuery)
    }

    const cacheControl = bypassCache ? 'no-cache, no-store, must-revalidate' : getCacheConfig('resources')

    return successResponse(resources, {
      cacheControl,
      meta: {
        count: resources?.length || 0,
        contentType: 'resources',
        cached: !bypassCache,
        ...(resourceType && { resourceType }),
      },
    })
  } catch (error) {
    return errorResponse(
      'Failed to fetch resources',
      500,
      process.env.NODE_ENV === 'development' ? error.message : undefined
    )
  }
})

/**
 * Get resource by slug helper
 */
export async function getResourceRoute(slug) {
  try {
    if (!slug) {
      return errorResponse('Slug parameter is required', 400)
    }

    const resource = await client.fetch(resourceBySlugQuery, { slug })

    if (!resource) {
      return errorResponse('Resource not found', 404)
    }

    return successResponse(resource, {
      cacheControl: getCacheConfig('detail'),
      meta: {
        slug,
        contentType: 'resource',
      },
    })
  } catch (error) {
    return errorResponse(
      'Failed to fetch resource',
      500,
      process.env.NODE_ENV === 'development' ? error.message : undefined
    )
  }
}

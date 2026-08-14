import { client } from '@/lib/sanity.client'
import { stylesQuery } from '@/lib/sanity.queries'
import {
  successResponse,
  errorResponse,
  withErrorHandling,
  getCacheConfig,
} from '@/lib/api-helpers'

/**
 * GET /api/styles
 * Fetch all published styles
 * 
 * Cache: 5 minutes (revalidate frequently during development)
 */
export const GET = withErrorHandling(async (request) => {
  try {
    const styles = await client.fetch(stylesQuery)

    return successResponse(styles, {
      cacheControl: getCacheConfig('styles'),
      meta: {
        count: styles?.length || 0,
        contentType: 'styles',
      },
    })
  } catch (error) {
    return errorResponse(
      'Failed to fetch styles',
      500,
      process.env.NODE_ENV === 'development' ? error.message : undefined
    )
  }
})
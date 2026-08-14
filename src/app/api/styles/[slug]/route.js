import { client } from '@/lib/sanity.client'
import { styleBySlugQuery } from '@/lib/sanity.queries'
import {
  successResponse,
  errorResponse,
  withErrorHandling,
  getCacheConfig,
} from '@/lib/api-helpers'

/**
 * GET /api/styles/[slug]
 * Fetch specific style by slug
 */
export const GET = withErrorHandling(async (request, { params }) => {
  try {
    const slug = params?.slug

    if (!slug) {
      return errorResponse('Slug parameter is required', 400)
    }

    const style = await client.fetch(styleBySlugQuery, { slug })

    if (!style) {
      return errorResponse('Style not found', 404)
    }

    return successResponse(style, {
      cacheControl: getCacheConfig('detail'),
      meta: {
        slug,
        contentType: 'style',
      },
    })
  } catch (error) {
    return errorResponse(
      'Failed to fetch style',
      500,
      process.env.NODE_ENV === 'development' ? error.message : undefined
    )
  }
})
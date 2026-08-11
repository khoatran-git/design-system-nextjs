import { getGetStartedRoute } from '../route'

/**
 * GET /api/get-started/[slug]
 * Fetch a specific get started page by slug
 */
export async function GET(request, { params }) {
  return await getGetStartedRoute(params.slug)
}
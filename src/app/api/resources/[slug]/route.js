import { getResourceRoute } from '../route'

/**
 * GET /api/resources/[slug]
 * Fetch a specific resource by slug
 */
export async function GET(request, { params }) {
  return await getResourceRoute(params.slug)
}
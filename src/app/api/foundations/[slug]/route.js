import { getFoundationRoute } from '../route'

/**
 * GET /api/foundations/[slug]
 * Fetch a specific foundation by slug
 */
export async function GET(request, { params }) {
  return await getFoundationRoute(params.slug)
}
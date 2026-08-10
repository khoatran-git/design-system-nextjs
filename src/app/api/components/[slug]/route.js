import { client } from '@/lib/sanity.client'
import { componentBySlugQuery } from '@/lib/sanity.queries'

export async function GET(request, { params }) {
  try {
    if (!client) {
      return Response.json({ message: 'Sanity not configured yet' }, { status: 200 })
    }
    const component = await client.fetch(componentBySlugQuery, {
      slug: params.slug,
    })
    if (!component) {
      return Response.json({ error: 'Component not found' }, { status: 404 })
    }
    return Response.json(component)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch component', details: error.message }, { status: 500 })
  }
}

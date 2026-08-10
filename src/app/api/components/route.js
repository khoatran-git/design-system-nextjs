import { client } from '@/lib/sanity.client'
import { componentsQuery } from '@/lib/sanity.queries'

export async function GET() {
  try {
    if (!client) {
      return Response.json({ message: 'Sanity not configured yet. Update .env.local with your Sanity project ID.' }, { status: 200 })
    }
    const components = await client.fetch(componentsQuery)
    return Response.json(components)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch components', details: error.message }, { status: 500 })
  }
}

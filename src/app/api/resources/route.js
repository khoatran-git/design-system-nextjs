import { client } from '@/lib/sanity.client'
import { resourcesQuery } from '@/lib/sanity.queries'

export async function GET() {
  try {
    if (!client) {
      return Response.json({ message: 'Sanity not configured yet' }, { status: 200 })
    }
    const resources = await client.fetch(resourcesQuery)
    return Response.json(resources)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch resources', details: error.message }, { status: 500 })
  }
}

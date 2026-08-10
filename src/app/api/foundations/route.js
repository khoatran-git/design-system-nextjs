import { client } from '@/lib/sanity.client'
import { foundationsQuery } from '@/lib/sanity.queries'

export async function GET() {
  try {
    if (!client) {
      return Response.json({ message: 'Sanity not configured yet' }, { status: 200 })
    }
    const foundations = await client.fetch(foundationsQuery)
    return Response.json(foundations)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch foundations', details: error.message }, { status: 500 })
  }
}

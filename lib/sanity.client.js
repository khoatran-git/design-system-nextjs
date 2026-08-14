import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

// Validate required environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'
const token = process.env.SANITY_API_TOKEN

// Log warnings in development if credentials are missing
if (!projectId && process.env.NODE_ENV === 'development') {
  console.warn('⚠️  NEXT_PUBLIC_SANITY_PROJECT_ID not set. Sanity queries will fail.')
}

/**
 * Sanity client instance
 * Configured with best practices:
 * - Uses CDN for fast queries in production
 * - Includes API token for authenticated requests
 * - Properly handles missing credentials
 */
export const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false, // Temporarily disable CDN to force fresh data
      token,
    })
  : null

/**
 * Build image URLs from Sanity image objects
 * Usage: urlFor(imageObject).url()
 */
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source) => {
  if (!source) return null
  return builder.image(source)
}

/**
 * Safe query wrapper with error handling
 * Returns null on error instead of throwing
 */
export const sanityFetch = async (query, params = {}, options = {}) => {
  if (!client) {
    console.error('Sanity client not initialized. Check NEXT_PUBLIC_SANITY_PROJECT_ID.')
    return null
  }

  try {
    return await client.fetch(query, params, options)
  } catch (error) {
    console.error('Sanity fetch error:', error.message)
    return null
  }
}

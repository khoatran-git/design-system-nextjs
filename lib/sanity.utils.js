import { sanityFetch } from './sanity.client'
import {
  componentsQuery,
  componentBySlugQuery,
  foundationsQuery,
  foundationBySlugQuery,
  foundationsByCategoryQuery,
  resourcesQuery,
  resourceBySlugQuery,
  REVALIDATE_SECONDS,
} from './sanity.queries'

/**
 * Fetch all components
 * @returns {Promise<Array>} Array of component objects
 */
export async function getAllComponents() {
  return await sanityFetch(
    componentsQuery,
    {},
    { cache: 'force-cache' }
  )
}

/**
 * Fetch component by slug
 * @param {string} slug - Component slug (e.g., "button")
 * @returns {Promise<Object|null>} Component object or null
 */
export async function getComponentBySlug(slug) {
  if (!slug) return null
  
  return await sanityFetch(
    componentBySlugQuery,
    { slug },
    { cache: 'force-cache' }
  )
}

/**
 * Fetch all foundations
 * @returns {Promise<Array>} Array of foundation objects grouped by category
 */
export async function getAllFoundations() {
  return await sanityFetch(
    foundationsQuery,
    {},
    { cache: 'force-cache' }
  )
}

/**
 * Fetch foundation by slug
 * @param {string} slug - Foundation slug (e.g., "typography")
 * @returns {Promise<Object|null>} Foundation object or null
 */
export async function getFoundationBySlug(slug) {
  if (!slug) return null
  
  return await sanityFetch(
    foundationBySlugQuery,
    { slug },
    { cache: 'force-cache' }
  )
}

/**
 * Fetch foundations by category
 * @param {string} category - Foundation category
 * @returns {Promise<Array>} Array of foundations in category
 */
export async function getFoundationsByCategory(category) {
  if (!category) return []
  
  return await sanityFetch(
    foundationsByCategoryQuery,
    { category },
    { cache: 'force-cache' }
  )
}

/**
 * Fetch all resources
 * @returns {Promise<Array>} Array of resource objects
 */
export async function getAllResources() {
  return await sanityFetch(
    resourcesQuery,
    {},
    { cache: 'force-cache' }
  )
}

/**
 * Fetch resource by slug
 * @param {string} slug - Resource slug
 * @returns {Promise<Object|null>} Resource object or null
 */
export async function getResourceBySlug(slug) {
  if (!slug) return null
  
  return await sanityFetch(
    resourceBySlugQuery,
    { slug },
    { cache: 'force-cache' }
  )
}

/**
 * Get revalidation time for a content type
 * @param {string} type - Content type ("components", "foundations", "resources")
 * @returns {number} Revalidation time in seconds
 */
export function getRevalidateTime(type) {
  const revalidateMap = {
    components: REVALIDATE_SECONDS.COMPONENTS,
    foundations: REVALIDATE_SECONDS.FOUNDATIONS,
    resources: REVALIDATE_SECONDS.RESOURCES,
    detailed: REVALIDATE_SECONDS.DETAILED,
  }
  
  return revalidateMap[type] || 3600
}

/**
 * Group items by a property
 * @param {Array} items - Array of items
 * @param {string} property - Property to group by
 * @returns {Object} Grouped object
 */
export function groupBy(items, property) {
  if (!items || !Array.isArray(items)) return {}
  
  return items.reduce((acc, item) => {
    const key = item[property]
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(item)
    return acc
  }, {})
}

/**
 * Sort items by a property
 * @param {Array} items - Array of items
 * @param {string} property - Property to sort by
 * @param {string} order - "asc" or "desc"
 * @returns {Array} Sorted array
 */
export function sortBy(items, property, order = 'asc') {
  if (!items || !Array.isArray(items)) return []
  
  const sorted = [...items].sort((a, b) => {
    if (a[property] < b[property]) return order === 'asc' ? -1 : 1
    if (a[property] > b[property]) return order === 'asc' ? 1 : -1
    return 0
  })
  
  return sorted
}

/**
 * Filter items by status
 * @param {Array} items - Array of items
 * @param {string} status - Status to filter by ("published", "draft", etc.)
 * @returns {Array} Filtered array
 */
export function filterByStatus(items, status = 'published') {
  if (!items || !Array.isArray(items)) return []
  
  return items.filter(item => item.status === status)
}

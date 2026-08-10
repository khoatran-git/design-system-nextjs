import { groq } from 'next-sanity'

// ============================================================================
// CACHE/REVALIDATION CONFIGURATION
// ============================================================================

// How often to revalidate data from Sanity (in seconds)
export const REVALIDATE_SECONDS = {
  COMPONENTS: 60,      // 1 minute - frequent changes
  FOUNDATIONS: 3600,   // 1 hour - less frequent changes
  RESOURCES: 3600,     // 1 hour - less frequent changes
  DETAILED: 60,        // 1 minute - detailed pages
}

// ============================================================================
// COMPONENT QUERIES
// ============================================================================

/**
 * Fetch all published components
 * Used for: components list page
 */
export const componentsQuery = groq`
  *[_type == "component" && status == "published"] 
  | order(publishedAt desc) {
    _id,
    name,
    slug,
    description,
    status,
    publishedAt,
  }
`

/**
 * Fetch specific component by slug with full details
 * Used for: component detail page with tabs
 * Parameters: { slug: "button" }
 */
export const componentBySlugQuery = groq`
  *[_type == "component" && slug.current == $slug && status == "published"][0] {
    _id,
    name,
    slug,
    description,
    overview,
    specifications,
    documentation,
    props,
    examples,
    relatedComponents[] -> {
      _id,
      name,
      slug,
    },
    status,
    publishedAt,
  }
`

/**
 * Fetch all components with minimal data
 * Used for: sidebar navigation, search indexing
 */
export const componentsMinimalQuery = groq`
  *[_type == "component" && status == "published"] 
  | order(name asc) {
    _id,
    name,
    slug,
  }
`

// ============================================================================
// FOUNDATION QUERIES
// ============================================================================

/**
 * Fetch all published foundations
 * Grouped by category
 * Used for: foundations list/grid page
 */
export const foundationsQuery = groq`
  *[_type == "foundation" && status == "published"] 
  | order(category, name) {
    _id,
    name,
    slug,
    category,
    description,
    status,
    publishedAt,
  }
`

/**
 * Fetch specific foundation by slug with full details
 * Used for: foundation detail page
 * Parameters: { slug: "typography" }
 */
export const foundationBySlugQuery = groq`
  *[_type == "foundation" && slug.current == $slug && status == "published"][0] {
    _id,
    name,
    slug,
    category,
    description,
    content,
    relatedFoundations[] -> {
      _id,
      name,
      slug,
      category,
    },
    status,
    publishedAt,
  }
`

/**
 * Fetch foundations by category
 * Used for: category-specific pages
 * Parameters: { category: "typography" }
 */
export const foundationsByCategoryQuery = groq`
  *[_type == "foundation" && category == $category && status == "published"] 
  | order(name) {
    _id,
    name,
    slug,
    category,
    description,
    status,
  }
`

/**
 * Fetch all foundation categories
 * Used for: generating category links
 */
export const foundationCategoriesQuery = groq`
  *[_type == "foundation"] 
  | order(category) {
    category,
  }
  | unique(category)
`

// ============================================================================
// RESOURCE QUERIES
// ============================================================================

/**
 * Fetch all published resources
 * Ordered by display priority
 * Used for: resources list page
 */
export const resourcesQuery = groq`
  *[_type == "resource" && status == "published"] 
  | order(order asc, _createdAt desc) {
    _id,
    title,
    slug,
    description,
    resourceType,
    url,
    icon,
    order,
    status,
  }
`

/**
 * Fetch specific resource by slug with full details
 * Used for: resource detail page
 * Parameters: { slug: "figma-kit" }
 */
export const resourceBySlugQuery = groq`
  *[_type == "resource" && slug.current == $slug && status == "published"][0] {
    _id,
    title,
    slug,
    description,
    resourceType,
    url,
    content,
    icon,
    status,
  }
`

/**
 * Fetch resources by type
 * Used for: filtering resources
 * Parameters: { resourceType: "guide" }
 */
export const resourcesByTypeQuery = groq`
  *[_type == "resource" && resourceType == $resourceType && status == "published"] 
  | order(order asc) {
    _id,
    title,
    slug,
    description,
    resourceType,
    url,
    icon,
  }
`

// ============================================================================
// AGGREGATE QUERIES
// ============================================================================

/**
 * Fetch everything published for sitemap/SEO
 * Used for: sitemap generation, search indexing
 */
export const allPublishedContentQuery = groq`
  {
    components: *[_type == "component" && status == "published"] {
      _id,
      slug,
      publishedAt,
    },
    foundations: *[_type == "foundation" && status == "published"] {
      _id,
      slug,
      publishedAt,
    },
    resources: *[_type == "resource" && status == "published"] {
      _id,
      slug,
      publishedAt,
    },
  }
`

/**
 * Fetch statistics about published content
 * Used for: dashboard, analytics
 */
export const contentStatsQuery = groq`
  {
    componentCount: count(*[_type == "component" && status == "published"]),
    foundationCount: count(*[_type == "foundation" && status == "published"]),
    resourceCount: count(*[_type == "resource" && status == "published"]),
    totalPublished: count(*[status == "published"]),
    totalDrafts: count(*[status == "draft"]),
  }
`

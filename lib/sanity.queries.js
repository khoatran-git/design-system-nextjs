// ============================================================================
// CACHE/REVALIDATION CONFIGURATION
// ============================================================================

// How often to revalidate data from Sanity (in seconds)
export const REVALIDATE_SECONDS = {
  COMPONENTS: 60,      // 1 minute - frequent changes
  DETAILED: 60,        // 1 minute - detailed pages
}

// ============================================================================
// COMPONENT QUERIES
// ============================================================================

/**
 * Fetch all published components
 * Used for: components list page
 */
export const componentsQuery = `
  *[_type == "simpleComponent" && status in ["published", "review"]] 
  | order(_createdAt desc) {
    _id,
    title,
    slug,
    description,
    overviewContent,
    codeContent,
    whatsNewContent,
    content,
    category,
    status,
    _createdAt,
  }
`

/**
 * Fetch specific component by slug with full details
 * Used for: component detail page
 * Parameters: { slug: "button-component" }
 */
export const componentBySlugQuery = `
  *[_type == "simpleComponent" && slug.current == $slug && status in ["published", "review"]][0] {
    _id,
    title,
    slug,
    description,
    overviewContent,
    codeContent,
    whatsNewContent,
    content,
    category,
    status,
    _createdAt,
  }
`

/**
 * Fetch all components with minimal data
 * Used for: sidebar navigation, search indexing
 */
export const componentsMinimalQuery = `
  *[_type == "simpleComponent" && status in ["published", "review"]] 
  | order(title asc) {
    _id,
    title,
    slug,
    category,
    overviewContent,
    codeContent,
    whatsNewContent,
    content,
  }
`

/**
 * Fetch components by category
 * Used for: category-specific pages
 * Parameters: { category: "Components" }
 */
export const componentsByCategoryQuery = `
  *[_type == "simpleComponent" && category == $category && status in ["published", "review"]] 
  | order(title) {
    _id,
    title,
    slug,
    description,
    category,
    status,
  }
`

/**
 * Fetch all categories
 * Used for: generating category links
 */
export const categoriesQuery = `
  *[_type == "simpleComponent" && defined(category)] 
  | order(category) {
    category,
  }
  | unique(category)
`

// ============================================================================
// AGGREGATE QUERIES
// ============================================================================

/**
 * Fetch everything published for sitemap/SEO
 * Used for: sitemap generation, search indexing
 */
export const allPublishedContentQuery = `
  *[_type == "simpleComponent" && status in ["published", "review"]] {
    _id,
    slug,
    _createdAt,
  }
`

/**
 * Fetch statistics about published content
 * Used for: dashboard, analytics
 */
export const contentStatsQuery = `
  {
    "componentCount": count(*[_type == "simpleComponent" && status in ["published", "review"]]),
    "totalDrafts": count(*[_type == "simpleComponent" && status == "draft"]),
    "totalInReview": count(*[_type == "simpleComponent" && status == "review"])
  }
`

/**
 * Search query for components
 * Used for: search functionality
 * Parameters: { searchTerm: "button" }
 */
export const searchComponentsQuery = `
  *[_type == "simpleComponent" && status in ["published", "review"] && (
    title match $searchTerm + "*" ||
    description match $searchTerm + "*" ||
    category match $searchTerm + "*"
  )] 
  | order(_score desc, title asc) {
    _id,
    title,
    slug,
    description,
    category,
  }
`

// ============================================================================
// FOUNDATION QUERIES
// ============================================================================

/**
 * Fetch all published foundations
 * Used for: foundations list, navigation
 */
export const foundationsQuery = `
  *[_type == "foundation" && status == "published"] 
  | order(order asc, title asc) {
    _id,
    title,
    slug,
    description,
    category,
    content,
    order,
    status,
    _createdAt,
    _updatedAt,
  }
`

/**
 * Fetch specific foundation by slug with full details
 * Used for: foundation detail page
 * Parameters: { slug: "principles" }
 */
export const foundationBySlugQuery = `
  *[_type == "foundation" && slug.current == $slug && status == "published"][0] {
    _id,
    title,
    slug,
    description,
    category,
    content,
    order,
    status,
    _createdAt,
    _updatedAt,
  }
`

/**
 * Fetch foundations by category
 * Used for: category-specific foundation pages
 * Parameters: { category: "Principles" }
 */
export const foundationsByCategoryQuery = `
  *[_type == "foundation" && category == $category && status == "published"] 
  | order(order asc, title asc) {
    _id,
    title,
    slug,
    description,
    category,
    content,
    order,
    status,
    _createdAt,
    _updatedAt,
  }
`

// ============================================================================
// RESOURCE QUERIES
// ============================================================================

/**
 * Fetch all published resources
 * Used for: resources list, navigation
 */
export const resourcesQuery = `
  *[_type == "resource" && status == "published"] 
  | order(order asc, title asc) {
    _id,
    title,
    slug,
    description,
    resourceType,
    content,
    order,
    status,
    _createdAt,
    _updatedAt,
  }
`

/**
 * Fetch specific resource by slug with full details
 * Used for: resource detail page
 * Parameters: { slug: "design-tokens-figma" }
 */
export const resourceBySlugQuery = `
  *[_type == "resource" && slug.current == $slug && status == "published"][0] {
    _id,
    title,
    slug,
    description,
    resourceType,
    content,
    order,
    status,
    _createdAt,
    _updatedAt,
  }
`

/**
 * Fetch resources by type
 * Used for: type-specific resource pages
 * Parameters: { resourceType: "Downloads" }
 */
export const resourcesByTypeQuery = `
  *[_type == "resource" && resourceType == $resourceType && status == "published"] 
  | order(order asc, title asc) {
    _id,
    title,
    slug,
    description,
    resourceType,
    content,
    order,
    status,
    _createdAt,
    _updatedAt,
  }
`

// ============================================================================
// GET STARTED QUERIES
// ============================================================================

/**
 * Fetch all published get started pages
 * Used for: get started navigation
 */
export const getStartedQuery = `
  *[_type == "getStarted" && status == "published"] 
  | order(order asc, title asc) {
    _id,
    title,
    slug,
    description,
    content,
    order,
    status,
    _createdAt,
    _updatedAt,
  }
`

/**
 * Fetch specific get started page by slug
 * Used for: get started detail page
 * Parameters: { slug: "quick-start" }
 */
export const getStartedBySlugQuery = `
  *[_type == "getStarted" && slug.current == $slug && status == "published"][0] {
    _id,
    title,
    slug,
    description,
    content,
    order,
    status,
    _createdAt,
    _updatedAt,
  }
`
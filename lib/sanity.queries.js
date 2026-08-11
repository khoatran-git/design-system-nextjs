// GROQ query helper (simple template literal replacement for next-sanity groq)
const groq = (template, ...substitutions) => {
  return template.reduce((result, chunk, i) => {
    return result + chunk + (substitutions[i] || '')
  }, '')
}

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
export const componentsQuery = groq`
  *[_type == "simpleComponent" && status in ["published", "review"]] 
  | order(_createdAt desc) {
    _id,
    title,
    slug,
    description,
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
export const componentBySlugQuery = groq`
  *[_type == "simpleComponent" && slug.current == $slug && status in ["published", "review"]][0] {
    _id,
    title,
    slug,
    description,
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
export const componentsMinimalQuery = groq`
  *[_type == "simpleComponent" && status in ["published", "review"]] 
  | order(title asc) {
    _id,
    title,
    slug,
    category,
  }
`

/**
 * Fetch components by category
 * Used for: category-specific pages
 * Parameters: { category: "Components" }
 */
export const componentsByCategoryQuery = groq`
  *[_type == "simpleComponent" && category == $category && status == "published"] 
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
export const categoriesQuery = groq`
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
export const allPublishedContentQuery = groq`
  *[_type == "simpleComponent" && status == "published"] {
    _id,
    slug,
    _createdAt,
  }
`

/**
 * Fetch statistics about published content
 * Used for: dashboard, analytics
 */
export const contentStatsQuery = groq`
  {
    componentCount: count(*[_type == "simpleComponent" && status == "published"]),
    totalDrafts: count(*[_type == "simpleComponent" && status == "draft"]),
    totalInReview: count(*[_type == "simpleComponent" && status == "review"]),
    categoryStats: *[_type == "simpleComponent" && defined(category)] 
      | group(category) {
        "category": @.category,
        "count": count(@)
      },
  }
`

/**
 * Search query for components
 * Used for: search functionality
 * Parameters: { searchTerm: "button" }
 */
export const searchComponentsQuery = groq`
  *[_type == "simpleComponent" && status == "published" && (
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

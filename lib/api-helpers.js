/**
 * API Response Helpers
 * Standardized error handling, caching, and response formatting
 */

/**
 * Standard API error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {Object} details - Additional error details
 * @returns {Response} JSON response
 */
export function errorResponse(message, statusCode = 500, details = null) {
  const response = {
    error: message,
    status: 'error',
    timestamp: new Date().toISOString(),
  }

  if (details) {
    response.details = details
  }

  // Log errors in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`[API Error] ${statusCode}: ${message}`, details || '')
  }

  return Response.json(response, { status: statusCode })
}

/**
 * Standard API success response
 * @param {any} data - Response data
 * @param {Object} options - Response options
 * @returns {Response} JSON response
 */
export function successResponse(data, options = {}) {
  const {
    cacheControl = 'public, s-maxage=60, stale-while-revalidate=300',
    statusCode = 200,
    meta = null,
  } = options

  const response = {
    data,
    status: 'success',
    timestamp: new Date().toISOString(),
  }

  if (meta) {
    response.meta = meta
  }

  const headers = {
    'Cache-Control': cacheControl,
    'Content-Type': 'application/json',
  }

  // Add revalidation tags for ISR if available
  if (options.tags) {
    headers['Cache-Tag'] = Array.isArray(options.tags) ? options.tags.join(',') : options.tags
  }

  return Response.json(response, {
    status: statusCode,
    headers,
  })
}

/**
 * Check if Sanity is properly configured
 * @returns {boolean} True if configured
 */
export function isSanityConfigured() {
  return !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
}

/**
 * Wrap API handler with error handling
 * @param {Function} handler - Async request handler
 * @returns {Function} Wrapped handler
 */
export function withErrorHandling(handler) {
  return async (request, context) => {
    try {
      // Check Sanity configuration
      if (!isSanityConfigured()) {
        return errorResponse(
          'Sanity not configured',
          503,
          'NEXT_PUBLIC_SANITY_PROJECT_ID environment variable is missing'
        )
      }

      // Call handler
      return await handler(request, context)
    } catch (error) {
      console.error('[API Handler Error]', error)

      // Return appropriate error response
      if (error.message.includes('network')) {
        return errorResponse('Network error - failed to connect to Sanity', 503)
      }

      if (error.message.includes('unauthorized')) {
        return errorResponse('Unauthorized - check API credentials', 401)
      }

      return errorResponse(
        'Internal server error',
        500,
        process.env.NODE_ENV === 'development' ? error.message : undefined
      )
    }
  }
}

/**
 * Cache configuration for different content types
 */
export const CACHE_CONFIG = {
  // Short-lived cache for frequently changing content (reduced for faster updates)
  SHORT: 'public, s-maxage=10, stale-while-revalidate=60',

  // Medium-lived cache for moderately changing content (reduced)
  MEDIUM: 'public, s-maxage=30, stale-while-revalidate=300',

  // Long-lived cache for static content (reduced)
  LONG: 'public, s-maxage=300, stale-while-revalidate=3600',

  // No cache - always fresh
  NONE: 'no-cache, no-store, must-revalidate',

  // Private cache only (for authenticated endpoints)
  PRIVATE: 'private, max-age=60',
}

/**
 * Check if request has cache-busting parameters
 * @param {Request} request - Incoming request
 * @returns {boolean} Whether to bypass cache
 */
export function shouldBypassCache(request) {
  if (process.env.NODE_ENV === 'development') {
    return true // Always bypass cache in development
  }
  
  const url = new URL(request.url)
  // Check for cache-busting parameters
  return url.searchParams.has('refresh') || 
         url.searchParams.has('nocache') || 
         url.searchParams.has('bust')
}

/**
 * Get cache config for content type
 * @param {string} contentType - Type of content (components, foundations, etc.)
 * @returns {string} Cache-Control header value
 */
export function getCacheConfig(contentType) {
  // Use no cache in development for immediate updates
  if (process.env.NODE_ENV === 'development') {
    return CACHE_CONFIG.NONE
  }
  
  // Use shorter cache durations for all content types to improve update speed
  const config = {
    components: CACHE_CONFIG.SHORT,       // 10s cache, 1min stale
    foundations: CACHE_CONFIG.SHORT,      // 10s cache, 1min stale
    styles: CACHE_CONFIG.SHORT,           // 10s cache, 1min stale
    patterns: CACHE_CONFIG.SHORT,         // 10s cache, 1min stale
    resources: CACHE_CONFIG.SHORT,        // 10s cache, 1min stale
    'get-started': CACHE_CONFIG.SHORT,    // 10s cache, 1min stale
    detail: CACHE_CONFIG.NONE,            // No cache for individual items
    search: CACHE_CONFIG.NONE,            // No cache for search results
  }

  return config[contentType] || CACHE_CONFIG.SHORT
}

/**
 * Format error response for database errors
 * @param {Error} error - Database error
 * @returns {Object} Formatted error object
 */
export function formatDatabaseError(error) {
  if (error.statusCode === 404) {
    return {
      message: 'Content not found',
      statusCode: 404,
    }
  }

  if (error.statusCode === 400) {
    return {
      message: 'Invalid query parameters',
      statusCode: 400,
    }
  }

  return {
    message: 'Database error',
    statusCode: 500,
  }
}

/**
 * Validate query parameters
 * @param {Object} params - Query parameters
 * @param {Array<string>} required - Required parameter names
 * @returns {Object} Validation result { valid: boolean, errors: [] }
 */
export function validateParams(params, required = []) {
  const errors = []

  for (const param of required) {
    if (!params[param]) {
      errors.push(`Missing required parameter: ${param}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Extract query parameters from URL
 * @param {Request} request - Next.js request object
 * @returns {Object} Parsed query parameters
 */
export function getQueryParams(request) {
  try {
    const { searchParams } = new URL(request.url)
    const params = {}

    searchParams.forEach((value, key) => {
      params[key] = value
    })

    return params
  } catch (error) {
    console.error('Failed to parse query parameters:', error)
    return {}
  }
}

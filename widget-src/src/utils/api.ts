import { SHOPIFY_CONFIG, getShopifyHeaders } from '../config/shopify'

interface ApiRequestOptions {
  query: string
  variables?: Record<string, any>
  useStorefront?: boolean
}

interface ApiResponse<T = any> {
  data: T
  errors?: Array<{ message: string }>
}

/**
 * Common utility for making authenticated requests to Shopify GraphQL API
 */
export const fetchShopifyAPI = async <T = any>({
  query,
  variables = {},
  useStorefront = true
}: ApiRequestOptions): Promise<T> => {
  const url = useStorefront ? SHOPIFY_CONFIG.STOREFRONT_URL : SHOPIFY_CONFIG.ADMIN_URL
  const headers = getShopifyHeaders(useStorefront)
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        ...(useStorefront 
          ? { 'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.STOREFRONT_API_TOKEN }
          : {}
        ),
      },
      body: JSON.stringify({
        query,
        variables
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ApiResponse<T> = await response.json()
    
    // Handle GraphQL errors
    if (data.errors && data.errors.length > 0) {
      throw new Error(data.errors[0].message || 'GraphQL error')
    }
    
    return data.data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`API request failed: ${error.message}`)
    }
    throw new Error('Unknown API error')
  }
}

/**
 * Utility for making requests specifically to Shopify Storefront API
 */
export const fetchStorefrontAPI = <T = any>(query: string, variables?: Record<string, any>): Promise<T> => {
  return fetchShopifyAPI<T>({ query, variables, useStorefront: true })
}

/**
 * Utility for making requests specifically to Shopify Admin API (for backend only)
 */
export const fetchAdminAPI = <T = any>(query: string, variables?: Record<string, any>): Promise<T> => {
  return fetchShopifyAPI<T>({ query, variables, useStorefront: false })
}

/**
 * Generic fetch utility with error handling
 */
export const fetchWithErrorHandling = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Network request failed: ${error.message}`)
    }
    throw new Error('Unknown network error')
  }
}

/**
 * Debounce utility for search functions
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * Format error messages for user display
 */
export const formatApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return 'An unexpected error occurred'
}
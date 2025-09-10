import { SHOPIFY_API } from '../constants'

// Centralized Shopify configuration
export const SHOPIFY_CONFIG = {
  STORE_DOMAIN: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'your-store.myshopify.com',
  STOREFRONT_API_TOKEN: import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
  
  // API URLs  
  STOREFRONT_URL: `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API.VERSIONS.STOREFRONT}/graphql.json`,
  ADMIN_URL: `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API.VERSIONS.ADMIN}/graphql.json`,
  
  // Legacy - keep for backward compatibility
  SHOP_URL: `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API.VERSIONS.STOREFRONT}/graphql.json`,
} as const

// Helper function to get common headers for Shopify API requests
export const getShopifyHeaders = (useStorefront: boolean = true) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  if (useStorefront && SHOPIFY_CONFIG.STOREFRONT_API_TOKEN) {
    headers['X-Shopify-Storefront-Access-Token'] = SHOPIFY_CONFIG.STOREFRONT_API_TOKEN
  }
  
  return headers
}
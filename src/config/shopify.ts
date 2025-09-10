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
export const getShopifyHeaders = (useStorefront: boolean = true) => ({
  [SHOPIFY_API.HEADERS.CONTENT_TYPE]: SHOPIFY_API.HEADERS.CONTENT_TYPE,
  [SHOPIFY_API.HEADERS.STOREFRONT_TOKEN_HEADER]: useStorefront 
    ? SHOPIFY_CONFIG.STOREFRONT_API_TOKEN 
    : undefined,
})
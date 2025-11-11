/**
 * Shared utilities for handling availability status display
 */

import type { MaterialSearchResult } from '../types/shopify'

export type AvailabilityStatus = 'available' | 'unavailable' | 'limited'

/**
 * Maps availability status to MUI color variants
 */
export const getAvailabilityColor = (availability: string): 'success' | 'error' | 'warning' | 'default' => {
  switch (availability) {
    case 'available':
      return 'success'
    case 'unavailable':
      return 'error'
    case 'limited':
      return 'warning'
    default:
      return 'default'
  }
}

/**
 * Maps availability status to localized Slovak text
 */
export const getAvailabilityText = (availability: string): string => {
  switch (availability) {
    case 'available':
      return 'Skladom'
    case 'unavailable':
      return 'Na objednávku'
    case 'limited':
      return 'Obmedzené'
    default:
      return availability
  }
}

/**
 * Calculates product availability by checking warehouse stock metafields
 * This unified method works for ALL products: materials, edges, and any other Shopify products
 * Used throughout the application (KISS & DRY principle)
 *
 * Logic:
 * 1. Check custom warehouse stock metafields (custom.local_warehouse_stock, custom.central_warehouse_stock)
 * 2. Product is available if EITHER warehouse has stock > 0
 * 3. Otherwise, product is unavailable ("na objednávku")
 *
 * @param product - Any MaterialSearchResult (material, edge, or other product from search)
 * @returns AvailabilityStatus - 'available' (Skladom) or 'unavailable' (Na objednávku)
 */
export const calculateAvailability = (product: MaterialSearchResult): AvailabilityStatus => {
  // Check warehouse stock metafields at both product-level and variant-level
  // This works for all product types (materials, edges, etc.)
  const localWarehouseStock =
    product.metafields?.["custom.local_warehouse_stock"] ||
    product.variant?.metafields?.["custom.local_warehouse_stock"]

  const centralWarehouseStock =
    product.metafields?.["custom.central_warehouse_stock"] ||
    product.variant?.metafields?.["custom.central_warehouse_stock"]

  // Parse stock values safely
  const localStock = localWarehouseStock ? parseInt(localWarehouseStock, 10) : 0
  const centralStock = centralWarehouseStock ? parseInt(centralWarehouseStock, 10) : 0

  // DEBUG: Log stock calculation for troubleshooting
  console.log('🔍 [Availability Debug]', {
    productTitle: product.title,
    productId: product.id,
    variantSku: product.variant?.sku,
    metafields: product.metafields,
    variantMetafields: product.variant?.metafields,
    localWarehouseStock,
    centralWarehouseStock,
    localStock,
    centralStock,
    isAvailable: localStock > 0 || centralStock > 0
  })

  // Product is available if either warehouse has stock > 0
  const isAvailable = localStock > 0 || centralStock > 0

  return isAvailable ? 'available' : 'unavailable'
}
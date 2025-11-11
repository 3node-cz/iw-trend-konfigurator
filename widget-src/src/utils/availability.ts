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
  // Use inventory quantity from variant (standard Shopify field)
  const inventoryQuantity = product.variant?.inventoryQuantity || 0

  // DEBUG: Log stock calculation for troubleshooting
  console.log('🔍 [Availability Debug]', {
    productTitle: product.title,
    productId: product.id,
    variantSku: product.variant?.sku,
    inventoryQuantity,
    availableForSale: product.variant?.availableForSale,
    isAvailable: inventoryQuantity > 0
  })

  // Product is available if inventory quantity > 0
  const isAvailable = inventoryQuantity > 0

  return isAvailable ? 'available' : 'unavailable'
}
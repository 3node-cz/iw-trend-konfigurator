/**
 * Customer Pricing Service
 * Calculates customer-specific pricing based on tags and metafields
 *
 * Priority:
 * 1. SKU-specific pricing from Prices metafield
 * 2. Tag-based discount (discount_group:XX_ZAK)
 * 3. Base price
 */

import type { CustomerOrderData, CustomerPricingData } from './customerApi'
import type { EdgeMaterial } from '../types/shopify'

export interface PricingResult {
  price: number
  discountPercentage: number
  basePrice: number
  source: 'sku_metafield' | 'tag_discount' | 'base_price'
}

/**
 * Extract discount percentage from customer tags
 * Looks for tag pattern: discount_group:20_ZAK
 * Supports flexible variations (spaces, case-insensitive)
 */
export function getDiscountFromTags(tags?: string[]): number {
  if (!tags || tags.length === 0) {
    console.log('🧪 [TAG-DISCOUNT] No tags provided');
    return 0;
  }

  console.log('🧪 [TAG-DISCOUNT] Analyzing tags:', tags);
  const discounts: number[] = []

  for (const tag of tags) {
    // More flexible pattern: allows spaces, case-insensitive
    // Matches: discount_group:20_ZAK, discount group:20 ZAK, DISCOUNT_GROUP:20_ZAK
    const match = tag.match(/discount[_\s]?group[:\s]+(\d+)[_\s]?ZAK/i)
    if (match) {
      const discount = parseInt(match[1], 10)
      console.log(`🧪 [TAG-DISCOUNT] Matched tag "${tag}" → ${discount}%`);
      // Validate discount is reasonable (0-100%)
      if (!isNaN(discount) && discount > 0 && discount <= 100) {
        discounts.push(discount)
      } else if (!isNaN(discount)) {
        console.warn(`⚠️ Invalid discount value in tag "${tag}": ${discount}% (must be 1-100)`)
      }
    }
  }

  // If multiple discount tags found, use the highest
  if (discounts.length > 1) {
    console.warn(`⚠️ Multiple discount tags found, using highest:`, discounts)
  }

  const finalDiscount = discounts.length > 0 ? Math.max(...discounts) : 0;
  console.log(`🧪 [TAG-DISCOUNT] Final discount: ${finalDiscount}%`);
  return finalDiscount;
}

/**
 * Calculate customer-specific price for a SKU
 *
 * @param sku Product SKU (e.g., "100-00289")
 * @param basePrice Regular product price
 * @param customer Customer data with pricing information
 * @returns Pricing result with discounted price
 */
export function calculateCustomerPrice(
  sku: string,
  basePrice: number,
  customer?: CustomerOrderData
): PricingResult {
  console.log(`🧪 [PRICING] Calculating price for SKU: ${sku}, Base: €${basePrice}`);

  // No customer = use base price
  if (!customer) {
    console.log(`🧪 [PRICING] → No customer, using base price`);
    return {
      price: basePrice,
      discountPercentage: 0,
      basePrice,
      source: 'base_price'
    }
  }

  // Priority 1: Check SKU-specific pricing from metafield
  if (customer.pricesMetafield && customer.pricesMetafield[sku]) {
    const skuPricing = customer.pricesMetafield[sku]
    console.log(`🧪 [PRICING] ✅ PRIORITY 1: SKU-specific pricing found!`, {
      sku,
      customerPrice: skuPricing.p,
      discount: `${skuPricing.d}%`,
      basePrice: skuPricing.b,
      source: 'sku_metafield'
    });
    return {
      price: skuPricing.p,
      discountPercentage: skuPricing.d,
      basePrice: skuPricing.b,
      source: 'sku_metafield'
    }
  }

  console.log(`🧪 [PRICING] Priority 1 (SKU metafield): Not found for SKU ${sku}`);

  // Priority 2: Check tag-based discount
  const tagDiscount = getDiscountFromTags(customer.tags)
  if (tagDiscount > 0) {
    const discountedPrice = basePrice * (1 - tagDiscount / 100)
    console.log(`🧪 [PRICING] ✅ PRIORITY 2: Tag-based discount applied!`, {
      sku,
      basePrice,
      discount: `${tagDiscount}%`,
      customerPrice: discountedPrice.toFixed(2),
      calculation: `${basePrice} × (1 - ${tagDiscount}/100) = ${discountedPrice.toFixed(2)}`,
      source: 'tag_discount'
    });
    return {
      price: discountedPrice,
      discountPercentage: tagDiscount,
      basePrice,
      source: 'tag_discount'
    }
  }

  console.log(`🧪 [PRICING] Priority 2 (Tag discount): No discount tags found`);

  // Priority 3: Base price (no customer discount)
  console.log(`🧪 [PRICING] ✅ PRIORITY 3: Using base price (no discount)`, {
    sku,
    price: basePrice,
    source: 'base_price'
  });
  return {
    price: basePrice,
    discountPercentage: 0,
    basePrice,
    source: 'base_price'
  }
}

/**
 * Apply customer pricing to a list of materials
 * Updates price and adds pricing metadata to each material
 */
export function applyCustomerPricing<T extends { variant?: { sku?: string; price: string } }>(
  materials: T[],
  customer?: CustomerOrderData
): T[] {
  return materials.map(material => {
    if (!material.variant) return material

    const sku = material.variant.sku
    const basePrice = parseFloat(material.variant.price)

    if (!sku || isNaN(basePrice)) return material

    const pricingResult = calculateCustomerPrice(sku, basePrice, customer)

    // Update variant price with customer-specific price
    return {
      ...material,
      variant: {
        ...material.variant,
        price: pricingResult.price.toString(),
        // Store pricing metadata for display purposes (always available)
        _basePrice: pricingResult.basePrice.toString(),
        _customerDiscount: pricingResult.discountPercentage,
        _pricingSource: pricingResult.source
      }
    }
  })
}

/**
 * Apply customer pricing to edge materials
 * Updates price.amount and adds pricing metadata to each edge material
 */
export function applyCustomerPricingToEdges(
  edges: EdgeMaterial[],
  customer?: CustomerOrderData
): EdgeMaterial[] {
  return edges.map(edge => {
    if (!edge.price) return edge

    // Use code or productCode as SKU
    const sku = edge.code || edge.productCode
    const basePrice = edge.price.amount

    if (!sku || isNaN(basePrice)) return edge

    const pricingResult = calculateCustomerPrice(sku, basePrice, customer)

    // Update edge price with customer-specific price
    return {
      ...edge,
      price: {
        ...edge.price,
        amount: pricingResult.price,
        // Store pricing metadata for display purposes
        _basePrice: pricingResult.basePrice,
        _customerDiscount: pricingResult.discountPercentage,
        _pricingSource: pricingResult.source
      }
    }
  })
}

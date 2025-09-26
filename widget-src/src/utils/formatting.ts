/**
 * Price formatting utilities
 */

/**
 * Format a price value to 2 decimal places with EUR currency
 * @param price - The price as a number or string
 * @param currency - The currency symbol (default: 'EUR')
 * @returns Formatted price string
 */
export const formatPrice = (price: number | string, currency: string = 'EUR'): string => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price

  if (isNaN(numericPrice)) {
    return `0.00 ${currency}`
  }

  return `${numericPrice.toFixed(2)} ${currency}`
}

/**
 * Format a price value to 2 decimal places without currency
 * @param price - The price as a number or string
 * @returns Formatted price string
 */
export const formatPriceNumber = (price: number | string): string => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price

  if (isNaN(numericPrice)) {
    return '0.00'
  }

  return numericPrice.toFixed(2)
}
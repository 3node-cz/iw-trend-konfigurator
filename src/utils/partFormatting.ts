import type { Part } from '../types/simple'
import { getCornerLabel, type CornerPosition } from './edgeConstants'

/**
 * Utility functions for formatting part data and UI labels
 */

/**
 * Get the display title for a corner position
 */
export function getCornerTitle(corner: string): string {
  return getCornerLabel(corner as CornerPosition)
}

/**
 * Format part dimensions display
 */
export function formatPartDimensions(part: Part): string {
  return `${part.width} × ${part.height} mm`
}

/**
 * Get part label with fallback to dimensions
 */
export function getPartLabel(part: Part): string {
  return part.label || `Diel ${part.width}×${part.height}`
}

/**
 * Calculate area in square meters per piece
 */
export function calculatePartArea(part: Part): string {
  return ((part.width * part.height) / 1000000).toFixed(3)
}

/**
 * Format quantity display
 */
export function formatQuantity(quantity: number): string {
  return `${quantity} ks`
}

/**
 * Format area display with unit
 */
export function formatAreaDisplay(part: Part): string {
  return `${calculatePartArea(part)} m²/ks`
}

/**
 * Get part stats for header display
 */
export function getPartStats(part: Part) {
  return {
    quantity: formatQuantity(part.quantity),
    area: formatAreaDisplay(part),
  }
}

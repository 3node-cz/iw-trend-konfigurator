/**
 * Cutting optimization configuration - SIMPLE!
 */

// Constants
export const SAW_WIDTH = 3 // mm - saw blade kerf
export const BOARD_TRIM = 15 // mm - trim from each side (osamovanie)
export const DUPEL_MARGIN = 20 // mm - extra margin for Dupel before gluing
export const DUPEL_EDGE_WIDTH = 42 // mm - edge band width for Dupel

/**
 * Get effective board dimensions after trimming
 * Example: 2800×2070 → 2770×2040 (with 15mm trim)
 */
export const getEffectiveBoardDimensions = (
  width: number,
  height: number,
  trim: number = BOARD_TRIM
): { width: number; height: number } => ({
  width: width - (trim * 2),
  height: height - (trim * 2),
})

/**
 * Apply Dupel transformation to piece
 * Doubles quantity and adds margins
 */
export const applyDupelTransform = (
  length: number,
  width: number,
  quantity: number
): { length: number; width: number; quantity: number } => ({
  length: length + DUPEL_MARGIN,
  width: width + DUPEL_MARGIN,
  quantity: quantity * 2,
})

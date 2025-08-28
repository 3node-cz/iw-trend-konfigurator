/**
 * Visualization constants and helpers for layout components
 * Contains colors, dimensions, and formatting utilities
 */

import { APP_CONFIG } from '../config/appConfig'

/**
 * Get block border styling configuration
 */
export const getBlockBorderStyle = () => {
  return {
    color: APP_CONFIG.visualization.blocks.borderColor,
    width: APP_CONFIG.visualization.blocks.borderWidth,
    opacity: APP_CONFIG.visualization.blocks.opacity,
  }
}

/**
 * Get inner block border styling configuration
 */
export const getInnerBlockBorderStyle = () => {
  return {
    color: APP_CONFIG.visualization.blocks.innerBorderColor,
    width: APP_CONFIG.visualization.blocks.innerBorderWidth,
    opacity: APP_CONFIG.visualization.blocks.opacity,
  }
}

/**
 * Check if a part is rotated (90 degrees)
 */
export const isPartRotated = (rotation: number): boolean => {
  return rotation === APP_CONFIG.visualization.rotation.standard
}

/**
 * Format efficiency percentage with configured decimal places
 */
export const formatEfficiencyPercentage = (efficiency: number): string => {
  const decimalPlaces = APP_CONFIG.visualization.formatting.decimalPlaces
  return `${(efficiency * 100).toFixed(decimalPlaces)}%`
}

/**
 * Format area in square meters with configured precision
 */
export const formatAreaInSquareMeters = (areaInMm2: number): number => {
  return areaInMm2 / APP_CONFIG.visualization.formatting.unitConversion.mmToM2
}

/**
 * Get material configuration for export
 */
export const getMaterialConfig = () => {
  return {
    type: 'DTD Laminovaná', // Default material type
    thickness: APP_CONFIG.material.material.thickness,
    sheetSize: {
      width: APP_CONFIG.material.defaultBoard.width,
      height: APP_CONFIG.material.defaultBoard.height,
    },
  }
}

/**
 * Generate unique order ID with timestamp
 */
export const generateOrderId = (): string => {
  return `order-${Date.now()}`
}

/**
 * Get timestamp in ISO format
 */
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString()
}

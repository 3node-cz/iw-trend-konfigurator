/**
 * Part formatting utilities for display and labeling
 */

import type { Part } from '../types/simple'

/**
 * Get formatted corner title for display
 * @param corner - Corner name (topLeft, topRight, bottomLeft, bottomRight)
 * @returns Formatted corner title
 */
export const getCornerTitle = (corner: string): string => {
  const cornerTitles: Record<string, string> = {
    topLeft: 'Ľavý horný',
    topRight: 'Pravý horný',
    bottomLeft: 'Ľavý dolný',
    bottomRight: 'Pravý dolný',
  }

  return cornerTitles[corner] || corner
}

/**
 * Format part dimension for display
 * @param width - Part width
 * @param height - Part height
 * @returns Formatted dimension string
 */
export const formatPartDimensions = (width: number, height: number): string => {
  return `${width}×${height} mm`
}

/**
 * Format part dimensions from a part object
 * @param part - Part object with width and height
 * @returns Formatted dimension string
 */
export const formatPartDimensionsFromPart = (part: Part): string => {
  return formatPartDimensions(part.width, part.height)
}

/**
 * Get part label for display
 * @param part - Part object
 * @returns Part label or formatted dimensions
 */
export const getPartLabel = (part: Part): string => {
  if (part.label) {
    return part.label
  }
  return formatPartDimensions(part.width, part.height)
}

/**
 * Get part statistics for display
 * @param part - Part object
 * @returns Part statistics object
 */
export const getPartStats = (
  part: Part,
): { quantity: number; area: string } => {
  const area = ((part.width * part.height) / 1000000).toFixed(3)
  return {
    quantity: part.quantity,
    area: `${area} m²`,
  }
}

/**
 * Format part label for display
 * @param label - Part label (optional)
 * @param width - Part width
 * @param height - Part height
 * @returns Formatted label string
 */
export const formatPartLabel = (
  label?: string,
  width?: number,
  height?: number,
): string => {
  if (label) {
    return label
  }
  if (width && height) {
    return formatPartDimensions(width, height)
  }
  return 'Nový diel'
}

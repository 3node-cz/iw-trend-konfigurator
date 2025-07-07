/**
 * Color management utilities for consistent piece coloring across all visualizations
 */

import { SHEET_VISUALIZATION } from './appConstants'

/**
 * Global color cache to ensure consistent colors for the same part across all boards
 */
const partColorCache = new Map<string, string>()

/**
 * Extract base ID from part ID by removing instance suffixes
 * Example: "part-123-1" -> "part-123"
 * Example: "part-123-0-0" -> "part-123" (handles double expansion)
 * For block parts: "block-1-0" -> "block-1"
 * For subblock parts: "subblock-1-0" -> "subblock-1"
 */
export const getBasePartId = (partId: string): string => {
  // Handle block composite parts
  if (partId.startsWith('block-')) {
    const match = partId.match(/^block-(\d+)-/)
    if (match) {
      return `block-${match[1]}`
    }
  }

  // Handle subblock composite parts
  if (partId.startsWith('subblock-')) {
    const match = partId.match(/^subblock-(\d+)-/)
    if (match) {
      return `block-${match[1]}`
    }
  }

  // Handle regular parts with instance suffixes (remove all numeric suffixes)
  // This handles cases like "part-123-0-0" -> "part-123"
  return partId.replace(/-\d+(-\d+)*$/, '')
}

/**
 * Simple string hash function for consistent color assignment
 */
const hashString = (str: string): number => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

/**
 * Generate a consistent color for a part based on its dimensions
 * Parts with the same dimensions will always get the same color
 */
export const getConsistentPartColor = (
  partId: string,
  part?: { blockId?: number; width?: number; height?: number },
): string => {
  // Create a key based on dimensions for consistent coloring
  let colorKey: string
  
  if (part?.width && part?.height) {
    // Use normalized dimensions (smaller dimension first) for consistent colors
    const [dim1, dim2] = [part.width, part.height].sort((a, b) => a - b)
    colorKey = `${dim1}x${dim2}`
    console.log(`Color assignment for part ${partId}: dimensions ${part.width}x${part.height} -> key ${colorKey}`)
  } else {
    // Fallback to part ID if dimensions not available
    colorKey = getBasePartId(partId)
    console.log(`Color assignment for part ${partId}: no dimensions, using base ID ${colorKey}`)
  }

  if (partColorCache.has(colorKey)) {
    const cachedColor = partColorCache.get(colorKey)!
    console.log(`Using cached color for ${colorKey}: ${cachedColor}`)
    return cachedColor
  }

  // Generate hash from dimensions for consistent color assignment
  const hash = hashString(colorKey)
  const colorIndex = hash % SHEET_VISUALIZATION.partColors.length
  const color = SHEET_VISUALIZATION.partColors[colorIndex]

  console.log(`New color for ${colorKey}: ${color} (index ${colorIndex})`)
  partColorCache.set(colorKey, color)
  return color
}

/**
 * Get color index for a part (for legacy compatibility)
 */
export const getPartColorIndex = (
  partId: string,
  part?: { blockId?: number },
): number => {
  const color = getConsistentPartColor(partId, part)
  return SHEET_VISUALIZATION.partColors.findIndex((c) => c === color)
}

/**
 * Clear the color cache (useful for testing or resetting)
 */
export const clearColorCache = (): void => {
  partColorCache.clear()
}

/**
 * Reset part colors (useful for testing)
 */
export const resetPartColors = (): void => {
  partColorCache.clear()
}

/**
 * Get all cached colors (useful for debugging)
 */
export const getColorCache = (): Map<string, string> => {
  return new Map(partColorCache)
}

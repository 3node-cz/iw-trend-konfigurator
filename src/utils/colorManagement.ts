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
 */
export const getBasePartId = (partId: string): string => {
  return partId.replace(/-\d+$/, '')
}

/**
 * Generate a consistent color for a part based on its base ID
 * The same base part will always get the same color across all boards
 */
export const getConsistentPartColor = (partId: string): string => {
  const baseId = getBasePartId(partId)

  if (partColorCache.has(baseId)) {
    return partColorCache.get(baseId)!
  }

  // Generate hash from base ID for consistent color assignment
  const hash = hashString(baseId)
  const colorIndex = hash % SHEET_VISUALIZATION.partColors.length
  const color = SHEET_VISUALIZATION.partColors[colorIndex]

  partColorCache.set(baseId, color)
  return color
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
 * Get color index for a part (for legacy compatibility)
 */
export const getPartColorIndex = (partId: string): number => {
  const color = getConsistentPartColor(partId)
  return SHEET_VISUALIZATION.partColors.findIndex((c) => c === color)
}

/**
 * Clear the color cache (useful for testing or resetting)
 */
export const clearColorCache = (): void => {
  partColorCache.clear()
}

/**
 * Get all cached colors (useful for debugging)
 */
export const getColorCache = (): Map<string, string> => {
  return new Map(partColorCache)
}

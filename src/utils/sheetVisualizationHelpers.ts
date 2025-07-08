import type { SheetLayout, PlacedPart } from '../types/simple'
import { SHEET_VISUALIZATION } from './appConstants'
import { getBasePartId } from './colorManagement'

/**
 * Utility functions for sheet visualization
 */

/**
 * Calculate optimal scale for sheet preview
 */
export const calculateSheetScale = (
  sheetWidth: number,
  sheetHeight: number,
  maxWidth: number = SHEET_VISUALIZATION.maxPreviewWidth,
  maxHeight: number = SHEET_VISUALIZATION.maxPreviewHeight,
): { scale: number; scaledWidth: number; scaledHeight: number } => {
  const scale = Math.min(maxWidth / sheetWidth, maxHeight / sheetHeight)
  return {
    scale,
    scaledWidth: sheetWidth * scale,
    scaledHeight: sheetHeight * scale,
  }
}

/**
 * Group placed parts by their base ID for legend generation
 */
export const groupPartsByBaseId = (
  placedParts: PlacedPart[],
  enhancedParts?: Array<{
    id: string
    color?: string
    label?: string
    width?: number
    height?: number
    quantity?: number
    blockId?: number
    orientation?: 'fixed' | 'rotatable'
  }>,
): Record<
  string,
  {
    label: string
    color: string
    count: number
  }
> => {
  const groups: Record<
    string,
    { label: string; color: string; count: number }
  > = {}

  // Helper to get color from enhanced parts
  const getPartColor = (partId: string): string => {
    if (!enhancedParts) return '#3498db' // fallback color

    // For block parts, find the first part that belongs to this block
    if (partId.startsWith('block-') || partId.startsWith('subblock-')) {
      const blockIdMatch = partId.match(/^(?:sub)?block-(?:composite-)?(\d+)/)
      if (blockIdMatch) {
        const blockId = parseInt(blockIdMatch[1], 10)
        const blockPart = enhancedParts.find((p) => p.blockId === blockId)
        return blockPart?.color || '#3498db'
      }
    }

    const originalPartId = getBasePartId(partId)
    const enhancedPart = enhancedParts.find((p) => p.id === originalPartId)
    return enhancedPart?.color || '#3498db'
  }

  // First, collect block information
  const blockGroups: Record<
    number,
    { partTypes: Set<string>; totalPieces: number }
  > = {}

  placedParts.forEach((placedPart) => {
    // Handle block parts specially
    if (
      placedPart.part.id.startsWith('block-') ||
      placedPart.part.id.startsWith('subblock-')
    ) {
      const blockIdMatch = placedPart.part.id.match(
        /^(?:sub)?block-(?:composite-)?(\d+)/,
      )
      if (blockIdMatch && enhancedParts) {
        const blockId = parseInt(blockIdMatch[1], 10)

        if (!blockGroups[blockId]) {
          blockGroups[blockId] = { partTypes: new Set(), totalPieces: 0 }
        }

        // Find all enhanced parts in this block to count part types
        const partsInBlock = enhancedParts.filter((p) => p.blockId === blockId)
        partsInBlock.forEach((part) => {
          blockGroups[blockId].partTypes.add(part.id)
        })

        // Count total pieces in block
        blockGroups[blockId].totalPieces = partsInBlock.reduce(
          (sum, part) => sum + (part.quantity || 1),
          0,
        )
      }
      return
    }

    // Handle non-block parts normally
    const baseId = getBasePartId(placedPart.part.id)

    let label = baseId
    // For frame pieces, use the original part label with "Frame" prefix
    if (placedPart.part.id.includes('_frame_')) {
      // Extract the original part ID and find its label from enhanced parts
      const originalPartId = placedPart.part.id.split('_frame_')[0]
      let originalPartLabel = 'Frame'

      if (enhancedParts) {
        const enhancedPart = enhancedParts.find((p) => p.id === originalPartId)
        if (enhancedPart?.label) {
          originalPartLabel = enhancedPart.label
        } else if (enhancedPart?.width && enhancedPart?.height) {
          originalPartLabel = `${enhancedPart.width}×${enhancedPart.height}`
        }
      }

      label = `${originalPartLabel} - rámček`
    } else {
      // For regular parts, find the matching enhanced part and use its label
      if (enhancedParts) {
        const enhancedPart = enhancedParts.find((p) => p.id === baseId)
        if (enhancedPart?.label) {
          label = enhancedPart.label

          // Add descriptive indicators
          const indicators: string[] = []

          // Add orientation indicator
          if (enhancedPart.orientation === 'fixed') {
            indicators.push('pevná orientácia')
          } else if (enhancedPart.orientation === 'rotatable') {
            indicators.push('otočiteľné')
          }

          if (indicators.length > 0) {
            label += ` (${indicators.join(', ')})`
          }
        } else if (enhancedPart?.width && enhancedPart?.height) {
          label = `${enhancedPart.width}×${enhancedPart.height}`
        }
      }

      // Fallback to placed part dimensions if no enhanced part found
      if (label === baseId && placedPart.part.width && placedPart.part.height) {
        label = `${placedPart.part.width}×${placedPart.part.height}`
      }
    }

    if (!groups[baseId]) {
      groups[baseId] = {
        label: label,
        color: getPartColor(placedPart.part.id),
        count: 0,
      }
    }

    // For frame pieces, count by sets of 4 (since each frame consists of 4 pieces)
    if (placedPart.part.id.includes('_frame_')) {
      // Only count once per frame (when we encounter the first piece)
      const framePartType = placedPart.part.id
        .split('_frame_')[1]
        ?.split('-')[0]
      if (framePartType === 'top') {
        groups[baseId].count++
      }
    } else {
      groups[baseId].count++
    }
  })

  // Add block groups to the main groups
  Object.entries(blockGroups).forEach(([blockIdStr, blockInfo]) => {
    const blockId = parseInt(blockIdStr, 10)
    const blockKey = `block-${blockId}`

    // Find a representative enhanced part from this block for color
    const representativePart = enhancedParts?.find((p) => p.blockId === blockId)

    groups[blockKey] = {
      label: `Blok ${blockId} (${blockInfo.partTypes.size} typov)`,
      color: representativePart?.color || '#3498db',
      count: 1, // Always show 1x for the block itself
    }
  })

  return groups
}

/**
 * Calculate wasted area for a sheet
 */
export const calculateWastedArea = (
  sheetWidth: number,
  sheetHeight: number,
  placedParts: PlacedPart[],
): number => {
  const usedArea = placedParts.reduce((sum, p) => {
    return sum + p.part.width * p.part.height
  }, 0)
  return sheetWidth * sheetHeight - usedArea
}

/**
 * Calculate total statistics for sheet layout
 */
export const calculateLayoutStats = (
  sheetLayout: SheetLayout,
): {
  totalPlacedParts: number
  totalRequestedParts: number
  placementRatio: number
} => {
  const totalPlacedParts = sheetLayout.sheets.reduce(
    (sum, sheet) => sum + sheet.placedParts.length,
    0,
  )
  const totalRequestedParts =
    totalPlacedParts + sheetLayout.unplacedParts.length
  const placementRatio =
    totalRequestedParts > 0 ? totalPlacedParts / totalRequestedParts : 0

  return {
    totalPlacedParts,
    totalRequestedParts,
    placementRatio,
  }
}

/**
 * Get part dimensions considering rotation
 */
export const getPartDimensions = (
  placedPart: PlacedPart,
): {
  width: number
  height: number
} => {
  const isRotated = placedPart.rotation === 90
  return {
    width: isRotated ? placedPart.part.height : placedPart.part.width,
    height: isRotated ? placedPart.part.width : placedPart.part.height,
  }
}

/**
 * Format area in square meters
 */
export const formatAreaInSquareMeters = (
  areaInSquareMillimeters: number,
): string => {
  return (
    Math.round((areaInSquareMillimeters / 1000000) * 100) / 100
  ).toString()
}

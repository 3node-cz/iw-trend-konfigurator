/**
 * Visualization utilities extracted from components
 * These functions handle visualization logic that was previously embedded in components
 */

import { APP_CONFIG } from '../config/appConfig'
import type { PlacedPart } from '../types/simple'
import type { EnhancedCuttingPart } from '../hooks/three-layer/useLayeredCuttingState'
import { getBasePartId } from './colorManagement'

// ===============================================
// PART COLOR UTILITIES
// ===============================================

/**
 * Get color for a part in visualization context
 * Handles block parts, composite parts, and individual parts
 */
export const getVisualizationPartColor = (
  partId: string,
  enhancedParts: EnhancedCuttingPart[],
): string => {
  // For composite block parts (block-X-Y, block-composite-X-Y or subblock-X-Y format)
  if (partId.startsWith('block-') || partId.startsWith('subblock-')) {
    const blockIdMatch = partId.match(/^(?:sub)?block-(?:composite-)?(\d+)/)
    if (blockIdMatch) {
      const blockId = parseInt(blockIdMatch[1], 10)
      // Find any part in this block that has a color
      const blockParts = enhancedParts.filter((p) => p.blockId === blockId)
      const partWithColor = blockParts.find((p) => p.color) || blockParts[0]

      return partWithColor?.color || APP_CONFIG.branding.colors.partsPalette[0]
    }
  }

  // For individual pieces, find the original enhanced part
  const baseId = getBasePartId(partId)
  const enhancedPart = enhancedParts.find((p) => p.id === baseId)

  if (enhancedPart) {
    // Use the enhanced part's color directly
    return enhancedPart.color || APP_CONFIG.branding.colors.partsPalette[0]
  }

  return APP_CONFIG.branding.colors.partsPalette[0]
}

// ===============================================
// BLOCK GROUPING UTILITIES
// ===============================================

/**
 * Group placed parts by their block ID for visualization borders
 */
export const groupPlacedPartsByBlock = (
  placedParts: PlacedPart[],
  enhancedParts: EnhancedCuttingPart[],
): Map<number, PlacedPart[]> => {
  const blockGroups = new Map<number, PlacedPart[]>()

  placedParts.forEach((placedPart) => {
    // Find the original enhanced part to get block info
    const baseId = getBasePartId(placedPart.part.id)
    const enhancedPart = enhancedParts.find((p) => p.id === baseId)

    if (enhancedPart?.blockId) {
      if (!blockGroups.has(enhancedPart.blockId)) {
        blockGroups.set(enhancedPart.blockId, [])
      }
      blockGroups.get(enhancedPart.blockId)!.push(placedPart)
    }
  })

  return blockGroups
}

/**
 * Calculate bounding box for a group of placed parts
 */
export const calculateBoundingBox = (parts: PlacedPart[]) => {
  if (parts.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 }
  }

  const minX = Math.min(...parts.map((p) => p.x))
  const minY = Math.min(...parts.map((p) => p.y))
  const maxX = Math.max(...parts.map((p) => p.x + (p.part.width || 0)))
  const maxY = Math.max(...parts.map((p) => p.y + (p.part.height || 0)))

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  }
}

// ===============================================
// SHEET SCALING UTILITIES
// ===============================================

/**
 * Calculate scaling for sheet visualization to fit within container
 */
export const calculateVisualizationScale = (
  sheetWidth: number,
  sheetHeight: number,
  maxWidth: number = APP_CONFIG.visualization.sheet.maxPreviewWidth,
  maxHeight: number = APP_CONFIG.visualization.sheet.maxPreviewHeight,
) => {
  const scaleX = maxWidth / sheetWidth
  const scaleY = maxHeight / sheetHeight
  const scale = Math.min(scaleX, scaleY, 1) // Never scale up

  return {
    scale,
    scaledWidth: sheetWidth * scale,
    scaledHeight: sheetHeight * scale,
  }
}

// ===============================================
// PART DIMENSION UTILITIES
// ===============================================

/**
 * Get actual dimensions of a placed part (considering rotation)
 */
export const getPlacedPartDimensions = (placedPart: PlacedPart) => {
  const isRotated = placedPart.rotation === 90

  return {
    width: isRotated ? placedPart.part.height || 0 : placedPart.part.width || 0,
    height: isRotated
      ? placedPart.part.width || 0
      : placedPart.part.height || 0,
  }
}

// ===============================================
// BLOCK BORDER RENDERING UTILITIES
// ===============================================

/**
 * Generate block border components for visualization
 */
export const generateBlockBorders = (
  blockGroups: Map<number, PlacedPart[]>,
  minPartsForBorder: number = 2,
) => {
  const borders: Array<{
    blockId: number
    parts: PlacedPart[]
    boundingBox: ReturnType<typeof calculateBoundingBox>
  }> = []

  blockGroups.forEach((parts, blockId) => {
    if (parts.length >= minPartsForBorder) {
      borders.push({
        blockId,
        parts,
        boundingBox: calculateBoundingBox(parts),
      })
    }
  })

  return borders
}

/**
 * Generate internal block separator lines
 */
export const generateBlockSeparators = (
  placedPart: PlacedPart,
  enhancedParts: EnhancedCuttingPart[],
) => {
  // Only render internal borders for composite block parts
  const isCompositeBlock =
    placedPart.part.id.startsWith('block-') ||
    placedPart.part.id.startsWith('subblock-')

  if (!isCompositeBlock || !placedPart.part.blockId) return []

  // Find all enhanced parts that belong to this block
  const blockParts = enhancedParts.filter(
    (part) => part.blockId === placedPart.part.blockId,
  )

  if (blockParts.length === 0) return []

  // Create array of individual pieces with their actual placed dimensions
  const individualPieces: { width: number; height: number }[] = []

  // Get the total placed dimensions of the composite block
  const { width: totalBlockWidth, height: totalBlockHeight } =
    getPlacedPartDimensions(placedPart)

  // Calculate total original width of all pieces in the block
  const totalOriginalWidth = blockParts.reduce(
    (sum, part) => sum + part.width * part.quantity,
    0,
  )

  // For each part, calculate its placed width proportionally
  blockParts.forEach((part) => {
    for (let i = 0; i < part.quantity; i++) {
      const proportionalWidth =
        (part.width / totalOriginalWidth) * totalBlockWidth
      individualPieces.push({
        width: proportionalWidth,
        height: totalBlockHeight,
      })
    }
  })

  // For blocks with multiple pieces, render internal borders
  if (individualPieces.length <= 1) return []

  const separators: Array<{
    x1: number
    y1: number
    x2: number
    y2: number
  }> = []

  // Check if the block is rotated using the rotation property
  const isRotated = placedPart.rotation === 90

  if (isRotated) {
    // Block is rotated - render horizontal borders (pieces stacked vertically)
    let currentY = Number(placedPart.y)

    // When rotated, pieces are stacked vertically, so we need to calculate heights
    const totalOriginalHeight = blockParts.reduce(
      (sum, part) => sum + part.height * part.quantity,
      0,
    )

    blockParts.forEach((part) => {
      for (let i = 0; i < part.quantity; i++) {
        if (currentY > Number(placedPart.y)) {
          // Don't render border before first piece
          separators.push({
            x1: placedPart.x,
            y1: currentY,
            x2: placedPart.x + totalBlockWidth,
            y2: currentY,
          })
        }
        // Calculate proportional height for this piece
        const proportionalHeight =
          (part.height / totalOriginalHeight) * totalBlockHeight
        currentY += proportionalHeight
      }
    })
  } else {
    // Block is not rotated - render vertical borders (pieces side by side)
    let currentX = Number(placedPart.x)

    for (let i = 0; i < individualPieces.length - 1; i++) {
      currentX += Number(individualPieces[i].width)
      separators.push({
        x1: currentX,
        y1: placedPart.y,
        x2: currentX,
        y2: placedPart.y + totalBlockHeight,
      })
    }
  }

  return separators
}

// ===============================================
// SHEET STATISTICS UTILITIES
// ===============================================

/**
 * Calculate sheet utilization statistics
 */
export const calculateSheetStats = (
  sheetWidth: number,
  sheetHeight: number,
  placedParts: PlacedPart[],
) => {
  const totalSheetArea = sheetWidth * sheetHeight
  const usedArea = placedParts.reduce((sum, part) => {
    const { width, height } = getPlacedPartDimensions(part)
    return sum + width * height
  }, 0)

  const efficiency = totalSheetArea > 0 ? (usedArea / totalSheetArea) * 100 : 0
  const wastedArea = totalSheetArea - usedArea

  return {
    totalArea: totalSheetArea,
    usedArea,
    wastedArea,
    efficiency,
    partCount: placedParts.length,
  }
}

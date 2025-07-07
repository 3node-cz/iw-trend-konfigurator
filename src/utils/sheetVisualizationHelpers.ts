import type { SheetLayout, PlacedPart } from '../types/simple'
import { SHEET_VISUALIZATION } from './appConstants'
import { getConsistentPartColor, getBasePartId } from './colorManagement'

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

  placedParts.forEach((placedPart) => {
    const baseId = getBasePartId(placedPart.part.id)

    let label = baseId
    // For block parts, use the block info for the label
    if (
      placedPart.part.id.startsWith('block-') ||
      placedPart.part.id.startsWith('subblock-')
    ) {
      if (placedPart.part.label) {
        label = placedPart.part.label
      } else {
        label = baseId
      }
    } else {
      // For regular parts, use dimensions or custom label
      if (placedPart.part.label) {
        label = placedPart.part.label
      } else {
        if (placedPart.part.width && placedPart.part.height) {
          label = `${placedPart.part.width}×${placedPart.part.height}`
        } else {
          label = baseId
        }
      }
    }

    if (!groups[baseId]) {
      groups[baseId] = {
        label: label,
        color: getConsistentPartColor(baseId, placedPart.part),
        count: 0,
      }
    }
    groups[baseId].count++
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

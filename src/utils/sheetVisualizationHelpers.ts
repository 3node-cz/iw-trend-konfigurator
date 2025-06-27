import type { SheetLayout, PlacedPart } from '../types/simple'
import { SHEET_VISUALIZATION } from './appConstants'

/**
 * Utility functions for sheet visualization
 */

/**
 * Calculate optimal scale for sheet preview
 */
export function calculateSheetScale(
  sheetWidth: number,
  sheetHeight: number,
  maxWidth: number = SHEET_VISUALIZATION.maxPreviewWidth,
  maxHeight: number = SHEET_VISUALIZATION.maxPreviewHeight,
): { scale: number; scaledWidth: number; scaledHeight: number } {
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
export function groupPartsByBaseId(placedParts: PlacedPart[]): Record<
  string,
  {
    label: string
    color: string
    count: number
  }
> {
  return placedParts.reduce((groups, placedPart) => {
    // Extract base ID by removing the last "-X" suffix (where X is the instance number)
    const baseId = placedPart.part.id.replace(/-\d+$/, '')
    if (!groups[baseId]) {
      groups[baseId] = {
        label:
          placedPart.part.label ||
          `${placedPart.part.width}×${placedPart.part.height}`,
        color:
          SHEET_VISUALIZATION.partColors[
            Object.keys(groups).length % SHEET_VISUALIZATION.partColors.length
          ],
        count: 0,
      }
    }
    groups[baseId].count++
    return groups
  }, {} as Record<string, { label: string; color: string; count: number }>)
}

/**
 * Calculate wasted area for a sheet
 */
export function calculateWastedArea(
  sheetWidth: number,
  sheetHeight: number,
  placedParts: PlacedPart[],
): number {
  const usedArea = placedParts.reduce((sum, p) => {
    return sum + p.part.width * p.part.height
  }, 0)
  return sheetWidth * sheetHeight - usedArea
}

/**
 * Calculate total statistics for sheet layout
 */
export function calculateLayoutStats(sheetLayout: SheetLayout): {
  totalPlacedParts: number
  totalRequestedParts: number
  placementRatio: number
} {
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
export function getPartDimensions(placedPart: PlacedPart): {
  width: number
  height: number
} {
  const isRotated = placedPart.rotation === 90
  return {
    width: isRotated ? placedPart.part.height : placedPart.part.width,
    height: isRotated ? placedPart.part.width : placedPart.part.height,
  }
}

/**
 * Format area in square meters
 */
export function formatAreaInSquareMeters(
  areaInSquareMillimeters: number,
): string {
  return (
    Math.round((areaInSquareMillimeters / 1000000) * 100) / 100
  ).toString()
}

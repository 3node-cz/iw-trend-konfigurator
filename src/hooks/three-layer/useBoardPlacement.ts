/**
 * Board Placement Hook
 *
 * This hook takes prepared pieces (from Block Preparation) and places them on boards.
 * It handles both individual pieces and composite block pieces.
 *
 * Architecture Layer: Board Placement State
 * Input: Prepared pieces from Block Preparation
 * Output: Optimized board layout with placed pieces
 */

import { useMemo } from 'react'
import type { PreparedPiece } from './useBlockPreparation'
import type { SheetLayout, PlacedPart, Part } from '../../types/simple'
import {
  optimizeCuttingBLF,
  defaultCuttingConfig,
  silentLogger,
  type CuttingConfig,
} from '../../utils/cuttingOptimizer'

export interface BoardPlacementState {
  boardLayout: SheetLayout | null
  isCalculating: boolean
  placedPieces: PlacedPart[]
  unplacedPieces: PreparedPiece[]
  totalBoards: number
  overallEfficiency: number
}

/**
 * Hook for placing prepared pieces on boards
 */
export const useBoardPlacement = (
  preparedPieces: PreparedPiece[],
  cuttingConfig: CuttingConfig = defaultCuttingConfig,
): BoardPlacementState => {
  const boardPlacementState = useMemo((): BoardPlacementState => {
    if (preparedPieces.length === 0) {
      return {
        boardLayout: null,
        isCalculating: false,
        placedPieces: [],
        unplacedPieces: [],
        totalBoards: 0,
        overallEfficiency: 0,
      }
    }

    try {
      // Convert prepared pieces to optimizer format
      const optimizerParts: Part[] = preparedPieces.map((piece) => ({
        id: piece.id,
        width: piece.width,
        height: piece.height,
        quantity: piece.quantity,
        orientation: piece.orientation || 'rotatable',
        label: piece.label,
        blockId: piece.blockId,
      }))

      // Use the existing BLF optimizer for board placement
      const result = optimizeCuttingBLF(
        optimizerParts,
        cuttingConfig,
        silentLogger,
      )

      // Extract placed pieces from all sheets
      const placedPieces: PlacedPart[] = []
      result.sheets.forEach((sheet) => {
        placedPieces.push(...sheet.placedParts)
      })

      // Find unplaced pieces
      const unplacedPieces = preparedPieces.filter((piece) =>
        result.unplacedParts.some((unplaced) => unplaced.id === piece.id),
      )

      return {
        boardLayout: result,
        isCalculating: false,
        placedPieces,
        unplacedPieces,
        totalBoards: result.totalSheets,
        overallEfficiency: result.overallEfficiency,
      }
    } catch (error) {
      console.error('Board placement failed:', error)
      return {
        boardLayout: null,
        isCalculating: false,
        placedPieces: [],
        unplacedPieces: preparedPieces,
        totalBoards: 0,
        overallEfficiency: 0,
      }
    }
  }, [preparedPieces, cuttingConfig])

  return boardPlacementState
}

/**
 * Helper function to expand composite block pieces back to individual parts
 * for visualization purposes
 */
export const expandPlacedBlockPieces = (
  placedParts: PlacedPart[],
  preparedPieces: PreparedPiece[],
): PlacedPart[] => {
  const expandedParts: PlacedPart[] = []

  placedParts.forEach((placedPart) => {
    // Find the corresponding prepared piece
    const preparedPiece = preparedPieces.find(
      (p) => p.id === placedPart.part.id,
    )

    if (
      preparedPiece &&
      preparedPiece.isBlockComposite &&
      preparedPiece.originalParts
    ) {
      // Expand composite block back to individual parts
      let currentX = placedPart.x
      const baseY = placedPart.y

      preparedPiece.originalParts.forEach((originalPart) => {
        for (let i = 0; i < originalPart.quantity; i++) {
          expandedParts.push({
            part: {
              ...originalPart,
              id: `${originalPart.id}-${i}`,
              quantity: 1,
            },
            x: currentX,
            y: baseY,
            rotation: placedPart.rotation,
          })
          currentX += originalPart.width
        }
      })
    } else {
      // Regular individual piece
      expandedParts.push(placedPart)
    }
  })

  return expandedParts
}

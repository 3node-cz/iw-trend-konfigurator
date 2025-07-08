/**
 * Board Placement Hook
 *
 * This hook takes prepared pieces and places them on boards.
 * Keeps the original placement logic but ensures proper export translation.
 *
 * Architecture Layer: Board Placement State
 * Input: Prepared pieces from Block Preparation
 * Output: Optimized board layout with proper export translation
 */

import { useMemo } from 'react'
import type { PreparedPiece } from './useBlockPreparation'
import type { SheetLayout, PlacedPart, Part } from '../../types/simple'
import {
  optimizeCuttingWithBlocks,
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
      // Convert prepared pieces to optimizer format, preserving blockId and grain direction
      const optimizerParts: Part[] = preparedPieces.map((piece) => ({
        id: piece.id,
        width: piece.width,
        height: piece.height,
        quantity: piece.quantity,
        orientation: piece.orientation || 'rotatable',
        grainDirection: piece.grainDirection, // Preserve grain direction for frame pieces
        label: piece.label,
        blockId: piece.blockId, // Preserve the blockId for block-aware optimization
      }))

      // Use the block-aware optimizer (this handles the placement and visualization correctly)
      const result = optimizeCuttingWithBlocks(
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

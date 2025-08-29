/**
 * Block Preparation Hook
 *
 * This hook takes dimensional parts and prepares them for board placement.
 * It creates individual pieces for both non-blocked and blocked parts.
 * For blocked parts, pieces maintain block grouping information to ensure
 * they are placed together while still being represented as individual pieces
 * for accurate cutting instructions.
 *
 * Architecture Layer: Block Preparation State
 * Input: Dimensional parts with block assignments
 * Output: Individual pieces ready for board placement with block grouping info
 */

import { useMemo } from 'react'
import type { Part } from '../../types/simple'
import type { EnhancedCuttingPart } from './useLayeredCuttingState'
import { calculateFramePieces } from '../../utils/frameCalculations'

export interface PreparedPiece {
  id: string
  width: number
  height: number
  quantity: number
  label?: string
  orientation?: 'fixed' | 'rotatable'
  grainDirection?: 'horizontal' | 'vertical' // Grain direction for frame pieces
  blockId?: number
  woodType?: string // Wood type information - CRITICAL for board grouping
  // Block-specific properties for grouping
  blockPosition?: number // Position within the block (0, 1, 2, ...)
  blockTotalWidth?: number // Total width of the complete block
  blockTotalHeight?: number // Maximum height of the complete block
  originalPartId?: string // Reference to original part before quantity expansion
}

export interface BlockPreparationState {
  preparedPieces: PreparedPiece[]
  blockCount: number
  totalIndividualPieces: number
  blockPieceCount: number
}

/**
 * Hook for preparing parts into individual pieces for board placement
 */
export const useBlockPreparation = (
  enhancedParts: EnhancedCuttingPart[],
): BlockPreparationState => {
  const blockPreparationState = useMemo((): BlockPreparationState => {
    const preparedPieces: PreparedPiece[] = []
    const blockGroups = new Map<number, Part[]>()
    const individualParts: Part[] = []

    // Step 1: Group parts by block ID and process frame pieces
    enhancedParts.forEach((part) => {
      // Check if part is a frame - if so, expand it to frame pieces
      if (part.frame?.enabled) {
        try {
          const framePieces = calculateFramePieces(
            part.width,
            part.height,
            part.frame,
            part.id,
            part.label,
          )

          // Add frame pieces as individual parts (frames don't support blocking)
          framePieces.forEach((framePiece) => {
            for (let i = 0; i < part.quantity; i++) {
              const finalId = `${framePiece.id}-${i}`
              preparedPieces.push({
                id: finalId,
                width: framePiece.width,
                height: framePiece.height,
                quantity: 1,
                label: framePiece.label,
                orientation: framePiece.orientation, // Use the orientation from frame calculation
                grainDirection: framePiece.grainDirection, // Include grain direction
                woodType: part.woodType, // Preserve wood type from original part
                originalPartId: part.id,
              })
            }
          })
        } catch (error) {
          console.error('Error calculating frame pieces:', error)
          // Fall back to treating as regular part
          individualParts.push(part)
        }
      } else {
        // Regular part processing
        if (part.blockId && part.blockId > 0) {
          if (!blockGroups.has(part.blockId)) {
            blockGroups.set(part.blockId, [])
          }
          blockGroups.get(part.blockId)!.push(part)
        } else {
          individualParts.push(part)
        }
      }
    })

    // Step 2: Process individual parts (expand by quantity)
    individualParts.forEach((part) => {
      // Each part becomes individual pieces based on quantity
      for (let i = 0; i < part.quantity; i++) {
        preparedPieces.push({
          id: `${part.id}-${i}`,
          width: part.width,
          height: part.height,
          quantity: 1,
          label: part.label,
          orientation: part.orientation || 'rotatable',
          woodType: part.woodType, // Preserve wood type information
          originalPartId: part.id,
        })
      }
    })

    // Step 3: Process block groups - create individual pieces with block grouping info
    blockGroups.forEach((parts, blockId) => {
      // Calculate block dimensions for reference
      const totalWidth = parts.reduce(
        (sum, part) => sum + part.width * part.quantity,
        0,
      )
      const maxHeight = Math.max(...parts.map((part) => part.height))

      // Expand each part by quantity and create individual pieces
      let blockPosition = 0
      parts.forEach((part) => {
        for (let i = 0; i < part.quantity; i++) {
          preparedPieces.push({
            id: `${part.id}-${i}`,
            width: part.width,
            height: part.height,
            quantity: 1,
            label: part.label,
            orientation: part.orientation || 'rotatable',
            blockId: blockId,
            blockPosition: blockPosition,
            blockTotalWidth: totalWidth,
            blockTotalHeight: maxHeight,
            woodType: part.woodType, // Preserve wood type information for blocks
            originalPartId: part.id,
          })
          blockPosition++
        }
      })
    })

    // Step 4: Calculate statistics
    const blockCount = blockGroups.size
    const totalIndividualPieces = preparedPieces.length
    const blockPieceCount = preparedPieces.filter(
      (piece) => piece.blockId,
    ).length

    return {
      preparedPieces,
      blockCount,
      totalIndividualPieces,
      blockPieceCount,
    }
  }, [enhancedParts])

  return blockPreparationState
}

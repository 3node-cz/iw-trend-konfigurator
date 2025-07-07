/**
 * Block Preparation Hook
 *
 * This hook takes dimensional parts and prepares them for board placement.
 * It creates individual pieces for non-blocked parts and composite block pieces
 * for blocked parts (placed horizontally next to each other).
 *
 * Architecture Layer: Block Preparation State
 * Input: Dimensional parts with block assignments
 * Output: Prepared pieces ready for board placement
 */

import { useMemo } from 'react'
import type { Part } from '../../types/simple'

export interface PreparedPiece {
  id: string
  width: number
  height: number
  quantity: number
  label?: string
  orientation?: 'fixed' | 'rotatable'
  blockId?: number
  // Block-specific properties
  isBlockComposite?: boolean
  originalParts?: Part[] // For composite blocks, track original parts
  blockLayout?: 'horizontal' | 'vertical' // How parts are arranged in the block
}

export interface BlockPreparationState {
  preparedPieces: PreparedPiece[]
  blockCount: number
  individualPieceCount: number
  compositeBlockCount: number
}

/**
 * Hook for preparing parts into blocks for board placement
 */
export const useBlockPreparation = (
  dimensionalParts: Part[],
  boardWidth: number = 2800,
  boardHeight: number = 2070,
): BlockPreparationState => {
  const blockPreparationState = useMemo((): BlockPreparationState => {
    const preparedPieces: PreparedPiece[] = []
    const blockGroups = new Map<number, Part[]>()
    const individualParts: Part[] = []

    // Step 1: Group parts by block ID
    dimensionalParts.forEach((part) => {
      if (part.blockId && part.blockId > 0) {
        if (!blockGroups.has(part.blockId)) {
          blockGroups.set(part.blockId, [])
        }
        blockGroups.get(part.blockId)!.push(part)
      } else {
        individualParts.push(part)
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
          blockId: undefined,
          isBlockComposite: false,
        })
      }
    })

    // Step 3: Process block groups
    blockGroups.forEach((parts, blockId) => {
      // Calculate total dimensions for horizontal arrangement
      const totalWidth = parts.reduce(
        (sum, part) => sum + part.width * part.quantity,
        0,
      )
      const maxHeight = Math.max(...parts.map((part) => part.height))

      // Check if the block fits on a single board
      const canFitOnBoard = totalWidth <= boardWidth && maxHeight <= boardHeight

      if (canFitOnBoard) {
        // Create a single composite block piece
        const blockLabel = `Block ${blockId} (${parts.length} part types)`

        preparedPieces.push({
          id: `block-${blockId}`,
          width: totalWidth,
          height: maxHeight,
          quantity: 1,
          label: blockLabel,
          orientation: 'fixed', // Blocks have fixed orientation to maintain texture
          blockId: blockId,
          isBlockComposite: true,
          originalParts: parts,
          blockLayout: 'horizontal',
        })
      } else {
        // Block is too large, split into sub-blocks
        let currentWidth = 0
        let currentBlockParts: Part[] = []
        let subBlockIndex = 0

        // Expand parts by quantity first
        const expandedParts: Part[] = []
        parts.forEach((part) => {
          for (let i = 0; i < part.quantity; i++) {
            expandedParts.push({
              ...part,
              id: `${part.id}-${i}`,
              quantity: 1,
            })
          }
        })

        // Create sub-blocks
        expandedParts.forEach((part) => {
          if (
            currentWidth + part.width > boardWidth &&
            currentBlockParts.length > 0
          ) {
            // Create current sub-block
            const subBlockWidth = currentBlockParts.reduce(
              (sum, p) => sum + p.width,
              0,
            )
            const subBlockHeight = Math.max(
              ...currentBlockParts.map((p) => p.height),
            )

            preparedPieces.push({
              id: `block-${blockId}-${subBlockIndex}`,
              width: subBlockWidth,
              height: subBlockHeight,
              quantity: 1,
              label: `Block ${blockId} Part ${subBlockIndex + 1}`,
              orientation: 'fixed',
              blockId: blockId,
              isBlockComposite: true,
              originalParts: currentBlockParts,
              blockLayout: 'horizontal',
            })

            // Start new sub-block
            currentBlockParts = [part]
            currentWidth = part.width
            subBlockIndex++
          } else {
            currentBlockParts.push(part)
            currentWidth += part.width
          }
        })

        // Add the last sub-block
        if (currentBlockParts.length > 0) {
          const subBlockWidth = currentBlockParts.reduce(
            (sum, p) => sum + p.width,
            0,
          )
          const subBlockHeight = Math.max(
            ...currentBlockParts.map((p) => p.height),
          )

          preparedPieces.push({
            id: `block-${blockId}-${subBlockIndex}`,
            width: subBlockWidth,
            height: subBlockHeight,
            quantity: 1,
            label: `Block ${blockId} Part ${subBlockIndex + 1}`,
            orientation: 'fixed',
            blockId: blockId,
            isBlockComposite: true,
            originalParts: currentBlockParts,
            blockLayout: 'horizontal',
          })
        }
      }
    })

    // Step 4: Calculate statistics
    const blockCount = blockGroups.size
    const individualPieceCount = individualParts.reduce(
      (sum, part) => sum + part.quantity,
      0,
    )
    const compositeBlockCount = preparedPieces.filter(
      (piece) => piece.isBlockComposite,
    ).length

    return {
      preparedPieces,
      blockCount,
      individualPieceCount,
      compositeBlockCount,
    }
  }, [dimensionalParts, boardWidth, boardHeight])

  return blockPreparationState
}

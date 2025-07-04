import type { Part, PartBlock } from '../types/simple'

/**
 * Block management utilities for grouping parts to maintain wood texture continuity
 */

/**
 * Group parts by their block ID
 */
export const groupPartsByBlock = (parts: Part[]): Map<number, Part[]> => {
  const blockMap = new Map<number, Part[]>()
  const individualParts: Part[] = []

  parts.forEach(part => {
    if (part.blockId && part.blockId > 0) {
      if (!blockMap.has(part.blockId)) {
        blockMap.set(part.blockId, [])
      }
      blockMap.get(part.blockId)!.push(part)
    } else {
      // Individual parts are treated as separate single-part blocks
      individualParts.push(part)
    }
  })

  // Add individual parts as separate blocks with negative IDs to avoid conflicts
  individualParts.forEach((part, index) => {
    blockMap.set(-(index + 1), [part])
  })

  return blockMap
}

/**
 * Calculate dimensions for a block of parts arranged horizontally
 */
export const calculateBlockDimensions = (parts: Part[]): { width: number; height: number } => {
  if (parts.length === 0) {
    return { width: 0, height: 0 }
  }

  // For texture continuity, parts are typically arranged horizontally
  const totalWidth = parts.reduce((sum, part) => sum + part.width, 0)
  const maxHeight = Math.max(...parts.map(part => part.height))

  return { width: totalWidth, height: maxHeight }
}

/**
 * Check if a block can fit on a single board
 */
export const canBlockFitOnBoard = (
  parts: Part[], 
  boardWidth: number, 
  boardHeight: number
): boolean => {
  const { width, height } = calculateBlockDimensions(parts)
  return width <= boardWidth && height <= boardHeight
}

/**
 * Split a block into sub-blocks that can fit on boards
 */
export const splitBlockForBoards = (
  parts: Part[], 
  boardWidth: number, 
  boardHeight: number,
  blockId: number
): PartBlock[] => {
  if (parts.length === 0) return []

  const subBlocks: PartBlock[] = []
  let currentSubBlock: Part[] = []
  let currentWidth = 0

  for (const part of parts) {
    // Check if adding this part would exceed board width
    if (currentWidth + part.width > boardWidth && currentSubBlock.length > 0) {
      // Create a sub-block with current parts
      const { width, height } = calculateBlockDimensions(currentSubBlock)
      subBlocks.push({
        blockId: blockId,
        parts: [...currentSubBlock],
        totalWidth: width,
        totalHeight: height,
        canFitOnSingleBoard: canBlockFitOnBoard(currentSubBlock, boardWidth, boardHeight)
      })
      
      // Start new sub-block
      currentSubBlock = [part]
      currentWidth = part.width
    } else {
      currentSubBlock.push(part)
      currentWidth += part.width
    }
  }

  // Add the last sub-block if it has parts
  if (currentSubBlock.length > 0) {
    const { width, height } = calculateBlockDimensions(currentSubBlock)
    subBlocks.push({
      blockId: blockId,
      parts: currentSubBlock,
      totalWidth: width,
      totalHeight: height,
      canFitOnSingleBoard: canBlockFitOnBoard(currentSubBlock, boardWidth, boardHeight)
    })
  }

  return subBlocks
}

/**
 * Create PartBlock objects from grouped parts
 */
export const createPartBlocks = (
  parts: Part[],
  boardWidth: number,
  boardHeight: number
): PartBlock[] => {
  const groupedParts = groupPartsByBlock(parts)
  const blocks: PartBlock[] = []

  groupedParts.forEach((blockParts, blockId) => {
    const { width, height } = calculateBlockDimensions(blockParts)
    const canFit = canBlockFitOnBoard(blockParts, boardWidth, boardHeight)

    if (canFit || blockParts.length === 1) {
      // Single block
      blocks.push({
        blockId: blockId,
        parts: blockParts,
        totalWidth: width,
        totalHeight: height,
        canFitOnSingleBoard: canFit
      })
    } else {
      // Split into sub-blocks
      const subBlocks = splitBlockForBoards(blockParts, boardWidth, boardHeight, blockId)
      blocks.push({
        blockId: blockId,
        parts: blockParts,
        totalWidth: width,
        totalHeight: height,
        canFitOnSingleBoard: false,
        subBlocks: subBlocks
      })
    }
  })

  return blocks
}

/**
 * Get available block numbers based on existing parts
 */
export const getAvailableBlockNumbers = (parts: Part[]): number[] => {
  const existingBlocks = new Set<number>()
  
  parts.forEach(part => {
    if (part.blockId && part.blockId > 0) {
      existingBlocks.add(part.blockId)
    }
  })

  // Always provide at least 5 block options, plus any additional ones needed
  const maxBlock = existingBlocks.size > 0 ? Math.max(...existingBlocks) : 0
  const maxOptions = Math.max(5, maxBlock + 3)
  const availableNumbers: number[] = []
  
  for (let i = 1; i <= maxOptions; i++) {
    availableNumbers.push(i)
  }
  
  return availableNumbers
}

/**
 * Update part block assignment
 */
export const updatePartBlock = (part: Part, blockId: number | undefined): Part => {
  return {
    ...part,
    blockId: blockId
  }
}

/**
 * Get block summary for display
 */
export const getBlockSummary = (parts: Part[]): { blockCount: number; individualCount: number } => {
  const blocks = new Set<number>()
  let individualCount = 0

  parts.forEach(part => {
    if (part.blockId && part.blockId > 0) {
      blocks.add(part.blockId)
    } else {
      individualCount++
    }
  })

  return {
    blockCount: blocks.size,
    individualCount
  }
}

import type { Part } from '../types/simple'
import { SHEET_CONSTRAINTS } from './appConstants'

/**
 * Consolidated block validation utilities
 * Merged from blockValidation.ts and blockValidationUtils.ts
 */

/**
 * Validate block width against board constraints
 */
export const validateBlockWidth = (
  parts: Part[],
  blockId: number,
): string | null => {
  const blockParts = parts.filter((part) => part.blockId === blockId)
  if (blockParts.length === 0) return null

  // Calculate total width including all quantities (each part width * quantity)
  const totalWidth = blockParts.reduce(
    (sum, part) => sum + part.width * part.quantity,
    0,
  )

  if (totalWidth > SHEET_CONSTRAINTS.standardWidth) {
    return `Blok ${blockId} je príliš široký (${totalWidth}mm > ${SHEET_CONSTRAINTS.standardWidth}mm)`
  }

  return null
}

/**
 * Validate all blocks in the parts list
 */
export const validateAllBlocks = (parts: Part[]): string[] => {
  const errors: string[] = []
  const blockIds = [
    ...new Set(parts.map((part) => part.blockId).filter(Boolean)),
  ]

  blockIds.forEach((blockId) => {
    const error = validateBlockWidth(parts, blockId!)
    if (error) {
      errors.push(error)
    }
  })

  return errors
}

/**
 * Check if there are any block validation errors
 * @param parts - Array of parts to validate
 * @returns boolean indicating if there are validation errors
 */
export const hasBlockValidationErrors = (parts: Part[]): boolean => {
  const blockGroups = groupPartsByBlock(parts)

  // Check each block for width validation errors
  for (const [, blockParts] of blockGroups.entries()) {
    const totalWidth = calculateBlockWidth(blockParts)
    if (totalWidth > SHEET_CONSTRAINTS.standardWidth) {
      return true
    }
  }

  return false
}

/**
 * Group parts by their block ID
 * @param parts - Array of parts to group
 * @returns Map of block ID to array of parts
 */
export const groupPartsByBlock = (parts: Part[]): Map<number, Part[]> => {
  const blockGroups = new Map<number, Part[]>()

  parts.forEach((part) => {
    if (part.blockId && part.blockId > 0) {
      if (!blockGroups.has(part.blockId)) {
        blockGroups.set(part.blockId, [])
      }
      blockGroups.get(part.blockId)!.push(part)
    }
  })

  return blockGroups
}

/**
 * Calculate total width of parts in a block
 * @param blockParts - Array of parts in the block
 * @returns Total width including quantities
 */
export const calculateBlockWidth = (blockParts: Part[]): number => {
  return blockParts.reduce((sum, part) => sum + part.width * part.quantity, 0)
}

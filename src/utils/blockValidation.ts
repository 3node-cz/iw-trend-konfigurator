import type { Part } from '../types/simple'
import { SHEET_CONSTRAINTS } from './appConstants'

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

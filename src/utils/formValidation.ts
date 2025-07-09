/**
 * Form validation utilities for part configuration
 */

import { PART_CONSTRAINTS, SHEET_CONSTRAINTS } from './appConstants'

export interface PartFormData {
  width: number
  height: number
  quantity: number
  label?: string
  rotatable?: boolean
  blockId?: number
  woodType?: string
}

/**
 * Generate validation rules for width field
 */
export const getWidthValidationRules = (
  boardWidth: number = SHEET_CONSTRAINTS.standardWidth,
) => ({
  required: 'Šírka je povinná',
  min: {
    value: PART_CONSTRAINTS.minWidth,
    message: `Min ${PART_CONSTRAINTS.minWidth}mm`,
  },
  max: {
    value: Math.min(PART_CONSTRAINTS.maxWidth, boardWidth),
    message: `Max ${Math.min(
      PART_CONSTRAINTS.maxWidth,
      boardWidth,
    )}mm (veľkosť dosky)`,
  },
})

/**
 * Generate validation rules for height field
 */
export const getHeightValidationRules = (
  boardHeight: number = SHEET_CONSTRAINTS.standardHeight,
) => ({
  required: 'Výška je povinná',
  min: {
    value: PART_CONSTRAINTS.minHeight,
    message: `Min ${PART_CONSTRAINTS.minHeight}mm`,
  },
  max: {
    value: Math.min(PART_CONSTRAINTS.maxHeight, boardHeight),
    message: `Max ${Math.min(
      PART_CONSTRAINTS.maxHeight,
      boardHeight,
    )}mm (veľkosť dosky)`,
  },
})

/**
 * Generate validation rules for quantity field
 */
export const getQuantityValidationRules = () => ({
  required: 'Počet je povinný',
  min: {
    value: PART_CONSTRAINTS.minQuantity,
    message: `Min ${PART_CONSTRAINTS.minQuantity}`,
  },
  max: {
    value: PART_CONSTRAINTS.maxQuantity,
    message: `Max ${PART_CONSTRAINTS.maxQuantity}`,
  },
})

/**
 * Transform form data to part data
 */
export const transformFormDataToPart = (
  data: PartFormData,
): Omit<import('../types/simple').Part, 'id'> => ({
  width: Number(data.width),
  height: Number(data.height),
  quantity: Number(data.quantity),
  label: data.label || undefined,
  orientation: data.rotatable ? 'rotatable' : 'fixed',
  blockId: data.blockId || undefined,
  woodType: data.woodType || undefined,
})

/**
 * Validate part dimensions against constraints
 */
export const validatePartDimensions = (
  width: number,
  height: number,
): string[] => {
  const errors: string[] = []

  if (width < PART_CONSTRAINTS.minWidth || width > PART_CONSTRAINTS.maxWidth) {
    errors.push(
      `Šírka musí byť medzi ${PART_CONSTRAINTS.minWidth}-${PART_CONSTRAINTS.maxWidth}mm`,
    )
  }

  if (
    height < PART_CONSTRAINTS.minHeight ||
    height > PART_CONSTRAINTS.maxHeight
  ) {
    errors.push(
      `Výška musí byť medzi ${PART_CONSTRAINTS.minHeight}-${PART_CONSTRAINTS.maxHeight}mm`,
    )
  }

  return errors
}

/**
 * Validate part quantity against constraints
 */
export const validatePartQuantity = (quantity: number): string[] => {
  const errors: string[] = []

  if (
    quantity < PART_CONSTRAINTS.minQuantity ||
    quantity > PART_CONSTRAINTS.maxQuantity
  ) {
    errors.push(
      `Počet kusov musí byť medzi ${PART_CONSTRAINTS.minQuantity}-${PART_CONSTRAINTS.maxQuantity}`,
    )
  }

  return errors
}

/**
 * Validate block width against board constraints
 */
export const validateBlockWidth = (
  blockParts: Array<{ width: number; quantity: number }>,
  boardWidth: number = SHEET_CONSTRAINTS.standardWidth,
): { isValid: boolean; totalWidth: number; errorMessage?: string } => {
  const totalWidth = blockParts.reduce(
    (sum, part) => sum + part.width * part.quantity,
    0,
  )

  if (totalWidth > boardWidth) {
    return {
      isValid: false,
      totalWidth,
      errorMessage: `Blok je príliš široký (${totalWidth}mm). Maximálna šírka dosky je ${boardWidth}mm.`,
    }
  }

  return {
    isValid: true,
    totalWidth,
  }
}

/**
 * Get block validation error message for a specific block
 */
export const getBlockValidationError = (
  parts: Array<{
    width: number
    height: number
    quantity: number
    blockId?: number
  }>,
  blockId: number,
  boardWidth: number = SHEET_CONSTRAINTS.standardWidth,
): string | null => {
  const blockParts = parts.filter((part) => part.blockId === blockId)

  if (blockParts.length === 0) return null

  const validation = validateBlockWidth(blockParts, boardWidth)

  return validation.isValid ? null : validation.errorMessage || null
}

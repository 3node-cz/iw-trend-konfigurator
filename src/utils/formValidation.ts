/**
 * Form validation utilities for part configuration
 */

import { PART_CONSTRAINTS } from './appConstants'

export interface PartFormData {
  width: number
  height: number
  quantity: number
  label?: string
}

/**
 * Generate validation rules for width field
 */
export const getWidthValidationRules = () => ({
  required: 'Šírka je povinná',
  min: {
    value: PART_CONSTRAINTS.minWidth,
    message: `Min ${PART_CONSTRAINTS.minWidth}mm`,
  },
  max: {
    value: PART_CONSTRAINTS.maxWidth,
    message: `Max ${PART_CONSTRAINTS.maxWidth}mm`,
  },
})

/**
 * Generate validation rules for height field
 */
export const getHeightValidationRules = () => ({
  required: 'Výška je povinná',
  min: {
    value: PART_CONSTRAINTS.minHeight,
    message: `Min ${PART_CONSTRAINTS.minHeight}mm`,
  },
  max: {
    value: PART_CONSTRAINTS.maxHeight,
    message: `Max ${PART_CONSTRAINTS.maxHeight}mm`,
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
  width: data.width,
  height: data.height,
  quantity: data.quantity,
  label: data.label || undefined,
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

/**
 * L-Shape validation utilities
 */

import type { LShapeConfig } from '../types/simple'

/**
 * Validation constraints for L-Shape configuration
 */
export interface LShapeValidationConstraints {
  minLeftWidth: number
  maxLeftWidth: number
  minTopHeight: number
  maxTopHeight: number
  minCutWidth: number
  maxCutWidth: number
  minCutHeight: number
  maxCutHeight: number
  maxWidth: number
  minWidth: number
}

/**
 * Get validation constraints for L-Shape based on part dimensions
 * @param partWidth - Total part width
 * @param partHeight - Total part height
 * @returns Validation constraints
 */
export const getLShapeValidationConstraints = (
  partWidth: number,
  partHeight: number,
): LShapeValidationConstraints => ({
  minLeftWidth: 10,
  maxLeftWidth: partWidth - 10,
  minTopHeight: 10,
  maxTopHeight: partHeight - 10,
  minCutWidth: 10,
  maxCutWidth: partWidth - 10,
  minCutHeight: 10,
  maxCutHeight: partHeight - 10,
  maxWidth: partWidth,
  minWidth: 10,
})

/**
 * Get L-Shape constraints (alias for getLShapeValidationConstraints)
 * @param partWidth - Total part width
 * @param partHeight - Total part height
 * @returns Validation constraints
 */
export const getLShapeConstraints = getLShapeValidationConstraints

/**
 * Create L-Shape update handlers
 * @param onUpdate - Update callback function
 * @returns Object with update handlers
 */
export const createLShapeUpdateHandlers = (
  onUpdate: (updates: Partial<LShapeConfig>) => void,
) => {
  return {
    updateLeftWidth: (leftWidth: number) => {
      onUpdate({ leftWidth })
    },
    updateRightWidth: (rightWidth: number) => {
      onUpdate({ rightWidth })
    },
    updateEnabled: (enabled: boolean) => {
      onUpdate({ enabled })
    },
    updateRadius: (radiusType: string, value: number) => {
      onUpdate({ [radiusType]: value })
    },
    handleLeftWidthChange: (value: string) => {
      const leftWidth = parseInt(value, 10)
      if (!isNaN(leftWidth)) {
        onUpdate({ leftWidth })
      }
    },
    handleRightWidthChange: (value: string) => {
      const rightWidth = parseInt(value, 10)
      if (!isNaN(rightWidth)) {
        onUpdate({ rightWidth })
      }
    },
    handleBottomLeftRadiusChange: (value: string) => {
      const radius = parseInt(value, 10)
      if (!isNaN(radius)) {
        onUpdate({ bottomLeftRadius: radius })
      }
    },
    handleTopLeftCutoutRadiusChange: (value: string) => {
      const radius = parseInt(value, 10)
      if (!isNaN(radius)) {
        onUpdate({ topLeftCutoutRadius: radius })
      }
    },
    handleInnerCutoutRadiusChange: (value: string) => {
      const radius = parseInt(value, 10)
      if (!isNaN(radius)) {
        onUpdate({ innerCutoutRadius: radius })
      }
    },
    handleRightBottomCutoutRadiusChange: (value: string) => {
      const radius = parseInt(value, 10)
      if (!isNaN(radius)) {
        onUpdate({ rightBottomCutoutRadius: radius })
      }
    },
  }
}

/**
 * Validate L-Shape configuration
 * @param lShape - L-Shape configuration to validate
 * @param constraints - Validation constraints
 * @returns Validation result with error messages
 */
export const validateLShapeConfig = (
  lShape: LShapeConfig,
  constraints: LShapeValidationConstraints,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!lShape.enabled) {
    return { isValid: true, errors: [] }
  }

  if (lShape.leftWidth !== undefined) {
    if (lShape.leftWidth < constraints.minLeftWidth) {
      errors.push(`Ľavá šírka musí byť aspoň ${constraints.minLeftWidth}mm`)
    }
    if (lShape.leftWidth > constraints.maxLeftWidth) {
      errors.push(`Ľavá šírka nesmie presiahnuť ${constraints.maxLeftWidth}mm`)
    }
  }

  if (lShape.rightWidth !== undefined) {
    if (lShape.rightWidth < constraints.minCutWidth) {
      errors.push(`Pravá šírka musí byť aspoň ${constraints.minCutWidth}mm`)
    }
    if (lShape.rightWidth > constraints.maxCutWidth) {
      errors.push(`Pravá šírka nesmie presiahnuť ${constraints.maxCutWidth}mm`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

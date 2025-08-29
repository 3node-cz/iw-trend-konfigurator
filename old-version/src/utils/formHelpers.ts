/**
 * Form utilities and validation logic extracted from components
 * Centralized form handling, validation, and data transformation
 */

import { APP_CONFIG } from '../config/appConfig'
import type { EnhancedCuttingPart } from '../hooks/three-layer/useLayeredCuttingState'

// ===============================================
// FORM DATA TRANSFORMATION
// ===============================================

export interface PartFormData {
  width: number
  height: number
  quantity: number
  label?: string
}

/**
 * Transform form data to part object with proper defaults and validation
 */
export const transformFormDataToPart = (formData: PartFormData) => {
  return {
    width: Math.max(formData.width || 0, APP_CONFIG.parts.constraints.minWidth),
    height: Math.max(
      formData.height || 0,
      APP_CONFIG.parts.constraints.minHeight,
    ),
    quantity: Math.max(
      Math.min(
        formData.quantity || APP_CONFIG.parts.defaults.quantity,
        APP_CONFIG.parts.constraints.maxQuantity,
      ),
      APP_CONFIG.parts.constraints.minQuantity,
    ),
    label: formData.label?.trim() || undefined,
    orientation: APP_CONFIG.parts.defaults.orientation,
  }
}

/**
 * Validate part dimensions and constraints
 */
export const validatePartData = (data: Partial<PartFormData>) => {
  const errors: Record<string, string> = {}

  // Width validation
  if (data.width !== undefined) {
    if (data.width < APP_CONFIG.parts.constraints.minWidth) {
      errors.width = `Šírka musí byť minimálne ${APP_CONFIG.parts.constraints.minWidth}mm`
    }
    if (data.width > APP_CONFIG.parts.constraints.maxWidth) {
      errors.width = `Šírka nemôže byť viac ako ${APP_CONFIG.parts.constraints.maxWidth}mm`
    }
  }

  // Height validation
  if (data.height !== undefined) {
    if (data.height < APP_CONFIG.parts.constraints.minHeight) {
      errors.height = `Výška musí byť minimálne ${APP_CONFIG.parts.constraints.minHeight}mm`
    }
    if (data.height > APP_CONFIG.parts.constraints.maxHeight) {
      errors.height = `Výška nemôže byť viac ako ${APP_CONFIG.parts.constraints.maxHeight}mm`
    }
  }

  // Quantity validation
  if (data.quantity !== undefined) {
    if (data.quantity < APP_CONFIG.parts.constraints.minQuantity) {
      errors.quantity = `Počet kusov musí byť minimálne ${APP_CONFIG.parts.constraints.minQuantity}`
    }
    if (data.quantity > APP_CONFIG.parts.constraints.maxQuantity) {
      errors.quantity = `Počet kusov nemôže byť viac ako ${APP_CONFIG.parts.constraints.maxQuantity}`
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// ===============================================
// BOARD CONFIGURATION UTILITIES
// ===============================================

/**
 * Get available board presets
 */
export const getAvailableBoardPresets = () => {
  return APP_CONFIG.material.standardBoards.map((board) => ({
    ...board,
    displayName: `${board.name} (${board.width}×${board.height}mm)`,
  }))
}

/**
 * Get default board configuration
 */
export const getDefaultBoardConfig = () => {
  const defaultBoard =
    APP_CONFIG.material.standardBoards.find(
      (b): b is typeof b & { isDefault: true } =>
        'isDefault' in b && b.isDefault,
    ) || APP_CONFIG.material.standardBoards[0]

  return {
    width: defaultBoard.width,
    height: defaultBoard.height,
    name: defaultBoard.name,
  }
}

/**
 * Validate board dimensions
 */
export const validateBoardDimensions = (width: number, height: number) => {
  const errors: string[] = []

  if (width < APP_CONFIG.material.boardConstraints.minWidth) {
    errors.push(
      `Šírka dosky musí byť minimálne ${APP_CONFIG.material.boardConstraints.minWidth}mm`,
    )
  }
  if (width > APP_CONFIG.material.boardConstraints.maxWidth) {
    errors.push(
      `Šírka dosky nemôže byť viac ako ${APP_CONFIG.material.boardConstraints.maxWidth}mm`,
    )
  }
  if (height < APP_CONFIG.material.boardConstraints.minHeight) {
    errors.push(
      `Výška dosky musí byť minimálne ${APP_CONFIG.material.boardConstraints.minHeight}mm`,
    )
  }
  if (height > APP_CONFIG.material.boardConstraints.maxHeight) {
    errors.push(
      `Výška dosky nemôže byť viac ako ${APP_CONFIG.material.boardConstraints.maxHeight}mm`,
    )
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// ===============================================
// BLOCK MANAGEMENT UTILITIES
// ===============================================

/**
 * Get available block numbers for assignment
 */
export const getAvailableBlockNumbers = (): number[] => {
  const maxBlocks = APP_CONFIG.optimization.blocking.maxBlocksPerSheet
  const availableBlocks: number[] = []

  for (let i = 1; i <= maxBlocks; i++) {
    availableBlocks.push(i)
  }

  return availableBlocks
}

/**
 * Check if a part can be added to a specific block
 */
export const canAddToBlock = (
  partId: string,
  blockId: number,
  enhancedParts: EnhancedCuttingPart[],
): { canAdd: boolean; reason?: string } => {
  if (!APP_CONFIG.features.enableBlocking) {
    return { canAdd: false, reason: 'Bloky sú vypnuté' }
  }

  const part = enhancedParts.find((p) => p.id === partId)
  if (!part) {
    return { canAdd: false, reason: 'Dielec nebol nájdený' }
  }

  // Check if part is already in the same block
  if (part.blockId === blockId) {
    return { canAdd: false, reason: 'Dielec je už v tomto bloku' }
  }

  // Check if frame is enabled (frames cannot be blocked)
  if (part.frame?.enabled) {
    return { canAdd: false, reason: 'Dielce s rámom nemôžu byť zoskupené' }
  }

  const partsInBlock = enhancedParts.filter((p) => p.blockId === blockId)
  const maxPartsPerBlock = 10 // Could be made configurable

  if (partsInBlock.length >= maxPartsPerBlock) {
    return {
      canAdd: false,
      reason: `Blok môže obsahovať maximálne ${maxPartsPerBlock} dielcov`,
    }
  }

  return { canAdd: true }
}

// ===============================================
// PART CONFIGURATION VALIDATION
// ===============================================

/**
 * Check if L-Shape configuration is valid
 */
export const validateLShapeConfig = (
  partWidth: number,
  partHeight: number,
  cutoutWidth: number,
  cutoutHeight: number,
) => {
  const errors: string[] = []

  const maxCutoutWidth = partWidth * APP_CONFIG.parts.lShape.maxCutoutRatio
  const maxCutoutHeight = partHeight * APP_CONFIG.parts.lShape.maxCutoutRatio

  if (cutoutWidth < APP_CONFIG.parts.lShape.minCutout) {
    errors.push(
      `Šírka výrezu musí byť minimálne ${APP_CONFIG.parts.lShape.minCutout}mm`,
    )
  }
  if (cutoutWidth >= maxCutoutWidth) {
    errors.push(
      `Šírka výrezu nemôže byť viac ako ${Math.floor(maxCutoutWidth)}mm`,
    )
  }
  if (cutoutHeight < APP_CONFIG.parts.lShape.minCutout) {
    errors.push(
      `Výška výrezu musí byť minimálne ${APP_CONFIG.parts.lShape.minCutout}mm`,
    )
  }
  if (cutoutHeight >= maxCutoutHeight) {
    errors.push(
      `Výška výrezu nemôže byť viac ako ${Math.floor(maxCutoutHeight)}mm`,
    )
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Check if Frame configuration is valid
 */
export const validateFrameConfig = (
  partWidth: number,
  partHeight: number,
  frameWidth: number,
) => {
  const errors: string[] = []

  const maxFrameWidth = Math.min(partWidth, partHeight) / 3 // Frame can't be more than 1/3 of smallest dimension

  if (frameWidth < APP_CONFIG.parts.frame.minFrameWidth) {
    errors.push(
      `Šírka rámu musí byť minimálne ${APP_CONFIG.parts.frame.minFrameWidth}mm`,
    )
  }
  if (frameWidth > APP_CONFIG.parts.frame.maxFrameWidth) {
    errors.push(
      `Šírka rámu nemôže byť viac ako ${APP_CONFIG.parts.frame.maxFrameWidth}mm`,
    )
  }
  if (frameWidth >= maxFrameWidth) {
    errors.push(
      `Šírka rámu nemôže byť viac ako ${Math.floor(
        maxFrameWidth,
      )}mm pre tento dielec`,
    )
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Check if Corner configuration is valid
 */
export const validateCornerConfig = (radius: number) => {
  const errors: string[] = []

  if (radius < APP_CONFIG.parts.corner.minRadius) {
    errors.push(
      `Polomer rohu musí byť minimálne ${APP_CONFIG.parts.corner.minRadius}mm`,
    )
  }
  if (radius > APP_CONFIG.parts.corner.maxRadius) {
    errors.push(
      `Polomer rohu nemôže byť viac ako ${APP_CONFIG.parts.corner.maxRadius}mm`,
    )
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// ===============================================
// FORM FIELD UTILITIES
// ===============================================

/**
 * Generate form field configuration with validation
 */
export const getFormFieldConfig = () => {
  return {
    width: {
      min: APP_CONFIG.parts.constraints.minWidth,
      max: APP_CONFIG.parts.constraints.maxWidth,
      step: 1,
      placeholder: 'Šírka v mm',
    },
    height: {
      min: APP_CONFIG.parts.constraints.minHeight,
      max: APP_CONFIG.parts.constraints.maxHeight,
      step: 1,
      placeholder: 'Výška v mm',
    },
    quantity: {
      min: APP_CONFIG.parts.constraints.minQuantity,
      max: APP_CONFIG.parts.constraints.maxQuantity,
      step: 1,
      placeholder: 'Počet kusov',
    },
    frameWidth: {
      min: APP_CONFIG.parts.frame.minFrameWidth,
      max: APP_CONFIG.parts.frame.maxFrameWidth,
      step: 1,
      placeholder: 'Šírka rámu v mm',
    },
    cornerRadius: {
      min: APP_CONFIG.parts.corner.minRadius,
      max: APP_CONFIG.parts.corner.maxRadius,
      step: 0.5,
      placeholder: 'Polomer v mm',
    },
  }
}

/**
 * Get debounce delay for form fields
 */
export const getFormDebounceDelay = () => {
  return APP_CONFIG.ui.form.debounceMs
}

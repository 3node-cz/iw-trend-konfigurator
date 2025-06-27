import type { LShapeConfig, Part } from '../types/simple'
import {
  validateLShapeRadius as validateRadius,
  getLShapeRadiusConstraints,
} from './lShapeRadiusCalculations'

export interface LShapeValidationConstraints {
  minValue: number
  maxWidth: number
  radiusConstraints: {
    bottomLeft: number
    topLeftCutout: number
    innerCutout: number
    rightBottomCutout: number
  }
}

export const getLShapeConstraints = (
  partWidth: number,
  part: Part,
  lShape: LShapeConfig,
): LShapeValidationConstraints => ({
  minValue: 0,
  maxWidth: partWidth - 10,
  radiusConstraints: getLShapeRadiusConstraints(part, lShape),
})

export const validateLShapeWidthValue = (
  value: number,
  constraints: LShapeValidationConstraints,
): number => {
  return Math.min(
    Math.max(constraints.minValue, value || 0),
    constraints.maxWidth,
  )
}

export const validateLShapeRadiusValue = (
  part: Part,
  lShape: LShapeConfig,
  corner: 'bottomLeft' | 'topLeftCutout' | 'innerCutout' | 'rightBottomCutout',
  value: number,
): number => {
  return validateRadius(part, lShape, corner, value)
}

export const createLShapeUpdateHandlers = (
  part: Part,
  lShape: LShapeConfig | undefined,
  onUpdate: (updates: Partial<LShapeConfig>) => void,
  constraints: LShapeValidationConstraints,
  createDefault: () => LShapeConfig,
) => {
  const currentLShape = lShape || { enabled: false }

  const handleToggle = (enabled: boolean) => {
    if (enabled) {
      const defaultLShape = createDefault()
      onUpdate(defaultLShape)
    } else {
      onUpdate({ enabled: false })
    }
  }

  const handleLeftWidthChange = (value: string) => {
    const validatedValue = validateLShapeWidthValue(Number(value), constraints)
    onUpdate({ leftWidth: validatedValue })
  }

  const handleRightWidthChange = (value: string) => {
    const validatedValue = validateLShapeWidthValue(Number(value), constraints)
    onUpdate({ rightWidth: validatedValue })
  }

  const handleBottomLeftRadiusChange = (value: string) => {
    const validatedValue = validateLShapeRadiusValue(
      part,
      currentLShape,
      'bottomLeft',
      Number(value),
    )
    onUpdate({ bottomLeftRadius: validatedValue })
  }

  const handleTopLeftCutoutRadiusChange = (value: string) => {
    const validatedValue = validateLShapeRadiusValue(
      part,
      currentLShape,
      'topLeftCutout',
      Number(value),
    )
    onUpdate({ topLeftCutoutRadius: validatedValue })
  }

  const handleInnerCutoutRadiusChange = (value: string) => {
    const validatedValue = validateLShapeRadiusValue(
      part,
      currentLShape,
      'innerCutout',
      Number(value),
    )
    onUpdate({ innerCutoutRadius: validatedValue })
  }

  const handleRightBottomCutoutRadiusChange = (value: string) => {
    const validatedValue = validateLShapeRadiusValue(
      part,
      currentLShape,
      'rightBottomCutout',
      Number(value),
    )
    onUpdate({ rightBottomCutoutRadius: validatedValue })
  }

  return {
    handleToggle,
    handleLeftWidthChange,
    handleRightWidthChange,
    handleBottomLeftRadiusChange,
    handleTopLeftCutoutRadiusChange,
    handleInnerCutoutRadiusChange,
    handleRightBottomCutoutRadiusChange,
  }
}

/**
 * Common validation utilities for form inputs and constraints
 */

export interface ValidationConstraints {
  min?: number
  max?: number
  step?: number
  required?: boolean
}

export interface ValidationResult {
  value: number
  isValid: boolean
  error?: string
}

/**
 * Validates a numeric input against constraints
 */
export const validateNumericInput = (
  input: string | number,
  constraints: ValidationConstraints = {},
): ValidationResult => {
  const { min = 0, max = Infinity, required = false } = constraints

  const value = typeof input === 'string' ? Number(input) : input

  if (required && (isNaN(value) || value === null || value === undefined)) {
    return { value: 0, isValid: false, error: 'This field is required' }
  }

  if (isNaN(value)) {
    return { value: 0, isValid: false, error: 'Please enter a valid number' }
  }

  if (value < min) {
    return { value: min, isValid: false, error: `Minimum value is ${min}` }
  }

  if (value > max) {
    return { value: max, isValid: false, error: `Maximum value is ${max}` }
  }

  return { value, isValid: true }
}

/**
 * Creates a safe numeric input handler with validation
 */
export const createNumericInputHandler = (
  onValidValue: (value: number) => void,
  constraints: ValidationConstraints = {},
  onError?: (error: string) => void,
) => {
  return (inputValue: string) => {
    const result = validateNumericInput(inputValue, constraints)

    if (result.isValid) {
      onValidValue(result.value)
    } else {
      onValidValue(result.value) // Still update with constrained value
      if (onError && result.error) {
        onError(result.error)
      }
    }
  }
}

/**
 * Clamps a value between min and max
 */
export const clampValue = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

/**
 * Formats a number with proper precision
 */
export const formatNumber = (value: number, precision: number = 0): string => {
  return value.toFixed(precision)
}

/**
 * Common dimension validation constraints
 */
export const DIMENSION_CONSTRAINTS = {
  width: { min: 10, max: 3000, required: true },
  height: { min: 10, max: 3000, required: true },
  thickness: { min: 1, max: 100, required: true },
  quantity: { min: 1, max: 1000, required: true },
  radius: { min: 0, max: 100 },
} as const

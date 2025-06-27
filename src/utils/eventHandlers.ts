/**
 * Common event handlers and UI utilities
 */

import { createNumericInputHandler } from './validationUtils'
import type { ValidationConstraints } from './validationUtils'

/**
 * Creates a change handler for numeric inputs
 */
export const createNumericChangeHandler = (
  onChange: (value: number) => void,
  constraints?: ValidationConstraints
) => {
  return createNumericInputHandler(onChange, constraints)
}

/**
 * Creates a change handler that updates a specific field of an object
 */
export const createFieldUpdateHandler = <T>(
  onUpdate: (updates: Partial<T>) => void,
  field: keyof T,
  constraints?: ValidationConstraints
) => {
  return (value: string) => {
    const numericHandler = createNumericInputHandler(
      (validValue) => onUpdate({ [field]: validValue } as Partial<T>),
      constraints
    )
    numericHandler(value)
  }
}

/**
 * Creates a toggle handler for boolean fields
 */
export const createToggleHandler = <T>(
  onUpdate: (updates: Partial<T>) => void,
  field: keyof T
) => {
  return (checked: boolean) => {
    onUpdate({ [field]: checked } as Partial<T>)
  }
}

/**
 * Prevents form submission on Enter key
 */
export const preventFormSubmission = (event: React.KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
  }
}

/**
 * Creates a debounced handler
 */
export const createDebouncedHandler = <T extends unknown[]>(
  handler: (...args: T) => void,
  delay: number = 300
) => {
  let timeoutId: NodeJS.Timeout
  
  return (...args: T) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => handler(...args), delay)
  }
}

/**
 * Common input event handlers
 */
export const InputHandlers = {
  /**
   * Handler for numeric inputs that prevents invalid characters
   */
  numericOnly: (event: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End'
    ]
    
    const isNumber = /[0-9]/.test(event.key)
    const isDecimal = event.key === '.' && !event.currentTarget.value.includes('.')
    
    if (!allowedKeys.includes(event.key) && !isNumber && !isDecimal) {
      event.preventDefault()
    }
  },

  /**
   * Handler for positive integers only
   */
  positiveIntegerOnly: (event: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End'
    ]
    
    const isNumber = /[0-9]/.test(event.key)
    
    if (!allowedKeys.includes(event.key) && !isNumber) {
      event.preventDefault()
    }
  }
}

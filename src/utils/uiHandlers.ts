/**
 * Utility functions for handling UI interactions and component state
 */

/**
 * Create handlers for tabbed editor functionality
 */
export function createTabHandler(setActiveTab: (tab: string) => void) {
  return (tab: string) => {
    setActiveTab(tab);
  };
}

/**
 * Handle input value changes with type safety
 */
export function createInputChangeHandler<T>(
  setValue: (value: T) => void,
  transformer?: (value: string) => T
) {
  return (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = event.target.value;
    const transformedValue = transformer ? transformer(value) : (value as unknown as T);
    setValue(transformedValue);
  };
}

/**
 * Handle numeric input changes with validation
 */
export function createNumericInputHandler(
  setValue: (value: number) => void,
  min?: number,
  max?: number
) {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(event.target.value);
    if (!isNaN(numValue)) {
      let clampedValue = numValue;
      if (min !== undefined) clampedValue = Math.max(min, clampedValue);
      if (max !== undefined) clampedValue = Math.min(max, clampedValue);
      setValue(clampedValue);
    }
  };
}

/**
 * Create validation handlers for form inputs
 */
export function createValidationHandler<T>(
  validator: (value: T) => boolean,
  onValid?: () => void,
  onInvalid?: () => void
) {
  return (value: T) => {
    const isValid = validator(value);
    if (isValid && onValid) onValid();
    if (!isValid && onInvalid) onInvalid();
    return isValid;
  };
}

/**
 * Debounce function for reducing excessive function calls
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

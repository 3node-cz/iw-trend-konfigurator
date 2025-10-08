/**
 * Shared utilities for handling availability status display
 */

export type AvailabilityStatus = 'available' | 'unavailable' | 'limited'

/**
 * Maps availability status to MUI color variants
 */
export const getAvailabilityColor = (availability: string): 'success' | 'error' | 'warning' | 'default' => {
  switch (availability) {
    case 'available':
      return 'success'
    case 'unavailable':
      return 'error'
    case 'limited':
      return 'warning'
    default:
      return 'default'
  }
}

/**
 * Maps availability status to localized Slovak text
 */
export const getAvailabilityText = (availability: string): string => {
  switch (availability) {
    case 'available':
      return 'Skladom'
    case 'unavailable':
      return 'Na objednávku'
    case 'limited':
      return 'Obmedzené'
    default:
      return availability
  }
}
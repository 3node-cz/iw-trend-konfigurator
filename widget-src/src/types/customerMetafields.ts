import type { OrderFormData } from '../schemas/orderSchema'
import type { CuttingSpecification } from './shopify'
import type { SavedConfiguration, SavedCuttingSpecification, AppView } from './optimized-saved-config'
import type { MaterialSearchResult } from './shopify'
import { createMinimalSavedConfig } from '../utils/data-transformation'
import { PRICING } from '../constants'

// Re-export optimized types for backward compatibility
export type { SavedConfiguration } from './optimized-saved-config'

/**
 * Root structure for customer metafield containing saved configurations
 */
export interface CustomerSavedConfigurations {
  version: string
  savedConfigurations: SavedConfiguration[]
  lastUpdated: string // ISO date string
}

/**
 * Helper function to create a new saved configuration (using optimized format)
 */
export const createSavedConfiguration = (
  name: string,
  orderInfo: OrderFormData,
  materials: MaterialSearchResult[],
  specifications: CuttingSpecification[],
  savedFromStep: AppView = 'recapitulation'
): SavedConfiguration => {
  // Use DRY utility from data-transformation
  return createMinimalSavedConfig(name, orderInfo, materials, specifications, savedFromStep)
}

/**
 * Helper function to parse customer metafield JSON
 */
export const parseCustomerConfigurations = (metafieldValue: string | null): CustomerSavedConfigurations => {
  if (!metafieldValue) {
    return {
      version: '1.0',
      savedConfigurations: [],
      lastUpdated: new Date().toISOString()
    }
  }

  try {
    // Clean up the value - handle HTML encoding and double encoding
    let cleanValue = metafieldValue.trim()

    // Decode HTML entities first (this is the main issue)
    if (cleanValue.includes('&quot;')) {
      cleanValue = cleanValue
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
    }

    // If the value starts and ends with quotes, it might be double-encoded
    if (cleanValue.startsWith('"') && cleanValue.endsWith('"')) {
      cleanValue = cleanValue.slice(1, -1)
      // Unescape any escaped quotes
      cleanValue = cleanValue.replace(/\\"/g, '"')
    }

    const parsed = JSON.parse(cleanValue)

    // Ensure it has the expected structure
    return {
      version: parsed.version || '1.0',
      savedConfigurations: parsed.savedConfigurations || [],
      lastUpdated: parsed.lastUpdated || new Date().toISOString()
    }
  } catch (error) {
    console.error('Error parsing saved configurations:', error)
    return {
      version: '1.0',
      savedConfigurations: [],
      lastUpdated: new Date().toISOString()
    }
  }
}

/**
 * Helper function to add a new configuration to existing saved configurations
 */
export const addConfigurationToSaved = (
  existingConfigurations: CustomerSavedConfigurations,
  newConfiguration: SavedConfiguration
): CustomerSavedConfigurations => {
  return {
    ...existingConfigurations,
    savedConfigurations: [...existingConfigurations.savedConfigurations, newConfiguration],
    lastUpdated: new Date().toISOString()
  }
}

/**
 * Helper function to remove a configuration from saved configurations
 */
export const removeConfigurationFromSaved = (
  existingConfigurations: CustomerSavedConfigurations,
  configurationId: string
): CustomerSavedConfigurations => {
  return {
    ...existingConfigurations,
    savedConfigurations: existingConfigurations.savedConfigurations.filter(
      config => config.id !== configurationId
    ),
    lastUpdated: new Date().toISOString()
  }
}
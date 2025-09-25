import type { OrderFormData } from '../schemas/orderSchema'
import type { CuttingSpecification } from './shopify'
import type { SavedConfiguration, SavedCuttingSpecification } from './optimized-saved-config'
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
  specifications: CuttingSpecification[]
): SavedConfiguration => {
  // Use DRY utility from data-transformation
  return createMinimalSavedConfig(name, orderInfo, materials, specifications)
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
    console.log('🔍 Raw metafield value type:', typeof metafieldValue)
    console.log('🔍 Raw metafield value length:', metafieldValue.length)
    console.log('🔍 Raw metafield first 100 chars:', metafieldValue.substring(0, 100))

    // Clean up the value - handle HTML encoding and double encoding
    let cleanValue = metafieldValue.trim()

    // Decode HTML entities first (this is the main issue)
    if (cleanValue.includes('&quot;')) {
      console.log('🔧 Decoding HTML entities - value is HTML-encoded')
      cleanValue = cleanValue
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
    }

    // If the value starts and ends with quotes, it might be double-encoded
    if (cleanValue.startsWith('"') && cleanValue.endsWith('"')) {
      console.log('🔧 Removing outer quotes - value appears double-encoded')
      cleanValue = cleanValue.slice(1, -1)
      // Unescape any escaped quotes
      cleanValue = cleanValue.replace(/\\"/g, '"')
    }

    console.log('🔍 Cleaned value first 100 chars:', cleanValue.substring(0, 100))

    const parsed = JSON.parse(cleanValue)
    console.log('✅ Successfully parsed configurations:', parsed.savedConfigurations?.length || 0, 'configs')

    // Ensure it has the expected structure
    return {
      version: parsed.version || '1.0',
      savedConfigurations: parsed.savedConfigurations || [],
      lastUpdated: parsed.lastUpdated || new Date().toISOString()
    }
  } catch (error) {
    console.error('❌ Error parsing saved configurations:', error)
    console.error('❌ Failed value:', metafieldValue?.substring(0, 200))
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
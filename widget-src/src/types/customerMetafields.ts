import type { OrderFormData } from '../schemas/orderSchema'
import type { CuttingSpecification } from './shopify'

/**
 * Simplified configuration for saving to customer metafields
 * This is a lightweight version optimized for storage in Shopify customer metafields
 */
export interface SavedConfiguration {
  id: string
  name: string // User-provided name for the configuration
  savedAt: string // ISO date string
  orderInfo: OrderFormData
  materials: Array<{
    id: string
    code: string
    name: string
    quantity: number
    price: number
  }>
  specifications: Array<{
    materialId: string
    materialName: string
    edgeMaterialId?: string
    edgeMaterialName?: string
    glueType: string
    pieces: Array<{
      id: string
      width: number
      height: number
      quantity: number
      label?: string
    }>
  }>
  summary: {
    totalMaterials: number
    totalPieces: number
    estimatedCost: number
    currency: string
  }
}

/**
 * Root structure for customer metafield containing saved configurations
 */
export interface CustomerSavedConfigurations {
  version: string
  savedConfigurations: SavedConfiguration[]
  lastUpdated: string // ISO date string
}

/**
 * Helper function to create a new saved configuration
 */
export const createSavedConfiguration = (
  name: string,
  orderInfo: OrderFormData,
  materials: Array<{ id: string; code: string; name: string; quantity: number; price: number }>,
  specifications: CuttingSpecification[]
): SavedConfiguration => {
  const id = `config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Convert cutting specifications to simplified format
  const savedSpecs = specifications.map(spec => ({
    materialId: spec.material.id,
    materialName: spec.material.name,
    edgeMaterialId: spec.edgeMaterial?.id,
    edgeMaterialName: spec.edgeMaterial?.name,
    glueType: spec.glueType,
    pieces: spec.pieces.map(piece => ({
      id: piece.id,
      width: piece.width,
      height: piece.height,
      quantity: piece.quantity,
      label: piece.label
    }))
  }))

  // Calculate summary
  const totalMaterials = materials.length
  const totalPieces = specifications.reduce((sum, spec) =>
    sum + spec.pieces.reduce((pieceSum, piece) => pieceSum + piece.quantity, 0), 0
  )
  const estimatedCost = materials.reduce((sum, material) =>
    sum + (material.price * material.quantity), 0
  )

  return {
    id,
    name,
    savedAt: new Date().toISOString(),
    orderInfo,
    materials,
    specifications: savedSpecs,
    summary: {
      totalMaterials,
      totalPieces,
      estimatedCost,
      currency: 'EUR'
    }
  }
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
    const parsed = JSON.parse(metafieldValue)
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
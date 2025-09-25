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
    glueType: string
    edgeMaterialId: string | null
    pieces: Array<{
      id: string
      partName: string
      length: number
      width: number
      quantity: number
      edgeAllAround: boolean | null
      edgeTop: boolean | null
      edgeBottom: boolean | null
      edgeLeft: boolean | null
      edgeRight: boolean | null
      allowRotation: boolean
      notes: string
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

  // Clean materials - only save essential fields for reconstruction
  const cleanMaterials = materials.map(material => ({
    id: material.id,
    code: material.code,
    name: material.name,
    quantity: material.quantity,
    price: material.price
    // Remove computed fields: totalPrice, variantId, image
  }))

  // Convert cutting specifications to minimal format needed for reconstruction
  const savedSpecs = specifications.map(spec => ({
    materialId: spec.material.id, // Always use product ID for consistency with MaterialSearchResult
    glueType: spec.glueType,
    edgeMaterialId: spec.edgeMaterial?.id || null,
    // Only save essential piece data needed for reconstruction
    pieces: spec.pieces.map(piece => ({
      id: piece.id,
      partName: piece.partName || '',
      length: piece.length,
      width: piece.width,
      quantity: piece.quantity,
      // Save edge configuration if present
      edgeAllAround: piece.edgeAllAround || null,
      edgeTop: piece.edgeTop || null,
      edgeBottom: piece.edgeBottom || null,
      edgeLeft: piece.edgeLeft || null,
      edgeRight: piece.edgeRight || null,
      allowRotation: piece.allowRotation || false,
      notes: piece.notes || ''
    }))
  }))

  // Calculate minimal summary (will be recalculated on load anyway)
  const totalMaterials = cleanMaterials.length
  const totalPieces = specifications.reduce((sum, spec) =>
    sum + spec.pieces.reduce((pieceSum, piece) => pieceSum + piece.quantity, 0), 0
  )
  const estimatedCost = cleanMaterials.reduce((sum, material) =>
    sum + (material.price * material.quantity), 0
  )

  return {
    id,
    name,
    savedAt: new Date().toISOString(),
    orderInfo,
    materials: cleanMaterials,
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
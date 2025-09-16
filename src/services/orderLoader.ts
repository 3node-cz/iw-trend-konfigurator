import { searchMaterials, searchEdgeMaterials } from './shopifyApi'
import type { SavedOrder, SavedCuttingSpecification } from '../types/savedOrder'
import type { CuttingSpecification, MaterialSearchResult, EdgeMaterial } from '../types/shopify'

// Cache for already fetched materials and edges to avoid duplicate API calls
const materialCache = new Map<string, MaterialSearchResult>()
const edgeCache = new Map<string, EdgeMaterial>()

/**
 * Loads a saved order configuration and fetches fresh material data from Shopify API
 */
export const loadOrderConfiguration = async (savedOrder: SavedOrder): Promise<{
  orderInfo: typeof savedOrder.orderInfo,
  specifications: CuttingSpecification[]
}> => {
  console.log('📋 Loading order configuration:', savedOrder.orderNumber)
  console.log('🔄 Fetching fresh material data from Shopify...')

  // Clear cache for fresh data on each order load
  materialCache.clear()
  edgeCache.clear()

  // Collect unique material and edge IDs to batch fetch
  const uniqueMaterialIds = [...new Set(savedOrder.specifications.map(spec => spec.materialId))]
  const uniqueEdgeIds = [...new Set(
    savedOrder.specifications
      .map(spec => spec.edgeMaterialId)
      .filter((id): id is string => id !== null)
  )]

  console.log(`📦 Fetching ${uniqueMaterialIds.length} unique materials and ${uniqueEdgeIds.length} unique edges`)

  // Batch fetch all unique materials
  await Promise.all(uniqueMaterialIds.map(async (materialId) => {
    const material = await fetchMaterialById(materialId)
    if (material) {
      materialCache.set(materialId, material)
      console.log(`✅ Cached material: ${material.name}`)
    }
  }))

  // Batch fetch all unique edge materials
  await Promise.all(uniqueEdgeIds.map(async (edgeId) => {
    const edge = await fetchEdgeMaterialById(edgeId)
    if (edge) {
      edgeCache.set(edgeId, edge)
      console.log(`✅ Cached edge: ${edge.name}`)
    }
  }))

  // Build specifications using cached data
  const specifications: CuttingSpecification[] = []
  for (const savedSpec of savedOrder.specifications) {
    const material = materialCache.get(savedSpec.materialId)
    if (!material) {
      console.warn(`⚠️ Material ${savedSpec.materialId} not found - skipping specification`)
      continue
    }

    const edgeMaterial = savedSpec.edgeMaterialId ? edgeCache.get(savedSpec.edgeMaterialId) || null : null

    specifications.push({
      material,
      edgeMaterial,
      glueType: savedSpec.glueType,
      pieces: savedSpec.pieces
    })
  }

  console.log(`🎉 Successfully loaded ${specifications.length} specifications with ${uniqueMaterialIds.length + uniqueEdgeIds.length} total API calls`)

  return {
    orderInfo: savedOrder.orderInfo,
    specifications
  }
}

/**
 * Converts a full CuttingSpecification to a lightweight SavedCuttingSpecification
 */
export const convertToSavedSpecification = (spec: CuttingSpecification): SavedCuttingSpecification => {
  return {
    materialId: spec.material.id,
    edgeMaterialId: spec.edgeMaterial?.id || null,
    glueType: spec.glueType,
    pieces: spec.pieces
  }
}


/**
 * Fetches material data by Shopify product ID with optimized single API call
 */
async function fetchMaterialById(materialId: string): Promise<MaterialSearchResult | null> {
  try {
    // Extract numeric ID directly to avoid double API call
    const numericId = materialId.split('/').pop() || materialId

    const results = await searchMaterials({
      query: `id:${numericId}`,
      limit: 1
    })

    if (results.length === 0) {
      console.warn(`Material not found for ID ${materialId}, falling back to mock data`)
      
      // Return different mock materials based on ID for testing
      const mockMaterials: Record<string, {
        id: string;
        code: string;
        name: string;
        productCode: string;
        availability: 'available';
        warehouse: string;
        price: { amount: number; currency: string; perUnit: string };
        dimensions: { width: number; height: number; thickness: number };
        image: string;
      }> = {
        'gid://shopify/Product/15514382139774': {
          id: materialId,
          code: 'H1180',
          name: 'EGG 18,6 LDTD H1180 ST37 Dub Halifax prírodný',
          productCode: '275048',
          availability: 'available' as const,
          warehouse: 'Bratislava',
          price: { amount: 103.39, currency: 'EUR', perUnit: '/ ks' },
          dimensions: { width: 2800, height: 2070, thickness: 18.6 },
          image: '/images/materials/h1180.jpg'
        },
        'gid://shopify/Product/15514382140000': {
          id: materialId,
          code: 'H3311',
          name: 'EGG 18,6 LDTD H3311 TM28 Dub Cuneo bielený',
          productCode: '275051',
          availability: 'available' as const,
          warehouse: 'Bratislava',
          price: { amount: 96.43, currency: 'EUR', perUnit: '/ ks' },
          dimensions: { width: 2800, height: 2070, thickness: 18.6 },
          image: '/images/materials/h3311.jpg'
        },
        'gid://shopify/Product/15514382141000': {
          id: materialId,
          code: 'H1303',
          name: 'EGG 18,6 LDTD H1303 ST12 Dub Belmont hnedý',
          productCode: '275055',
          availability: 'available' as const,
          warehouse: 'Bratislava',
          price: { amount: 89.75, currency: 'EUR', perUnit: '/ ks' },
          dimensions: { width: 2800, height: 2070, thickness: 18.6 },
          image: '/images/materials/h1303.jpg'
        }
      }
      
      // Return specific mock material or default to H1180
      return mockMaterials[materialId] || mockMaterials['gid://shopify/Product/15514382139774']
    }

    return results[0]
  } catch (error) {
    console.error('Error fetching material by ID:', error)
    return null
  }
}

/**
 * Fetches edge material data by Shopify product ID with optimized single API call
 */
async function fetchEdgeMaterialById(edgeMaterialId: string): Promise<EdgeMaterial | null> {
  try {
    // Extract numeric ID directly to avoid double API call
    const numericId = edgeMaterialId.split('/').pop() || edgeMaterialId

    const results = await searchEdgeMaterials({
      query: `id:${numericId}`,
      limit: 1
    })

    if (results.length > 0) {
      const result = results[0]
      // Convert MaterialSearchResult to EdgeMaterial
      return {
        id: result.id,
        name: result.name,
        productCode: result.productCode || result.code,
        availability: result.availability,
        thickness: 0.8, // Default thickness
        availableThicknesses: [0.4, 0.8, 2], // Common edge thickness variants
        warehouse: result.warehouse,
        price: result.price,
        image: result.image // Include the image from the API result
      }
    }

    // Fallback to mock edge data
    console.warn(`Edge material not found for ID ${edgeMaterialId}, falling back to mock data`)
    return {
      id: edgeMaterialId,
      name: 'ABS hrana dub Halifax prírodný',
      productCode: 'ABS001',
      availability: 'available' as const,
      thickness: 2,
      availableThicknesses: [0.4, 0.8, 1, 2],
      warehouse: 'Bratislava',
      price: { amount: 12.50, currency: 'EUR', perUnit: '/ m' },
      image: '/images/edges/abs-halifax.jpg' // Mock edge image
    }
  } catch (error) {
    console.error('Error fetching edge material by ID:', error)
    return null
  }
}
import { searchMaterials, searchEdgeMaterials } from './shopifyApi'
import type { SavedOrder, SavedCuttingSpecification } from '../types/savedOrder'
import type {
  CuttingSpecification,
  MaterialSearchResult,
  EdgeMaterial,
} from '../types/shopify'

// Cache for already fetched materials and edges to avoid duplicate API calls
const materialCache = new Map<string, MaterialSearchResult>()
const edgeCache = new Map<string, EdgeMaterial>()

/**
 * Loads a saved order configuration and fetches fresh material data from Shopify API
 */
export const loadOrderConfiguration = async (
  savedOrder: SavedOrder,
): Promise<{
  orderInfo: typeof savedOrder.orderInfo
  specifications: CuttingSpecification[]
}> => {
  console.log('🔍 Loading order configuration for:', savedOrder.id);
  console.log('🔍 Saved order specifications:', savedOrder.specifications);

  materialCache.clear()
  edgeCache.clear()

  const uniqueMaterialIds = [
    ...new Set(savedOrder.specifications.map((spec) => spec.materialId)),
  ]
  console.log('🔍 Unique material IDs to fetch:', uniqueMaterialIds);
  const uniqueEdgeIds = [
    ...new Set(
      savedOrder.specifications
        .map((spec) => spec.edgeMaterialId)
        .filter((id): id is string => id !== null),
    ),
  ]


  await Promise.all(
    uniqueMaterialIds.map(async (materialId) => {
      const material = await fetchMaterialById(materialId)
      if (material) {
        materialCache.set(materialId, material)
      }
    }),
  )

  await Promise.all(
    uniqueEdgeIds.map(async (edgeId) => {
      const edge = await fetchEdgeMaterialById(edgeId)
      if (edge) {
        edgeCache.set(edgeId, edge)
      }
    }),
  )

  const specifications: CuttingSpecification[] = []
  for (const savedSpec of savedOrder.specifications) {
    const material = materialCache.get(savedSpec.materialId)
    if (!material) {
      console.warn(
        `⚠️ Material ${savedSpec.materialId} not found - skipping specification`,
      )
      continue
    }

    const edgeMaterial = savedSpec.edgeMaterialId
      ? edgeCache.get(savedSpec.edgeMaterialId) || null
      : null

    specifications.push({
      material,
      edgeMaterial,
      glueType: savedSpec.glueType,
      pieces: savedSpec.pieces,
    })
  }


  return {
    orderInfo: savedOrder.orderInfo,
    specifications,
  }
}

/**
 * Converts a full CuttingSpecification to a lightweight SavedCuttingSpecification
 */
export const convertToSavedSpecification = (
  spec: CuttingSpecification,
): SavedCuttingSpecification => {
  return {
    materialId: spec.material.id,
    edgeMaterialId: spec.edgeMaterial?.id || null,
    glueType: spec.glueType,
    pieces: spec.pieces,
  }
}

async function fetchMaterialById(
  materialId: string,
): Promise<MaterialSearchResult | null> {
  console.log('🔍 Fetching material by ID:', materialId);

  try {
    // Pass the full materialId (GID) to the search, let the API handle the format
    const results = await searchMaterials({
      query: `id:${materialId}`,
      limit: 1,
    })

    console.log('🔍 Search results for material ID', materialId, ':', results);

    if (results.length === 0) {
      console.warn(`❌ Material not found for ID ${materialId}`)
      return null
    }

    console.log('✅ Found material:', results[0]);
    return results[0]
  } catch (error) {
    console.error('Error fetching material by ID:', error)
    return null
  }
}

async function fetchEdgeMaterialById(
  edgeMaterialId: string,
): Promise<EdgeMaterial | null> {
  try {
    // Pass the full edgeMaterialId (GID) to the search, let the API handle the format
    const results = await searchEdgeMaterials({
      query: `id:${edgeMaterialId}`,
      limit: 1,
    })

    if (results.length > 0) {
      const result = results[0]
      return {
        id: result.id,
        name: result.name,
        productCode: result.productCode || result.code,
        availability: result.availability,
        thickness: 0.8,
        availableThicknesses: [0.4, 0.8, 2],
        warehouse: result.warehouse,
        price: result.price,
        image: result.image,
      }
    }

    console.warn(`Edge material not found for ID ${edgeMaterialId}`)
    return null
  } catch (error) {
    console.error('Error fetching edge material by ID:', error)
    return null
  }
}

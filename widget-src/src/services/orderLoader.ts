import { searchMaterials, searchEdgeMaterials } from './shopifyApi'
import type { SavedConfiguration, SavedCuttingSpecification } from '../types/optimized-saved-config'
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
  savedOrder: SavedConfiguration,
): Promise<{
  orderInfo: typeof savedOrder.orderInfo
  specifications: CuttingSpecification[]
}> => {

  materialCache.clear()
  edgeCache.clear()

  const uniqueMaterialIds = [
    ...new Set(savedOrder.specifications.map((spec) => spec.materialId)),
  ]
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
        `Material ${savedSpec.materialId} not found - skipping specification`,
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

  try {
    // Strategy 1: Try direct GID search first (for valid GIDs)
    let results = await searchMaterials({
      query: `id:${materialId}`,
      limit: 1,
    })


    // Strategy 2: If direct search fails, try enhanced numeric search
    if (results.length === 0) {
      let numericId = materialId;

      // Extract numeric part if it's a GID
      if (materialId.includes('gid://shopify/')) {
        numericId = materialId.replace(/^gid:\/\/shopify\/(Product|ProductVariant)\//, '');
      } else {
      }

      // Use the enhanced numeric search (same as what's working in the API)
      const fallbackResults = await searchMaterials({
        query: numericId,
        limit: 5,
      });


      if (fallbackResults.length > 0) {
        return fallbackResults[0];
      }
    }

    if (results.length === 0) {
      console.warn(`Material not found for ID ${materialId} (tried both GID and numeric search)`);
      return null
    }

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
    // Strategy 1: Try direct GID search first (for valid GIDs)
    let results = await searchEdgeMaterials({
      query: `id:${edgeMaterialId}`,
      limit: 1,
    })


    // Strategy 2: If direct search fails, try enhanced numeric search
    if (results.length === 0) {
      let numericId = edgeMaterialId;

      // Extract numeric part if it's a GID
      if (edgeMaterialId.includes('gid://shopify/')) {
        numericId = edgeMaterialId.replace(/^gid:\/\/shopify\/(Product|ProductVariant)\//, '');
      } else {
      }

      // Use the enhanced numeric search (same as what's working for materials)
      const fallbackResults = await searchEdgeMaterials({
        query: numericId,
        limit: 5,
      });


      if (fallbackResults.length > 0) {
        results = [fallbackResults[0]];
      }
    }

    if (results.length > 0) {
      const result = results[0]
      return {
        id: result.id,
        variantId: result.variant?.id,
        code: result.variant?.sku || result.handle,
        name: result.title,
        productCode: result.variant?.sku || result.handle,
        availability: 'available',
        thickness: 0.8,
        availableThicknesses: [0.4, 0.8, 2],
        warehouse: 'default',
        price: result.variant?.price ? {
          amount: parseFloat(result.variant.price),
          currency: 'EUR',
          perUnit: 'm'
        } : undefined,
        image: result.image,
      }
    }

    console.warn(`Edge material not found for ID ${edgeMaterialId} (tried both GID and numeric search)`)
    return null
  } catch (error) {
    console.error('Error fetching edge material by ID:', error)
    return null
  }
}

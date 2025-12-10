import { searchMaterials, searchEdgeMaterials } from './shopifyApi'
import type { SavedConfiguration, SavedCuttingSpecification } from '../types/optimized-saved-config'
import type {
  CuttingSpecification,
  MaterialSearchResult,
  EdgeMaterial,
} from '../types/shopify'
import { applyCustomerPricing, applyCustomerPricingToEdges } from './customerPricingService'
import type { CustomerOrderData } from './customerApi'

// Cache for already fetched materials and edges to avoid duplicate API calls
const materialCache = new Map<string, MaterialSearchResult>()
const edgeCache = new Map<string, EdgeMaterial>()

/**
 * Loads a saved order configuration and fetches fresh material data from Shopify API
 *
 * @param savedOrder - The saved configuration to load
 * @param customer - Optional customer data for applying customer-specific pricing
 */
export const loadOrderConfiguration = async (
  savedOrder: SavedConfiguration,
  customer?: CustomerOrderData | null
): Promise<{
  orderInfo: typeof savedOrder.orderInfo
  specifications: CuttingSpecification[]
}> => {

  console.log('🔄 Loading order configuration:', savedOrder.id)
  console.log('🧪 [ORDER-LOADER] Full savedOrder object:', JSON.stringify(savedOrder, null, 2))
  console.log('🧪 [ORDER-LOADER] Specifications array length:', savedOrder.specifications?.length || 0)
  console.log('🧪 [ORDER-LOADER] First specification:', savedOrder.specifications?.[0])

  materialCache.clear()
  edgeCache.clear()

  const uniqueMaterialIds = [
    ...new Set(savedOrder.specifications.map((spec) => spec.materialId)),
  ]

  console.log('📦 Material IDs to load:', uniqueMaterialIds)

  // Collect all edge IDs (default + custom edges from pieces)
  const allEdgeIds = new Set<string>()
  savedOrder.specifications.forEach((spec) => {
    if (spec.edgeMaterialId) {
      allEdgeIds.add(spec.edgeMaterialId)
    }
    // Collect custom edge IDs from pieces
    spec.pieces.forEach((piece: any) => {
      if (piece.customEdgeTopId) allEdgeIds.add(piece.customEdgeTopId)
      if (piece.customEdgeBottomId) allEdgeIds.add(piece.customEdgeBottomId)
      if (piece.customEdgeLeftId) allEdgeIds.add(piece.customEdgeLeftId)
      if (piece.customEdgeRightId) allEdgeIds.add(piece.customEdgeRightId)
    })
  })
  const uniqueEdgeIds = Array.from(allEdgeIds)

  console.log('🔲 Edge IDs to load:', uniqueEdgeIds)

  await Promise.all(
    uniqueMaterialIds.map(async (materialId) => {
      console.log('🔍 Fetching material:', materialId)
      const material = await fetchMaterialById(materialId)
      if (material) {
        console.log('✅ Material loaded:', materialId, material.title)
        materialCache.set(materialId, material)
      } else {
        console.error('❌ Failed to load material:', materialId)
      }
    }),
  )

  // Apply customer-specific pricing to loaded materials
  if (customer && materialCache.size > 0) {
    console.log('💰 Applying customer pricing to', materialCache.size, 'materials')
    const materialsArray = Array.from(materialCache.values())

    // 🧪 TESTING: Log materials before pricing
    console.log('🧪 [ORDER-LOADER-MATERIALS] Before pricing:', materialsArray.map(m => ({
      id: m.id,
      title: m.title,
      sku: m.variant?.sku,
      basePrice: m.variant?.price
    })));

    const pricedMaterials = applyCustomerPricing(materialsArray, customer)

    // 🧪 TESTING: Log materials after pricing
    console.log('🧪 [ORDER-LOADER-MATERIALS] After pricing:', pricedMaterials.map(m => ({
      id: m.id,
      title: m.title,
      sku: m.variant?.sku,
      basePrice: (m.variant as any)?._basePrice,
      customerPrice: m.variant?.price,
      discount: (m.variant as any)?._customerDiscount,
      source: (m.variant as any)?._pricingSource
    })));

    // Update cache with priced materials
    materialCache.clear()
    pricedMaterials.forEach(material => {
      materialCache.set(material.id, material)
    })
    console.log('✅ Customer pricing applied')
  }

  await Promise.all(
    uniqueEdgeIds.map(async (edgeId) => {
      const edge = await fetchEdgeMaterialById(edgeId)
      if (edge) {
        edgeCache.set(edgeId, edge)
      }
    }),
  )

  // Apply customer-specific pricing to loaded edges
  if (customer && edgeCache.size > 0) {
    console.log('💰 Applying customer pricing to', edgeCache.size, 'edge materials')
    const edgesArray = Array.from(edgeCache.values())

    // 🧪 TESTING: Log edges before pricing
    console.log('🧪 [ORDER-LOADER-EDGES] Before pricing:', edgesArray.map(e => ({
      id: e.id,
      name: e.name,
      code: e.code,
      basePrice: e.price?.amount
    })));

    const pricedEdges = applyCustomerPricingToEdges(edgesArray, customer)

    // 🧪 TESTING: Log edges after pricing
    console.log('🧪 [ORDER-LOADER-EDGES] After pricing:', pricedEdges.map(e => ({
      id: e.id,
      name: e.name,
      code: e.code,
      basePrice: (e.price as any)?._basePrice,
      customerPrice: e.price?.amount,
      discount: (e.price as any)?._customerDiscount,
      source: (e.price as any)?._pricingSource
    })));

    // Update cache with priced edges
    edgeCache.clear()
    pricedEdges.forEach(edge => {
      edgeCache.set(edge.id, edge)
    })
    console.log('✅ Customer pricing applied to edges')
  }

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

    // Map custom edge IDs to EdgeMaterial objects in pieces
    const piecesWithCustomEdges = savedSpec.pieces.map((piece: any) => ({
      ...piece,
      customEdgeTop: piece.customEdgeTopId
        ? edgeCache.get(piece.customEdgeTopId) || null
        : null,
      customEdgeBottom: piece.customEdgeBottomId
        ? edgeCache.get(piece.customEdgeBottomId) || null
        : null,
      customEdgeLeft: piece.customEdgeLeftId
        ? edgeCache.get(piece.customEdgeLeftId) || null
        : null,
      customEdgeRight: piece.customEdgeRightId
        ? edgeCache.get(piece.customEdgeRightId) || null
        : null,
    }))

    specifications.push({
      material,
      edgeMaterial,
      glueType: savedSpec.glueType,
      pieces: piecesWithCustomEdges,
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
    console.log('🔎 fetchMaterialById called with:', materialId)

    // Strategy 1: Try direct GID search first (for valid GIDs)
    console.log('   Strategy 1: Trying direct GID search with query:', `id:${materialId}`)
    let results = await searchMaterials({
      query: `id:${materialId}`,
      limit: 1,
    })

    console.log('   Strategy 1 results:', results.length, results.length > 0 ? results[0].id : 'none')

    // Strategy 2: If direct search fails, try enhanced numeric search
    if (results.length === 0) {
      let numericId = materialId;

      // Extract numeric part if it's a GID
      if (materialId.includes('gid://shopify/')) {
        numericId = materialId.replace(/^gid:\/\/shopify\/(Product|ProductVariant)\//, '');
        console.log('   Extracted numeric ID:', numericId)
      } else {
        console.log('   Not a GID, using as-is:', numericId)
      }

      // Use the enhanced numeric search (same as what's working in the API)
      console.log('   Strategy 2: Trying numeric search with query:', numericId)
      const fallbackResults = await searchMaterials({
        query: numericId,
        limit: 5,
      });

      console.log('   Strategy 2 results:', fallbackResults.length, fallbackResults.length > 0 ? fallbackResults[0].id : 'none')

      if (fallbackResults.length > 0) {
        return fallbackResults[0];
      }
    }

    if (results.length === 0) {
      console.warn(`❌ Material not found for ID ${materialId} (tried both GID and numeric search)`);
      return null
    }

    return results[0]
  } catch (error) {
    console.error('💥 Error fetching material by ID:', error)
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

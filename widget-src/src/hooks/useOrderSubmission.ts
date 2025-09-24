import { useState, useCallback } from 'react'
import { createCartViaBackend, createCartStorefront } from '../api/cart'
import type { CompleteOrder } from '../types/shopify'
import { SHOPIFY_API } from '../constants'

// Helper function to get variant ID from product ID - only for service products
const getVariantIdFromProduct = async (productId: string): Promise<string> => {
  try {
    // If it's already a variant ID, return as-is
    if (productId.includes('ProductVariant')) {
      return productId
    }

    // Search for the product using existing search API
    const response = await fetch(`/apps/konfigurator/api/search-materials?query=${encodeURIComponent(productId)}&limit=1`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const materials = await response.json()

    if (materials.length > 0 && materials[0].variant?.id) {
      console.log(`✅ Converted Product ID ${productId} to Variant ID ${materials[0].variant.id}`)
      return materials[0].variant.id
    } else {
      throw new Error(`Nemožno nájsť variantu pre službu s ID: ${productId}`)
    }
  } catch (error) {
    console.error('Failed to get variant ID for service product:', error)
    throw new Error(`Nemožno nájsť variantu pre službu s ID: ${productId}`)
  }
}

export interface OrderSubmissionState {
  isSubmitting: boolean
  error: string | null
  cartId: string | null
  success: boolean
  checkoutUrl: string | null
}

export const useOrderSubmission = () => {
  const [state, setState] = useState<OrderSubmissionState>({
    isSubmitting: false,
    error: null,
    cartId: null,
    success: false,
    checkoutUrl: null,
  })

  const submitOrder = useCallback(async (completeOrder: CompleteOrder) => {
    setState(prev => ({ ...prev, isSubmitting: true, error: null }))

    try {
      // 1. Prepare all line items first
      const allLineItems = []

      // 2. Prepare order data for cart attributes
      const orderData = {
        order: completeOrder.order,
        specifications: completeOrder.specifications,
        cuttingLayouts: completeOrder.cuttingLayouts?.map(layout => ({
          materialIndex: layout.materialIndex,
          boardNumber: layout.boardNumber,
          materialName: layout.materialName,
          totalPieces: layout.totalPieces,
          efficiency: layout.efficiency,
          // Don't include the full cutting diagram data to keep it lightweight
        })),
        totals: completeOrder.orderCalculations?.totals,
        timestamp: new Date().toISOString(),
      }

      // 2. Create items for each material specification with cutting pieces
      const specsWithPieces = completeOrder.specifications.filter(spec => spec.pieces.length > 0)

      // Allow all materials to be ordered regardless of availability status
      
      for (const [specIndex, spec] of specsWithPieces.entries()) {
        // Calculate how many boards are needed based on cutting layouts
        const materialLayouts = completeOrder.cuttingLayouts?.filter(layout => 
          layout.materialIndex === specIndex + 1
        ) || []
        
        // Use the number of boards from cutting layouts, or 1 as fallback
        const boardsNeeded = materialLayouts.length > 0 ? materialLayouts.length : 1
        
        // Get the correct variant ID for the board material - NO DANGEROUS FALLBACKS
        let boardMerchandiseId: string
        if (spec.material.variantId) {
          boardMerchandiseId = spec.material.variantId
        } else {
          throw new Error(`Chyba: Materiál "${spec.material.title}" nemá dostupnú variantu pre objednávku.`)
        }
        
        // Add board material line item
        allLineItems.push({
          variantId: boardMerchandiseId,
          quantity: boardsNeeded,
          attributes: [
            {
              key: '_material_specification',
              value: JSON.stringify({
                material: spec.material,
                edgeMaterial: spec.edgeMaterial,
                glueType: spec.glueType,
                pieces: spec.pieces,
              }),
            },
          ],
        })

        // Add edge material line item if present
        if (spec.edgeMaterial && spec.pieces.length > 0) {
          // Calculate total edge length needed (same logic as OrderInvoiceTable)
          const totalEdgeLength = spec.pieces.reduce((sum, piece) => {
            let pieceEdgeLength = 0
            if (piece.edgeAllAround) {
              pieceEdgeLength = ((piece.length + piece.width) * 2) * piece.quantity / 1000 // Convert to meters
            } else {
              const edges = [piece.edgeTop, piece.edgeBottom, piece.edgeLeft, piece.edgeRight]
              edges.forEach(edge => {
                if (edge) {
                  // Simplified edge length calculation
                  pieceEdgeLength += (piece.length + piece.width) / 2 * piece.quantity / 1000
                }
              })
            }
            return sum + pieceEdgeLength
          }, 0)

          if (totalEdgeLength > 0) {
            // Get the correct variant ID for the edge material - NO DANGEROUS FALLBACKS
            let edgeMerchandiseId: string
            if (spec.edgeMaterial.variantId) {
              edgeMerchandiseId = spec.edgeMaterial.variantId
            } else {
              throw new Error(`Chyba: Hranový materiál "${spec.edgeMaterial.name}" nemá dostupnú variantu pre objednávku.`)
            }
            
            allLineItems.push({
              variantId: edgeMerchandiseId,
              quantity: Math.ceil(totalEdgeLength), // Round up to whole meters
              attributes: [
                {
                  key: '_edge_specification',
                  value: JSON.stringify({
                    edgeMaterial: spec.edgeMaterial,
                    totalEdgeLength: totalEdgeLength,
                    relatedMaterial: spec.material.name,
                  }),
                },
              ],
            })
          }
        }
      }

      // Add cutting service product (flat 1 piece for any cutting order)
      // Use configured variant ID or fallback to Product ID conversion
      const cuttingServiceVariantId = SHOPIFY_API.SERVICES.CUTTING_SERVICE_VARIANT_ID.includes('TODO')
        ? await getVariantIdFromProduct(SHOPIFY_API.SERVICES.CUTTING_SERVICE_PRODUCT_ID)
        : SHOPIFY_API.SERVICES.CUTTING_SERVICE_VARIANT_ID

      allLineItems.push({
        variantId: cuttingServiceVariantId,
        quantity: 1,
        attributes: [
          {
            key: '_cutting_service',
            value: JSON.stringify({
              totalPieces: completeOrder.specifications.reduce((sum, spec) =>
                sum + spec.pieces.reduce((pieceSum, piece) => pieceSum + piece.quantity, 0), 0
              ),
              totalBoards: completeOrder.cuttingLayouts?.length || 0,
              orderName: completeOrder.order.orderName,
            }),
          },
        ],
      })

      // 3. Create cart/draft order via backend API (recommended approach)
      const result = await createCartViaBackend(allLineItems)

      // Alternative: Use Storefront API (requires manual token setup)
      // const result = await createCartStorefront(allLineItems)

      // 4. Set success state with checkout URL (no automatic redirect)
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        success: true,
        checkoutUrl: result.cart.checkoutUrl,
        cartId: result.cart.id
      }))
      
      return result
    } catch (error) {
      let errorMessage = error instanceof Error ? error.message : 'Neznáma chyba'
      
      // Handle specific Shopify quantity limit errors
      if (errorMessage.includes('môžete pridať len') && errorMessage.includes('v počte')) {
        // Extract product name and max quantity from Slovak error message
        const matches = errorMessage.match(/položku (.+?) v počte (\d+)/)
        if (matches) {
          const productName = matches[1]
          const maxQuantity = matches[2]
          errorMessage = `Materiál "${productName}" má maximálne ${maxQuantity} kusov skladom. Upravte množstvo v konfigurácii.`
        }
      }
      
      setState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        error: `Chyba pri odosielaní objednávky: ${errorMessage}` 
      }))
      throw error
    }
  }, [state.cartId])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  const resetSuccess = useCallback(() => {
    setState(prev => ({ ...prev, success: false, checkoutUrl: null }))
  }, [])

  return {
    ...state,
    submitOrder,
    clearError,
    resetSuccess,
  }
}
import { useState, useCallback } from 'react'
import { addToCartSF, createCartSF, redirectToCheckout } from '../api/cart'
import { SHOPIFY_CONFIG } from '../config/shopify'
import type { CompleteOrder } from '../types/shopify'

// Helper function to get variant ID from product ID
const getVariantIdFromProduct = async (productId: string): Promise<string> => {
  const query = `
    query getProductVariant($id: ID!) {
      product(id: $id) {
        variants(first: 1) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `
  
  try {
    const response = await fetch(SHOPIFY_CONFIG.SHOP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.STOREFRONT_API_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: { id: productId }
      })
    })
    
    const data = await response.json()
    const variantId = data.data?.product?.variants?.edges[0]?.node?.id
    
    if (variantId) {
      return variantId
    } else {
      return productId // Fallback to product ID if no variant found
    }
  } catch (error) {
    return productId // Fallback to product ID on error
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
      // 1. Create a new cart if we don't have one
      let cartId = state.cartId
      if (!cartId) {
        const cartResult = await createCartSF({
          shopUrl: SHOPIFY_CONFIG.SHOP_URL,
          storefrontToken: SHOPIFY_CONFIG.STOREFRONT_API_TOKEN,
        })
        cartId = cartResult.cart.id
        setState(prev => ({ ...prev, cartId }))
      }

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

      // 3. Create cart lines - one for each material specification with cutting pieces
      const specsWithPieces = completeOrder.specifications.filter(spec => spec.pieces.length > 0)
      
      // Allow all materials to be ordered regardless of availability status

      // Get variant IDs for all materials and create cart lines
      const allLines = []
      
      for (const [specIndex, spec] of specsWithPieces.entries()) {
        // Calculate how many boards are needed based on cutting layouts
        const materialLayouts = completeOrder.cuttingLayouts?.filter(layout => 
          layout.materialIndex === specIndex + 1
        ) || []
        
        // Use the number of boards from cutting layouts, or 1 as fallback
        const boardsNeeded = materialLayouts.length > 0 ? materialLayouts.length : 1
        
        // Get the correct variant ID for the board material
        const boardMerchandiseId = spec.material.variantId || await getVariantIdFromProduct(spec.material.id)
        
        // Add board material line item
        allLines.push({
          merchandiseId: boardMerchandiseId,
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
            // Get the correct variant ID for the edge material
            const edgeMerchandiseId = spec.edgeMaterial.variantId || await getVariantIdFromProduct(spec.edgeMaterial.id)
            
            allLines.push({
              merchandiseId: edgeMerchandiseId,
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
      const cuttingServiceProductId = 'gid://shopify/Product/15514687799678'
      const cuttingServiceVariantId = await getVariantIdFromProduct(cuttingServiceProductId)

      allLines.push({
        merchandiseId: cuttingServiceVariantId,
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

      const lines = allLines

      // 4. Add items to cart with order data as attributes
      const result = await addToCartSF({
        cartId: cartId!,
        shopUrl: SHOPIFY_CONFIG.SHOP_URL,
        storefrontToken: SHOPIFY_CONFIG.STOREFRONT_API_TOKEN,
        lines,
        attributes: [
          {
            key: '_cutting_data',
            value: JSON.stringify(orderData),
          },
          {
            key: '_order_type',
            value: 'cutting_specification',
          },
        ],
      })

      // 5. Set success state with checkout URL (no automatic redirect)
      setState(prev => ({ 
        ...prev, 
        isSubmitting: false,
        success: true,
        checkoutUrl: result.cart.checkoutUrl
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
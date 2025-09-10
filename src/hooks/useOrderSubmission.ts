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
      
      // Check for unavailable materials before processing
      const unavailableMaterials = specsWithPieces.filter(spec => spec.material.availability === 'unavailable')
      if (unavailableMaterials.length > 0) {
        const materialNames = unavailableMaterials.map(spec => spec.material.name).join(', ')
        throw new Error(`Tieto materiály nie sú skladom a nemožno ich objednať: ${materialNames}`)
      }

      // Get variant IDs for all materials
      const lines = await Promise.all(specsWithPieces.map(async (spec, specIndex) => {
        // Calculate how many boards are needed based on cutting layouts
        // Find cutting layouts for this material specification
        const materialLayouts = completeOrder.cuttingLayouts?.filter(layout => 
          layout.materialIndex === specIndex + 1
        ) || []
        
        // Use the number of boards from cutting layouts, or 1 as fallback
        const boardsNeeded = materialLayouts.length > 0 ? materialLayouts.length : 1
        
        // Get the correct variant ID (either from material data or fetch it)
        const merchandiseId = spec.material.variantId || await getVariantIdFromProduct(spec.material.id)
        
        // Prepare cart line item for this material specification
        
        return {
          merchandiseId,
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
        }
      }))

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
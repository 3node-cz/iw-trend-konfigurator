import { useState, useCallback } from "react";
import { createCartViaBackend, createCartStorefront } from "../api/cart";
import type { CompleteOrder } from "../types/shopify";
import { SHOPIFY_API } from "../constants";
import { createSubmittedOrderService } from "../services/submittedOrderService";

// Helper function to get variant ID from product ID - only for service products
const getVariantIdFromProduct = async (productId: string): Promise<string> => {
  try {
    // If it's already a variant ID, return as-is
    if (productId.includes("ProductVariant")) {
      return productId;
    }

    // Search for the product using existing search API
    const response = await fetch(
      `/apps/configurator/api/search-materials?query=${encodeURIComponent(productId)}&limit=1`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const materials = await response.json();

    if (materials.length > 0 && materials[0].variant?.id) {
      console.log(
        `✅ Converted Product ID ${productId} to Variant ID ${materials[0].variant.id}`,
      );
      return materials[0].variant.id;
    } else {
      throw new Error(`Nemožno nájsť variantu pre službu s ID: ${productId}`);
    }
  } catch (error) {
    console.error("Failed to get variant ID for service product:", error);
    throw new Error(`Nemožno nájsť variantu pre službu s ID: ${productId}`);
  }
};

export interface OrderSubmissionState {
  isSubmitting: boolean;
  error: string | null;
  cartId: string | null;
  success: boolean;
  checkoutUrl: string | null;
}

export const useOrderSubmission = () => {
  const [state, setState] = useState<OrderSubmissionState>({
    isSubmitting: false,
    error: null,
    cartId: null,
    success: false,
    checkoutUrl: null,
  });

  const submitOrder = useCallback(
    async (completeOrder: CompleteOrder) => {
      setState((prev) => ({ ...prev, isSubmitting: true, error: null }));

      try {
        // 1. Prepare all line items first
        const allLineItems = [];

        // 2. Prepare order data for cart attributes
        const orderData = {
          order: completeOrder.order,
          specifications: completeOrder.specifications,
          cuttingLayouts: completeOrder.cuttingLayouts?.map((layout) => ({
            materialIndex: layout.materialIndex,
            boardNumber: layout.boardNumber,
            materialName: layout.materialName,
            totalPieces: layout.totalPieces,
            efficiency: layout.efficiency,
            // Don't include the full cutting diagram data to keep it lightweight
          })),
          totals: completeOrder.orderCalculations?.totals,
          timestamp: new Date().toISOString(),
        };

        // 2. Create items for each material specification with cutting pieces
        const specsWithPieces = completeOrder.specifications.filter(
          (spec) => spec.pieces.length > 0,
        );

        // Allow all materials to be ordered regardless of availability status

        for (const [specIndex, spec] of specsWithPieces.entries()) {
          // Calculate how many boards are needed based on cutting layouts
          const materialLayouts =
            completeOrder.cuttingLayouts?.filter(
              (layout) => layout.materialIndex === specIndex + 1,
            ) || [];

          // Use the number of boards from cutting layouts, or 1 as fallback
          const boardsNeeded =
            materialLayouts.length > 0 ? materialLayouts.length : 1;

          // Get the correct variant ID for the board material - check both variantId and variant.id
          let boardMerchandiseId: string;
          if (spec.material.variantId) {
            boardMerchandiseId = spec.material.variantId;
          } else if (spec.material.variant?.id) {
            boardMerchandiseId = spec.material.variant.id;
          } else {
            // Fallback to product ID if no variant ID available
            boardMerchandiseId = spec.material.id;
            console.warn(`Using product ID as fallback for material: ${spec.material.title}`);
          }

          // Add board material line item
          allLineItems.push({
            variantId: boardMerchandiseId,
            quantity: boardsNeeded,
            attributes: [
              {
                key: "_material_specification",
                value: JSON.stringify({
                  material: spec.material,
                  edgeMaterial: spec.edgeMaterial,
                  glueType: spec.glueType,
                  pieces: spec.pieces,
                }),
              },
            ],
          });
        }

        // Add edge materials from edge consumption calculations
        // This handles multiple edge materials per specification (including custom edges)
        if (completeOrder.orderCalculations?.edgeConsumption) {
          for (const edgeConsumption of completeOrder.orderCalculations.edgeConsumption) {
            if (edgeConsumption.totalEdgeLengthMeters > 0) {
              // Find the edge material in specifications
              const relatedSpec = specsWithPieces.find(
                s => (s.material?.title || s.material?.name) === edgeConsumption.materialName
              );

              if (!relatedSpec) {
                console.warn(`Could not find specification for edge material: ${edgeConsumption.edgeMaterialName}`);
                continue;
              }

              // Find edge material - check default and all custom edges in pieces
              let edgeMaterialToAdd = null;

              // Check if it's the default edge material
              if (relatedSpec.edgeMaterial?.name === edgeConsumption.edgeMaterialName) {
                edgeMaterialToAdd = relatedSpec.edgeMaterial;
              } else {
                // Search in custom edges
                for (const piece of relatedSpec.pieces) {
                  const customEdges = [
                    piece.customEdgeTop,
                    piece.customEdgeBottom,
                    piece.customEdgeLeft,
                    piece.customEdgeRight,
                  ].filter(Boolean);

                  for (const customEdge of customEdges) {
                    if (customEdge?.name === edgeConsumption.edgeMaterialName) {
                      edgeMaterialToAdd = customEdge;
                      break;
                    }
                  }
                  if (edgeMaterialToAdd) break;
                }
              }

              if (!edgeMaterialToAdd) {
                console.warn(`Could not find edge material: ${edgeConsumption.edgeMaterialName}`);
                continue;
              }

              // Get the correct variant ID for the edge material
              let edgeMerchandiseId: string;
              if (edgeMaterialToAdd.variantId) {
                edgeMerchandiseId = edgeMaterialToAdd.variantId;
              } else if (edgeMaterialToAdd.variant?.id) {
                edgeMerchandiseId = edgeMaterialToAdd.variant.id;
              } else {
                // Fallback to product ID if no variant ID available
                edgeMerchandiseId = edgeMaterialToAdd.id;
                console.warn(`Using product ID as fallback for edge material: ${edgeMaterialToAdd.name}`);
              }

              // Build attributes array
              const attributes: Array<{ key: string; value: string }> = [
                {
                  key: "_edge_specification",
                  value: JSON.stringify({
                    edgeMaterial: edgeMaterialToAdd,
                    totalEdgeLength: edgeConsumption.totalEdgeLengthMeters,
                    relatedMaterial: edgeConsumption.materialName,
                    consumptionByVariant: edgeConsumption.consumptionByVariant,
                    isPlaceholder: edgeConsumption.isPlaceholder,
                  }),
                },
              ];

              // Add placeholder note if this is a placeholder edge
              if (edgeConsumption.isPlaceholder && edgeConsumption.placeholderNote) {
                attributes.push({
                  key: "_placeholder_edge_note",
                  value: edgeConsumption.placeholderNote
                });
              }

              allLineItems.push({
                variantId: edgeMerchandiseId,
                quantity: Math.ceil(edgeConsumption.totalEdgeLengthMeters), // Round up to whole meters
                attributes,
              });
            }
          }
        }

        // TODO: Add cutting service product later when we have the correct variant ID
        // For now, we're only sending material line items to avoid variant ID issues
        console.log("Cutting service temporarily disabled - only sending materials");

        // 3. Create cart/draft order via backend API (recommended approach)
        // Pass all order form data as custom attributes
        const result = await createCartViaBackend(
          allLineItems,
          {
            orderName: completeOrder.order.orderName,
            deliveryDate: completeOrder.order.deliveryDate?.toISOString(),
            transferLocation: completeOrder.order.transferLocation,
            costCenter: completeOrder.order.costCenter,
            cuttingCenter: completeOrder.order.cuttingCenter,
            deliveryMethod: completeOrder.order.deliveryMethod,
            processingType: completeOrder.order.processingType,
            customerName: completeOrder.order.customerName,
            company: completeOrder.order.company,
            notes: completeOrder.order.notes,
            totalPieces: completeOrder.specifications.reduce(
              (sum, spec) => sum + spec.pieces.reduce((ps, p) => ps + p.quantity, 0),
              0
            ).toString(),
            totalBoards: (completeOrder.cuttingLayouts?.length || 0).toString(),
            materialNames: completeOrder.specifications.map(s => s.material.title).join(', '),
          },
          {
            // Configuration data to be stored in metafield
            order: completeOrder.order,
            specifications: completeOrder.specifications.map(spec => ({
              material: {
                id: spec.material.id,
                title: spec.material.title,
                handle: spec.material.handle,
              },
              edgeMaterial: spec.edgeMaterial ? {
                id: spec.edgeMaterial.id,
                name: spec.edgeMaterial.name,
                edgeWidth: spec.edgeMaterial.edgeWidth,
              } : null,
              glueType: spec.glueType,
              pieces: spec.pieces.map(piece => ({
                id: piece.id,
                partName: piece.partName,
                length: piece.length,
                width: piece.width,
                quantity: piece.quantity,
                allowRotation: piece.allowRotation,
                withoutEdge: piece.withoutEdge,
                isDupel: piece.isDupel,
                edgeTop: piece.edgeTop,
                edgeBottom: piece.edgeBottom,
                edgeLeft: piece.edgeLeft,
                edgeRight: piece.edgeRight,
                edgeAllAround: piece.edgeAllAround,
                algorithmValue: piece.algorithmValue,
                notes: piece.notes,
                customEdgeTop: piece.customEdgeTop ? {
                  id: piece.customEdgeTop.id,
                  name: piece.customEdgeTop.name,
                  edgeWidth: piece.customEdgeTop.edgeWidth,
                } : null,
                customEdgeBottom: piece.customEdgeBottom ? {
                  id: piece.customEdgeBottom.id,
                  name: piece.customEdgeBottom.name,
                  edgeWidth: piece.customEdgeBottom.edgeWidth,
                } : null,
                customEdgeLeft: piece.customEdgeLeft ? {
                  id: piece.customEdgeLeft.id,
                  name: piece.customEdgeLeft.name,
                  edgeWidth: piece.customEdgeLeft.edgeWidth,
                } : null,
                customEdgeRight: piece.customEdgeRight ? {
                  id: piece.customEdgeRight.id,
                  name: piece.customEdgeRight.name,
                  edgeWidth: piece.customEdgeRight.edgeWidth,
                } : null,
              })),
            })),
            cuttingLayouts: completeOrder.cuttingLayouts?.map(layout => ({
              materialIndex: layout.materialIndex,
              boardNumber: layout.boardNumber,
              materialName: layout.materialName,
              totalPieces: layout.totalPieces,
              efficiency: layout.efficiency,
            })),
            orderCalculations: completeOrder.orderCalculations ? {
              totals: completeOrder.orderCalculations.totals,
              edgeConsumption: completeOrder.orderCalculations.edgeConsumption,
            } : null,
            timestamp: new Date().toISOString(),
          }
        );

        // Alternative: Use Storefront API (requires manual token setup)
        // const result = await createCartStorefront(allLineItems)

        // 4. Save order reference for history tracking
        try {
          const submittedService = createSubmittedOrderService();
          await submittedService.saveOrderReference({
            id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            draftOrderId: result.cart.id,
            orderId: null, // Will be updated when draft converts to order
            orderName: result.cart.id.split('/').pop() || result.cart.id,
            submittedAt: new Date().toISOString(),
            status: 'draft',
            totalPieces: completeOrder.specifications.reduce(
              (sum, spec) => sum + spec.pieces.reduce((ps, p) => ps + p.quantity, 0),
              0
            ),
            totalBoards: completeOrder.cuttingLayouts?.length || 0,
            materialNames: completeOrder.specifications.map(s => s.material.title)
          });
          console.log('✅ Order reference saved to customer history');
        } catch (historyError) {
          console.error('⚠️ Failed to save order reference (non-critical):', historyError);
          // Don't fail the order submission if history tracking fails
        }

        // 5. Set success state with checkout URL (no automatic redirect)
        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          success: true,
          checkoutUrl: result.cart.checkoutUrl,
          cartId: result.cart.id,
        }));

        return result;
      } catch (error) {
        let errorMessage =
          error instanceof Error ? error.message : "Neznáma chyba";

        // Handle specific Shopify quantity limit errors
        if (
          errorMessage.includes("môžete pridať len") &&
          errorMessage.includes("v počte")
        ) {
          // Extract product name and max quantity from Slovak error message
          const matches = errorMessage.match(/položku (.+?) v počte (\d+)/);
          if (matches) {
            const productName = matches[1];
            const maxQuantity = matches[2];
            errorMessage = `Materiál "${productName}" má maximálne ${maxQuantity} kusov skladom. Upravte množstvo v konfigurácii.`;
          }
        }

        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          error: `Chyba pri odosielaní objednávky: ${errorMessage}`,
        }));
        throw error;
      }
    },
    [state.cartId],
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const resetSuccess = useCallback(() => {
    setState((prev) => ({ ...prev, success: false, checkoutUrl: null }));
  }, []);

  return {
    ...state,
    submitOrder,
    clearError,
    resetSuccess,
  };
};

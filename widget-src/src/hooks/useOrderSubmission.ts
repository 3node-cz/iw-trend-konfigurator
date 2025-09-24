import { useState, useCallback } from "react";
import { createCartViaBackend, createCartStorefront } from "../api/cart";
import type { CompleteOrder } from "../types/shopify";
import { SHOPIFY_API } from "../constants";

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

          // Add edge material line item if present
          if (spec.edgeMaterial && spec.pieces.length > 0) {
            // Calculate total edge length needed (same logic as OrderInvoiceTable)
            const totalEdgeLength = spec.pieces.reduce((sum, piece) => {
              let pieceEdgeLength = 0;
              if (piece.edgeAllAround) {
                pieceEdgeLength =
                  ((piece.length + piece.width) * 2 * piece.quantity) / 1000; // Convert to meters
              } else {
                const edges = [
                  piece.edgeTop,
                  piece.edgeBottom,
                  piece.edgeLeft,
                  piece.edgeRight,
                ];
                edges.forEach((edge) => {
                  if (edge) {
                    // Simplified edge length calculation
                    pieceEdgeLength +=
                      (((piece.length + piece.width) / 2) * piece.quantity) /
                      1000;
                  }
                });
              }
              return sum + pieceEdgeLength;
            }, 0);

            if (totalEdgeLength > 0) {
              // Get the correct variant ID for the edge material - check both variantId and variant.id
              let edgeMerchandiseId: string;
              if (spec.edgeMaterial.variantId) {
                edgeMerchandiseId = spec.edgeMaterial.variantId;
              } else if (spec.edgeMaterial.variant?.id) {
                edgeMerchandiseId = spec.edgeMaterial.variant.id;
              } else {
                // Fallback to product ID if no variant ID available
                edgeMerchandiseId = spec.edgeMaterial.id;
                console.warn(`Using product ID as fallback for edge material: ${spec.edgeMaterial.name}`);
              }

              allLineItems.push({
                variantId: edgeMerchandiseId,
                quantity: Math.ceil(totalEdgeLength), // Round up to whole meters
                attributes: [
                  {
                    key: "_edge_specification",
                    value: JSON.stringify({
                      edgeMaterial: spec.edgeMaterial,
                      totalEdgeLength: totalEdgeLength,
                      relatedMaterial: spec.material.name,
                    }),
                  },
                ],
              });
            }
          }
        }

        // TODO: Add cutting service product later when we have the correct variant ID
        // For now, we're only sending material line items to avoid variant ID issues
        console.log("Cutting service temporarily disabled - only sending materials");

        // 3. Create cart/draft order via backend API (recommended approach)
        const result = await createCartViaBackend(allLineItems);

        // Alternative: Use Storefront API (requires manual token setup)
        // const result = await createCartStorefront(allLineItems)

        // 4. Set success state with checkout URL (no automatic redirect)
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

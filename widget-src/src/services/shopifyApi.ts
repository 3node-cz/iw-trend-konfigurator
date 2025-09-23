import type { MaterialSearchParams, MaterialSearchResult, CompleteOrder, CuttingSpecification, CuttingPiece } from '../types/shopify'


// Admin API calls should go through backend


export const searchMaterials = async (params: MaterialSearchParams): Promise<MaterialSearchResult[]> => {

  // Build search parameters
  const searchParams = new URLSearchParams({
    query: params.query,
    limit: params.limit?.toString() || '250'
  });

  if (params.collection) {
    searchParams.append('collection', params.collection);
  }

  if (params.warehouse) {
    searchParams.append('warehouse', params.warehouse);
  }

  try {
    // Call our Remix API route via app proxy (use relative path like update-metafield)
    const response = await fetch(
      `/apps/konfigurator/api/search-materials?${searchParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error('Search error:', error);
    throw new Error('Failed to search materials from Shopify');
  }
}

// Submit complete order to Shopify (Admin API)
export const submitOrderToShopify = async (completeOrder: CompleteOrder): Promise<any> => {
  const { order, specifications } = completeOrder

  // Prepare order data for Shopify
  const shopifyOrder = {
    order: {
      email: 'orders@iwtrend.sk', // Default email or from order
      line_items: specifications.flatMap((specification: CuttingSpecification, index: number) => {
        const materialLineItem = {
          variant_id: specification.material.id,
          quantity: specification.pieces.reduce((sum: number, piece: CuttingPiece) => sum + piece.quantity, 0),
          properties: [
            {
              name: 'Názov zákazky',
              value: order.orderName
            },
            {
              name: 'Nárezové centrum',
              value: order.cuttingCenter
            },
            {
              name: 'Typ lepidla',
              value: specification.glueType
            },
            {
              name: 'Materiál číslo',
              value: (index + 1).toString()
            }
          ]
        }

        const edgeLineItem = specification.edgeMaterial ? {
          variant_id: specification.edgeMaterial.id,
          quantity: 1, // Calculate based on pieces
          properties: [
            {
              name: 'Typ hrany',
              value: 'Hrana'
            },
            {
              name: 'Materiál číslo',
              value: (index + 1).toString()
            }
          ]
        } : null

        return [materialLineItem, edgeLineItem].filter(Boolean)
      }),
      shipping_address: {
        company: order.company,
        address1: order.transferLocation,
        city: order.costCenter,
        country: 'Slovakia'
      },
      note: order.notes,
      tags: ['cutting-order', 'konfigurator'],
      metafields: [
        {
          namespace: 'cutting_specification',
          key: 'specifications',
          value: JSON.stringify(specifications),
          type: 'json'
        },
        {
          namespace: 'cutting_specification', 
          key: 'delivery_date',
          value: order.deliveryDate?.toISOString() || '',
          type: 'date'
        },
        {
          namespace: 'cutting_specification',
          key: 'processing_type',
          value: order.processingType,
          type: 'single_line_text_field'
        }
      ]
    }
  }

  try {
    // NOTE: This function currently won't work because Admin API access is not configured
    // Admin API calls should go through your backend server, not frontend
    throw new Error('Order submission must be implemented on backend server for security')
  } catch (error) {
    throw new Error('Failed to submit order to Shopify')
  }
}



// Search edge materials using collection filter (much more efficient)
export const searchEdgeMaterials = async (params: MaterialSearchParams): Promise<MaterialSearchResult[]> => {
  try {
    // Search directly in the "hrany" collection - much more efficient than complex queries
    const results = await searchMaterials({
      ...params,
      collection: "hrany"  // Filter to edges collection
    });

    return results;

  } catch (error) {
    throw new Error('Failed to search edge materials from Shopify');
  }
}

export default {
  searchMaterials,
  searchEdgeMaterials,
  submitOrderToShopify
}
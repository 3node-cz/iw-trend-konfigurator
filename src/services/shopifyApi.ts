import type { OrderFormData, CuttingSpecification, MaterialSearchParams, MaterialSearchResult } from '../types/shopify'


// Frontend-safe Shopify configuration (Storefront API only)
const SHOPIFY_STOREFRONT_CONFIG = {
  storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'your-store.myshopify.com',
  storefrontAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || ''
}

// ⚠️ NEVER put Admin API credentials in frontend!
// Admin API calls should go through your backend API

interface CompleteOrder {
  order: OrderFormData
  specification: CuttingSpecification
  submittedAt: Date
}

// Shopify Storefront API for searching materials
export const searchMaterials = async (params: MaterialSearchParams): Promise<MaterialSearchResult[]> => {
  const query = `
    query searchProducts($query: String!, $first: Int) {
      products(query: $query, first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  availableForSale
                  quantityAvailable
                }
              }
            }
            metafields(identifiers: [
              {namespace: "custom", key: "product_code"},
              {namespace: "custom", key: "availability"},
              {namespace: "custom", key: "warehouse"},
              {namespace: "custom", key: "dimensions"}
            ]) {
              key
              value
            }
          }
        }
      }
    }
  `

  // Debug log to see what we're searching for
  console.log('Searching materials with query:', params.query)
  console.log('Using store domain:', SHOPIFY_STOREFRONT_CONFIG.storeDomain)
  
  try {
    const response = await fetch(`https://${SHOPIFY_STOREFRONT_CONFIG.storeDomain}/api/2023-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_CONFIG.storefrontAccessToken
      },
      body: JSON.stringify({
        query,
        variables: {
          query: params.query,
          first: params.limit || 20
        }
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // Debug log the response
    console.log('Shopify API response:', data)
    
    // Check for GraphQL errors
    if (data.errors) {
      console.error('GraphQL errors:', data.errors)
      throw new Error(data.errors[0]?.message || 'GraphQL error')
    }
    
    // Validate data structure
    if (!data.data?.products?.edges) {
      console.error('Invalid API response structure:', data)
      throw new Error('Invalid response from Shopify API')
    }
    
    // Transform Shopify response to our MaterialSearchResult format
    return data.data.products.edges.map((edge: any) => {
      const product = edge.node
      const variant = product.variants.edges[0]?.node
      
      // Extract metafields (filter out null fields)
      const metafields = product.metafields
        .filter((field: any) => field !== null && field.key)
        .reduce((acc: any, field: any) => {
          acc[field.key] = field.value
          return acc
        }, {})

      return {
        id: product.id,
        code: metafields.product_code || product.handle,
        name: product.title,
        productCode: metafields.product_code || '',
        availability: metafields.availability || 'available',
        warehouse: metafields.warehouse || 'Bratislava',
        price: {
          amount: parseFloat(variant?.price.amount || '0'),
          currency: variant?.price.currencyCode || 'EUR',
          perUnit: '/ ks'
        },
        totalPrice: variant?.compareAtPrice ? {
          amount: parseFloat(variant.compareAtPrice.amount),
          currency: variant.compareAtPrice.currencyCode
        } : undefined,
        dimensions: metafields.dimensions ? JSON.parse(metafields.dimensions) : undefined
      } as MaterialSearchResult
    })
  } catch (error) {
    console.error('Error searching materials:', error)
    throw new Error('Failed to search materials from Shopify')
  }
}

// Submit complete order to Shopify (Admin API)
export const submitOrderToShopify = async (completeOrder: CompleteOrder): Promise<any> => {
  const { order, specification } = completeOrder

  // Prepare order data for Shopify
  const shopifyOrder = {
    order: {
      email: 'orders@iwtrend.sk', // Default email or from order
      line_items: [
        // Main material
        {
          variant_id: specification.material.id,
          quantity: specification.pieces.reduce((sum, piece) => sum + piece.quantity, 0),
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
            }
          ]
        },
        // Edge material (if selected)
        ...(specification.edgeMaterial ? [{
          variant_id: specification.edgeMaterial.id,
          quantity: 1, // Calculate based on pieces
          properties: [
            {
              name: 'Typ hrany',
              value: 'Hrana'
            }
          ]
        }] : [])
      ],
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
          key: 'pieces',
          value: JSON.stringify(specification.pieces),
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
    console.warn('⚠️ Admin API calls should be handled by backend server')
    
    throw new Error('Order submission must be implemented on backend server for security')
  } catch (error) {
    console.error('Error submitting order to Shopify:', error)
    throw new Error('Failed to submit order to Shopify')
  }
}

// Get collection hierarchy for material categories
export const getCollectionHierarchy = async (): Promise<any> => {
  const query = `
    query getCollections {
      collections(first: 50) {
        edges {
          node {
            id
            title
            handle
            parent: metafield(namespace: "hierarchy", key: "parent") {
              value
            }
            children: metafield(namespace: "hierarchy", key: "children") {
              value
            }
          }
        }
      }
    }
  `

  try {
    const response = await fetch(`https://${SHOPIFY_STOREFRONT_CONFIG.storeDomain}/api/2023-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_CONFIG.storefrontAccessToken
      },
      body: JSON.stringify({ query })
    })

    const data = await response.json()
    return data.data.collections.edges.map((edge: any) => edge.node)
  } catch (error) {
    console.error('Error fetching collections:', error)
    throw new Error('Failed to fetch collections from Shopify')
  }
}


// Search edge materials using the main search API (more efficient)
export const searchEdgeMaterials = async (params: MaterialSearchParams): Promise<MaterialSearchResult[]> => {
  try {
    console.log('🔍 Searching edge materials with query:', params.query)
    
    // Use the main search but add edge-specific search terms
    const edgeQuery = `${params.query} hrana OR ${params.query} edge OR ${params.query} abs`
    
    const results = await searchMaterials({
      query: edgeQuery,
      limit: params.limit || 10
    })
    
    // Filter results to only include edge-related products
    const edgeResults = results.filter((result) => {
      const lowerTitle = result.name.toLowerCase()
      const lowerCode = result.code.toLowerCase()
      
      return (
        lowerTitle.includes('hrana') ||
        lowerTitle.includes('edge') ||
        lowerTitle.includes('abs') ||
        lowerCode.includes('hr') ||
        lowerCode.includes('edge')
      )
    })
    
    console.log('✅ Found', edgeResults.length, 'edge materials from', results.length, 'total results')
    return edgeResults
    
  } catch (error) {
    console.error('❌ Error searching edge materials:', error)
    throw new Error('Failed to search edge materials from Shopify')
  }
}

export default {
  searchMaterials,
  searchEdgeMaterials,
  submitOrderToShopify,
  getCollectionHierarchy
}
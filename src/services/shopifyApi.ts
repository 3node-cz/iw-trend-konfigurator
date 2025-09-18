import type { MaterialSearchParams, MaterialSearchResult, CompleteOrder, CuttingSpecification, CuttingPiece } from '../types/shopify'


import { SHOPIFY_CONFIG, getShopifyHeaders } from '../config/shopify'
import { SHOPIFY_API } from '../constants'


// Admin API calls should go through backend

export const searchMaterials = async (params: MaterialSearchParams): Promise<MaterialSearchResult[]> => {
  const query = `
    query searchProducts($query: String!, $first: Int, $sortKey: ProductSortKeys, $reverse: Boolean) {
      products(query: $query, first: $first, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            id
            title
            handle
            description
            featuredImage {
              url
              altText
            }
            images(first: 3) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
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
                  image {
                    url
                    altText
                  }
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

  // Always show all products, regardless of availability
  const showAvailableOnly = false
  
  const searchQuery = params.query

  try {
    const response = await fetch(SHOPIFY_CONFIG.STOREFRONT_URL, {
      method: 'POST',
      headers: getShopifyHeaders(true),
      body: JSON.stringify({
        query,
        variables: {
          query: searchQuery,
          first: 250,
          sortKey: "RELEVANCE",
          reverse: false
        }
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.errors) {
      throw new Error(data.errors[0]?.message || 'GraphQL error')
    }
    
    // Handle single query response structure
    if (!data.data?.products?.edges) {
      throw new Error('Invalid response from Shopify API')
    }
    
    const allProducts = data.data.products.edges.map((edge: any) => {
      const product = edge.node
      const variant = product.variants.edges[0]?.node
      
      const metafields = product.metafields
        .filter((field: any) => field !== null && field.key)
        .reduce((acc: any, field: any) => {
          acc[field.key] = field.value
          return acc
        }, {})


      return {
        id: product.id,
        variantId: variant?.id,
        code: metafields.product_code || product.handle,
        name: product.title,
        productCode: metafields.product_code || '',
        availability: variant?.availableForSale ? 'available' : 'unavailable',
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
        dimensions: metafields.dimensions ? JSON.parse(metafields.dimensions) : undefined,
        image: variant?.image?.url || product.featuredImage?.url,
        images: product.images?.edges?.map((edge: any) => edge.node.url) || [],
        description: product.description
      } as MaterialSearchResult
    })

    
    let filteredProducts = allProducts
    
    if (params.collection) {
      filteredProducts = allProducts.filter((product: MaterialSearchResult) => {
        if (params.collection === 'dekorativne-plosne-materialy') {
          // Filter for board materials - exclude products that look like edges
          const name = product.name.toLowerCase()
          const productCode = product.productCode?.toLowerCase() || ''
          
          // Exclude obvious edge materials (ABS, PVC edges, etc.)
          const isEdgeMaterial = name.includes('abs') || 
                               name.includes('pvc') || 
                               name.includes('hrana') ||
                               name.includes('edge') ||
                               productCode.includes('abs') ||
                               productCode.includes('pvc')
          
          return !isEdgeMaterial
        } else if (params.collection === 'hrany') {
          // Filter for edge materials - include only products that look like edges
          const name = product.name.toLowerCase()
          const productCode = product.productCode?.toLowerCase() || ''
          
          // Include edge materials (ABS, PVC edges, etc.)
          const isEdgeMaterial = name.includes('abs') || 
                               name.includes('pvc') || 
                               name.includes('hrana') ||
                               name.includes('edge') ||
                               productCode.includes('abs') ||
                               productCode.includes('pvc')
          
          return isEdgeMaterial
        }
        return true
      })
      // Collection filtering applied
    }
    
    // Sort by availability first (available products at the top)
    filteredProducts.sort((a: MaterialSearchResult, b: MaterialSearchResult) => {
      // Available products first
      if (a.availability === 'available' && b.availability !== 'available') return -1
      if (a.availability !== 'available' && b.availability === 'available') return 1
      
      // Then by relevance (keep original order from Shopify for same availability)
      return 0
    })

    // Filter by availability (client-side since GraphQL filter doesn't work reliably)
    if (showAvailableOnly) {
      filteredProducts = filteredProducts.filter((product: MaterialSearchResult) => 
        product.availability === 'available'
      )
    }
    
    // Filter by warehouse if specified
    if (params.warehouse) {
      filteredProducts = filteredProducts.filter((product: MaterialSearchResult) => 
        product.warehouse === params.warehouse
      )
    }
    
    // Apply limit to get the exact number of results requested
    if (params.limit && params.limit > 0) {
      filteredProducts = filteredProducts.slice(0, params.limit)
    }
    
    return filteredProducts
  } catch (error) {
    console.error('Search error:', error)
    throw new Error('Failed to search materials from Shopify')
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
    const response = await fetch(SHOPIFY_CONFIG.STOREFRONT_URL, {
      method: 'POST',
      headers: getShopifyHeaders(true),
      body: JSON.stringify({ query })
    })

    const data = await response.json()
    return data.data.collections.edges.map((edge: any) => edge.node)
  } catch (error) {
    console.error('Error fetching collections:', error)
    throw new Error('Failed to fetch collections from Shopify')
  }
}


// Search edge materials using collection filter (much more efficient)
export const searchEdgeMaterials = async (params: MaterialSearchParams): Promise<MaterialSearchResult[]> => {
  try {
    // Search directly in the "hrany" collection - much more efficient than complex queries
    const results = await searchMaterials({
      ...params,
      collection: "hrany"  // Filter to edges collection
    })
    
    return results
    
  } catch (error) {
    throw new Error('Failed to search edge materials from Shopify')
  }
}

export default {
  searchMaterials,
  searchEdgeMaterials,
  submitOrderToShopify,
  getCollectionHierarchy
}
import type { OrderFormData, CuttingSpecification, MaterialSearchParams, MaterialSearchResult } from '../types/shopify'

// Types for edge products
export type EdgeVariant = {
  id: string
  title: string
  sku: string | null
  price: {
    amount: string
    currencyCode: string
  }
  image?: {
    url: string
  } | null
}

export type EdgeProduct = {
  id: string
  title: string
  vendor: string
  description?: string
  handle?: string
  featuredImage?: {
    url: string
    altText?: string | null
  }
  variants: EdgeVariant[]
}

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
    const response = await fetch(`https://${SHOPIFY_STOREFRONT_CONFIG.storeDomain}/admin/api/2023-10/orders.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_STOREFRONT_CONFIG.adminAccessToken
      },
      body: JSON.stringify(shopifyOrder)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result.order
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

// GraphQL query for fetching products by collection
const GET_PRODUCTS_BY_COLLECTION_ID = `
  query getProductsByCollectionId($id: ID!, $pageSize: Int!, $variantsSize: Int!, $cursor: String) {
    collection(id: $id) {
      products(first: $pageSize, after: $cursor) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            id
            title
            vendor
            description
            handle
            featuredImage {
              url
              altText
            }
            variants(first: $variantsSize) {
              edges {
                node {
                  id
                  title
                  sku
                  price {
                    amount
                    currencyCode
                  }
                  image {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

// Fetch edge products by collection ID
export const fetchEdgeProducts = async (collectionId: string): Promise<{
  products: EdgeProduct[]
  vendors: string[]
}> => {
  let allProducts: EdgeProduct[] = []
  let cursor: string | null = null
  let hasNextPage = true
  let pageCount = 0
  const MAX_PAGES = 3 // Reduced to prevent too many API calls
  const seenCursors = new Set<string>() // Track cursors we've seen

  try {
    while (hasNextPage && pageCount < MAX_PAGES) {
      pageCount++
      console.log('🔍 Fetching edge products, page:', pageCount, 'hasNextPage:', hasNextPage)
      
      const response = await fetch(`https://${SHOPIFY_STOREFRONT_CONFIG.storeDomain}/api/2023-10/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_CONFIG.storefrontAccessToken
        },
        body: JSON.stringify({
          query: GET_PRODUCTS_BY_COLLECTION_ID,
          variables: {
            id: collectionId,
            pageSize: 20,
            variantsSize: 10,
            cursor,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()

      if (json.errors) {
        console.error('GraphQL errors:', json.errors)
        throw new Error(json.errors[0]?.message || 'GraphQL error')
      }

      // Log API cost info
      const costInfo = json.extensions?.cost
      if (costInfo) {
        const { requestedQueryCost, throttleStatus } = costInfo
        const { currentlyAvailable, maximumAvailable } = throttleStatus
        console.log(`Query cost: ${requestedQueryCost}, Available: ${currentlyAvailable}/${maximumAvailable}`)
        
        if (currentlyAvailable < 100) {
          console.warn('Shopify API limit sa blíži vyčerpaniu!')
        }
      }

      const edges = json.data.collection?.products?.edges || []

      const products: EdgeProduct[] = edges.map((edge: any) => {
        const p = edge.node
        return {
          id: p.id,
          title: p.title,
          vendor: p.vendor,
          description: p.description,
          handle: p.handle,
          featuredImage: p.featuredImage ? {
            url: p.featuredImage.url,
            altText: p.featuredImage.altText
          } : undefined,
          variants: p.variants.edges.map((vEdge: any) => ({
            id: vEdge.node.id,
            title: vEdge.node.title,
            sku: vEdge.node.sku,
            price: {
              amount: vEdge.node.price.amount,
              currencyCode: vEdge.node.price.currencyCode
            },
            image: vEdge.node.image ? { url: vEdge.node.image.url } : null,
          })),
        }
      })

      allProducts = [...allProducts, ...products]

      hasNextPage = json.data.collection?.products?.pageInfo?.hasNextPage || false
      const newCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null
      
      console.log('✅ Fetched', products.length, 'edge products, hasNextPage:', hasNextPage, 'newCursor:', newCursor?.substring(0, 20))
      
      // Break if we've seen this cursor before (prevents infinite loops)
      if (newCursor && seenCursors.has(newCursor)) {
        console.warn('⚠️ Cursor already seen, breaking pagination loop')
        break
      }
      
      // Add cursor to seen set
      if (newCursor) {
        seenCursors.add(newCursor)
      }
      
      cursor = newCursor
    }

    const vendors = Array.from(new Set(allProducts.map((p) => p.vendor).filter(Boolean)))

    console.log('🎯 Total edge products fetched:', allProducts.length, 'from vendors:', vendors)
    return { products: allProducts, vendors }
  } catch (error) {
    console.error('❌ fetchEdgeProducts error:', error)
    return { products: [], vendors: [] }
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
  fetchEdgeProducts,
  submitOrderToShopify,
  getCollectionHierarchy
}
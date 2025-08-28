// Shopify API types for material selection
export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  code: string // e.g., "H1180", "DTD_H1180"
  description?: string
  variants: {
    nodes: ProductVariant[]
  }
  availability: 'available' | 'unavailable'
  warehouse?: string // e.g., "Bratislava", "Žilina"
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
}

export interface ProductVariant {
  id: string
  title: string
  price: {
    amount: string
    currencyCode: string
  }
  compareAtPrice?: {
    amount: string
    currencyCode: string
  }
  availableForSale: boolean
  quantityAvailable?: number
}

export interface MaterialSearchResult {
  id: string
  code: string // "H1180"
  name: string // "DTD_H1180 ST37 Dub Halifax prírodný 2800/2070/18.6"
  productCode: string // "275048"
  availability: 'available' | 'unavailable' | 'limited'
  warehouse: string // "Bratislava"
  price: {
    amount: number
    currency: string
    perUnit: string // "/ ks" or "/ m²"
  }
  totalPrice?: {
    amount: number
    currency: string
  }
  discountInfo?: string // "22 % / 0 %" 
  quantity?: number
  dimensions?: {
    width: number
    height: number
    thickness: number
  }
}

export interface CollectionHierarchy {
  id: string
  title: string
  parent: ParentMetafield | null
  children: ChildrenMetafield | null
}

export interface ParentMetafield {
  type: 'collection_reference'
  reference: CollectionReference | null
}

export interface ChildrenMetafield {
  type: 'list.collection_reference'
  references: {
    nodes: CollectionReference[]
    pageInfo: PageInfo
  }
}

export interface CollectionReference {
  id: string
  title: string
  handle: string
}

export interface PageInfo {
  hasNextPage: boolean
  endCursor: string | null
}

// For the material selection interface
export interface SelectedMaterial {
  id: string
  code: string
  name: string
  quantity: number
  price: number
  totalPrice: number
  variantId: string
}

export interface MaterialSearchParams {
  query: string
  collection?: string
  availability?: 'available' | 'all'
  warehouse?: string
  limit?: number
}

// Order form data
export interface OrderFormData {
  company: string
  transferLocation: string
  costCenter: string
  cuttingCenter: string
  orderName: string
  deliveryDate: Date | null
  materialType: string
  deliveryMethod: string
  processingType: string
  withoutEdges: boolean
  bandingFree: boolean
  palettePayment: boolean
  notes: string
}
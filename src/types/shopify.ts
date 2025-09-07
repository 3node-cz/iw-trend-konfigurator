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
  image?: string // Featured product image URL
  grainDirection?: 'horizontal' | 'vertical' // Wood grain direction for visualization
  images?: string[] // Additional product images
  description?: string // Product description
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
  image?: string // Add image field
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

// Cutting specification interfaces
export interface EdgeMaterial {
  id: string
  name: string
  productCode: string
  availability: 'available' | 'unavailable' | 'limited'
  thickness: number // Current/default thickness in mm
  availableThicknesses: number[] // Available thickness options in mm (e.g., [0.4, 0.8, 2])
  warehouse: string
  image?: string // Optional edge material image
}

export interface CuttingPiece {
  id: string
  partName: string // Názov dielca
  length: number // in mm
  width: number // in mm
  quantity: number
  glueEdge: boolean // Letokruhy
  withoutEdge: boolean // Bez orezu
  duplicate: boolean // Dupel
  edgeAllAround: number | null // Hrana dookola - thickness in mm (0.8, 1, 2)
  edgeTop: number | null // Hrana vrch - thickness in mm
  edgeBottom: number | null // Hrana spodok - thickness in mm
  edgeLeft: number | null // Hrana ľavá - thickness in mm
  edgeRight: number | null // Hrana pravá - thickness in mm
  notes: string // Poznámka
}

export interface CuttingSpecification {
  material: MaterialSearchResult
  edgeMaterial: EdgeMaterial | null
  glueType: string // PUR transparentná/bílá, etc.
  pieces: CuttingPiece[]
  allowRotation?: boolean // Allow pieces to be rotated for better optimization
}

// Complete order for submission
export interface CompleteOrder {
  order: OrderFormData
  specification: CuttingSpecification[]
  submittedAt: Date
}
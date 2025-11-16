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

// Clean Shopify API structure
export interface MaterialSearchResult {
  id: string // Product or Variant ID
  title: string // Product title
  handle: string // Product handle
  vendor: string // Product vendor
  productType: string // Product type
  tags: string[] // Product tags
  variant?: {
    id: string // Variant ID
    title: string // Variant title
    sku: string // SKU
    price: string // Price as string (Shopify format)
    inventoryQuantity: number
    availableForSale: boolean
    metafields: Record<string, string>
  }
  metafields: Record<string, string> // Product metafields
  image?: string // Featured product image URL
  images?: string[] // Additional product images
  description?: string // Product description
  dimensions?: {
    width: number
    height: number
    thickness: number
  } // Product dimensions in mm
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
  availableOnly?: boolean // When false, shows all products including unavailable
  warehouse?: string
  limit?: number
}

// Order form data - re-export from schema
export type { OrderFormData } from '../schemas/orderSchema'

// Cutting specification interfaces
export interface EdgeMaterial {
  id: string
  variantId?: string // Shopify ProductVariant ID for cart operations
  code?: string // Material code
  name: string
  productCode: string
  availability: 'available' | 'unavailable' | 'limited'
  warehouse: string
  price?: {
    amount: number
    currency: string
    perUnit: string
  }
  image?: string // Optional edge material image

  // Edge specification fields
  edgeWidth: number // Edge width from param.sirka_hrany (0.45, 1, or 2 mm)
  boardThickness: number // Board thickness from param.hrubka_hrany (18 or 36 mm for dupel)
  isPlaceholder?: boolean // True if this is a placeholder for missing edge
  missingSpec?: {
    width: number
    boardThickness: number
    materialName?: string // Material name for order notes when using placeholder
  } // Details about missing edge specification
}

export interface CuttingPiece {
  id: string
  partName: string // Názov dielca
  length: number // in mm
  width: number // in mm
  quantity: number
  allowRotation: boolean // Povoliť rotáciu (pôvodne Letokruhy)
  withoutEdge: boolean // Bez orezu
  duplicate: boolean // UNUSED - kept for data compatibility
  isDupel: boolean // Dupel - double-glued piece (2× thickness, +20mm margins)
  edgeAllAround: number | null // Hrana dookola - thickness in mm (0.8, 1, 2)
  algorithmValue: number // Hodnota pre algoritmus rozmiestňovania
  edgeTop: number | null // Hrana vrch - thickness in mm
  edgeBottom: number | null // Hrana spodok - thickness in mm
  edgeLeft: number | null // Hrana ľavá - thickness in mm
  edgeRight: number | null // Hrana pravá - thickness in mm
  notes: string // Poznámka
  // Custom edge materials - optional, fallback to default edgeMaterial if null
  customEdgeTop?: EdgeMaterial | null
  customEdgeBottom?: EdgeMaterial | null
  customEdgeLeft?: EdgeMaterial | null
  customEdgeRight?: EdgeMaterial | null
}

export interface CuttingSpecification {
  material: MaterialSearchResult
  edgeMaterial: EdgeMaterial | null
  availableEdges?: EdgeMaterial[] // All available edge combinations for this material
  glueType: string // PUR transparentná/bílá, etc.
  pieces: CuttingPiece[]
}

// Order calculations interface
export interface OrderCalculations {
  edgeConsumption: any[] // MaterialEdgeConsumption[]
  cuttingCosts: any[] // CuttingCostBreakdown[]
  totals: {
    totalEdgeLength: number // Total edge length in meters across all materials
    totalCuttingCost: number // Total cutting cost in EUR
    totalPieces: number // Total number of pieces
    totalMaterials: number // Number of different materials
    totalCuts: number // Total number of actual cuts needed
  }
}

// Complete order for submission
export interface CompleteOrder {
  order: any // OrderFormData from schemas - avoid circular dependency
  specifications: CuttingSpecification[]
  cuttingLayouts?: any[] // From useCuttingLayouts hook
  orderCalculations?: OrderCalculations // From useOrderCalculations hook
  submittedAt: Date
}
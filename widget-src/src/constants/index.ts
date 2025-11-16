// UI Constants
export const UI_CONSTANTS = {
  COLORS: {
    PRIMARY: '#1976d2',
    ERROR: '#ff4444',
    WARNING: '#ff6600',
    SUCCESS: '#4caf50',
  },
  LAYOUT: {
    MAX_CONTAINER_WIDTH: '1920px',
    DEFAULT_PADDING: 3,
    COMPACT_PADDING: 2,
    SMALL_GAP: 1,
    MEDIUM_GAP: 2,
    LARGE_GAP: 3,
  }
} as const

// Material and Board Dimensions
export const DIMENSIONS = {
  STANDARD_BOARD: {
    WIDTH: 2800,
    HEIGHT: 2070,
    THICKNESS: 18, // Default thickness in mm
  },
  EDGE_WIDTHS: [0.45, 1, 2] as const, // Available edge widths in mm
  BOARD_THICKNESSES: [18, 36] as const, // Board thicknesses: 18mm standard, 36mm dupel
  CUTTING_KERF: 3.2, // Saw blade width in mm
} as const

// Pricing Constants
export const PRICING = {
  CUTTING: {
    BASE_COST: 0.50,
    COMPLEXITY_COST: 0.25,
    MINIMUM_CHARGE: 2.00,
  },
  EDGING: {
    BASE_COST: 1.20,
    SETUP_COST: 0.30,
  },
  CURRENCY: 'EUR',
} as const

// Search and API Constants
export const SEARCH = {
  MIN_QUERY_LENGTH: 2,
  DEFAULT_LIMIT: 10,
  MAX_RESULTS: 50,
  DEBOUNCE_DELAY: 300,
} as const

// Shopify Collections
export const COLLECTIONS = {
  BOARDS: 'porezove-produkty', // Collection for board materials
  EDGES: 'hrany-konfigurator', // Collection for edge materials
} as const

// Shopify Collection IDs (numeric IDs for GraphQL filtering)
export const COLLECTION_IDS = {
  BOARDS: '735247827326', // Porezove produkty collection ID
  EDGES: '735538577790', // Hrany konfigurator collection ID
} as const

// Map collection handles to IDs for backend filtering
export const COLLECTION_HANDLE_TO_ID: Record<string, string> = {
  [COLLECTIONS.BOARDS]: COLLECTION_IDS.BOARDS,
  [COLLECTIONS.EDGES]: COLLECTION_IDS.EDGES,
} as const

// Edge Material Keywords
export const EDGE_KEYWORDS = {
  SLOVAK: ['hrana', 'hranový', 'abs'],
  ENGLISH: ['edge', 'edging'],
  CODES: ['hr', 'edge', 'abs'],
} as const

// Glue Types
export const GLUE_TYPES = [
  'PUR transparentná/bílá',
  'PUR čierna',
  'EVA transparentná',
  'EVA čierna',
] as const

// Processing Types  
export const PROCESSING_TYPES = [
  'Štandardné rezanie',
  'Presné rezanie',
  'Presné rezanie + leštenie',
] as const

// Delivery Methods
export const DELIVERY_METHODS = [
  'Osobný odber',
  'Doručenie kuriérom',
  'Vlastná doprava',
] as const

// Shopify API Configuration
export const SHOPIFY_API = {
  VERSIONS: {
    STOREFRONT: '2023-10',
    ADMIN: '2023-07',
  },
  HEADERS: {
    CONTENT_TYPE: 'application/json',
    STOREFRONT_TOKEN_HEADER: 'X-Shopify-Storefront-Access-Token',
    ADMIN_TOKEN_HEADER: 'X-Shopify-Access-Token',
  },
  CART_ATTRIBUTES: {
    CUTTING_DATA: '_cutting_data',
    ORDER_TYPE: '_order_type',
    MATERIAL_SPEC: '_material_specification',
  },
  ORDER_TYPE: 'cutting_specification',
  // Service Product IDs - TODO: Replace with actual variant IDs
  SERVICES: {
    // Temporary: Using a known working variant ID until we get the actual cutting service variant ID
    CUTTING_SERVICE_VARIANT_ID: 'gid://shopify/ProductVariant/51514284671317',
    // Fallback product ID for conversion
    CUTTING_SERVICE_PRODUCT_ID: 'gid://shopify/Product/15514687799678',
  },
  // Placeholder edge product - used when customer needs unavailable edge combination
  // TODO: Replace with actual placeholder edge product from Shopify
  PLACEHOLDER_EDGE: {
    PRODUCT_ID: 'gid://shopify/Product/PLACEHOLDER_EDGE_TO_BE_CREATED',
    VARIANT_ID: 'gid://shopify/ProductVariant/PLACEHOLDER_EDGE_VARIANT_TO_BE_CREATED',
    SKU: 'EDGE-PLACEHOLDER',
    NAME: 'Hrana na objednávku / Custom Edge Order',
  },
} as const

// File Size Limits
export const FILE_LIMITS = {
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const

// Validation Constants
export const VALIDATION = {
  MIN_PIECE_DIMENSION: 10, // Default minimum piece size in mm (actual minimum configured in Shopify admin)
  MAX_PIECE_DIMENSION: 2800, // Maximum piece size in mm (board width)
  MAX_PIECES_PER_SPEC: 100, // Maximum pieces per material specification
  MAX_MATERIALS_PER_ORDER: 20, // Maximum materials per order
  MIN_ORDER_NAME_LENGTH: 3,
  MAX_ORDER_NAME_LENGTH: 100,
} as const

// Order Configuration
export const ORDER_CONFIG = {
  DEFAULT_DELIVERY_DAYS: 7, // Default delivery time in days from order creation
} as const
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
  EDGE_THICKNESSES: [0.4, 0.8, 1.0, 2.0] as const,
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
} as const

// File Size Limits
export const FILE_LIMITS = {
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const

// Validation Constants
export const VALIDATION = {
  MIN_PIECE_DIMENSION: 10, // Minimum piece size in mm
  MAX_PIECE_DIMENSION: 2800, // Maximum piece size in mm (board width)
  MAX_PIECES_PER_SPEC: 100, // Maximum pieces per material specification
  MAX_MATERIALS_PER_ORDER: 20, // Maximum materials per order
  MIN_ORDER_NAME_LENGTH: 3,
  MAX_ORDER_NAME_LENGTH: 100,
} as const
// UNIFIED CONSTANTS & ENUMS - Single source of truth

// Business Logic Constants
export const EDGE_THICKNESSES = [0.4, 0.8, 1.0, 2.0] as const
export const GLUE_TYPES = [
  'PUR transparentná/bílá',
  'PUR čierna',
  'EVA transparentná',
  'EVA čierna',
] as const

export const DELIVERY_METHODS = [
  'Osobný odber',
  'Doručenie kuriérom',
  'Vlastná doprava',
] as const

export const PROCESSING_TYPES = [
  'Štandardné rezanie',
  'Presné rezanie',
  'Presné rezanie + leštenie',
] as const

// Availability Status (unified across all entities)
export const AVAILABILITY_STATUS = {
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable',
  LIMITED: 'limited'
} as const

// Currency (always EUR, but centralized)
export const CURRENCY = 'EUR' as const

// Derived Types
export type EdgeThickness = typeof EDGE_THICKNESSES[number]
export type GlueType = typeof GLUE_TYPES[number]
export type DeliveryMethod = typeof DELIVERY_METHODS[number]
export type ProcessingType = typeof PROCESSING_TYPES[number]
export type AvailabilityStatus = typeof AVAILABILITY_STATUS[keyof typeof AVAILABILITY_STATUS]

// Validation Constants
export const VALIDATION_RULES = {
  PIECE: {
    MIN_DIMENSION: 10,    // mm
    MAX_DIMENSION: 2800,  // mm
    MAX_QUANTITY: 999
  },
  ORDER: {
    MAX_MATERIALS: 20,
    MAX_PIECES_PER_SPEC: 100,
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 100
  }
} as const

// Board Standards
export const STANDARD_BOARD = {
  WIDTH: 2800,   // mm
  HEIGHT: 2070,  // mm
  THICKNESS: 18, // mm
} as const

// Default Values
export const DEFAULTS = {
  COMPANY: 'IW TREND, s.r.o',
  CURRENCY,
  DISCOUNT_PERCENTAGE: 0,
  ALLOW_ROTATION: false,
  CUTTING_KERF: 3.2, // mm
} as const

// API Constants
export const API = {
  SEARCH: {
    MIN_QUERY_LENGTH: 2,
    DEFAULT_LIMIT: 10,
    MAX_RESULTS: 50,
    DEBOUNCE_DELAY: 300
  },
  SHOPIFY: {
    CART_ATTRIBUTES: {
      CUTTING_DATA: '_cutting_data',
      ORDER_TYPE: '_order_type',
      MATERIAL_SPEC: '_material_specification'
    },
    ORDER_TYPE: 'cutting_specification'
  }
} as const

// Type Guards
export const isValidEdgeThickness = (value: number): value is EdgeThickness => {
  return EDGE_THICKNESSES.includes(value as EdgeThickness)
}

export const isValidAvailabilityStatus = (value: string): value is AvailabilityStatus => {
  return Object.values(AVAILABILITY_STATUS).includes(value as AvailabilityStatus)
}
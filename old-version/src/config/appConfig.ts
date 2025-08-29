/**
 * Centralized Application Configuration
 *
 * This file contains all branding, styling, and business logic configuration
 * that can be easily customized for different deployments.
 */

// ===============================================
// BRANDING & VISUAL IDENTITY
// ===============================================

export const BRANDING = {
  app: {
    name: 'iW Trend Konfigurátor',
    company: 'iW Trend',
    version: '1.0.0',
  },
  colors: {
    primary: '#3498db',
    secondary: '#2c3e50',
    success: '#2ecc71',
    warning: '#f39c12',
    danger: '#e74c3c',
    info: '#1abc9c',
    light: '#f8f9fa',
    dark: '#34495e',
    // Extended palette for parts visualization
    partsPalette: [
      '#3498db', // Primary blue
      '#e74c3c', // Red
      '#2ecc71', // Green
      '#f39c12', // Orange
      '#9b59b6', // Purple
      '#1abc9c', // Teal
      '#34495e', // Dark blue-gray
      '#e67e22', // Dark orange
      '#16a085', // Dark teal
      '#8e44ad', // Dark purple
      '#d35400', // Dark orange-red
      '#27ae60', // Dark green
    ],
  },
  typography: {
    fontFamily: {
      primary:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      monospace: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
    },
  },
} as const

// ===============================================
// MATERIAL & BOARD SPECIFICATIONS
// ===============================================

export const MATERIAL_CONFIG = {
  // Standard board dimensions (in mm)
  standardBoards: [
    { width: 2800, height: 2070, name: 'Štandardná doska', isDefault: true },
    { width: 3000, height: 2100, name: 'Veľká doska' },
    { width: 2500, height: 1850, name: 'Menšia doska' },
    { width: 1830, height: 1220, name: 'Kompaktná doska' },
  ],

  // Available wood types
  woodTypes: [
    { id: 'pine', name: 'Borovica', isDefault: true },
    { id: 'oak', name: 'Dub' },
    { id: 'beech', name: 'Buk' },
    { id: 'birch', name: 'Breza' },
    { id: 'spruce', name: 'Smrek' },
    { id: 'maple', name: 'Javor' },
  ],

  // Default wood type
  defaultWoodType: 'pine',

  // Default board selection
  defaultBoard: {
    width: 2800,
    height: 2070,
  },

  // Board constraints
  boardConstraints: {
    minWidth: 100,
    maxWidth: 5000,
    minHeight: 100,
    maxHeight: 5000,
  },

  // Material properties
  material: {
    thickness: 18, // Standard thickness in mm
    density: 650, // kg/m³ for weight calculations
    cutting: {
      sawBlade: 3.2, // mm - kerf width
      minCutWidth: 10, // minimum strip width
      edgeBanding: 2, // mm - edge banding thickness
    },
  },
} as const

// ===============================================
// PART SPECIFICATIONS & CONSTRAINTS
// ===============================================

export const PART_CONFIG = {
  constraints: {
    minWidth: 1,
    maxWidth: 10000,
    minHeight: 1,
    maxHeight: 10000,
    minQuantity: 1,
    maxQuantity: 999,
  },

  defaults: {
    quantity: 1,
    orientation: 'rotatable' as const,
    cornerRadius: 5,
  },

  // L-Shape configuration
  lShape: {
    minCutout: 10, // minimum cutout size
    maxCutoutRatio: 0.8, // maximum 80% of part dimension
    defaultCutout: {
      width: 100,
      height: 100,
    },
  },

  // Frame configuration
  frame: {
    minFrameWidth: 10,
    maxFrameWidth: 200,
    defaultFrameWidth: 70, // moved from component
    types: ['type1', 'type2', 'type3', 'type4'] as const,
  },

  // Corner configuration
  corner: {
    minRadius: 1,
    maxRadius: 100,
    defaultRadius: 5,
  },
} as const

// ===============================================
// VISUALIZATION SETTINGS
// ===============================================

export const VISUALIZATION_CONFIG = {
  sheet: {
    maxPreviewWidth: 600,
    maxPreviewHeight: 400,
    gridSize: 100,
    showGrid: true,
    backgroundColor: '#f8f9fa',
    borderColor: '#2c3e50',
    gridColor: '#e1e8ed',
  },

  parts: {
    strokeWidth: {
      normal: 1,
      hover: 2,
      selected: 3,
    },
    opacity: {
      normal: 0.8,
      hover: 0.9,
      selected: 1.0,
    },
    text: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
    },
  },

  blocks: {
    borderColor: '#FF0000',
    borderWidth: 6,
    borderStyle: 'dashed',
    innerBorderColor: '#FF0000',
    innerBorderWidth: 2,
    strokeWidth: 6,
    opacity: 1.0,
  },

  // Rotation constants
  rotation: {
    standard: 90, // degrees
  },

  // Number formatting
  formatting: {
    decimalPlaces: 1,
    unitConversion: {
      mmToM2: 1000000, // Convert mm² to m²
    },
  },

  legend: {
    itemSpacing: 8,
    colorBoxSize: 16,
    fontSize: 14,
  },
} as const

// ===============================================
// CUTTING OPTIMIZATION SETTINGS
// ===============================================

export const OPTIMIZATION_CONFIG = {
  algorithm: {
    maxIterations: 1000,
    timeoutMs: 30000, // 30 seconds timeout
    minEfficiency: 0.1, // 10% minimum efficiency to accept solution
  },

  placement: {
    margin: 5, // mm spacing between parts
    rotationEnabled: true,
    allowOverhang: false,
  },

  blocking: {
    enabled: true,
    maxBlocksPerSheet: 10,
    autoGroupSimilarParts: false,
  },
} as const

// ===============================================
// EXPORT SETTINGS
// ===============================================

export const EXPORT_CONFIG = {
  gap010: {
    format: 'GAP 010',
    version: '1.0',
    precision: 2, // decimal places for measurements
    includeMetadata: true,
  },

  pdf: {
    pageSize: 'A4',
    orientation: 'landscape',
    margins: 20, // mm
    showGrid: true,
    showDimensions: true,
  },

  csv: {
    delimiter: ';',
    encoding: 'UTF-8',
    includeHeaders: true,
  },
} as const

// ===============================================
// USER INTERFACE SETTINGS
// ===============================================

export const UI_CONFIG = {
  form: {
    debounceMs: 300,
    autoSave: true,
    validateOnChange: true,
  },

  layout: {
    sidebarWidth: 320,
    headerHeight: 60,
    tabHeight: 48,
  },

  animation: {
    duration: 200, // ms
    easing: 'ease-in-out',
  },

  responsive: {
    breakpoints: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
} as const

// ===============================================
// FEATURE FLAGS
// ===============================================

export const FEATURE_FLAGS = {
  enableLShapes: true,
  enableFrames: true,
  enableBlocking: true,
  enableRotation: true,
  enableCornerModifications: true,
  enableEdgeTreatments: true,
  enableExport: true,
  enableAdvancedOptimization: true,
  showDebugInfo: false, // Set to true for development
} as const

// ===============================================
// BUSINESS LOGIC SETTINGS
// ===============================================

export const BUSINESS_CONFIG = {
  pricing: {
    enabled: false, // Enable if pricing calculation is needed
    currency: 'EUR',
    vatRate: 0.2, // 20% VAT
    materialCostPerM2: 25.0, // EUR per m²
    cuttingCostPerCut: 0.5, // EUR per cut
  },

  validation: {
    strictMode: false, // Enable for strict validation
    allowZeroQuantity: false,
    requireLabels: false,
  },

  workflow: {
    autoOptimize: true,
    autoExport: false,
    confirmBeforeDelete: true,
  },
} as const

// ===============================================
// COMBINED CONFIGURATION EXPORT
// ===============================================

export const APP_CONFIG = {
  branding: BRANDING,
  material: MATERIAL_CONFIG,
  parts: PART_CONFIG,
  visualization: VISUALIZATION_CONFIG,
  optimization: OPTIMIZATION_CONFIG,
  export: EXPORT_CONFIG,
  ui: UI_CONFIG,
  features: FEATURE_FLAGS,
  business: BUSINESS_CONFIG,
} as const

// Type exports for TypeScript support
export type AppConfig = typeof APP_CONFIG
export type BrandingConfig = typeof BRANDING
export type MaterialConfig = typeof MATERIAL_CONFIG
export type PartConfig = typeof PART_CONFIG
export type VisualizationConfig = typeof VISUALIZATION_CONFIG

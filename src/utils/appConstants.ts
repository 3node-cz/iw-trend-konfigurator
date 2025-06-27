/**
 * Application-specific constants and configuration values
 * For UI/styling constants, see uiConstants.ts
 */

/**
 * Default form values
 */
export const FORM_DEFAULTS = {
  quantity: 1,
  cornerValue: 5,
  sheetWidth: 2800,
  sheetHeight: 2070,
} as const

/**
 * UI dimension constants for specific components
 */
export const UI_DIMENSIONS = {
  maxPreviewWidth: 400,
  maxPreviewHeight: 300,
  borderRadius: 8,
  padding: 20,
} as const

/**
 * Material and part constraints
 */
export const PART_CONSTRAINTS = {
  minWidth: 1,
  maxWidth: 10000,
  minHeight: 1,
  maxHeight: 10000,
  minQuantity: 1,
  maxQuantity: 999,
} as const

/**
 * Sheet constraints
 */
export const SHEET_CONSTRAINTS = {
  standardWidth: 2800,
  standardHeight: 2070,
  minWidth: 100,
  maxWidth: 5000,
  minHeight: 100,
  maxHeight: 5000,
} as const

/**
 * SVG rendering constants
 */
export const SVG_RENDERING = {
  maxPreviewDimension: 400,
  defaultPadding: 40,
  strokeWidth: 2,
  cornerIndicatorRadius: 4,
  colors: {
    originalOutline: '#bdc3c7',
    modifiedStroke: '#3498db',
    modifiedFill: '#e8f4fd',
    cornerIndicator: '#e74c3c',
  },
  dashArray: {
    dashed: '5,5',
    solid: 'none',
  },
} as const

/**
 * Sheet visualization constants
 */
export const SHEET_VISUALIZATION = {
  maxPreviewWidth: 600,
  maxPreviewHeight: 400,
  gridSize: 100,
  strokeWidth: {
    sheet: 2,
    part: 1,
    partHover: 2,
    grid: 1,
  },
  colors: {
    sheetBackground: '#f8f9fa',
    sheetBorder: '#2c3e50',
    gridLines: '#e1e8ed',
    partText: 'white',
    dimensionText: '#2c3e50',
  },
  partColors: [
    '#3498db',
    '#e74c3c',
    '#2ecc71',
    '#f39c12',
    '#9b59b6',
    '#1abc9c',
    '#34495e',
    '#e67e22',
  ],
  fontSize: {
    partLabel: 10,
    dimensions: 12,
  },
  spacing: {
    dimensionOffset: 20,
  },
} as const

/**
 * Application-wide constants and configuration values
 */

/**
 * Default form values
 */
export const FORM_DEFAULTS = {
  quantity: 1,
  cornerValue: 5,
  sheetWidth: 2800,
  sheetHeight: 2070
} as const;

/**
 * UI dimension constants
 */
export const UI_DIMENSIONS = {
  maxPreviewWidth: 400,
  maxPreviewHeight: 300,
  borderRadius: 8,
  padding: 20
} as const;

/**
 * Color constants
 */
export const COLORS = {
  primary: '#3498db',
  secondary: '#2c3e50',
  text: '#2c3e50',
  textMuted: '#7f8c8d',
  background: '#f5f6fa',
  cardBackground: 'white',
  border: '#e1e8ed',
  inputBorder: '#ddd',
  selected: '#e8f4fd',
  selectedBorder: '#3498db',
  hover: '#ecf0f1',
  success: '#27ae60',
  warning: '#f39c12',
  error: '#e74c3c'
} as const;

/**
 * Typography constants
 */
export const TYPOGRAPHY = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
  fontSize: {
    small: '0.75rem',
    normal: '0.9rem',
    medium: '1rem',
    large: '1.1rem',
    heading: '1.3rem',
    title: '2.2rem'
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
} as const;

/**
 * Grid and layout constants
 */
export const LAYOUT = {
  maxWidth: '1200px',
  breakpoints: {
    mobile: '768px',
    tablet: '1024px'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '30px'
  }
} as const;

/**
 * Material and part constraints
 */
export const PART_CONSTRAINTS = {
  minWidth: 1,
  maxWidth: 10000,
  minHeight: 1,
  maxHeight: 10000,
  minQuantity: 1,
  maxQuantity: 999
} as const;

/**
 * Sheet constraints
 */
export const SHEET_CONSTRAINTS = {
  standardWidth: 2800,
  standardHeight: 2070,
  minWidth: 100,
  maxWidth: 5000,
  minHeight: 100,
  maxHeight: 5000
} as const;

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
    cornerIndicator: '#e74c3c'
  },
  dashArray: {
    dashed: '5,5',
    solid: 'none'
  }
} as const;

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
    grid: 1
  },
  colors: {
    sheetBackground: '#f8f9fa',
    sheetBorder: '#2c3e50',
    gridLines: '#e1e8ed',
    partText: 'white',
    dimensionText: '#2c3e50'
  },
  partColors: [
    '#3498db', '#e74c3c', '#2ecc71', '#f39c12', 
    '#9b59b6', '#1abc9c', '#34495e', '#e67e22'
  ],
  fontSize: {
    partLabel: 10,
    dimensions: 12
  },
  spacing: {
    dimensionOffset: 20
  }
} as const;

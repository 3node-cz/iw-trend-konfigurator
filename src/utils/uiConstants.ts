/**
 * UI Constants and Design System
 * Centralized design system constants for consistent styling across the application
 */

// Spacing constants (in pixels)
export const SPACING = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 40,
} as const

// Border radius constants
export const BORDER_RADIUS = {
  sm: 4,
  md: 6,
  lg: 8,
} as const

// Box shadow constants
export const BOX_SHADOW = {
  light: '0 2px 4px rgba(0, 0, 0, 0.1)',
  medium: '0 4px 8px rgba(0, 0, 0, 0.1)',
  heavy: '0 8px 16px rgba(0, 0, 0, 0.2)',
} as const

// Color palette
export const COLORS = {
  // Brand colors
  primary: '#3498db',
  secondary: '#2c3e50',
  
  // Background colors
  background: '#f5f6fa',
  cardBackground: '#ffffff',
  
  // Text colors
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
  textMuted: '#95a5a6',
  
  // Border colors
  border: '#e1e8ed',
  borderLight: '#ddd',
  
  // Status colors
  success: '#27ae60',
  warning: '#f39c12',
  danger: '#e74c3c',
  info: '#3498db',
  
  // Hover states
  hoverLight: '#ecf0f1',
  hoverPrimary: '#2980b9',
} as const

// Typography
export const TYPOGRAPHY = {
  fontFamily: {
    system: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    mono: 'Consolas, "Liberation Mono", Menlo, Courier, monospace',
  },
  fontSize: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const

// Breakpoints for responsive design
export const BREAKPOINTS = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  large: '1200px',
} as const

// Z-index layers
export const Z_INDEX = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  modal: 1000,
  tooltip: 2000,
} as const

// Animation durations
export const TRANSITIONS = {
  fast: '0.15s',
  normal: '0.25s',
  slow: '0.5s',
} as const

// Form input dimensions
export const INPUT_DIMENSIONS = {
  height: {
    sm: '32px',
    md: '40px',
    lg: '48px',
  },
  padding: {
    sm: '4px 8px',
    md: '8px 12px',
    lg: '12px 16px',
  },
} as const

// Component-specific constants
export const COMPONENT_DIMENSIONS = {
  card: {
    padding: SPACING.xxl,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xxl,
  },
  button: {
    padding: '6px 8px',
    borderRadius: BORDER_RADIUS.sm,
  },
  icon: {
    sm: 16,
    md: 20,
    lg: 24,
  },
  preview: {
    maxWidth: 400,
    maxHeight: 300,
    minHeight: 450,
  },
} as const

// Layout constants
export const LAYOUT = {
  maxWidth: '1200px',
  containerPadding: SPACING.xxl,
} as const

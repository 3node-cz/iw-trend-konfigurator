/**
 * Utility functions for edge visualization colors and styling
 */

/**
 * Get color for edge thickness
 */
export const getEdgeColor = (thickness: number): string => {
  const colors = {
    0.4: '#e91e63', // Pink for 0.4mm
    0.8: '#2196f3', // Blue for 0.8mm
    1: '#4caf50', // Green for 1mm
    2: '#ff9800', // Orange for 2mm
    3: '#9c27b0', // Purple for 3mm (if needed)
  }
  return colors[thickness as keyof typeof colors] || '#757575' // Gray for unknown
}

/**
 * Get stroke width for edge visualization based on thickness
 */
export const getEdgeStrokeWidth = (thickness: number): number => {
  // Scale thickness for better visibility (minimum 2px, maximum 8px)
  return Math.max(2, Math.min(8, thickness * 2))
}

/**
 * Edge thickness to color mapping for legends and UI
 */
export const EDGE_THICKNESS_COLORS = {
  0.4: '#e91e63',
  0.8: '#2196f3',
  1: '#4caf50',
  2: '#ff9800',
  3: '#9c27b0',
} as const

/**
 * Get all available edge thicknesses and their colors
 */
export const getEdgeThicknessOptions = () => {
  return Object.entries(EDGE_THICKNESS_COLORS).map(([thickness, color]) => ({
    thickness: parseFloat(thickness),
    color,
    label: `${thickness}mm`,
  }))
}

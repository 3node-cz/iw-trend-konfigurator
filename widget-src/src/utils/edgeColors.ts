/**
 * Utility functions for edge visualization colors and styling
 */

/**
 * Get color for edge thickness
 */
export const getEdgeColor = (thickness: number): string => {
  const colors = {
    0.45: '#2196f3', // Blue for 0.45mm
    1: '#4caf50',    // Green for 1mm
    2: '#ff9800',    // Orange for 2mm
  }
  return colors[thickness as keyof typeof colors] || '#757575' // Gray for unknown
}

/**
 * Get stroke width for edge visualization - consistent width for all edges
 */
export const getEdgeStrokeWidth = (thickness: number): number => {
  // Return consistent stroke width for all edges (only color differs)
  return 3
}

/**
 * Edge thickness to color mapping for legends and UI
 */
export const EDGE_THICKNESS_COLORS = {
  0.45: '#2196f3', // Blue
  1: '#4caf50',    // Green
  2: '#ff9800',    // Orange
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

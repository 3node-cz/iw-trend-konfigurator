/**
 * @deprecated Use APP_CONFIG from '../config/appConfig.ts' instead
 * This file is kept for backward compatibility and will be removed in a future version
 */

import { APP_CONFIG } from '../config/appConfig'

/**
 * @deprecated Use APP_CONFIG.parts.defaults instead
 */
export const FORM_DEFAULTS = {
  quantity: APP_CONFIG.parts.defaults.quantity,
  cornerValue: APP_CONFIG.parts.defaults.cornerRadius,
  sheetWidth: APP_CONFIG.material.defaultBoard.width,
  sheetHeight: APP_CONFIG.material.defaultBoard.height,
} as const

/**
 * @deprecated Use APP_CONFIG.parts.constraints instead
 */
export const PART_CONSTRAINTS = APP_CONFIG.parts.constraints

/**
 * @deprecated Use APP_CONFIG.material.boardConstraints instead
 */
export const SHEET_CONSTRAINTS = {
  standardWidth: APP_CONFIG.material.defaultBoard.width,
  standardHeight: APP_CONFIG.material.defaultBoard.height,
  minWidth: APP_CONFIG.material.boardConstraints.minWidth,
  maxWidth: APP_CONFIG.material.boardConstraints.maxWidth,
  minHeight: APP_CONFIG.material.boardConstraints.minHeight,
  maxHeight: APP_CONFIG.material.boardConstraints.maxHeight,
} as const

/**
 * @deprecated Use APP_CONFIG.visualization instead
 */
export const SVG_RENDERING = {
  maxPreviewDimension: 400,
  defaultPadding: 40,
  strokeWidth: 2,
  cornerIndicatorRadius: 4,
  colors: {
    originalOutline: '#bdc3c7',
    modifiedStroke: APP_CONFIG.branding.colors.primary,
    modifiedFill: '#e8f4fd',
    cornerIndicator: APP_CONFIG.branding.colors.danger,
  },
  dashArray: {
    dashed: '5,5',
    solid: 'none',
  },
} as const

/**
 * @deprecated Use APP_CONFIG.visualization instead
 */
export const SHEET_VISUALIZATION = {
  maxPreviewWidth: APP_CONFIG.visualization.sheet.maxPreviewWidth,
  maxPreviewHeight: APP_CONFIG.visualization.sheet.maxPreviewHeight,
  gridSize: APP_CONFIG.visualization.sheet.gridSize,
  strokeWidth: {
    sheet: 2,
    part: APP_CONFIG.visualization.parts.strokeWidth.normal,
    partHover: APP_CONFIG.visualization.parts.strokeWidth.hover,
    grid: 1,
  },
  colors: {
    sheetBackground: APP_CONFIG.visualization.sheet.backgroundColor,
    sheetBorder: APP_CONFIG.visualization.sheet.borderColor,
    gridLines: APP_CONFIG.visualization.sheet.gridColor,
    partText: APP_CONFIG.visualization.parts.text.color,
    dimensionText: APP_CONFIG.branding.colors.secondary,
  },
  partColors: APP_CONFIG.branding.colors.partsPalette,
  fontSize: {
    partLabel: APP_CONFIG.visualization.parts.text.fontSize,
    dimensions: 14,
  },
  spacing: {
    dimensionOffset: 20,
  },
} as const

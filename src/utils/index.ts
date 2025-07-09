/**
 * Central export point for all utility modules
 * This provides a clean import interface for all utilities
 */

// Configuration
export { APP_CONFIG } from '../config/appConfig'
export type {
  AppConfig,
  BrandingConfig,
  MaterialConfig,
  PartConfig,
  VisualizationConfig,
} from '../config/appConfig'

// Business Logic
export {
  calculateTotalPartsArea,
  calculatePlacedPartsArea,
  calculateSheetArea,
  calculateEfficiency,
  calculateMaterialWeight,
  calculateLayoutStatistics,
  calculateSheetStatistics,
  calculateMaterialCost,
  calculateCuttingCost,
  estimateNumberOfCuts,
  calculateProjectCost,
  calculateOptimizationMetrics,
  analyzePartComplexity,
  getPerformanceBenchmarks,
} from './businessLogic'

// Form Helpers
export {
  transformFormDataToPart,
  validatePartData,
  getAvailableBoardPresets,
  getDefaultBoardConfig,
  validateBoardDimensions,
  getAvailableBlockNumbers,
  canAddToBlock,
  validateLShapeConfig,
  validateCornerConfig,
  getFormFieldConfig,
  getFormDebounceDelay,
} from './formHelpers'
export type { PartFormData } from './formHelpers'

// Visualization Helpers
export {
  getVisualizationPartColor,
  groupPlacedPartsByBlock,
  calculateBoundingBox,
  calculateVisualizationScale,
  getPlacedPartDimensions,
  generateBlockBorders,
  generateBlockSeparators,
  calculateSheetStats,
} from './visualizationHelpers'

// Color Management
export {
  getBasePartId,
  getConsistentPartColor,
  clearColorCache,
} from './colorManagement'

// Frame Helpers
export {
  FRAME_TYPE_COMPONENTS,
  getDefaultFrameWidth,
  getFrameWidth,
  calculateInnerDimensions,
  validateFrameConfig,
  getAvailableFrameTypes,
} from './frameHelpers'

// Layout Visualization Helpers
export {
  getBlockBorderStyle,
  getInnerBlockBorderStyle,
  isPartRotated,
  formatEfficiencyPercentage,
  formatAreaInSquareMeters,
  getMaterialConfig,
  generateOrderId,
  getCurrentTimestamp,
} from './layoutVisualizationHelpers'

// Existing utilities (re-exported for compatibility)
export {
  calculateSheetScale,
  groupPartsByBaseId,
  calculateWastedArea,
  calculateLayoutStats,
  getPartDimensions,
} from './sheetVisualizationHelpers'

export {
  hasAnyCornerModifications,
  hasAnyEdgeTreatments,
  isLShapeConfigured,
  hasAdvancedConfiguration,
  computePartConfigurationStatus,
  // Additional exports from consolidated partEnhancements
  hasCornerModification,
  hasCornerModifications,
  hasEdgeTreatments,
  hasEdgeTreatmentsInterface,
  isLShape,
  isFrame,
  hasAdvancedConfig,
  hasAdvancedConfigInterface,
  generatePartId,
  getDefaultEdges,
  getDefaultCorners,
  getDefaultLShape,
  getDefaultFrame,
} from './partEnhancements'

export {
  formatPartLabel,
  formatPartDimensions,
  getPartLabel,
} from './partFormatting'

// Constants (backward compatibility)
export {
  FORM_DEFAULTS,
  PART_CONSTRAINTS,
  SHEET_CONSTRAINTS,
  SVG_RENDERING,
  SHEET_VISUALIZATION,
} from './appConstants'

// Block Validation (consolidated)
export {
  validateBlockWidth,
  validateAllBlocks,
  hasBlockValidationErrors,
  groupPartsByBlock,
  calculateBlockWidth,
} from './blockValidation'

// Part Updates (consolidated)
export {
  createPartUpdateHandlers,
  EDGE_INDEX_MAP,
  CORNER_INDEX_MAP,
  separatePartUpdates,
  hasCuttingUpdates,
  processEdgeUpdates,
  processCornerUpdates,
} from './partUpdates'

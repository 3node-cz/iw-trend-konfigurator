/**
 * Visual configuration management utilities
 * Handles logic for part configuration states, validation, and updates
 */

import type { Part, CornerModification, EdgeTreatment } from '../types/simple'

/**
 * Configuration state types
 */
export type ConfigurationType = 'basic' | 'lshape' | 'none'

export interface ConfigurationState {
  activeConfig: ConfigurationType
  hasCornerConfig: boolean
  hasEdgeConfig: boolean
  hasLShapeConfig: boolean
  isBasicConfigActive: boolean
  isLShapeConfigActive: boolean
}

/**
 * Analyze a part's current configuration state
 */
export const analyzePartConfiguration = (
  part: Part | null,
): ConfigurationState => {
  if (!part) {
    return {
      activeConfig: 'none',
      hasCornerConfig: false,
      hasEdgeConfig: false,
      hasLShapeConfig: false,
      isBasicConfigActive: false,
      isLShapeConfigActive: false,
    }
  }

  // Check corner configuration
  const hasCornerConfig =
    part.corners &&
    Object.values(part.corners).some(
      (corner) => corner && corner.type !== 'none',
    )

  // Check edge configuration
  const hasEdgeConfig =
    part.edges && Object.values(part.edges).some((edge) => edge !== 'none')

  // Check L-shape configuration
  const hasLShapeConfig = part.lShape?.enabled === true

  // A basic config is considered "active" if corners or edges objects exist
  const isBasicConfigActive = !!(part.corners || part.edges)
  const isLShapeConfigActive = !!part.lShape?.enabled

  // Determine active configuration
  let activeConfig: ConfigurationType = 'none'
  if (hasLShapeConfig) {
    activeConfig = 'lshape'
  } else if (hasCornerConfig || hasEdgeConfig) {
    activeConfig = 'basic'
  } else if (isBasicConfigActive) {
    activeConfig = 'basic' // Basic config is enabled but not configured yet
  }

  return {
    activeConfig,
    hasCornerConfig: !!hasCornerConfig,
    hasEdgeConfig: !!hasEdgeConfig,
    hasLShapeConfig: !!hasLShapeConfig,
    isBasicConfigActive,
    isLShapeConfigActive,
  }
}

/**
 * Create configuration updates for enabling/disabling configurations
 */
export const createConfigurationUpdate = (
  part: Part,
  configType: ConfigurationType,
  enabled: boolean,
): Partial<Part> => {
  if (configType === 'basic') {
    if (enabled) {
      // Enable basic configuration, disable L-shape
      return {
        lShape: undefined,
        // Initialize corners and edges with 'none' values to make them "configurable"
        corners: {
          topLeft: { type: 'none' },
          topRight: { type: 'none' },
          bottomLeft: { type: 'none' },
          bottomRight: { type: 'none' },
        },
        edges: createDefaultEdgeConfig(),
      }
    } else {
      // Disable basic configuration - remove corners and edges entirely
      return {
        corners: undefined,
        edges: undefined,
      }
    }
  } else if (configType === 'lshape') {
    if (enabled) {
      // Enable L-shape, disable basic configuration
      return {
        lShape: {
          enabled: true,
          leftWidth: Math.min(part.width * 0.3, 50),
          rightWidth: Math.min(part.width * 0.7, part.width - 50),
        },
        // Remove corners and edges entirely when L-shape is enabled
        corners: undefined,
        edges: undefined,
      }
    } else {
      // Disable L-shape
      return {
        lShape: undefined,
      }
    }
  }

  return {}
}

/**
 * Validate if a configuration change is allowed
 */
export const validateConfigurationChange = (
  part: Part,
  configType: ConfigurationType,
  enabled: boolean,
): { valid: boolean; reason?: string } => {
  if (configType === 'lshape' && enabled) {
    // Validate L-shape dimensions
    if (part.width < 100 || part.height < 100) {
      return {
        valid: false,
        reason: 'L-shape requires minimum dimensions of 100×100mm',
      }
    }
  }

  return { valid: true }
}

/**
 * Get configuration indicators for UI display
 */
export const getConfigurationIndicators = (
  part: Part,
): {
  hasCornerModifications: boolean
  hasEdgeTreatments: boolean
  isLShape: boolean
  hasAdvancedConfig: boolean
} => {
  const config = analyzePartConfiguration(part)

  return {
    hasCornerModifications: config.hasCornerConfig,
    hasEdgeTreatments: config.hasEdgeConfig,
    isLShape: config.hasLShapeConfig,
    hasAdvancedConfig:
      config.hasCornerConfig || config.hasEdgeConfig || config.hasLShapeConfig,
  }
}

/**
 * Create default corner configuration
 */
export const createDefaultCornerConfig = (): Record<
  string,
  CornerModification
> => ({
  topLeft: { type: 'none' },
  topRight: { type: 'none' },
  bottomLeft: { type: 'none' },
  bottomRight: { type: 'none' },
})

/**
 * Create default edge configuration
 */
export const createDefaultEdgeConfig = (): EdgeTreatment => ({
  top: 'none',
  right: 'none',
  bottom: 'none',
  left: 'none',
})

/**
 * Enable basic configuration for a part
 */
export const enableBasicConfiguration = (part: Part): Partial<Part> => {
  return createConfigurationUpdate(part, 'basic', true)
}

/**
 * Enable L-shape configuration for a part
 */
export const enableLShapeConfiguration = (part: Part): Partial<Part> => {
  return createConfigurationUpdate(part, 'lshape', true)
}

/**
 * Disable basic configuration for a part
 */
export const disableBasicConfiguration = (part: Part): Partial<Part> => {
  return createConfigurationUpdate(part, 'basic', false)
}

/**
 * Frame component utilities and constants
 * Contains frame type mappings and related helper functions
 */

import {
  FrameType1Icon,
  FrameType2Icon,
  FrameType3Icon,
  FrameType4Icon,
} from '../components/three-layer/visual/FrameIcons'
import { APP_CONFIG } from '../config/appConfig'
import type { FrameConfig } from '../types/simple'

/**
 * Mapping of frame types to their respective icon components
 */
export const FRAME_TYPE_COMPONENTS = {
  type1: FrameType1Icon,
  type2: FrameType2Icon,
  type3: FrameType3Icon,
  type4: FrameType4Icon,
} as const

/**
 * Get the default frame width from configuration
 */
export const getDefaultFrameWidth = (): number => {
  return APP_CONFIG.parts.frame.defaultFrameWidth
}

/**
 * Get frame width with fallback to default
 */
export const getFrameWidth = (frameConfig: FrameConfig): number => {
  return frameConfig.width || getDefaultFrameWidth()
}

/**
 * Calculate inner dimensions after frame is applied
 */
export const calculateInnerDimensions = (
  partWidth: number,
  partHeight: number,
  frameConfig: FrameConfig,
): { innerWidth: number; innerHeight: number; isValid: boolean } => {
  const frameWidth = getFrameWidth(frameConfig)
  const innerWidth = partWidth - 2 * frameWidth
  const innerHeight = partHeight - 2 * frameWidth

  return {
    innerWidth,
    innerHeight,
    isValid: innerWidth > 0 && innerHeight > 0,
  }
}

/**
 * Validate frame configuration
 */
export const validateFrameConfig = (
  partWidth: number,
  partHeight: number,
  frameConfig: FrameConfig,
): boolean => {
  const { isValid } = calculateInnerDimensions(
    partWidth,
    partHeight,
    frameConfig,
  )
  return isValid
}

/**
 * Get all available frame types
 */
export const getAvailableFrameTypes = (): Array<
  keyof typeof FRAME_TYPE_COMPONENTS
> => {
  return Object.keys(FRAME_TYPE_COMPONENTS) as Array<
    keyof typeof FRAME_TYPE_COMPONENTS
  >
}

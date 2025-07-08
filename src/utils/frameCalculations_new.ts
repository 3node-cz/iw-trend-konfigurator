import type { FrameConfig } from '../types/simple'

/**
 * Frame calculation utilities
 * Based on the frame type, calculate the 4 pieces that make up the frame
 */

export interface FramePiece {
  id: string
  width: number
  height: number
  quantity: number
  label: string
  orientation: 'fixed' | 'rotatable'
  grainDirection: 'horizontal' | 'vertical'
  isFramePiece: true
  originalPartId: string
  frameType: string
  pieceType: 'top' | 'bottom' | 'left' | 'right'
}

/**
 * Calculate frame pieces based on frame configuration
 * Types 1 & 2: Top/bottom pieces are full width, left/right pieces fit between them
 * Types 3 & 4: Left/right pieces are full height, top/bottom pieces fit between them
 */
export const calculateFramePieces = (
  originalWidth: number,
  originalHeight: number,
  frameConfig: FrameConfig,
  originalPartId: string,
  originalLabel?: string,
): FramePiece[] => {
  if (!frameConfig.enabled) {
    return []
  }

  const frameWidth = frameConfig.width || 70 // Default 70mm as shown in image

  // Calculate inner dimensions for validation
  const innerWidth = originalWidth - 2 * frameWidth
  const innerHeight = originalHeight - 2 * frameWidth

  if (innerWidth <= 0 || innerHeight <= 0) {
    throw new Error('Frame width is too large for the given dimensions')
  }

  const pieces: FramePiece[] = []
  const baseLabel = originalLabel || 'Frame'

  // Based on frame type, create the 4 pieces with different construction methods
  switch (frameConfig.type) {
    case 'type1': // All horizontal grain - top/bottom full width, sides between
      pieces.push(
        // Top piece - horizontal grain, full width
        {
          id: `${originalPartId}_frame_top`,
          width: originalWidth,
          height: frameWidth,
          quantity: 1,
          label: `${baseLabel} - Top`,
          orientation: 'fixed', // Horizontal grain matches board grain
          grainDirection: 'horizontal',
          isFramePiece: true,
          originalPartId,
          frameType: frameConfig.type,
          pieceType: 'top',
        },
        // Bottom piece - horizontal grain, full width
        {
          id: `${originalPartId}_frame_bottom`,
          width: originalWidth,
          height: frameWidth,
          quantity: 1,
          label: `${baseLabel} - Bottom`,
          orientation: 'fixed', // Horizontal grain matches board grain
          grainDirection: 'horizontal',
          isFramePiece: true,
          originalPartId,
          frameType: frameConfig.type,
          pieceType: 'bottom',
        },
        // Left piece - horizontal grain, between top/bottom
        {
          id: `${originalPartId}_frame_left`,
          width: frameWidth,
          height: innerHeight,
          quantity: 1,
          label: `${baseLabel} - Left`,
          orientation: 'fixed', // Horizontal grain matches board grain
          grainDirection: 'horizontal',
          isFramePiece: true,
          originalPartId,
          frameType: frameConfig.type,
          pieceType: 'left',
        },
        // Right piece - horizontal grain, between top/bottom
        {
          id: `${originalPartId}_frame_right`,
          width: frameWidth,
          height: innerHeight,
          quantity: 1,
          label: `${baseLabel} - Right`,
          orientation: 'fixed', // Horizontal grain matches board grain
          grainDirection: 'horizontal',
          isFramePiece: true,
          originalPartId,
          frameType: frameConfig.type,
          pieceType: 'right',
        },
      )
      break

    case 'type2': // Top/bottom horizontal, left/right vertical - top/bottom full width, sides between
      pieces.push(
        // Top piece - horizontal grain, full width
        {
          id: `${originalPartId}_frame_top`,
          width: originalWidth,
          height: frameWidth,
          quantity: 1,
          label: `${baseLabel} - Top`,
          orientation: 'fixed', // Horizontal grain matches board grain
          grainDirection: 'horizontal',
          isFramePiece: true,
          originalPartId,
          frameType: frameConfig.type,
          pieceType: 'top',
        },
        // Bottom piece - horizontal grain, full width
        {
          id: `${originalPartId}_frame_bottom`,
          width: originalWidth,
          height: frameWidth,
          quantity: 1,
          label: `${baseLabel} - Bottom`,
          orientation: 'fixed', // Horizontal grain matches board grain
          grainDirection: 'horizontal',
          isFramePiece: true,
          originalPartId,
          frameType: frameConfig.type,
          pieceType: 'bottom',
        },
        // Left piece - vertical grain, between top/bottom - needs rotation
        {
          id: `${originalPartId}_frame_left`,
          width: innerHeight, // Swap dimensions for vertical grain
          height: frameWidth,
          quantity: 1,
          label: `${baseLabel} - Left`,
          orientation: 'fixed', // Fixed after rotation
          grainDirection: 'vertical',
          isFramePiece: true,
          originalPartId,
          frameType: frameConfig.type,
          pieceType: 'left',
        },
        // Right piece - vertical grain, between top/bottom - needs rotation
        {
          id: `${originalPartId}_frame_right`,
          width: innerHeight, // Swap dimensions for vertical grain
          height: frameWidth,
          quantity: 1,
          label: `${baseLabel} - Right`,
          orientation: 'fixed', // Fixed after rotation
          grainDirection: 'vertical',
          isFramePiece: true,
          originalPartId,
          frameType: frameConfig.type,
          pieceType: 'right',
        },
      )
      break

    case 'type3': // Top/bottom vertical, left/right horizontal - left/right full height, top/bottom between
      pieces.push(
        // Top piece - vertical grain, between left/right - needs rotation
        {
          id: `${originalPartId}_frame_top`,
          width: frameWidth, // Swap dimensions for vertical grain
          height: innerWidth,
          quantity: 1,
          label: `${baseLabel} - Top`,
          orientation: 'fixed', // Fixed after rotation
          grainDirection: 'vertical',
          isFramePiece: true,
          originalPartId,
          frameType: frameConfig.type,
          pieceType: 'top',
        },
        // Bottom piece - vertical grain, between left/right - needs rotation
        {
          id: `${originalPartId}_frame_bottom`,
          width: frameWidth, // Swap dimensions for vertical grain
          height: innerWidth,
          quantity: 1,
          label: `${baseLabel} - Bottom`,
          orientation: 'fixed', // Fixed after rotation
          grainDirection: 'vertical',
          isFramePiece: true,
          originalPartId,
          frameType: frameConfig.type,
          pieceType: 'bottom',
        },
        // Left piece - horizontal grain, full height
        {
          id: `${originalPartId}_frame_left`,
          width: frameWidth,
          height: originalHeight,
          quantity: 1,
          label: `${baseLabel} - Left`,
          orientation: 'fixed', // Horizontal grain matches board grain
          grainDirection: 'horizontal',
          isFramePiece: true,
          originalPartId,
          frameType: frameConfig.type,
          pieceType: 'left',
        },
        // Right piece - horizontal grain, full height
        {
          id: `${originalPartId}_frame_right`,
          width: frameWidth,
          height: originalHeight,
          quantity: 1,
          label: `${baseLabel} - Right`,
          orientation: 'fixed', // Horizontal grain matches board grain
          grainDirection: 'horizontal',
          isFramePiece: true,
          originalPartId,
          frameType: frameConfig.type,
          pieceType: 'right',
        },
      )
      break

    case 'type4': // All vertical grain - left/right full height, top/bottom between
      pieces.push(
        // Top piece - vertical grain, between left/right - needs rotation
        {
          id: `${originalPartId}_frame_top`,
          width: frameWidth, // Swap dimensions for vertical grain
          height: innerWidth,
          quantity: 1,
          label: `${baseLabel} - Top`,
          orientation: 'fixed', // Fixed after rotation
          grainDirection: 'vertical',
          isFramePiece: true,
          originalPartId,
          frameType: frameConfig.type,
          pieceType: 'top',
        },
        // Bottom piece - vertical grain, between left/right - needs rotation
        {
          id: `${originalPartId}_frame_bottom`,
          width: frameWidth, // Swap dimensions for vertical grain
          height: innerWidth,
          quantity: 1,
          label: `${baseLabel} - Bottom`,
          orientation: 'fixed', // Fixed after rotation
          grainDirection: 'vertical',
          isFramePiece: true,
          originalPartId,
          frameType: frameConfig.type,
          pieceType: 'bottom',
        },
        // Left piece - vertical grain, full height - needs rotation
        {
          id: `${originalPartId}_frame_left`,
          width: originalHeight, // Swap dimensions for vertical grain
          height: frameWidth,
          quantity: 1,
          label: `${baseLabel} - Left`,
          orientation: 'fixed', // Fixed after rotation
          grainDirection: 'vertical',
          isFramePiece: true,
          originalPartId,
          frameType: frameConfig.type,
          pieceType: 'left',
        },
        // Right piece - vertical grain, full height - needs rotation
        {
          id: `${originalPartId}_frame_right`,
          width: originalHeight, // Swap dimensions for vertical grain
          height: frameWidth,
          quantity: 1,
          label: `${baseLabel} - Right`,
          orientation: 'fixed', // Fixed after rotation
          grainDirection: 'vertical',
          isFramePiece: true,
          originalPartId,
          frameType: frameConfig.type,
          pieceType: 'right',
        },
      )
      break

    default:
      throw new Error(`Unknown frame type: ${frameConfig.type}`)
  }

  return pieces
}

/**
 * Get frame piece dimensions for preview (UI only)
 * This is used by the frame preview component
 */
export interface FramePieceDimensions {
  top: { width: number; height: number }
  bottom: { width: number; height: number }
  left: { width: number; height: number }
  right: { width: number; height: number }
}

export const getFramePieceDimensions = (
  originalWidth: number,
  originalHeight: number,
  frameConfig: FrameConfig,
): FramePieceDimensions => {
  const frameWidth = frameConfig.width || 70
  const innerWidth = originalWidth - 2 * frameWidth
  const innerHeight = originalHeight - 2 * frameWidth

  // Note: These are the actual cutting dimensions, not the placed dimensions
  // The placed dimensions might be rotated based on grain direction
  switch (frameConfig.type) {
    case 'type1': // All horizontal grain - top/bottom full width, sides between
      return {
        top: { width: originalWidth, height: frameWidth },
        bottom: { width: originalWidth, height: frameWidth },
        left: { width: frameWidth, height: innerHeight },
        right: { width: frameWidth, height: innerHeight },
      }

    case 'type2': // Top/bottom horizontal, left/right vertical - top/bottom full width, sides between
      return {
        top: { width: originalWidth, height: frameWidth },
        bottom: { width: originalWidth, height: frameWidth },
        left: { width: frameWidth, height: innerHeight },
        right: { width: frameWidth, height: innerHeight },
      }

    case 'type3': // Top/bottom vertical, left/right horizontal - left/right full height, top/bottom between
      return {
        top: { width: innerWidth, height: frameWidth },
        bottom: { width: innerWidth, height: frameWidth },
        left: { width: frameWidth, height: originalHeight },
        right: { width: frameWidth, height: originalHeight },
      }

    case 'type4': // All vertical grain - left/right full height, top/bottom between
      return {
        top: { width: innerWidth, height: frameWidth },
        bottom: { width: innerWidth, height: frameWidth },
        left: { width: frameWidth, height: originalHeight },
        right: { width: frameWidth, height: originalHeight },
      }

    default:
      throw new Error(`Unknown frame type: ${frameConfig.type}`)
  }
}

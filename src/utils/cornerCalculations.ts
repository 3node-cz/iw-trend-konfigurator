import type { Part, CornerModification } from '../types/simple';

/**
 * Utility functions for calculating corner modification limits and validations
 */

/**
 * Calculate the maximum allowed radius for a corner, considering adjacent corners
 */
export function calculateMaxCornerRadius(
  part: Part, 
  corner: string
): number {
  const corners = part.corners as Record<string, CornerModification> || {};
  
  // Calculate space used by adjacent corners (both round and bevel)
  const getAdjacentCornerSpace = (cornerName: string, dimension: 'x' | 'y'): number => {
    const adjCorner = corners[cornerName] || { type: 'none' };
    if (adjCorner.type === 'round') {
      return adjCorner.x || 0;
    } else if (adjCorner.type === 'bevel') {
      return adjCorner[dimension] || 0;
    }
    return 0;
  };
  
  // For radius, we need to consider both edges that meet at this corner
  // The radius is limited by the available space on each edge
  let maxFromWidth = part.width;
  let maxFromHeight = part.height;
  
  // Reduce max based on adjacent corners on the same edges
  switch (corner) {
    case 'topLeft':
      maxFromWidth -= getAdjacentCornerSpace('topRight', 'x');    // Same top edge
      maxFromHeight -= getAdjacentCornerSpace('bottomLeft', 'y'); // Same left edge
      break;
    case 'topRight':
      maxFromWidth -= getAdjacentCornerSpace('topLeft', 'x');      // Same top edge
      maxFromHeight -= getAdjacentCornerSpace('bottomRight', 'y'); // Same right edge
      break;
    case 'bottomRight':
      maxFromWidth -= getAdjacentCornerSpace('bottomLeft', 'x');  // Same bottom edge
      maxFromHeight -= getAdjacentCornerSpace('topRight', 'y');   // Same right edge
      break;
    case 'bottomLeft':
      maxFromWidth -= getAdjacentCornerSpace('bottomRight', 'x'); // Same bottom edge
      maxFromHeight -= getAdjacentCornerSpace('topLeft', 'y');    // Same left edge
      break;
  }
  
  // The radius is limited by the smaller available space (can't exceed either edge)
  return Math.max(0, Math.min(maxFromWidth, maxFromHeight));
}

/**
 * Calculate the maximum allowed dimension (x or y) for a corner bevel, considering adjacent corners
 */
export function calculateMaxCornerDimension(
  part: Part, 
  corner: string, 
  dimension: 'x' | 'y'
): number {
  const corners = part.corners as Record<string, CornerModification> || {};
  const isWidth = dimension === 'x';
  const maxDimension = isWidth ? part.width : part.height;
  
  // Calculate used space by adjacent corners on the same edge
  const getAdjacentCornerDimension = (cornerName: string): number => {
    const adjCorner = corners[cornerName] || { type: 'none' };
    if (adjCorner.type === 'bevel') {
      return adjCorner[dimension] || 0;
    } else if (adjCorner.type === 'round') {
      return adjCorner.x || 0;
    }
    return 0;
  };
  
  let usedSpace = 0;
  
  // Calculate used space based on corner position and dimension
  switch (corner) {
    case 'topLeft':
      if (isWidth) {
        usedSpace = getAdjacentCornerDimension('topRight');
      } else {
        usedSpace = getAdjacentCornerDimension('bottomLeft');
      }
      break;
    case 'topRight':
      if (isWidth) {
        usedSpace = getAdjacentCornerDimension('topLeft');
      } else {
        usedSpace = getAdjacentCornerDimension('bottomRight');
      }
      break;
    case 'bottomRight':
      if (isWidth) {
        usedSpace = getAdjacentCornerDimension('bottomLeft');
      } else {
        usedSpace = getAdjacentCornerDimension('topRight');
      }
      break;
    case 'bottomLeft':
      if (isWidth) {
        usedSpace = getAdjacentCornerDimension('bottomRight');
      } else {
        usedSpace = getAdjacentCornerDimension('topLeft');
      }
      break;
  }
  
  return Math.max(0, maxDimension - usedSpace);
}

/**
 * Resolve conflicts between corners on the same edge by adjusting conflicting corners
 */
export function resolveCornerConflicts(
  part: Part,
  corners: Record<string, CornerModification>,
  updatedCorner: string
): Record<string, CornerModification> {
  const result = { ...corners };
  
  // Helper to get effective dimension for a corner
  const getEffectiveDimension = (cornerData: CornerModification, dimension: 'x' | 'y'): number => {
    if (cornerData.type === 'round') {
      return cornerData.x || 0;
    } else if (cornerData.type === 'bevel') {
      return cornerData[dimension] || 0;
    }
    return 0;
  };
  
  // Check and resolve conflicts for each edge
  const resolveEdgeConflicts = (
    corner1: string, 
    corner2: string, 
    dimension: 'x' | 'y', 
    maxDimension: number
  ) => {
    const corner1Data = result[corner1] || { type: 'none' };
    const corner2Data = result[corner2] || { type: 'none' };
    
    const corner1Dim = getEffectiveDimension(corner1Data, dimension);
    const corner2Dim = getEffectiveDimension(corner2Data, dimension);
    
    if (corner1Dim + corner2Dim > maxDimension) {
      // If the updated corner is corner1, adjust corner2
      if (updatedCorner === corner1) {
        const remaining = maxDimension - corner1Dim;
        if (corner2Data.type === 'round') {
          result[corner2] = { ...corner2Data, x: Math.max(0, remaining) };
        } else if (corner2Data.type === 'bevel') {
          result[corner2] = { ...corner2Data, [dimension]: Math.max(0, remaining) };
        }
      }
      // If the updated corner is corner2, adjust corner1  
      else if (updatedCorner === corner2) {
        const remaining = maxDimension - corner2Dim;
        if (corner1Data.type === 'round') {
          result[corner1] = { ...corner1Data, x: Math.max(0, remaining) };
        } else if (corner1Data.type === 'bevel') {
          result[corner1] = { ...corner1Data, [dimension]: Math.max(0, remaining) };
        }
      }
    }
  };
  
  // Resolve conflicts for each edge
  resolveEdgeConflicts('topLeft', 'topRight', 'x', part.width);
  resolveEdgeConflicts('topRight', 'bottomRight', 'y', part.height);
  resolveEdgeConflicts('bottomRight', 'bottomLeft', 'x', part.width);
  resolveEdgeConflicts('bottomLeft', 'topLeft', 'y', part.height);
  
  return result;
}

/**
 * Clamp a value to be within the allowed range for a corner modification
 */
export function clampCornerValue(
  part: Part,
  corner: string,
  type: 'bevel' | 'round',
  dimension: 'x' | 'y',
  value: number
): number {
  if (type === 'round') {
    const maxRadius = calculateMaxCornerRadius(part, corner);
    return Math.min(Math.max(0, value), maxRadius);
  } else if (type === 'bevel') {
    const maxDimension = calculateMaxCornerDimension(part, corner, dimension);
    return Math.min(Math.max(0, value), maxDimension);
  }
  return value;
}

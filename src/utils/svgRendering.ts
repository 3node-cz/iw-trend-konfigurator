import type { Part, CornerModification } from '../types/simple';
import { SVG_RENDERING } from './appConstants';

/**
 * Utility functions for SVG rendering and part shape generation
 */

export interface SVGPathData {
  d: string;
  fill: string;
  stroke: string;
  strokeWidth: string;
  strokeDasharray?: string;
}

export interface SVGCircleData {
  key: string;
  cx: number;
  cy: number;
  r: number;
  fill: string;
}

export interface SVGRenderResult {
  originalOutline: SVGPathData;
  modifiedShape: SVGPathData;
  cornerIndicators: SVGCircleData[];
  previewWidth: number;
  previewHeight: number;
}

/**
 * Create an SVG path for a rectangle with corner modifications
 */
export function createRectangleWithCorners(
  x: number,
  y: number,
  width: number,
  height: number,
  corners: Record<string, CornerModification>,
  scale: number,
  strokeColor: string,
  fillColor: string
): SVGPathData {
  // Determine starting point based on top-left corner modification
  const topLeftCorner = corners['topLeft'] || { type: 'none' };
  let startX = x;
  let startY = y;
  
  if (topLeftCorner.type === 'bevel' && topLeftCorner.x && topLeftCorner.y) {
    const bevelX = (topLeftCorner.x || 0) * scale;
    startX = x + bevelX;
    startY = y;
  } else if (topLeftCorner.type === 'round' && topLeftCorner.x) {
    const radius = (topLeftCorner.x || 0) * scale;
    startX = x + radius;
    startY = y;
  }
  
  // Start the path from the corrected position
  let path = `M ${startX} ${startY}`;
  
  // Top edge to top-right corner
  const topRightCorner = corners['topRight'] || { type: 'none' };
  if (topRightCorner.type === 'bevel' && topRightCorner.x && topRightCorner.y) {
    const bevelX = (topRightCorner.x || 0) * scale;
    const bevelY = (topRightCorner.y || 0) * scale;
    path += ` L ${x + width - bevelX} ${y}`;
    path += ` L ${x + width} ${y + bevelY}`;
  } else if (topRightCorner.type === 'round' && topRightCorner.x) {
    const radius = (topRightCorner.x || 0) * scale;
    path += ` L ${x + width - radius} ${y}`;
    path += ` Q ${x + width} ${y} ${x + width} ${y + radius}`;
  } else {
    path += ` L ${x + width} ${y}`;
  }
  
  // Right edge to bottom-right corner
  const bottomRightCorner = corners['bottomRight'] || { type: 'none' };
  if (bottomRightCorner.type === 'bevel' && bottomRightCorner.x && bottomRightCorner.y) {
    const bevelX = (bottomRightCorner.x || 0) * scale;
    const bevelY = (bottomRightCorner.y || 0) * scale;
    path += ` L ${x + width} ${y + height - bevelY}`;
    path += ` L ${x + width - bevelX} ${y + height}`;
  } else if (bottomRightCorner.type === 'round' && bottomRightCorner.x) {
    const radius = (bottomRightCorner.x || 0) * scale;
    path += ` L ${x + width} ${y + height - radius}`;
    path += ` Q ${x + width} ${y + height} ${x + width - radius} ${y + height}`;
  } else {
    path += ` L ${x + width} ${y + height}`;
  }
  
  // Bottom edge to bottom-left corner
  const bottomLeftCorner = corners['bottomLeft'] || { type: 'none' };
  if (bottomLeftCorner.type === 'bevel' && bottomLeftCorner.x && bottomLeftCorner.y) {
    const bevelX = (bottomLeftCorner.x || 0) * scale;
    const bevelY = (bottomLeftCorner.y || 0) * scale;
    path += ` L ${x + bevelX} ${y + height}`;
    path += ` L ${x} ${y + height - bevelY}`;
  } else if (bottomLeftCorner.type === 'round' && bottomLeftCorner.x) {
    const radius = (bottomLeftCorner.x || 0) * scale;
    path += ` L ${x + radius} ${y + height}`;
    path += ` Q ${x} ${y + height} ${x} ${y + height - radius}`;
  } else {
    path += ` L ${x} ${y + height}`;
  }
  
  // Left edge back to top-left corner (already defined above)
  if (topLeftCorner.type === 'bevel' && topLeftCorner.x && topLeftCorner.y) {
    const bevelX = (topLeftCorner.x || 0) * scale;
    const bevelY = (topLeftCorner.y || 0) * scale;
    path += ` L ${x} ${y + bevelY}`;
    path += ` L ${x + bevelX} ${y}`;
  } else if (topLeftCorner.type === 'round' && topLeftCorner.x) {
    const radius = (topLeftCorner.x || 0) * scale;
    path += ` L ${x} ${y + radius}`;
    path += ` Q ${x} ${y} ${x + radius} ${y}`;
  } else {
    path += ` L ${x} ${y}`;
  }
  
  path += ' Z';
  
  return {
    d: path,
    fill: fillColor,
    stroke: strokeColor,
    strokeWidth: SVG_RENDERING.strokeWidth.toString(),
    strokeDasharray: fillColor === 'none' ? SVG_RENDERING.dashArray.dashed : SVG_RENDERING.dashArray.solid
  };
}

/**
 * Create corner modification indicator circles
 */
export function createCornerIndicators(
  part: Part,
  padding: number,
  width: number,
  height: number
): SVGCircleData[] {
  return Object.entries(part.corners || {})
    .map(([corner, modification]) => {
      if (modification.type === 'none') return null;
      
      const getCornerPosition = (corner: string) => {
        switch (corner) {
          case 'topLeft': return { x: padding, y: padding };
          case 'topRight': return { x: padding + width, y: padding };
          case 'bottomRight': return { x: padding + width, y: padding + height };
          case 'bottomLeft': return { x: padding, y: padding + height };
          default: return { x: padding, y: padding };
        }
      };
      
      const pos = getCornerPosition(corner);
      
      return {
        key: corner,
        cx: pos.x,
        cy: pos.y,
        r: SVG_RENDERING.cornerIndicatorRadius,
        fill: SVG_RENDERING.colors.cornerIndicator
      };
    })
    .filter((indicator) => indicator !== null) as SVGCircleData[];
}

/**
 * Calculate optimal scale and dimensions for part preview
 */
export function calculatePreviewDimensions(
  part: Part,
  maxDimension: number = SVG_RENDERING.maxPreviewDimension,
  padding: number = SVG_RENDERING.defaultPadding
) {
  const scale = Math.min(maxDimension / part.width, maxDimension / part.height);
  const width = part.width * scale;
  const height = part.height * scale;
  const previewWidth = width + padding * 2;
  const previewHeight = height + padding * 2;
  
  return {
    scale,
    width,
    height,
    previewWidth,
    previewHeight,
    padding
  };
}

/**
 * Render complete part shape with original and modified outlines
 */
export function renderPartShape(part: Part): SVGRenderResult {
  const { scale, width, height, previewWidth, previewHeight, padding } = 
    calculatePreviewDimensions(part);
  
  const corners = (part.corners as Record<string, CornerModification>) || {};

  // Original dimensions (dashed outline)
  const originalOutline = createRectangleWithCorners(
    padding, 
    padding, 
    width, 
    height,
    {},
    scale,
    SVG_RENDERING.colors.originalOutline,
    'none'
  );
  
  // Modified shape (solid)
  const modifiedShape = createRectangleWithCorners(
    padding, 
    padding, 
    width, 
    height,
    corners,
    scale,
    SVG_RENDERING.colors.modifiedStroke,
    SVG_RENDERING.colors.modifiedFill
  );
  
  // Corner modification indicators
  const cornerIndicators = createCornerIndicators(part, padding, width, height);

  return { 
    originalOutline, 
    modifiedShape, 
    cornerIndicators, 
    previewWidth, 
    previewHeight 
  };
}

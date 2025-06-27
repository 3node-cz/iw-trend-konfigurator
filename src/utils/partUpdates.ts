import type { Part, CornerModification } from '../types/simple';
import type { EdgeValue } from './edgeConstants';
import { DEFAULT_EDGES } from './edgeConstants';
import { resolveCornerConflicts } from './cornerCalculations';

/**
 * Utility functions for handling part updates
 */

/**
 * Update edge treatment for a specific edge of a part
 */
export function updatePartEdge(
  part: Part,
  edge: string,
  value: EdgeValue
): Partial<Part> {
  const updatedEdges = {
    ...DEFAULT_EDGES,
    ...(part.edges || {}),
    [edge]: value
  };
  
  return { edges: updatedEdges };
}

/**
 * Update corner modification with automatic conflict resolution
 */
export function updatePartCorner(
  part: Part,
  corner: string,
  updates: Partial<CornerModification>
): Partial<Part> {
  const corners = part.corners as Record<string, CornerModification> || {};
  const currentCorner = corners[corner] || { type: 'none' };
  
  // Apply updates to current corner
  const updatedCorner = { ...currentCorner, ...updates };
  
  // Handle conflict resolution for corners on the same edge
  const updatedCorners = { ...corners, [corner]: updatedCorner };
  
  // Apply automatic adjustments if needed
  const finalCorners = resolveCornerConflicts(part, updatedCorners, corner);
  
  return {
    corners: {
      topLeft: finalCorners['topLeft'] || { type: 'none' },
      topRight: finalCorners['topRight'] || { type: 'none' },
      bottomRight: finalCorners['bottomRight'] || { type: 'none' },
      bottomLeft: finalCorners['bottomLeft'] || { type: 'none' }
    }
  };
}

/**
 * Create update handlers for a part editor component
 */
export function createPartUpdateHandlers(
  part: Part,
  onPartUpdate: (id: string, updates: Partial<Part>) => void
) {
  const handleEdgeUpdate = (edge: string, value: EdgeValue) => {
    const updates = updatePartEdge(part, edge, value);
    onPartUpdate(part.id, updates);
  };

  const handleCornerUpdate = (corner: string, updates: Partial<CornerModification>) => {
    const partUpdates = updatePartCorner(part, corner, updates);
    onPartUpdate(part.id, partUpdates);
  };

  return {
    handleEdgeUpdate,
    handleCornerUpdate
  };
}

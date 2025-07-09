/**
 * Part update handlers and utilities
 */

import type { Part, EdgeTreatment, CornerModification } from '../types/simple'

/**
 * Create update handlers for part editing
 * @param part - The part to create handlers for
 * @param onPartUpdate - The update callback function
 * @returns Object with update handlers
 */
export const createPartUpdateHandlers = (
  part: Part,
  onPartUpdate: (id: string, updates: Partial<Part>) => void,
) => {
  return {
    updateWidth: (width: number) => {
      onPartUpdate(part.id, { width })
    },
    updateHeight: (height: number) => {
      onPartUpdate(part.id, { height })
    },
    updateQuantity: (quantity: number) => {
      onPartUpdate(part.id, { quantity })
    },
    updateLabel: (label: string) => {
      onPartUpdate(part.id, { label })
    },
    updateOrientation: (orientation: 'fixed' | 'rotatable') => {
      onPartUpdate(part.id, { orientation })
    },
    handleEdgeUpdate: (edge: string, value: 'none' | 'abs-1mm' | 'abs-2mm') => {
      const currentEdges = part.edges || {
        top: 'none',
        right: 'none',
        bottom: 'none',
        left: 'none',
      }
      const updatedEdges: EdgeTreatment = {
        ...currentEdges,
        [edge]: value,
      }
      onPartUpdate(part.id, { edges: updatedEdges })
    },
    handleCornerUpdate: (
      corner: string,
      modification: Partial<CornerModification>,
    ) => {
      const currentCorners = part.corners || {
        topLeft: { type: 'none' },
        topRight: { type: 'none' },
        bottomRight: { type: 'none' },
        bottomLeft: { type: 'none' },
      }
      
      // Get existing corner data to preserve existing values
      const existingCornerData = currentCorners[corner as keyof typeof currentCorners] || { type: 'none' }
      
      const fullModification: CornerModification = {
        type: modification.type || existingCornerData.type || 'none',
        ...(modification.x !== undefined && { x: modification.x }),
        ...(modification.y !== undefined && { y: modification.y }),
        ...(modification.edgeType && { edgeType: modification.edgeType }),
        // Preserve existing values if not being updated
        ...(existingCornerData.x !== undefined && modification.x === undefined && { x: existingCornerData.x }),
        ...(existingCornerData.y !== undefined && modification.y === undefined && { y: existingCornerData.y }),
        ...(existingCornerData.edgeType && !modification.edgeType && { edgeType: existingCornerData.edgeType }),
      }
      
      const updatedCorners = {
        ...currentCorners,
        [corner]: fullModification,
      }
      onPartUpdate(part.id, { corners: updatedCorners })
    },
  }
}

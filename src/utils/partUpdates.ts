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
      const fullModification: CornerModification = {
        type: modification.type || 'none',
        ...(modification.x && { x: modification.x }),
        ...(modification.y && { y: modification.y }),
        ...(modification.edgeType && { edgeType: modification.edgeType }),
      }
      const updatedCorners = {
        ...currentCorners,
        [corner]: fullModification,
      }
      onPartUpdate(part.id, { corners: updatedCorners })
    },
  }
}

/**
 * Part update handlers and utilities
 * Consolidated from partUpdates.ts and partUpdateHelpers.ts
 */

import type { Part, EdgeTreatment, CornerModification } from '../types/simple'

/**
 * Constants for mapping edge and corner names to their indices
 */
export const EDGE_INDEX_MAP = {
  top: 0,
  right: 1,
  bottom: 2,
  left: 3,
} as const

export const CORNER_INDEX_MAP = {
  topLeft: 0,
  topRight: 1,
  bottomRight: 2,
  bottomLeft: 3,
} as const

/**
 * Helper function to separate part updates into cutting and visual updates
 * @param updates - The updates to separate
 * @returns Object with cuttingUpdates and visualUpdates
 */
export const separatePartUpdates = (updates: Partial<Part>) => {
  const { width, height, quantity, orientation, label, ...visualUpdates } =
    updates

  // Update cutting properties if any cutting-relevant properties changed
  const cuttingUpdates: Partial<
    Omit<Part, 'id' | 'corners' | 'edges' | 'lShape'>
  > = {}

  if (width !== undefined) cuttingUpdates.width = width
  if (height !== undefined) cuttingUpdates.height = height
  if (quantity !== undefined) cuttingUpdates.quantity = quantity
  if (orientation !== undefined) cuttingUpdates.orientation = orientation
  if (label !== undefined) cuttingUpdates.label = label

  return {
    cuttingUpdates,
    visualUpdates,
  }
}

/**
 * Check if there are any cutting-relevant updates
 * @param updates - Part updates to check
 * @returns boolean indicating if there are cutting updates
 */
export const hasCuttingUpdates = (updates: Partial<Part>): boolean => {
  const { width, height, quantity, orientation, label } = updates
  return (
    width !== undefined ||
    height !== undefined ||
    quantity !== undefined ||
    orientation !== undefined ||
    label !== undefined
  )
}

/**
 * Process edge updates into individual edge operations
 * @param edges - Edge updates object
 * @returns Array of edge operations
 */
export const processEdgeUpdates = (edges: EdgeTreatment) => {
  return Object.entries(edges)
    .map(([edge, value]) => {
      const edgeIndex = EDGE_INDEX_MAP[edge as keyof typeof EDGE_INDEX_MAP]
      return { edgeIndex, value }
    })
    .filter(({ edgeIndex }) => edgeIndex !== undefined)
}

/**
 * Process corner updates into individual corner operations
 * @param corners - Corner updates object
 * @returns Array of corner operations
 */
export const processCornerUpdates = (
  corners: Record<string, CornerModification>,
) => {
  return Object.entries(corners)
    .map(([corner, cornerData]) => {
      const cornerIndex =
        CORNER_INDEX_MAP[corner as keyof typeof CORNER_INDEX_MAP]
      return { cornerIndex, cornerData }
    })
    .filter(({ cornerIndex }) => cornerIndex !== undefined)
}

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
      const existingCornerData = currentCorners[
        corner as keyof typeof currentCorners
      ] || { type: 'none' }

      const fullModification: CornerModification = {
        type: modification.type || existingCornerData.type || 'none',
        ...(modification.x !== undefined && { x: modification.x }),
        ...(modification.y !== undefined && { y: modification.y }),
        ...(modification.edgeType && { edgeType: modification.edgeType }),
        // Preserve existing values if not being updated
        ...(existingCornerData.x !== undefined &&
          modification.x === undefined && { x: existingCornerData.x }),
        ...(existingCornerData.y !== undefined &&
          modification.y === undefined && { y: existingCornerData.y }),
        ...(existingCornerData.edgeType &&
          !modification.edgeType && { edgeType: existingCornerData.edgeType }),
      }

      const updatedCorners = {
        ...currentCorners,
        [corner]: fullModification,
      }
      onPartUpdate(part.id, { corners: updatedCorners })
    },
  }
}

import type { CuttingLayout } from './guillotineCutting'

export interface GroupedLayoutData {
  groupId: string
  layout: CuttingLayout
  materialIndex: number
  materialName: string
  isMultiBoard: boolean
  boardNumber: number
  totalBoards: number
  multiboardStats: any
  instances: Array<{
    materialIndex: number
    boardNumber: number
    materialName: string
  }>
  count: number
}

/**
 * Create a hash of the cutting layout to identify identical layouts
 * Two layouts are identical if they have:
 * - Same board dimensions
 * - Exact same pieces in exact same positions
 * - Same piece names/types and original dimensions
 */
export function createLayoutHash(layout: CuttingLayout): string {
  // Sort pieces by position for consistent hashing
  const sortedPieces = [...layout.placedPieces].sort((a, b) => {
    if (a.x !== b.x) return a.x - b.x
    if (a.y !== b.y) return a.y - b.y
    if (a.width !== b.width) return a.width - b.width
    if (a.height !== b.height) return a.height - b.height
    if (a.rotated !== b.rotated) return a.rotated ? 1 : -1
    // Include original piece dimensions and name for stricter matching
    if (a.originalPiece.length !== b.originalPiece.length) return a.originalPiece.length - b.originalPiece.length
    if (a.originalPiece.width !== b.originalPiece.width) return a.originalPiece.width - b.originalPiece.width
    const aName = a.originalPiece.partName || a.originalPiece.id
    const bName = b.originalPiece.partName || b.originalPiece.id
    return aName.localeCompare(bName)
  })

  // Create hash from exact layout properties - must be identical
  const hashData = {
    boardWidth: layout.boardWidth,
    boardHeight: layout.boardHeight,
    pieceCount: sortedPieces.length,
    pieces: sortedPieces.map(piece => ({
      x: piece.x,
      y: piece.y,
      width: piece.width,
      height: piece.height,
      rotated: piece.rotated,
      // Include original piece identity for strict matching
      originalLength: piece.originalPiece.length,
      originalWidth: piece.originalPiece.width,
      partName: piece.originalPiece.partName || piece.originalPiece.id,
      // Include edge information if present
      edgeInfo: {
        edgeTop: piece.originalPiece.edgeTop,
        edgeBottom: piece.originalPiece.edgeBottom,
        edgeLeft: piece.originalPiece.edgeLeft,
        edgeRight: piece.originalPiece.edgeRight,
        withoutEdge: piece.originalPiece.withoutEdge
      }
    })),
    // Include cut lines for exact matching
    cutLines: layout.cutLines.map(cut => ({
      x1: cut.x1,
      y1: cut.y1,
      x2: cut.x2,
      y2: cut.y2,
      direction: cut.direction
    }))
  }

  // Create a more detailed hash for exact matching
  // Use a simple string hash instead of btoa to handle Unicode characters
  const jsonString = JSON.stringify(hashData)
  let hash = 0
  for (let i = 0; i < jsonString.length; i++) {
    const char = jsonString.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }

  // Convert to positive hex string
  return Math.abs(hash).toString(36).padStart(8, '0')
}

/**
 * Group cutting layouts by their structural similarity
 * Identical cutting layouts will be grouped together with count badges
 */
export function groupCuttingLayouts(layouts: Array<{
  layout: CuttingLayout
  materialIndex: number
  materialName: string
  isMultiBoard: boolean
  boardNumber: number
  totalBoards: number
  multiboardStats: any
}>): GroupedLayoutData[] {
  const groups = new Map<string, GroupedLayoutData>()

  for (const layoutData of layouts) {
    const hash = createLayoutHash(layoutData.layout)

    if (groups.has(hash)) {
      // Add to existing group
      const group = groups.get(hash)!
      group.instances.push({
        materialIndex: layoutData.materialIndex,
        boardNumber: layoutData.boardNumber,
        materialName: layoutData.materialName
      })
      group.count = group.instances.length
    } else {
      // Create new group
      groups.set(hash, {
        groupId: hash,
        layout: layoutData.layout,
        materialIndex: layoutData.materialIndex,
        materialName: layoutData.materialName,
        isMultiBoard: layoutData.isMultiBoard,
        boardNumber: layoutData.boardNumber,
        totalBoards: layoutData.totalBoards,
        multiboardStats: layoutData.multiboardStats,
        instances: [{
          materialIndex: layoutData.materialIndex,
          boardNumber: layoutData.boardNumber,
          materialName: layoutData.materialName
        }],
        count: 1
      })
    }
  }

  // Sort groups by material index and board number for consistent display
  return Array.from(groups.values()).sort((a, b) => {
    if (a.materialIndex !== b.materialIndex) {
      return a.materialIndex - b.materialIndex
    }
    return a.boardNumber - b.boardNumber
  })
}

/**
 * Generate a human-readable title for grouped layouts (for dialog)
 */
export function getGroupedLayoutTitle(group: GroupedLayoutData): string {
  if (group.count === 1) {
    // Single instance - use original title format
    const materialName = group.instances[0].materialName || 'Neznámy materiál'
    return group.isMultiBoard
      ? `Plán č. ${group.materialIndex}.${group.boardNumber} - ${materialName} (${group.boardNumber}/${group.totalBoards})`
      : `Plán č. ${group.materialIndex} - ${materialName}`
  } else {
    // Multiple instances - show grouped title
    const uniqueMaterials = [...new Set(group.instances.map(i => i.materialName || 'Neznámy materiál'))]

    if (uniqueMaterials.length === 1) {
      // All same material
      return `Rozrezový plán - ${uniqueMaterials[0]} (×${group.count} dosiek)`
    } else {
      // Mixed materials
      return `Identický rozrezový plán (×${group.count} dosiek)`
    }
  }
}

/**
 * Generate a short number-based title for thumbnails
 */
export function getGroupedLayoutShortTitle(group: GroupedLayoutData): string {
  // Always use simple numbers - just the first instance's number
  return group.isMultiBoard
    ? `${group.materialIndex}.${group.boardNumber}`
    : `${group.materialIndex}`
}

/**
 * Generate detailed description for grouped layouts
 */
export function getGroupedLayoutDescription(group: GroupedLayoutData): string {
  if (group.count === 1) {
    return ''
  }

  // List just the board numbers in a concise way
  const boardNumbers = group.instances.map(instance => {
    return `${instance.materialIndex}.${instance.boardNumber}`
  })

  return `Dosky: ${boardNumbers.join(', ')}`
}
// Guillotine cutting algorithm - cuts can only go straight across the entire board
import type { CuttingPiece } from '../types/shopify'

export interface PlacedPiece {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  rotated: boolean
  originalPiece: CuttingPiece
}

export interface CutLine {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
  direction: 'horizontal' | 'vertical'
  order: number
}

export interface WasteArea {
  id: string
  x: number
  y: number
  width: number
  height: number
}

export interface CuttingLayout {
  boardWidth: number
  boardHeight: number
  placedPieces: PlacedPiece[]
  cutLines: CutLine[]
  wasteAreas: WasteArea[]
  efficiency: number
  totalUsedArea: number
  totalWasteArea: number
}

// Rectangle representing available space
interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}

// Main guillotine cutting optimizer
export class GuillotineCuttingOptimizer {
  private boardWidth: number
  private boardHeight: number
  private freeRectangles: Rectangle[] = []
  private placedPieces: PlacedPiece[] = []
  private cutLines: CutLine[] = []
  private cutCounter = 0

  constructor(boardWidth: number, boardHeight: number) {
    this.boardWidth = boardWidth
    this.boardHeight = boardHeight
    // Initialize with the full board as one free rectangle
    this.freeRectangles = [{ x: 0, y: 0, width: boardWidth, height: boardHeight }]
  }

  // Try to place all pieces using guillotine cutting
  optimize(pieces: CuttingPiece[]): CuttingLayout {
    this.placedPieces = []
    this.cutLines = []
    this.cutCounter = 0
    this.freeRectangles = [{ x: 0, y: 0, width: this.boardWidth, height: this.boardHeight }]

    const sortedPieces = this.sortPiecesForOptimalCutting(pieces)

    // Try to place each piece
    for (const piece of sortedPieces) {
      for (let qty = 0; qty < piece.quantity; qty++) {
        const placed = this.placePiece(piece, `${piece.id}_${qty}`)
        if (placed) {
          this.placedPieces.push(placed)
        }
      }
    }

    // Calculate waste areas (remaining free rectangles)
    const wasteAreas = this.freeRectangles.map((rect, index) => ({
      id: `waste_${index}`,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    }))
    
    // Calculate efficiency
    const totalUsedArea = this.placedPieces.reduce((sum, p) => sum + (p.width * p.height), 0)
    const totalBoardArea = this.boardWidth * this.boardHeight
    const totalWasteArea = totalBoardArea - totalUsedArea
    const efficiency = (totalUsedArea / totalBoardArea) * 100

    return {
      boardWidth: this.boardWidth,
      boardHeight: this.boardHeight,
      placedPieces: this.placedPieces,
      cutLines: this.cutLines,
      wasteAreas,
      efficiency,
      totalUsedArea,
      totalWasteArea
    }
  }

  // Sort pieces for optimal cutting - larger pieces first
  private sortPiecesForOptimalCutting(pieces: CuttingPiece[]): CuttingPiece[] {
    return [...pieces].sort((a, b) => {
      const aArea = a.length * a.width
      const bArea = b.length * b.width
      const aMax = Math.max(a.length, a.width)
      const bMax = Math.max(b.length, b.width)
      
      // Sort by largest dimension first, then by area
      if (aMax !== bMax) return bMax - aMax
      return bArea - aArea
    })
  }

  // Try to place a single piece
  private placePiece(piece: CuttingPiece, uniqueId: string): PlacedPiece | null {
    const width = piece.length  // Note: length becomes width in cutting
    const height = piece.width  // Note: width becomes height in cutting

    // Find the best fitting rectangle
    let bestRect: Rectangle | null = null
    let bestIndex = -1
    let rotated = false

    // Try normal orientation first
    for (let i = 0; i < this.freeRectangles.length; i++) {
      const rect = this.freeRectangles[i]
      if (rect.width >= width && rect.height >= height) {
        if (!bestRect || this.isBetterFit(rect, bestRect, width, height)) {
          bestRect = rect
          bestIndex = i
          rotated = false
        }
      }
    }

    // Try rotated orientation if normal doesn't fit or if rotation gives better fit
    if (piece.length !== piece.width) {
      for (let i = 0; i < this.freeRectangles.length; i++) {
        const rect = this.freeRectangles[i]
        if (rect.width >= height && rect.height >= width) {
          if (!bestRect || this.isBetterFit(rect, bestRect, height, width)) {
            bestRect = rect
            bestIndex = i
            rotated = true
          }
        }
      }
    }

    if (!bestRect || bestIndex === -1) return null

    // Use rotated dimensions if piece is rotated
    const finalWidth = rotated ? height : width
    const finalHeight = rotated ? width : height

    // Create the placed piece
    const placedPiece: PlacedPiece = {
      id: uniqueId,
      name: piece.partName || `Piece ${uniqueId}`,
      x: bestRect.x,
      y: bestRect.y,
      width: finalWidth,
      height: finalHeight,
      rotated,
      originalPiece: piece
    }

    // Remove the used rectangle and split the remaining area
    this.freeRectangles.splice(bestIndex, 1)
    this.splitRectangle(bestRect, placedPiece)

    return placedPiece
  }

  // Split a rectangle after placing a piece - this is the key guillotine operation
  private splitRectangle(rect: Rectangle, piece: PlacedPiece) {
    const remainingWidth = rect.width - piece.width
    const remainingHeight = rect.height - piece.height

    // Create new rectangles from the remaining space
    const newRects: Rectangle[] = []

    // Right remaining area (if any)
    if (remainingWidth > 0) {
      newRects.push({
        x: rect.x + piece.width,
        y: rect.y,
        width: remainingWidth,
        height: rect.height
      })

      // Add vertical cut line
      this.cutLines.push({
        id: `cut_${this.cutCounter++}`,
        x1: rect.x + piece.width,
        y1: rect.y,
        x2: rect.x + piece.width,
        y2: rect.y + rect.height,
        direction: 'vertical',
        order: this.cutCounter
      })
    }

    // Bottom remaining area (if any)
    if (remainingHeight > 0) {
      newRects.push({
        x: rect.x,
        y: rect.y + piece.height,
        width: piece.width,
        height: remainingHeight
      })

      // Add horizontal cut line
      this.cutLines.push({
        id: `cut_${this.cutCounter++}`,
        x1: rect.x,
        y1: rect.y + piece.height,
        x2: rect.x + piece.width,
        y2: rect.y + piece.height,
        direction: 'horizontal',
        order: this.cutCounter
      })
    }

    // Add new rectangles to the list
    for (const newRect of newRects) {
      if (newRect.width > 0 && newRect.height > 0) {
        this.freeRectangles.push(newRect)
      }
    }
  }

  // Determine if rect1 is a better fit than rect2 for given dimensions
  private isBetterFit(rect1: Rectangle, rect2: Rectangle, width: number, height: number): boolean {
    // Prefer tighter fits (less wasted area)
    const waste1 = (rect1.width * rect1.height) - (width * height)
    const waste2 = (rect2.width * rect2.height) - (width * height)
    
    if (waste1 !== waste2) {
      return waste1 < waste2
    }

    // If waste is equal, prefer smaller area overall
    const area1 = rect1.width * rect1.height
    const area2 = rect2.width * rect2.height
    return area1 < area2
  }
}

// Helper function to optimize multiple materials
export function optimizeAllMaterials(
  materialSpecs: Array<{
    material: { dimensions: { width: number, height: number } }
    pieces: CuttingPiece[]
  }>
): CuttingLayout[] {
  const layouts: CuttingLayout[] = []

  for (const spec of materialSpecs) {
    if (spec.material.dimensions && spec.pieces.length > 0) {
      const optimizer = new GuillotineCuttingOptimizer(
        spec.material.dimensions.width,
        spec.material.dimensions.height
      )
      
      const layout = optimizer.optimize(spec.pieces)
      layouts.push(layout)
    }
  }

  return layouts
}
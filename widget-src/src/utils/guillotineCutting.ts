// Enhanced Guillotine cutting algorithm with professional optimizations
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
  isGrouped?: boolean
  groupId?: string
  blockNumber?: number // Block number for grain continuity
  isBlock?: boolean // True if this piece is part of a block group
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
  boardNumber?: number
  unplacedPieces?: CuttingPiece[]
}

export interface MultiboardCuttingResult {
  boards: CuttingLayout[]
  totalBoards: number
  totalPieces: number
  totalPlacedPieces: number
  totalUnplacedPieces: number
  overallEfficiency: number
  unplacedPieces: CuttingPiece[]
}

// Rectangle representing available space
interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}

// Piece group for identical pieces
interface PieceGroup {
  piece: CuttingPiece
  totalQuantity: number
  width: number
  height: number
  rotated: boolean
  gridWidth: number // pieces per row
  gridHeight: number // pieces per column
  totalWidth: number // total width of the group
  totalHeight: number // total height of the group
}

// Block group for grain continuity
interface BlockGroup {
  blockNumber: number
  pieces: CuttingPiece[]
  totalWidth: number
  totalHeight: number
  rotated: boolean // Whether the entire block is rotated 90°
  allowsRotation: boolean // Whether any piece in block allows rotation
}

// Enhanced guillotine cutting optimizer with professional features
export class OptimizedGuillotineCuttingOptimizer {
  private boardWidth: number
  private boardHeight: number
  private freeRectangles: Rectangle[] = []
  private placedPieces: PlacedPiece[] = []
  private cutLines: CutLine[] = []
  private cutCounter = 0
  private groupCounter = 0

  constructor(boardWidth: number, boardHeight: number) {
    this.boardWidth = boardWidth
    this.boardHeight = boardHeight
    this.freeRectangles = [
      { x: 0, y: 0, width: boardWidth, height: boardHeight },
    ]
  }

  // Multi-board optimization - main entry point
  optimizeMultipleBoards(pieces: CuttingPiece[]): MultiboardCuttingResult {
    const allBoards: CuttingLayout[] = []
    let remainingPieces = [...pieces]
    let boardNumber = 1
    const totalOriginalPieces = pieces.reduce((sum, p) => sum + p.quantity, 0)

    while (remainingPieces.length > 0) {
      // Try to optimize current board
      const layout = this.optimize(remainingPieces)
      layout.boardNumber = boardNumber

      // If no pieces were placed, we can't fit any more
      if (layout.placedPieces.length === 0) {
        break
      }

      allBoards.push(layout)

      // Calculate remaining pieces
      const placedPiecesCount = new Map<string, number>()
      for (const placedPiece of layout.placedPieces) {
        const key = `${placedPiece.originalPiece.length}x${placedPiece.originalPiece.width}`
        placedPiecesCount.set(key, (placedPiecesCount.get(key) || 0) + 1)
      }

      // Update remaining pieces
      remainingPieces = remainingPieces
        .map((piece) => {
          const key = `${piece.length}x${piece.width}`
          const placedCount = placedPiecesCount.get(key) || 0
          const newQuantity = Math.max(0, piece.quantity - placedCount)
          placedPiecesCount.set(key, Math.max(0, placedCount - piece.quantity))

          return {
            ...piece,
            quantity: newQuantity,
          }
        })
        .filter((piece) => piece.quantity > 0)

      boardNumber++

      // Reset optimizer for next board
      this.placedPieces = []
      this.cutLines = []
      this.cutCounter = 0
      this.groupCounter = 0
      this.freeRectangles = [
        { x: 0, y: 0, width: this.boardWidth, height: this.boardHeight },
      ]

      // Safety break to prevent infinite loops
      if (boardNumber > 10) {
        console.warn('Maximum number of boards (10) reached')
        break
      }
    }

    const totalPlacedPieces = allBoards.reduce(
      (sum, board) => sum + board.placedPieces.length,
      0,
    )
    const totalUsedArea = allBoards.reduce(
      (sum, board) => sum + board.totalUsedArea,
      0,
    )
    const totalBoardArea = allBoards.length * this.boardWidth * this.boardHeight
    const overallEfficiency =
      totalBoardArea > 0 ? (totalUsedArea / totalBoardArea) * 100 : 0

    return {
      boards: allBoards,
      totalBoards: allBoards.length,
      totalPieces: totalOriginalPieces,
      totalPlacedPieces,
      totalUnplacedPieces: remainingPieces.reduce(
        (sum, p) => sum + p.quantity,
        0,
      ),
      overallEfficiency,
      unplacedPieces: remainingPieces,
    }
  }

  // Single board optimization (existing method)
  optimize(pieces: CuttingPiece[]): CuttingLayout {
    // Reset state for new optimization
    this.placedPieces = []
    this.cutLines = []
    this.cutCounter = 0

    // Expand pieces by quantity (1 piece with quantity 10 = 10 individual pieces)
    const expandedPieces: CuttingPiece[] = []
    pieces.forEach((piece) => {
      for (let i = 0; i < piece.quantity; i++) {
        expandedPieces.push({
          ...piece,
          id: `${piece.id}_${i}`,
          quantity: 1,
        })
      }
    })

    this.placedPieces = []
    this.cutLines = []
    this.cutCounter = 0
    this.groupCounter = 0
    this.freeRectangles = [
      { x: 0, y: 0, width: this.boardWidth, height: this.boardHeight },
    ]

    // Separate block pieces from regular pieces
    const blockPieces: CuttingPiece[] = []
    const regularPieces: CuttingPiece[] = []

    expandedPieces.forEach(piece => {
      if (piece.algorithmValue > 0) {
        blockPieces.push(piece)
      } else {
        regularPieces.push(piece)
      }
    })

    // Phase 0: Place block groups first (highest priority for grain continuity)
    const blockGroups = this.createBlockGroups(blockPieces)
    const sortedBlocks = this.sortBlocksForOptimalCutting(blockGroups)

    for (const block of sortedBlocks) {
      this.placeBlockGroup(block)
    }

    // Phase 1: Create piece groups for identical regular pieces
    const pieceGroups = this.createPieceGroups(regularPieces)

    // Phase 2: Sort groups by priority (large groups first, then by area)
    const sortedGroups = this.sortGroupsForOptimalCutting(pieceGroups)

    // Phase 3: Place groups
    for (const group of sortedGroups) {
      this.placePieceGroup(group)
    }

    // Phase 4: Post-processing - try to fill small gaps with remaining pieces
    this.optimizeSmallGaps()

    // Calculate waste areas and efficiency
    const wasteAreas = this.freeRectangles.map((rect, index) => ({
      id: `waste_${index}`,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    }))

    const totalUsedArea = this.placedPieces.reduce(
      (sum, p) => sum + p.width * p.height,
      0,
    )
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
      totalWasteArea,
    }
  }

  // Create block groups for grain continuity
  private createBlockGroups(pieces: CuttingPiece[]): BlockGroup[] {
    const blockMap = new Map<number, CuttingPiece[]>()

    // Group pieces by block number
    pieces.forEach(piece => {
      const blockNum = piece.algorithmValue
      if (!blockMap.has(blockNum)) {
        blockMap.set(blockNum, [])
      }
      blockMap.get(blockNum)!.push(piece)
    })

    // Convert to BlockGroup array
    const blockGroups: BlockGroup[] = []
    blockMap.forEach((blockPieces, blockNumber) => {
      // Check if any piece in the block allows rotation
      const allowsRotation = blockPieces.some(p => p.allowRotation)

      // ALWAYS arrange horizontally (side by side)
      // Normal orientation: pieces side by side with length as width
      const totalWidthNormal = blockPieces.reduce((sum, p) => sum + p.length, 0)
      const maxHeightNormal = Math.max(...blockPieces.map(p => p.width))

      // Rotated orientation: rotate entire block 90° (pieces still side by side)
      // When rotated: width becomes length, length becomes width
      const totalWidthRotated = blockPieces.reduce((sum, p) => sum + p.width, 0)
      const maxHeightRotated = Math.max(...blockPieces.map(p => p.length))

      // Choose orientation based on which fits better
      const fitsNormal = totalWidthNormal <= this.boardWidth && maxHeightNormal <= this.boardHeight
      const fitsRotated = allowsRotation && totalWidthRotated <= this.boardWidth && maxHeightRotated <= this.boardHeight

      let rotated = false
      let totalWidth = totalWidthNormal
      let totalHeight = maxHeightNormal

      if (!fitsNormal && fitsRotated) {
        // Only fits when rotated
        rotated = true
        totalWidth = totalWidthRotated
        totalHeight = maxHeightRotated
      } else if (fitsNormal && fitsRotated) {
        // Both fit, choose the one with less waste
        const wasteNormal = (this.boardWidth * this.boardHeight) - (totalWidthNormal * maxHeightNormal)
        const wasteRotated = (this.boardWidth * this.boardHeight) - (totalWidthRotated * maxHeightRotated)

        if (wasteRotated < wasteNormal) {
          rotated = true
          totalWidth = totalWidthRotated
          totalHeight = maxHeightRotated
        }
      }

      blockGroups.push({
        blockNumber,
        pieces: blockPieces,
        totalWidth,
        totalHeight,
        rotated,
        allowsRotation
      })
    })

    return blockGroups
  }

  // Sort blocks by priority
  private sortBlocksForOptimalCutting(blocks: BlockGroup[]): BlockGroup[] {
    return blocks.sort((a, b) => {
      // Sort by total area (largest first)
      const aArea = a.totalWidth * a.totalHeight
      const bArea = b.totalWidth * b.totalHeight
      return bArea - aArea
    })
  }

  // Place a block group with grain continuity
  private placeBlockGroup(block: BlockGroup): void {
    // Find the best fitting rectangle for the entire block
    let bestRect: Rectangle | null = null
    let bestIndex = -1

    for (let i = 0; i < this.freeRectangles.length; i++) {
      const rect = this.freeRectangles[i]
      if (rect.width >= block.totalWidth && rect.height >= block.totalHeight) {
        if (!bestRect || this.isBetterFit(rect, bestRect, block.totalWidth, block.totalHeight)) {
          bestRect = rect
          bestIndex = i
        }
      }
    }

    if (!bestRect || bestIndex === -1) {
      // Can't place block as a group, try placing pieces individually
      console.warn(`Block ${block.blockNumber} could not be placed as a continuous group`)
      return
    }

    // Place pieces horizontally (side by side)
    const blockId = `block_${block.blockNumber}`
    let currentX = bestRect.x
    let currentY = bestRect.y

    block.pieces.forEach((piece, index) => {
      // If block is rotated, swap dimensions for each piece
      // But pieces are still placed side by side (horizontally)
      const pieceWidth = block.rotated ? piece.width : piece.length
      const pieceHeight = block.rotated ? piece.length : piece.width

      const placedPiece: PlacedPiece = {
        id: `${piece.id}_block`,
        name: piece.partName || `Block ${block.blockNumber} - ${index + 1}`,
        x: currentX,
        y: currentY,
        width: pieceWidth,
        height: pieceHeight,
        rotated: block.rotated, // All pieces in block have same rotation
        originalPiece: piece,
        isBlock: true,
        blockNumber: block.blockNumber,
        groupId: blockId
      }

      this.placedPieces.push(placedPiece)

      // Move to next position horizontally (side by side)
      currentX += pieceWidth
    })

    // Remove the used rectangle and split the remaining area
    this.freeRectangles.splice(bestIndex, 1)
    this.splitRectangle(bestRect, {
      x: bestRect.x,
      y: bestRect.y,
      width: block.totalWidth,
      height: block.totalHeight,
    })
  }

  // Create groups for identical pieces
  private createPieceGroups(pieces: CuttingPiece[]): PieceGroup[] {
    const groupMap = new Map<string, PieceGroup>()

    for (const piece of pieces) {
      // Create a key for identical pieces (same dimensions)
      const key = `${piece.length}x${piece.width}`

      if (groupMap.has(key)) {
        const existingGroup = groupMap.get(key)!
        existingGroup.totalQuantity += piece.quantity
      } else {
        // Create new group
        const width = piece.length
        const height = piece.width

        // Calculate optimal grid layout for this piece type
        const { gridWidth, gridHeight, rotated } = this.calculateOptimalGrid(
          width,
          height,
          piece.quantity,
          this.boardWidth,
          this.boardHeight,
          piece.allowRotation,
        )

        const finalWidth = rotated ? height : width
        const finalHeight = rotated ? width : height

        groupMap.set(key, {
          piece,
          totalQuantity: piece.quantity,
          width: finalWidth,
          height: finalHeight,
          rotated,
          gridWidth,
          gridHeight,
          totalWidth: finalWidth * gridWidth,
          totalHeight: finalHeight * gridHeight,
        })
      }
    }

    return Array.from(groupMap.values())
  }

  // Calculate optimal grid arrangement for identical pieces
  private calculateOptimalGrid(
    pieceWidth: number,
    pieceHeight: number,
    quantity: number,
    maxWidth: number,
    maxHeight: number,
    allowRotation = false,
  ): { gridWidth: number; gridHeight: number; rotated: boolean } {
    const tryLayout = (w: number, h: number) => {
      const maxCols = Math.floor(maxWidth / w)
      const maxRows = Math.floor(maxHeight / h)

      if (maxCols === 0 || maxRows === 0) return null

      // Calculate how many pieces we can fit
      const totalFit = Math.min(maxCols * maxRows, quantity)

      // Calculate optimal grid dimensions - prefer filling one dimension completely
      let bestCols = 1
      let bestRows = 1
      let bestWaste = Infinity

      for (let cols = 1; cols <= Math.min(maxCols, totalFit); cols++) {
        const rows = Math.min(maxRows, Math.ceil(totalFit / cols))
        if (cols * rows >= totalFit) {
          const usedWidth = cols * w
          const usedHeight = rows * h
          const waste = maxWidth * maxHeight - usedWidth * usedHeight

          if (waste < bestWaste) {
            bestWaste = waste
            bestCols = cols
            bestRows = rows
          }
        }
      }

      const cols = bestCols
      const rows = bestRows

      return {
        gridWidth: cols,
        gridHeight: rows,
        totalFit,
        efficiency: totalFit / quantity,
        wastedSpace: maxWidth * maxHeight - w * cols * h * rows,
      }
    }

    // Try both orientations only if rotation is allowed
    const normal = tryLayout(pieceWidth, pieceHeight)
    const rotated = allowRotation ? tryLayout(pieceHeight, pieceWidth) : null

    // Choose the better orientation
    if (!normal && !rotated) {
      return { gridWidth: 1, gridHeight: 1, rotated: false }
    }

    if (!rotated || (normal && normal.efficiency >= rotated.efficiency)) {
      return {
        gridWidth: normal!.gridWidth,
        gridHeight: normal!.gridHeight,
        rotated: false,
      }
    } else {
      return {
        gridWidth: rotated.gridWidth,
        gridHeight: rotated.gridHeight,
        rotated: true,
      }
    }
  }

  // Sort groups for optimal cutting
  private sortGroupsForOptimalCutting(groups: PieceGroup[]): PieceGroup[] {
    return groups.sort((a, b) => {
      // First priority: larger groups (more pieces)
      if (a.totalQuantity !== b.totalQuantity) {
        return b.totalQuantity - a.totalQuantity
      }

      // Second priority: larger total area
      const aArea = a.totalWidth * a.totalHeight
      const bArea = b.totalWidth * b.totalHeight
      if (aArea !== bArea) {
        return bArea - aArea
      }

      // Third priority: larger individual pieces
      const aPieceArea = a.width * a.height
      const bPieceArea = b.width * b.height
      return bPieceArea - aPieceArea
    })
  }

  // Place a group of identical pieces
  private placePieceGroup(group: PieceGroup): void {
    let remainingQuantity = group.totalQuantity

    while (remainingQuantity > 0) {
      // Calculate how many pieces to place in this iteration
      const piecesToPlace = Math.min(
        remainingQuantity,
        group.gridWidth * group.gridHeight,
      )

      // Try to find space for the entire group
      const placedGroup = this.placeGroupGrid(group, piecesToPlace)

      if (placedGroup) {
        remainingQuantity -= piecesToPlace
      } else {
        // If we can't place the group, try placing individual pieces
        const individualPiece = this.placeSinglePiece(
          group.piece,
          `${group.piece.id}_${this.groupCounter++}`,
        )
        if (individualPiece) {
          this.placedPieces.push(individualPiece)
          remainingQuantity -= 1
        } else {
          // Can't place any more pieces
          break
        }
      }
    }
  }

  // Place a grid of identical pieces
  private placeGroupGrid(group: PieceGroup, piecesToPlace: number): boolean {
    // Calculate actual grid dimensions for this placement
    const actualCols = Math.min(group.gridWidth, piecesToPlace)
    const actualRows = Math.ceil(piecesToPlace / actualCols)
    const groupWidth = group.width * actualCols
    const groupHeight = group.height * actualRows

    // Find the best fitting rectangle
    let bestRect: Rectangle | null = null
    let bestIndex = -1

    for (let i = 0; i < this.freeRectangles.length; i++) {
      const rect = this.freeRectangles[i]
      if (rect.width >= groupWidth && rect.height >= groupHeight) {
        if (
          !bestRect ||
          this.isBetterFit(rect, bestRect, groupWidth, groupHeight)
        ) {
          bestRect = rect
          bestIndex = i
        }
      }
    }

    if (!bestRect || bestIndex === -1) return false

    // Place individual pieces in the grid
    const groupId = `group_${this.groupCounter++}`
    let pieceIndex = 0

    for (let row = 0; row < actualRows && pieceIndex < piecesToPlace; row++) {
      for (let col = 0; col < actualCols && pieceIndex < piecesToPlace; col++) {
        const piece: PlacedPiece = {
          id: `${group.piece.id}_${pieceIndex}`,
          name: group.piece.partName || `${group.piece.id}_${pieceIndex}`,
          x: bestRect.x + col * group.width,
          y: bestRect.y + row * group.height,
          width: group.width,
          height: group.height,
          rotated: group.rotated,
          originalPiece: group.piece,
          isGrouped: true,
          groupId,
        }

        this.placedPieces.push(piece)
        pieceIndex++
      }
    }

    // Remove the used rectangle and split the remaining area
    this.freeRectangles.splice(bestIndex, 1)
    this.splitRectangle(bestRect, {
      x: bestRect.x,
      y: bestRect.y,
      width: groupWidth,
      height: groupHeight,
    })

    return true
  }

  // Fallback: place a single piece (same as original algorithm)
  private placeSinglePiece(
    piece: CuttingPiece,
    uniqueId: string,
  ): PlacedPiece | null {
    const width = piece.length
    const height = piece.width

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

    // Try rotated orientation only if allowed
    if (piece.allowRotation && piece.length !== piece.width) {
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

    const finalWidth = rotated ? height : width
    const finalHeight = rotated ? width : height

    const placedPiece: PlacedPiece = {
      id: uniqueId,
      name: piece.partName || uniqueId,
      x: bestRect.x,
      y: bestRect.y,
      width: finalWidth,
      height: finalHeight,
      rotated,
      originalPiece: piece,
    }

    this.freeRectangles.splice(bestIndex, 1)
    this.splitRectangle(bestRect, placedPiece)

    return placedPiece
  }

  // Split a rectangle after placing pieces (enhanced with better cut line generation)
  private splitRectangle(
    rect: Rectangle,
    placed: { x: number; y: number; width: number; height: number },
  ) {
    const remainingWidth = rect.width - placed.width
    const remainingHeight = rect.height - placed.height

    const newRects: Rectangle[] = []

    // Create larger continuous areas when possible
    if (remainingWidth > 0) {
      newRects.push({
        x: rect.x + placed.width,
        y: rect.y,
        width: remainingWidth,
        height: rect.height,
      })

      // Add vertical cut line
      this.cutLines.push({
        id: `cut_${this.cutCounter++}`,
        x1: rect.x + placed.width,
        y1: rect.y,
        x2: rect.x + placed.width,
        y2: rect.y + rect.height,
        direction: 'vertical',
        order: this.cutCounter,
      })
    }

    if (remainingHeight > 0) {
      newRects.push({
        x: rect.x,
        y: rect.y + placed.height,
        width: placed.width,
        height: remainingHeight,
      })

      // Add horizontal cut line
      this.cutLines.push({
        id: `cut_${this.cutCounter++}`,
        x1: rect.x,
        y1: rect.y + placed.height,
        x2: rect.x + placed.width,
        y2: rect.y + placed.height,
        direction: 'horizontal',
        order: this.cutCounter,
      })
    }

    // Add new rectangles to the list
    for (const newRect of newRects) {
      if (newRect.width > 0 && newRect.height > 0) {
        this.freeRectangles.push(newRect)
      }
    }
  }

  // Enhanced fit evaluation with better waste minimization
  private isBetterFit(
    rect1: Rectangle,
    rect2: Rectangle,
    width: number,
    height: number,
  ): boolean {
    const waste1 = rect1.width * rect1.height - width * height
    const waste2 = rect2.width * rect2.height - width * height

    // Primary: minimize waste
    if (waste1 !== waste2) {
      return waste1 < waste2
    }

    // Secondary: prefer rectangles that create more usable remaining space
    const remainingArea1 =
      (rect1.width - width) * rect1.height +
      rect1.width * (rect1.height - height) -
      (rect1.width - width) * (rect1.height - height)
    const remainingArea2 =
      (rect2.width - width) * rect2.height +
      rect2.width * (rect2.height - height) -
      (rect2.width - width) * (rect2.height - height)

    if (remainingArea1 !== remainingArea2) {
      return remainingArea1 > remainingArea2
    }

    // Tertiary: prefer better aspect ratio match
    const aspectRatio = width / height
    const rect1AspectRatio = rect1.width / rect1.height
    const rect2AspectRatio = rect2.width / rect2.height

    const aspectDiff1 = Math.abs(aspectRatio - rect1AspectRatio)
    const aspectDiff2 = Math.abs(aspectRatio - rect2AspectRatio)

    return aspectDiff1 < aspectDiff2
  }

  // Post-processing to fill small gaps
  private optimizeSmallGaps(): void {
    // Merge adjacent waste rectangles to create larger usable spaces
    this.mergeWasteRectangles()

    // Try to compact existing pieces to reduce waste
    this.compactLayout()
  }

  // Merge adjacent waste rectangles
  private mergeWasteRectangles(): void {
    let merged = true
    while (merged) {
      merged = false

      for (let i = 0; i < this.freeRectangles.length; i++) {
        for (let j = i + 1; j < this.freeRectangles.length; j++) {
          const rect1 = this.freeRectangles[i]
          const rect2 = this.freeRectangles[j]

          // Check if rectangles can be merged horizontally
          if (rect1.y === rect2.y && rect1.height === rect2.height) {
            if (rect1.x + rect1.width === rect2.x) {
              // rect1 is left of rect2
              this.freeRectangles[i] = {
                x: rect1.x,
                y: rect1.y,
                width: rect1.width + rect2.width,
                height: rect1.height,
              }
              this.freeRectangles.splice(j, 1)
              merged = true
              break
            } else if (rect2.x + rect2.width === rect1.x) {
              // rect2 is left of rect1
              this.freeRectangles[i] = {
                x: rect2.x,
                y: rect1.y,
                width: rect1.width + rect2.width,
                height: rect1.height,
              }
              this.freeRectangles.splice(j, 1)
              merged = true
              break
            }
          }

          // Check if rectangles can be merged vertically
          if (rect1.x === rect2.x && rect1.width === rect2.width) {
            if (rect1.y + rect1.height === rect2.y) {
              // rect1 is above rect2
              this.freeRectangles[i] = {
                x: rect1.x,
                y: rect1.y,
                width: rect1.width,
                height: rect1.height + rect2.height,
              }
              this.freeRectangles.splice(j, 1)
              merged = true
              break
            } else if (rect2.y + rect2.height === rect1.y) {
              // rect2 is above rect1
              this.freeRectangles[i] = {
                x: rect1.x,
                y: rect2.y,
                width: rect1.width,
                height: rect1.height + rect2.height,
              }
              this.freeRectangles.splice(j, 1)
              merged = true
              break
            }
          }
        }

        if (merged) break
      }
    }
  }

  // Compact layout by moving pieces to reduce fragmentation
  private compactLayout(): void {
    // Sort placed pieces by area (smallest first for easier repositioning)
    const sortedPieces = [...this.placedPieces].sort(
      (a, b) => a.width * a.height - b.width * b.height,
    )

    // Try to reposition smaller pieces to better locations
    for (let i = 0; i < Math.min(sortedPieces.length, 5); i++) {
      const piece = sortedPieces[i]

      // Temporarily remove piece and add its space back
      const pieceIndex = this.placedPieces.indexOf(piece)
      if (pieceIndex === -1) continue

      this.placedPieces.splice(pieceIndex, 1)
      this.freeRectangles.push({
        x: piece.x,
        y: piece.y,
        width: piece.width,
        height: piece.height,
      })

      // Try to find a better position
      const originalPos = { x: piece.x, y: piece.y }
      let bestRect: Rectangle | null = null
      let bestIndex = -1

      for (let j = 0; j < this.freeRectangles.length; j++) {
        const rect = this.freeRectangles[j]
        if (rect.width >= piece.width && rect.height >= piece.height) {
          if (
            !bestRect ||
            this.isBetterFit(rect, bestRect, piece.width, piece.height)
          ) {
            bestRect = rect
            bestIndex = j
          }
        }
      }

      if (bestRect && bestIndex !== -1) {
        // Place piece in new position
        piece.x = bestRect.x
        piece.y = bestRect.y
        this.placedPieces.push(piece)

        this.freeRectangles.splice(bestIndex, 1)
        this.splitRectangle(bestRect, piece)

        // Remove the old position we added back
        this.freeRectangles = this.freeRectangles.filter(
          (rect) =>
            !(
              rect.x === originalPos.x &&
              rect.y === originalPos.y &&
              rect.width === piece.width &&
              rect.height === piece.height
            ),
        )
      } else {
        // Put piece back in original position
        this.placedPieces.push(piece)
        // Remove the space we added back
        this.freeRectangles = this.freeRectangles.filter(
          (rect) =>
            !(
              rect.x === originalPos.x &&
              rect.y === originalPos.y &&
              rect.width === piece.width &&
              rect.height === piece.height
            ),
        )
      }
    }
  }
}

// Helper function for backward compatibility
export function optimizeAllMaterials(
  materialSpecs: Array<{
    material: { dimensions: { width: number; height: number } }
    pieces: CuttingPiece[]
  }>,
): CuttingLayout[] {
  const layouts: CuttingLayout[] = []

  for (const spec of materialSpecs) {
    if (spec.material.dimensions && spec.pieces.length > 0) {
      const optimizer = new OptimizedGuillotineCuttingOptimizer(
        spec.material.dimensions.width,
        spec.material.dimensions.height,
      )

      const layout = optimizer.optimize(spec.pieces)
      layouts.push(layout)
    }
  }

  return layouts
}

import type { PieceGeometry, CornerConfig, Point } from '../types/geometry'

export class SVGPathGenerator {
  private geometry: PieceGeometry
  private scale: number

  constructor(geometry: PieceGeometry, scale: number = 1) {
    this.geometry = geometry
    this.scale = scale
  }

  generatePath(): string {
    const { width, height } = this.geometry
    const w = width * this.scale
    const h = height * this.scale

    let path = ''
    
    // Start from top-left corner after considering corner config
    const startPoint = this.getCornerStartPoint('topLeft', 0, 0, w, h)
    path += `M ${startPoint.x} ${startPoint.y}`

    // Trace the perimeter clockwise
    path += this.traceTopEdge(w, h)
    path += this.traceRightEdge(w, h)
    path += this.traceBottomEdge(w, h)
    path += this.traceLeftEdge(w, h)

    path += ' Z' // Close path
    return path
  }

  private getCornerStartPoint(corner: keyof PieceGeometry['corners'], x: number, y: number, w: number, h: number): Point {
    const cornerConfig = this.geometry.corners[corner]
    
    switch (corner) {
      case 'topLeft':
        return this.calculateCornerOffset(cornerConfig, x, y, 'right')
      case 'topRight':
        return { x: x + w, y: y + this.getCornerOffset(cornerConfig, 'down') }
      case 'bottomRight':
        return { x: x + w - this.getCornerOffset(cornerConfig, 'left'), y: y + h }
      case 'bottomLeft':
        return { x: x, y: y + h - this.getCornerOffset(cornerConfig, 'up') }
      default:
        return { x, y }
    }
  }

  private getCornerOffset(corner: CornerConfig, direction: 'up' | 'down' | 'left' | 'right'): number {
    switch (corner.type) {
      case 'rounded':
        return (corner.radius || 0) * this.scale
      case 'beveled':
        const distance1 = (corner.cutDistance1 || 0) * this.scale
        const distance2 = (corner.cutDistance2 || 0) * this.scale
        return direction === 'up' || direction === 'left' ? distance1 : distance2
      default:
        return 0
    }
  }

  private calculateCornerOffset(corner: CornerConfig, baseX: number, baseY: number, direction: 'right' | 'down'): Point {
    const offset = this.getCornerOffset(corner, direction === 'right' ? 'right' : 'down')
    return {
      x: baseX + (direction === 'right' ? offset : 0),
      y: baseY + (direction === 'down' ? offset : 0)
    }
  }

  private traceTopEdge(w: number, h: number): string {
    const topRightCorner = this.geometry.corners.topRight
    const endX = w - this.getCornerOffset(topRightCorner, 'left')
    
    let path = ` L ${endX} 0`
    path += this.generateCornerPath('topRight', w, 0, w, h)
    return path
  }

  private traceRightEdge(w: number, h: number): string {
    const bottomRightCorner = this.geometry.corners.bottomRight
    const endY = h - this.getCornerOffset(bottomRightCorner, 'up')
    
    let path = ` L ${w} ${endY}`
    path += this.generateCornerPath('bottomRight', w, h, w, h)
    return path
  }

  private traceBottomEdge(w: number, h: number): string {
    const bottomLeftCorner = this.geometry.corners.bottomLeft
    const endX = this.getCornerOffset(bottomLeftCorner, 'right')
    
    let path = ` L ${endX} ${h}`
    path += this.generateCornerPath('bottomLeft', 0, h, w, h)
    return path
  }

  private traceLeftEdge(w: number, h: number): string {
    const topLeftCorner = this.geometry.corners.topLeft
    const endY = this.getCornerOffset(topLeftCorner, 'down')
    
    let path = ` L 0 ${endY}`
    path += this.generateCornerPath('topLeft', 0, 0, w, h)
    return path
  }

  private generateCornerPath(corner: keyof PieceGeometry['corners'], cornerX: number, cornerY: number, w: number, h: number): string {
    const cornerConfig = this.geometry.corners[corner]
    
    switch (cornerConfig.type) {
      case 'rounded':
        return this.generateRoundedCorner(corner, cornerX, cornerY, cornerConfig.radius || 0)
      case 'beveled':
        return this.generateBeveledCorner(corner, cornerX, cornerY, cornerConfig.cutDistance1 || 0, cornerConfig.cutDistance2 || 0)
      default:
        return '' // Square corner - just continue with straight lines
    }
  }

  private generateRoundedCorner(corner: keyof PieceGeometry['corners'], x: number, y: number, radius: number): string {
    const r = radius * this.scale
    
    // Arc command: A rx ry x-axis-rotation large-arc-flag sweep-flag x y
    switch (corner) {
      case 'topRight':
        return ` A ${r} ${r} 0 0 1 ${x} ${y + r}`
      case 'bottomRight':
        return ` A ${r} ${r} 0 0 1 ${x - r} ${y}`
      case 'bottomLeft':
        return ` A ${r} ${r} 0 0 1 ${x} ${y - r}`
      case 'topLeft':
        return ` A ${r} ${r} 0 0 1 ${x + r} ${y}`
      default:
        return ''
    }
  }

  private generateBeveledCorner(corner: keyof PieceGeometry['corners'], x: number, y: number, distance1: number, distance2: number): string {
    const d1 = distance1 * this.scale
    const d2 = distance2 * this.scale
    
    switch (corner) {
      case 'topRight':
        return ` L ${x - d1} ${y} L ${x} ${y + d2}`
      case 'bottomRight':
        return ` L ${x} ${y - d1} L ${x - d2} ${y}`
      case 'bottomLeft':
        return ` L ${x + d1} ${y} L ${x} ${y - d2}`
      case 'topLeft':
        return ` L ${x} ${y + d1} L ${x + d2} ${y}`
      default:
        return ''
    }
  }
}

export function createGeometryFromPiece(piece: any): PieceGeometry {
  return {
    width: piece.width,
    height: piece.length, // Note: switching length/width for proper display orientation
    corners: {
      topLeft: { type: 'square' },
      topRight: { type: 'square' },
      bottomRight: { type: 'square' },
      bottomLeft: { type: 'square' }
    }
  }
}
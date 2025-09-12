export interface CornerConfig {
  type: 'square' | 'rounded' | 'beveled'
  radius?: number
  cutDistance1?: number
  cutDistance2?: number
}

export interface PieceGeometry {
  width: number
  height: number
  thickness?: number
  corners: {
    topLeft: CornerConfig
    topRight: CornerConfig
    bottomRight: CornerConfig
    bottomLeft: CornerConfig
  }
}

export interface EdgeConfig {
  top?: string
  right?: string
  bottom?: string
  left?: string
  allAround?: string
}

export interface Point {
  x: number
  y: number
}
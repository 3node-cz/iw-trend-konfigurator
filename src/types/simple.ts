// Simplified types for the basic cutting configurator

export interface CornerModification {
  type: 'none' | 'bevel' | 'round'
  x?: number // horizontal value for bevel, radius for round
  y?: number // vertical value for bevel
  edgeType?: 'none' | 'abs-1mm' | 'abs-2mm' // edge treatment for this corner
}

export interface EdgeTreatment {
  top: 'none' | 'abs-1mm' | 'abs-2mm'
  right: 'none' | 'abs-1mm' | 'abs-2mm'
  bottom: 'none' | 'abs-1mm' | 'abs-2mm'
  left: 'none' | 'abs-1mm' | 'abs-2mm'
}

export interface LShapeConfig {
  enabled: boolean
  // Width from left edge to cutout
  leftWidth?: number
  // Width from right edge to cutout
  rightWidth?: number
  // Corner radii
  bottomLeftRadius?: number // Bottom left outer corner
  topLeftCutoutRadius?: number // Top left cutout corner
  innerCutoutRadius?: number // Inner cutout corner
  rightBottomCutoutRadius?: number // Right bottom cutout corner
  // Legacy support - will be removed
  topLeftWidth?: number
  topLeftHeight?: number
  bottomRightWidth?: number
  bottomRightHeight?: number
  topInnerCornerRadius?: number
  bottomInnerCornerRadius?: number
  innerCornerRadius?: number
}

export interface Part {
  id: string
  width: number
  height: number
  quantity: number
  label?: string
  corners?: {
    topLeft: CornerModification
    topRight: CornerModification
    bottomRight: CornerModification
    bottomLeft: CornerModification
  }
  edges?: EdgeTreatment
  lShape?: LShapeConfig
  orientation?: 'fixed' | 'rotatable' // whether part can be rotated for better packing

  // Configuration status metadata (computed properties)
  hasCornerModifications?: boolean // true if any corner has bevel/round modifications
  hasEdgeTreatments?: boolean // true if any edge has treatment applied
  isLShape?: boolean // true if L-shape is enabled
  hasAdvancedConfig?: boolean // true if any of the above are configured
}

export interface SheetLayout {
  sheets: Sheet[]
  totalSheets: number
  overallEfficiency: number
  unplacedParts: Part[]
}

export interface Sheet {
  sheetNumber: number
  sheetWidth: number
  sheetHeight: number
  placedParts: PlacedPart[]
  efficiency: number
}

export interface PlacedPart {
  part: Part
  x: number
  y: number
  rotation: 0 | 90 // 0 = normal, 90 = rotated
}

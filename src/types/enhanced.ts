// Enhanced types to match the reference implementation

export interface CustomerInfo {
  name: string
  company?: string
  address: string
  city: string
  postalCode: string
  phone: string
  email: string
}

export interface MaterialType {
  id: string
  name: string
  pricePerUnit: number
  thickness: number
  color?: string
  texture?: string
  category: 'dtd' | 'mdf' | 'plywood' | 'other'
}

export interface EdgeType {
  id: string
  name: string
  pricePerMeter: number
  thickness: number
  description: string
  color?: string
}

export interface PartShape {
  type: 'rectangle' | 'L-shape' | 'circle' | 'custom'
  cornerRadius?: number
  cutouts?: Array<{
    x: number
    y: number
    width: number
    height: number
    radius?: number
  }>
}

export interface EdgeProcessing {
  top: EdgeType | null
  right: EdgeType | null
  bottom: EdgeType | null
  left: EdgeType | null
}

export interface CuttingPart {
  id: string
  width: number
  height: number
  quantity: number
  material: MaterialType
  shape: PartShape
  edgeProcessing: EdgeProcessing
  label?: string
  notes?: string
  pricePerPiece: number
  totalPrice: number
}

export interface CuttingConfiguration {
  id: string
  customerInfo: CustomerInfo
  parts: CuttingPart[]
  totalPrice: number
  totalMaterialArea: number
  createdAt: Date
  notes?: string
}

export interface PriceCalculation {
  materialCost: number
  edgeProcessingCost: number
  laborCost: number
  totalCost: number
  materialWaste: number
  efficiency: number
  pricePerPart: CuttingPart[]
}

export interface SheetLayout {
  width: number
  height: number
  parts: Array<{
    part: CuttingPart
    x: number
    y: number
    rotation: number
  }>
  efficiency: number
}

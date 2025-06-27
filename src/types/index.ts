// Types for the cutting configurator application

export interface MaterialType {
  id: string
  name: string
  pricePerUnit: number
  thickness: number
  color?: string
  texture?: string
}

export interface EdgeProcessing {
  id: string
  name: string
  pricePerMeter: number
  description: string
}

export interface CuttingPart {
  id: string
  width: number
  height: number
  quantity: number
  material: MaterialType
  edgeProcessing: EdgeProcessing[]
  label?: string
}

export interface CuttingConfiguration {
  id: string
  parts: CuttingPart[]
  totalPrice: number
  totalMaterialArea: number
  createdAt: Date
  customerInfo?: CustomerInfo
}

export interface CustomerInfo {
  name: string
  email: string
  phone?: string
  company?: string
  address?: Address
}

export interface Address {
  street: string
  city: string
  postalCode: string
  country: string
}

export interface PriceCalculation {
  materialCost: number
  edgeProcessingCost: number
  laborCost: number
  totalCost: number
  materialWaste: number
  efficiency: number
}

export interface ExportData {
  configuration: CuttingConfiguration
  supplierFormat: 'csv' | 'xml' | 'json'
  timestamp: Date
}

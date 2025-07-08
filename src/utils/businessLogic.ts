/**
 * Business logic utilities
 * Calculations, measurements, and business-specific operations
 */

import { APP_CONFIG } from '../config/appConfig'
import type { EnhancedCuttingPart } from '../hooks/three-layer/useLayeredCuttingState'
import type { PlacedPart, SheetLayout } from '../types/simple'

// ===============================================
// MEASUREMENT CALCULATIONS
// ===============================================

/**
 * Calculate total area for a list of parts
 */
export const calculateTotalPartsArea = (
  parts: EnhancedCuttingPart[],
): number => {
  return parts.reduce((total, part) => {
    return total + (part.width * part.height * part.quantity) / 1000000 // Convert mm² to m²
  }, 0)
}

/**
 * Calculate total area for placed parts on sheets
 */
export const calculatePlacedPartsArea = (placedParts: PlacedPart[]): number => {
  return placedParts.reduce((total, part) => {
    const width = part.part.width || 0
    const height = part.part.height || 0
    return total + (width * height) / 1000000 // Convert mm² to m²
  }, 0)
}

/**
 * Calculate sheet area in square meters
 */
export const calculateSheetArea = (width: number, height: number): number => {
  return (width * height) / 1000000 // Convert mm² to m²
}

/**
 * Calculate material efficiency percentage
 */
export const calculateEfficiency = (
  usedArea: number,
  totalSheetArea: number,
): number => {
  if (totalSheetArea === 0) return 0
  return (usedArea / totalSheetArea) * 100
}

/**
 * Calculate total weight based on material density
 */
export const calculateMaterialWeight = (areaM2: number): number => {
  const thicknessM = APP_CONFIG.material.material.thickness / 1000 // Convert mm to m
  const volumeM3 = areaM2 * thicknessM
  return volumeM3 * APP_CONFIG.material.material.density
}

// ===============================================
// LAYOUT STATISTICS
// ===============================================

/**
 * Calculate comprehensive layout statistics
 */
export const calculateLayoutStatistics = (sheetLayout: SheetLayout | null) => {
  if (!sheetLayout) {
    return {
      totalSheets: 0,
      totalPartsPlaced: 0,
      totalPartsRequested: 0,
      totalSheetArea: 0,
      totalUsedArea: 0,
      overallEfficiency: 0,
      totalWeight: 0,
      unplacedParts: 0,
    }
  }

  const totalSheets = sheetLayout.sheets.length
  const totalPartsPlaced = sheetLayout.sheets.reduce(
    (sum, sheet) => sum + sheet.placedParts.length,
    0,
  )
  const totalPartsRequested =
    totalPartsPlaced + sheetLayout.unplacedParts.length

  let totalSheetArea = 0
  let totalUsedArea = 0

  sheetLayout.sheets.forEach((sheet) => {
    const sheetArea = calculateSheetArea(sheet.sheetWidth, sheet.sheetHeight)
    const usedArea = calculatePlacedPartsArea(sheet.placedParts)

    totalSheetArea += sheetArea
    totalUsedArea += usedArea
  })

  const overallEfficiency = calculateEfficiency(totalUsedArea, totalSheetArea)
  const totalWeight = calculateMaterialWeight(totalSheetArea)

  return {
    totalSheets,
    totalPartsPlaced,
    totalPartsRequested,
    totalSheetArea,
    totalUsedArea,
    overallEfficiency,
    totalWeight,
    unplacedParts: sheetLayout.unplacedParts.length,
  }
}

/**
 * Calculate statistics for a single sheet
 */
export const calculateSheetStatistics = (
  sheetWidth: number,
  sheetHeight: number,
  placedParts: PlacedPart[],
) => {
  const sheetArea = calculateSheetArea(sheetWidth, sheetHeight)
  const usedArea = calculatePlacedPartsArea(placedParts)
  const wastedArea = sheetArea - usedArea
  const efficiency = calculateEfficiency(usedArea, sheetArea)

  return {
    sheetArea,
    usedArea,
    wastedArea,
    efficiency,
    partCount: placedParts.length,
  }
}

// ===============================================
// COST CALCULATIONS (if pricing is enabled)
// ===============================================

/**
 * Calculate material cost based on area
 */
export const calculateMaterialCost = (areaM2: number): number => {
  if (!APP_CONFIG.business.pricing.enabled) return 0
  return areaM2 * APP_CONFIG.business.pricing.materialCostPerM2
}

/**
 * Calculate cutting cost based on number of cuts
 */
export const calculateCuttingCost = (numberOfCuts: number): number => {
  if (!APP_CONFIG.business.pricing.enabled) return 0
  return numberOfCuts * APP_CONFIG.business.pricing.cuttingCostPerCut
}

/**
 * Estimate number of cuts needed for a layout
 */
export const estimateNumberOfCuts = (parts: EnhancedCuttingPart[]): number => {
  return parts.reduce((totalCuts, part) => {
    // Basic estimation: 4 cuts per rectangular part (assuming no optimizations)
    let cutsPerPart = 4

    // L-Shape parts need additional cuts
    if (part.lShape?.enabled) {
      cutsPerPart += 2 // Additional cuts for the cutout
    }

    // Frame parts need more cuts
    if (part.frame?.enabled) {
      cutsPerPart += 4 // Additional cuts for inner frame
    }

    return totalCuts + cutsPerPart * part.quantity
  }, 0)
}

/**
 * Calculate total project cost
 */
export const calculateProjectCost = (
  parts: EnhancedCuttingPart[],
  sheetLayout: SheetLayout | null,
) => {
  if (!APP_CONFIG.business.pricing.enabled) {
    return {
      materialCost: 0,
      cuttingCost: 0,
      subtotal: 0,
      vat: 0,
      total: 0,
    }
  }

  const stats = calculateLayoutStatistics(sheetLayout)
  const numberOfCuts = estimateNumberOfCuts(parts)

  const materialCost = calculateMaterialCost(stats.totalSheetArea)
  const cuttingCost = calculateCuttingCost(numberOfCuts)
  const subtotal = materialCost + cuttingCost
  const vat = subtotal * APP_CONFIG.business.pricing.vatRate
  const total = subtotal + vat

  return {
    materialCost,
    cuttingCost,
    subtotal,
    vat,
    total,
    currency: APP_CONFIG.business.pricing.currency,
  }
}

// ===============================================
// OPTIMIZATION METRICS
// ===============================================

/**
 * Calculate optimization quality metrics
 */
export const calculateOptimizationMetrics = (
  sheetLayout: SheetLayout | null,
) => {
  if (!sheetLayout) {
    return {
      utilizationScore: 0,
      compactnessScore: 0,
      wasteScore: 0,
      overallScore: 0,
    }
  }

  const stats = calculateLayoutStatistics(sheetLayout)

  // Utilization score (0-100) based on efficiency
  const utilizationScore = Math.min(stats.overallEfficiency, 100)

  // Compactness score based on number of sheets used vs theoretical minimum
  const totalPartsArea = stats.totalUsedArea
  const singleSheetArea = calculateSheetArea(
    APP_CONFIG.material.defaultBoard.width,
    APP_CONFIG.material.defaultBoard.height,
  )
  const theoreticalMinSheets = Math.ceil(totalPartsArea / singleSheetArea)
  const compactnessScore =
    theoreticalMinSheets > 0
      ? Math.max(
          0,
          100 -
            ((stats.totalSheets - theoreticalMinSheets) /
              theoreticalMinSheets) *
              50,
        )
      : 100

  // Waste score (inverted - lower waste = higher score)
  const wastePercentage = 100 - stats.overallEfficiency
  const wasteScore = Math.max(0, 100 - wastePercentage)

  // Overall score (weighted average)
  const overallScore =
    utilizationScore * 0.5 + compactnessScore * 0.3 + wasteScore * 0.2

  return {
    utilizationScore: Math.round(utilizationScore),
    compactnessScore: Math.round(compactnessScore),
    wasteScore: Math.round(wasteScore),
    overallScore: Math.round(overallScore),
  }
}

// ===============================================
// PART ANALYSIS
// ===============================================

/**
 * Analyze part complexity and requirements
 */
export const analyzePartComplexity = (part: EnhancedCuttingPart) => {
  let complexityScore = 1 // Base score

  // L-Shape adds complexity
  if (part.lShape?.enabled) {
    complexityScore += 1.5
  }

  // Frame adds significant complexity
  if (part.frame?.enabled) {
    complexityScore += 2
  }

  // Corner modifications add minor complexity
  if (part.hasCornerModifications) {
    complexityScore += 0.5
  }

  // Edge treatments add minor complexity
  if (part.hasEdgeTreatments) {
    complexityScore += 0.3
  }

  // Size factor (larger parts are generally easier to handle)
  const area = part.width * part.height
  const sizeFactor = area > 500000 ? 0.9 : area < 100000 ? 1.2 : 1 // 500cm² and 100cm² thresholds

  complexityScore *= sizeFactor

  return {
    score: Math.round(complexityScore * 10) / 10, // Round to 1 decimal
    category:
      complexityScore <= 1.5
        ? 'simple'
        : complexityScore <= 3
        ? 'medium'
        : 'complex',
    factors: {
      hasLShape: part.lShape?.enabled || false,
      hasFrame: part.frame?.enabled || false,
      hasCorners: part.hasCornerModifications || false,
      hasEdges: part.hasEdgeTreatments || false,
      sizeCategory:
        sizeFactor === 0.9 ? 'large' : sizeFactor === 1.2 ? 'small' : 'medium',
    },
  }
}

/**
 * Get performance benchmarks for the current layout
 */
export const getPerformanceBenchmarks = (sheetLayout: SheetLayout | null) => {
  const stats = calculateLayoutStatistics(sheetLayout)
  const metrics = calculateOptimizationMetrics(sheetLayout)

  return {
    efficiency: {
      current: stats.overallEfficiency,
      good: 75,
      excellent: 85,
      status:
        stats.overallEfficiency >= 85
          ? 'excellent'
          : stats.overallEfficiency >= 75
          ? 'good'
          : stats.overallEfficiency >= 50
          ? 'fair'
          : 'poor',
    },
    waste: {
      current: 100 - stats.overallEfficiency,
      acceptable: 25,
      good: 15,
      status:
        100 - stats.overallEfficiency <= 15
          ? 'excellent'
          : 100 - stats.overallEfficiency <= 25
          ? 'good'
          : 100 - stats.overallEfficiency <= 40
          ? 'fair'
          : 'poor',
    },
    optimization: {
      current: metrics.overallScore,
      good: 70,
      excellent: 80,
      status:
        metrics.overallScore >= 80
          ? 'excellent'
          : metrics.overallScore >= 70
          ? 'good'
          : metrics.overallScore >= 50
          ? 'fair'
          : 'poor',
    },
  }
}

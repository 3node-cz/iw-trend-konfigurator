import type { CuttingPart, PriceCalculation } from '../types';

/**
 * Calculate the total price for a cutting configuration
 */
export const calculatePrice = (parts: CuttingPart[]): PriceCalculation => {
  let materialCost = 0;
  let edgeProcessingCost = 0;

  parts.forEach(part => {
    const partArea = (part.width / 1000) * (part.height / 1000); // Convert mm to m²
    const partMaterialCost = partArea * part.material.pricePerUnit * part.quantity;
    materialCost += partMaterialCost;

    // Calculate edge processing cost
    const perimeter = 2 * (part.width + part.height) / 1000; // Convert mm to m
    part.edgeProcessing.forEach(edge => {
      edgeProcessingCost += perimeter * edge.pricePerMeter * part.quantity;
    });
  });

  // Calculate material waste (simplified algorithm)
  const materialWaste = calculateMaterialWaste(parts);
  const efficiency = 1 - materialWaste;
  
  // Basic labor cost calculation (10% of material cost)
  const laborCost = materialCost * 0.1;
  
  const totalCost = materialCost + edgeProcessingCost + laborCost;

  return {
    materialCost,
    edgeProcessingCost,
    laborCost,
    totalCost,
    materialWaste,
    efficiency
  };
};

/**
 * Calculate material waste percentage based on cutting optimization
 */
export const calculateMaterialWaste = (parts: CuttingPart[]): number => {
  // Simplified waste calculation
  // In a real application, this would use more sophisticated cutting optimization algorithms
  const totalPartsArea = parts.reduce((sum, part) => {
    const area = (part.width / 1000) * (part.height / 1000) * part.quantity;
    return sum + area;
  }, 0);

  // Assume standard sheet size of 2800x2070mm
  const standardSheetArea = 2.8 * 2.07;
  const sheetsNeeded = Math.ceil(totalPartsArea / (standardSheetArea * 0.85)); // 85% efficiency
  const totalSheetArea = sheetsNeeded * standardSheetArea;
  
  const waste = totalSheetArea > 0 ? (totalSheetArea - totalPartsArea) / totalSheetArea : 0;
  return Math.max(0, Math.min(1, waste));
};

/**
 * Optimize cutting layout for minimal waste
 */
export const optimizeCuttingLayout = (parts: CuttingPart[], sheetWidth = 2800, sheetHeight = 2070) => {
  // Simplified bin packing algorithm
  // In production, you'd use more sophisticated algorithms like Bottom-Left Fill or Genetic Algorithms
  const sheets: Array<{ width: number; height: number; parts: CuttingPart[] }> = [];
  const sortedParts = [...parts].sort((a, b) => (b.width * b.height) - (a.width * a.height));

  sortedParts.forEach(part => {
    let placed = false;
    
    for (const sheet of sheets) {
      if (canFitInSheet(part, sheet, sheetWidth, sheetHeight)) {
        sheet.parts.push(part);
        placed = true;
        break;
      }
    }
    
    if (!placed) {
      sheets.push({
        width: sheetWidth,
        height: sheetHeight,
        parts: [part]
      });
    }
  });

  return sheets;
};

/**
 * Check if a part can fit in the remaining space of a sheet
 */
const canFitInSheet = (
  part: CuttingPart, 
  sheet: { parts: CuttingPart[] }, 
  sheetWidth: number, 
  sheetHeight: number
): boolean => {
  // Simplified check - in reality, you'd need more complex space management
  const usedArea = sheet.parts.reduce((sum, p) => sum + (p.width * p.height * p.quantity), 0);
  const totalSheetArea = sheetWidth * sheetHeight;
  const partArea = part.width * part.height * part.quantity;
  
  return (usedArea + partArea) <= (totalSheetArea * 0.85); // 85% efficiency factor
};

/**
 * Format price for display
 */
export const formatPrice = (price: number, currency = 'CZK'): string => {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

/**
 * Convert measurements to different units
 */
export const convertUnits = {
  mmToM: (mm: number) => mm / 1000,
  mToMm: (m: number) => m * 1000,
  mmToCm: (mm: number) => mm / 10,
  cmToMm: (cm: number) => cm * 10
};

import type { Part, SheetLayout, Sheet, PlacedPart } from '../types/simple'

/**
 * Pure function to expand parts by quantity
 */
export const expandPartsByQuantity = (parts: Part[]): Part[] => {
  const allParts: Part[] = []
  parts.forEach((part) => {
    for (let i = 0; i < part.quantity; i++) {
      allParts.push({ ...part, id: `${part.id}-${i}`, quantity: 1 })
    }
  })
  return allParts
}

/**
 * Pure function to sort parts by area (largest first)
 */
export const sortPartsByArea = (parts: Part[]): Part[] => {
  return [...parts].sort(
    (a, b) =>
      Number(b.width) * Number(b.height) - Number(a.width) * Number(a.height),
  )
}

/**
 * Pure function to check if two rectangles overlap with gap consideration
 */
export const hasOverlap = (
  x: number,
  y: number,
  width: number,
  height: number,
  placedParts: PlacedPart[],
  gap: number,
): boolean => {
  for (const placed of placedParts) {
    const placedWidth =
      placed.rotation === 90
        ? Number(placed.part.height)
        : Number(placed.part.width)
    const placedHeight =
      placed.rotation === 90
        ? Number(placed.part.width)
        : Number(placed.part.height)

    // Check if rectangles overlap (with gap)
    if (
      !(
        x >= placed.x + placedWidth + gap ||
        placed.x >= x + width + gap ||
        y >= placed.y + placedHeight + gap ||
        placed.y >= y + height + gap
      )
    ) {
      return true
    }
  }
  return false
}

/**
 * Pure function to find the best position using Bottom-Left Fill strategy
 */
export const findBestPosition = (
  sheet: Sheet,
  partWidth: number,
  partHeight: number,
  gap: number,
  stepSize: number = 10,
): { x: number; y: number } | null => {
  const { sheetWidth, sheetHeight, placedParts } = sheet

  // Try positions starting from bottom-left, moving right then up
  for (let y = 0; y <= sheetHeight - partHeight; y += stepSize) {
    for (let x = 0; x <= sheetWidth - partWidth; x += stepSize) {
      if (!hasOverlap(x, y, partWidth, partHeight, placedParts, gap)) {
        // Check if this position is as low and left as possible
        let canMoveDown = false
        let canMoveLeft = false

        // Check if we can move down
        if (y > 0) {
          for (let testY = y - stepSize; testY >= 0; testY -= stepSize) {
            if (
              !hasOverlap(x, testY, partWidth, partHeight, placedParts, gap)
            ) {
              canMoveDown = true
              break
            }
          }
        }

        // Check if we can move left
        if (x > 0 && !canMoveDown) {
          for (let testX = x - stepSize; testX >= 0; testX -= stepSize) {
            if (
              !hasOverlap(testX, y, partWidth, partHeight, placedParts, gap)
            ) {
              canMoveLeft = true
              break
            }
          }
        }

        // If we can't move down or left, this is a good position
        if (!canMoveDown && !canMoveLeft) {
          return { x, y }
        }
      }
    }
  }
  return null
}

/**
 * Pure function to get possible orientations for a part
 */
export const getPartOrientations = (
  part: Part,
): Array<{ width: number; height: number; rotation: 0 | 90 }> => {
  const orientations: Array<{
    width: number
    height: number
    rotation: 0 | 90
  }> = [{ width: Number(part.width), height: Number(part.height), rotation: 0 }]

  // Add 90-degree rotation if part is not square
  if (part.width !== part.height) {
    orientations.push({
      width: Number(part.height),
      height: Number(part.width),
      rotation: 90,
    })
  }

  return orientations
}

/**
 * Pure function to find the best placement for a part on a sheet
 */
export const findBestPlacement = (
  sheet: Sheet,
  part: Part,
  gap: number,
  stepSize: number = 10,
): {
  x: number
  y: number
  rotation: 0 | 90
  width: number
  height: number
} | null => {
  const orientations = getPartOrientations(part)
  let bestPosition: {
    x: number
    y: number
    rotation: 0 | 90
    width: number
    height: number
  } | null = null

  for (const orientation of orientations) {
    const position = findBestPosition(
      sheet,
      orientation.width,
      orientation.height,
      gap,
      stepSize,
    )

    if (position) {
      // Prefer positions that are lower (smaller y), then lefter (smaller x)
      if (
        !bestPosition ||
        position.y < bestPosition.y ||
        (position.y === bestPosition.y && position.x < bestPosition.x)
      ) {
        bestPosition = {
          x: position.x,
          y: position.y,
          rotation: orientation.rotation,
          width: orientation.width,
          height: orientation.height,
        }
      }
    }
  }

  return bestPosition
}

/**
 * Pure function to calculate sheet efficiency
 */
export const calculateSheetEfficiency = (sheet: Sheet): number => {
  const usedArea = sheet.placedParts.reduce((sum, placedPart) => {
    return sum + Number(placedPart.part.width) * Number(placedPart.part.height)
  }, 0)
  return usedArea / (sheet.sheetWidth * sheet.sheetHeight)
}

/**
 * Pure function to calculate overall efficiency
 */
export const calculateOverallEfficiency = (sheets: Sheet[]): number => {
  const totalUsedArea = sheets.reduce((sum, sheet) => {
    return (
      sum +
      sheet.placedParts.reduce((sheetSum, placedPart) => {
        return (
          sheetSum +
          Number(placedPart.part.width) * Number(placedPart.part.height)
        )
      }, 0)
    )
  }, 0)
  const totalSheetArea = sheets.reduce(
    (sum, sheet) => sum + sheet.sheetWidth * sheet.sheetHeight,
    0,
  )
  return totalSheetArea > 0 ? totalUsedArea / totalSheetArea : 0
}

/**
 * Pure function to place a single part on a sheet
 */
export const placePart = (
  sheet: Sheet,
  part: Part,
  placement: { x: number; y: number; rotation: 0 | 90 },
): Sheet => {
  return {
    ...sheet,
    placedParts: [
      ...sheet.placedParts,
      {
        part,
        x: placement.x,
        y: placement.y,
        rotation: placement.rotation,
      },
    ],
  }
}

/**
 * Pure function to create an empty sheet
 */
export const createEmptySheet = (
  sheetNumber: number,
  sheetWidth: number,
  sheetHeight: number,
): Sheet => {
  return {
    sheetNumber,
    sheetWidth,
    sheetHeight,
    placedParts: [],
    efficiency: 0,
  }
}

/**
 * Configuration interface for the cutting optimization
 */
export interface CuttingConfig {
  sheetWidth: number
  sheetHeight: number
  gap: number
  stepSize: number
  enableLogging: boolean
}

/**
 * Default configuration
 */
export const defaultCuttingConfig: CuttingConfig = {
  sheetWidth: 2800,
  sheetHeight: 2070,
  gap: 1,
  stepSize: 10,
  enableLogging: true,
}

/**
 * Logger interface for dependency injection
 */
export interface Logger {
  log: (message: string) => void
  warn: (message: string) => void
}

/**
 * Console logger implementation
 */
export const consoleLogger: Logger = {
  log: (message: string) => console.log(message),
  warn: (message: string) => console.warn(message),
}

/**
 * Silent logger for testing/production
 */
export const silentLogger: Logger = {
  log: () => {},
  warn: () => {},
}

/**
 * Development logger - only logs in development mode
 */
export const developmentLogger: Logger = {
  log: (message: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(message)
    }
  },
  warn: (message: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(message)
    }
  },
}

/**
 * Core cutting optimization algorithm - Bottom-Left Fill
 * Pure function that takes parts and configuration, returns optimized layout
 */
export const optimizeCuttingBLF = (
  parts: Part[],
  config: CuttingConfig = defaultCuttingConfig,
  logger: Logger = consoleLogger,
): SheetLayout => {
  const { sheetWidth, sheetHeight, gap, stepSize, enableLogging } = config
  const log = enableLogging ? logger.log : () => {}
  const warn = enableLogging ? logger.warn : () => {}

  // Step 1: Expand and sort parts
  const expandedParts = expandPartsByQuantity(parts)
  const sortedParts = sortPartsByArea(expandedParts)

  log('🔧 Advanced BLF Algorithm for Mixed-Size Parts')
  log(
    `📦 Processing parts: ${sortedParts
      .map((p) => `${p.width}×${p.height}mm`)
      .join(', ')}`,
  )
  log(`📋 Sheet size: ${sheetWidth}×${sheetHeight}mm`)

  const sheets: Sheet[] = []
  const unplacedParts: Part[] = []
  const remainingParts = [...sortedParts]
  let sheetNumber = 1

  // Step 2: Process each sheet
  while (remainingParts.length > 0) {
    log(`\n📄 Starting Sheet ${sheetNumber}`)
    log(`📊 Remaining parts: ${remainingParts.length}`)

    let currentSheet = createEmptySheet(sheetNumber, sheetWidth, sheetHeight)
    let partsPlacedOnThisSheet = 0
    let consecutiveFailures = 0

    // Step 3: Keep trying to place parts until no more fit
    while (
      remainingParts.length > 0 &&
      consecutiveFailures < remainingParts.length
    ) {
      let partPlaced = false

      // Try to place each remaining part
      for (let i = 0; i < remainingParts.length; i++) {
        const part = remainingParts[i]
        const placement = findBestPlacement(currentSheet, part, gap, stepSize)

        if (placement) {
          // Place the part
          currentSheet = placePart(currentSheet, part, placement)

          log(
            `✅ Placed ${part.width}×${part.height}mm at (${placement.x}, ${placement.y}) rotation: ${placement.rotation}°`,
          )

          remainingParts.splice(i, 1)
          partsPlacedOnThisSheet++
          partPlaced = true
          consecutiveFailures = 0
          break // Start over with the remaining parts
        }
      }

      if (!partPlaced) {
        consecutiveFailures++
      }
    }

    // Step 4: Finalize sheet
    currentSheet.efficiency = calculateSheetEfficiency(currentSheet)
    log(
      `📋 Sheet ${sheetNumber} completed: ${
        currentSheet.placedParts.length
      } parts, ${(currentSheet.efficiency * 100).toFixed(1)}% efficiency`,
    )

    if (currentSheet.placedParts.length > 0) {
      sheets.push(currentSheet)
      sheetNumber++
    }

    // Step 5: Handle unplaceable parts
    if (partsPlacedOnThisSheet === 0 && remainingParts.length > 0) {
      warn('⚠️ Some parts cannot fit on any sheet:')
      remainingParts.forEach((part) => {
        warn(
          `  - ${part.width}×${part.height}mm (too large for ${sheetWidth}×${sheetHeight}mm sheet)`,
        )
        unplacedParts.push(part)
      })
      break
    }
  }

  // Step 6: Calculate final results
  const overallEfficiency = calculateOverallEfficiency(sheets)

  log(`\n🎯 === CUTTING SUMMARY ===`)
  log(`📄 Total sheets used: ${sheets.length}`)
  log(
    `📦 Total parts placed: ${sheets.reduce(
      (sum, sheet) => sum + sheet.placedParts.length,
      0,
    )}`,
  )
  log(`❌ Unplaced parts: ${unplacedParts.length}`)
  log(`⚡ Overall efficiency: ${(overallEfficiency * 100).toFixed(1)}%`)

  return {
    sheets,
    totalSheets: sheets.length,
    overallEfficiency,
    unplacedParts,
  }
}

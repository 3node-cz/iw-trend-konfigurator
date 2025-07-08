import type {
  Part,
  SheetLayout,
  Sheet,
  PlacedPart,
  PartBlock,
  BlockLayout,
} from '../types/simple'
import { createPartBlocks } from './blockManagement'

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
  }> = []

  // Debug logging for frame pieces
  if (part.id.includes('_frame_')) {
    console.log(
      `Frame piece ${part.id}: grainDirection=${part.grainDirection}, dimensions=${part.width}x${part.height}`,
    )
  }

  // For frame pieces with vertical grain direction, force rotation
  if (part.grainDirection === 'vertical') {
    // Vertical grain pieces should be rotated 90 degrees
    orientations.push({
      width: Number(part.height),
      height: Number(part.width),
      rotation: 90,
    })
    console.log(
      `Forcing rotation for vertical grain piece ${part.id}: ${part.width}x${part.height} -> ${part.height}x${part.width} (90°)`,
    )
  } else {
    // Default orientation (horizontal grain or no grain specified)
    orientations.push({
      width: Number(part.width),
      height: Number(part.height),
      rotation: 0,
    })
  }

  // Add 90-degree rotation only if part is not square AND rotation is enabled AND no grain constraint
  if (
    part.width !== part.height &&
    part.orientation === 'rotatable' &&
    !part.grainDirection // Only allow rotation if no specific grain direction
  ) {
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

/**
 * Optimizes cutting layout with block support for texture continuity
 * Blocks are groups of parts that must be placed together to maintain wood texture continuity
 */
export const optimizeCuttingWithBlocks = (
  parts: Part[],
  config: CuttingConfig = defaultCuttingConfig,
  logger: Logger = consoleLogger,
): BlockLayout => {
  const { sheetWidth, sheetHeight, enableLogging } = config
  const log = enableLogging ? logger.log : () => {}

  log('🔧 Advanced BLF Algorithm with Block Support')
  log(`📦 Processing ${parts.length} parts with potential blocks`)
  log(`📋 Sheet size: ${sheetWidth}×${sheetHeight}mm`)

  // Step 1: Parts are already expanded by the block preparation hook, so use them directly
  // No need to expand by quantity since block preparation already created individual pieces
  log(
    `📦 Using ${parts.length} individual parts (already expanded by block preparation)`,
  )

  // Debug: Log parts
  parts.forEach((part) => {
    log(
      `  Part: ${part.id} (${part.width}×${part.height}mm, qty: ${part.quantity}, blockId: ${part.blockId})`,
    )
  })

  const blocks = createPartBlocks(parts, sheetWidth, sheetHeight)
  log(`📦 Created ${blocks.length} blocks (including individual parts)`)

  // Debug: Log block details
  blocks.forEach((block) => {
    log(
      `  Block ${block.blockId}: ${block.parts.length} parts, ${block.totalWidth}×${block.totalHeight}mm, canFit: ${block.canFitOnSingleBoard}`,
    )
    block.parts.forEach((part, index) => {
      log(
        `    Part ${index + 1}: ${part.id} (${part.width}×${
          part.height
        }mm, qty: ${part.quantity})`,
      )
    })
  })

  // Step 2: Create a block-aware optimization strategy
  // Group parts by blockId and create placement units
  const placementUnits: Part[] = []
  const blockGroups = new Map<number, Part[]>()
  const individualParts: Part[] = []
  const compositeToOriginalMap = new Map<string, Part[]>()

  // Separate parts into blocks and individuals
  parts.forEach((part) => {
    if (part.blockId && part.blockId > 0) {
      if (!blockGroups.has(part.blockId)) {
        blockGroups.set(part.blockId, [])
      }
      blockGroups.get(part.blockId)!.push(part)
    } else {
      individualParts.push(part)
    }
  })

  // Create composite placement units for blocks
  blockGroups.forEach((blockParts, blockId) => {
    const block = blocks.find((b) => b.blockId === blockId)
    if (!block) return

    if (block.canFitOnSingleBoard) {
      // Create a composite part for block placement
      const compositeId = `block-composite-${blockId}`
      const compositePart: Part = {
        id: compositeId,
        width: block.totalWidth,
        height: block.totalHeight,
        quantity: 1,
        label: `Block ${blockId} (${blockParts.length} parts)`,
        blockId: blockId,
        orientation: 'fixed',
      }
      placementUnits.push(compositePart)
      compositeToOriginalMap.set(compositeId, blockParts)
      log(
        `  ✅ Created composite placement unit for Block ${blockId}: ${block.totalWidth}×${block.totalHeight}mm`,
      )
    } else {
      // Block too large, add parts individually
      placementUnits.push(...blockParts)
      log(`  ⚠️ Block ${blockId} too large, adding parts individually`)
    }
  })

  // Add individual parts
  placementUnits.push(...individualParts)

  log(
    `📦 Created ${placementUnits.length} placement units from ${parts.length} parts`,
  )

  // Step 3: Optimize using the existing BLF algorithm
  const basicLayout = optimizeCuttingBLF(placementUnits, config, logger)

  // Step 4: Expand composite parts back to individual parts for the final layout
  const finalSheets = basicLayout.sheets.map((sheet) => ({
    ...sheet,
    placedParts: sheet.placedParts.flatMap((placedPart) => {
      if (placedPart.part.id.startsWith('block-composite-')) {
        // Expand composite block back to individual parts
        const originalParts = compositeToOriginalMap.get(placedPart.part.id)
        if (!originalParts) return [placedPart]

        let currentX = placedPart.x

        return originalParts.map((originalPart) => {
          const expandedPart = {
            part: originalPart,
            x: currentX,
            y: placedPart.y,
            rotation: placedPart.rotation,
          }
          // Update position for next part
          currentX += originalPart.width
          return expandedPart
        })
      } else {
        // Regular individual part
        return [placedPart]
      }
    }),
  }))

  // Step 5: Create final BlockLayout result with expanded parts
  const finalLayout: BlockLayout = {
    ...basicLayout,
    sheets: finalSheets,
    blocks: blocks,
    unplacedBlocks: blocks.filter((block) =>
      block.parts.some((part) =>
        basicLayout.unplacedParts.some((unplaced) => unplaced.id === part.id),
      ),
    ),
  }

  log(`\n🎯 === BLOCK CUTTING SUMMARY ===`)
  log(`📄 Total sheets used: ${finalLayout.sheets.length}`)
  log(`📦 Total blocks created: ${blocks.length}`)
  log(
    `📦 Blocks that fit on single board: ${
      blocks.filter((b) => b.canFitOnSingleBoard).length
    }`,
  )
  log(
    `📦 Blocks requiring splitting: ${
      blocks.filter((b) => !b.canFitOnSingleBoard).length
    }`,
  )
  log(`❌ Unplaced blocks: ${finalLayout.unplacedBlocks.length}`)
  log(
    `⚡ Overall efficiency: ${(finalLayout.overallEfficiency * 100).toFixed(
      1,
    )}%`,
  )

  return finalLayout
}

/**
 * Custom placement function for block composite parts
 * Places individual parts of a block in a horizontal row
 */
export const placeBlockParts = (
  sheet: Sheet,
  block: PartBlock,
  placement: { x: number; y: number; rotation: 0 | 90 },
): Sheet => {
  let newSheet = { ...sheet }
  let currentX = placement.x

  // Place each part in the block horizontally next to each other
  for (const part of block.parts) {
    const placedPart: PlacedPart = {
      part: part,
      x: currentX,
      y: placement.y,
      rotation: placement.rotation,
    }

    newSheet = {
      ...newSheet,
      placedParts: [...newSheet.placedParts, placedPart],
    }

    // Move to next position (part width + gap)
    currentX += part.width + 1 // Using 1mm gap
  }

  return newSheet
}

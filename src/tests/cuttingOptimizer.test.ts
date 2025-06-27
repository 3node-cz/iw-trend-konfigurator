/**
 * Simple tests demonstrating how the pure functions can be easily tested
 * This shows the portability and testability benefits of the extracted logic
 */

import {
  optimizeCuttingBLF,
  expandPartsByQuantity,
  sortPartsByArea,
  hasOverlap,
  calculateSheetEfficiency,
  createEmptySheet,
  silentLogger,
  defaultCuttingConfig,
} from '../utils/cuttingOptimizer'
import type { Part, PlacedPart } from '../types/simple'

// Test helper for silent testing
const testConfig = {
  ...defaultCuttingConfig,
  enableLogging: false,
}

// Test 1: Part expansion
export const testPartExpansion = () => {
  const parts: Part[] = [
    { id: '1', width: 100, height: 200, quantity: 3, label: 'Test' },
  ]

  const expanded = expandPartsByQuantity(parts)

  console.assert(expanded.length === 3, 'Should expand to 3 parts')
  console.assert(expanded[0].id === '1-0', 'Should have correct ID')
  console.assert(expanded[2].id === '1-2', 'Should have correct ID')

  return {
    test: 'Part Expansion',
    passed: expanded.length === 3,
    result: expanded,
  }
}

// Test 2: Sorting by area
export const testSortingByArea = () => {
  const parts: Part[] = [
    { id: '1', width: 100, height: 200, quantity: 1 }, // 20,000
    { id: '2', width: 300, height: 400, quantity: 1 }, // 120,000
    { id: '3', width: 150, height: 100, quantity: 1 }, // 15,000
  ]

  const sorted = sortPartsByArea(parts)

  const expectedOrder = ['2', '1', '3'] // Largest to smallest
  const actualOrder = sorted.map((p) => p.id)

  const passed = JSON.stringify(actualOrder) === JSON.stringify(expectedOrder)

  return {
    test: 'Sorting by Area',
    passed,
    expected: expectedOrder,
    actual: actualOrder,
  }
}

// Test 3: Overlap detection
export const testOverlapDetection = () => {
  const placedParts: PlacedPart[] = [
    {
      part: { id: '1', width: 100, height: 200, quantity: 1 },
      x: 0,
      y: 0,
      rotation: 0,
    },
  ]

  // Test cases
  const tests = [
    { x: 0, y: 0, width: 50, height: 50, expected: true, desc: 'Overlapping' },
    {
      x: 102,
      y: 0,
      width: 50,
      height: 50,
      expected: false,
      desc: 'Adjacent with gap',
    },
    {
      x: 101,
      y: 0,
      width: 50,
      height: 50,
      expected: true,
      desc: 'Too close (gap violation)',
    },
    {
      x: 200,
      y: 200,
      width: 50,
      height: 50,
      expected: false,
      desc: 'Far away',
    },
  ]

  const results = tests.map((test) => {
    const actual = hasOverlap(
      test.x,
      test.y,
      test.width,
      test.height,
      placedParts,
      1,
    )
    return {
      ...test,
      actual,
      passed: actual === test.expected,
    }
  })

  return {
    test: 'Overlap Detection',
    passed: results.every((r) => r.passed),
    results,
  }
}

// Test 4: Sheet efficiency calculation
export const testSheetEfficiency = () => {
  const sheet = createEmptySheet(1, 1000, 1000)

  // Add some parts (total area: 50,000 out of 1,000,000 = 5%)
  sheet.placedParts = [
    {
      part: { id: '1', width: 100, height: 200, quantity: 1 },
      x: 0,
      y: 0,
      rotation: 0,
    },
    {
      part: { id: '2', width: 150, height: 200, quantity: 1 },
      x: 101,
      y: 0,
      rotation: 0,
    },
  ]

  const efficiency = calculateSheetEfficiency(sheet)
  const expectedEfficiency = 0.05 // 5%
  const passed = Math.abs(efficiency - expectedEfficiency) < 0.001

  return {
    test: 'Sheet Efficiency',
    passed,
    expected: expectedEfficiency,
    actual: efficiency,
  }
}

// Test 5: Integration test - simple 2-part scenario
export const testSimpleTwoParts = () => {
  const parts: Part[] = [
    { id: '1', width: 500, height: 500, quantity: 1 },
    { id: '2', width: 200, height: 300, quantity: 1 },
  ]

  const result = optimizeCuttingBLF(parts, testConfig, silentLogger)

  // These parts should definitely fit on one 2800x2070 sheet
  const passed = result.totalSheets === 1 && result.unplacedParts.length === 0

  return {
    test: 'Simple Two Parts',
    passed,
    totalSheets: result.totalSheets,
    efficiency: result.overallEfficiency,
    unplacedParts: result.unplacedParts.length,
  }
}

// Test 6: Stress test - many small parts
export const testManySmallParts = () => {
  const parts: Part[] = []

  // Create 50 small parts (100x100 each)
  for (let i = 0; i < 50; i++) {
    parts.push({
      id: `part-${i}`,
      width: 100,
      height: 100,
      quantity: 1,
    })
  }

  const result = optimizeCuttingBLF(parts, testConfig, silentLogger)

  // All parts should fit (50 * 10,000 = 500,000 area vs 5,796,000 sheet area)
  const allPlaced = result.unplacedParts.length === 0
  const reasonableSheets = result.totalSheets <= 2 // Should fit on 1-2 sheets

  return {
    test: 'Many Small Parts',
    passed: allPlaced && reasonableSheets,
    totalSheets: result.totalSheets,
    totalParts: parts.length,
    placedParts: result.sheets.reduce(
      (sum, sheet) => sum + sheet.placedParts.length,
      0,
    ),
    efficiency: result.overallEfficiency,
  }
}

// Run all tests
export const runAllTests = () => {
  console.log('🧪 Running Cutting Optimizer Tests...\n')

  const tests = [
    testPartExpansion(),
    testSortingByArea(),
    testOverlapDetection(),
    testSheetEfficiency(),
    testSimpleTwoParts(),
    testManySmallParts(),
  ]

  const passed = tests.filter((t) => t.passed).length
  const total = tests.length

  console.log('📊 Test Results:')
  tests.forEach((test) => {
    const icon = test.passed ? '✅' : '❌'
    console.log(`${icon} ${test.test}`)
  })

  console.log(`\n🎯 Summary: ${passed}/${total} tests passed`)

  return {
    passed,
    total,
    success: passed === total,
    tests,
  }
}

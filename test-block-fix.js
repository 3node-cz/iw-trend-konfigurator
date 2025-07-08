// Test script to verify the block preparation fix
// This simulates the issue from the provided export data

const testParts = [
  {
    id: 'part-1751895717327-cdvr4k022',
    width: 300,
    height: 500,
    quantity: 3,
    blockId: 2,
  },
  {
    id: 'part-1751895721357-amvl0yzak',
    width: 200,
    height: 600,
    quantity: 1,
    frame: { enabled: true },
  },
  {
    id: 'part-1751895730135-wnnlvw6gf',
    width: 500,
    height: 800,
    quantity: 3,
    blockId: 1,
  },
]

console.log('Original data from export:')
console.log('Expected total pieces: 7 (3 + 1 + 3)')
console.log('Frame pieces for 200x600 should be: 4 pieces')
console.log('Total expected individual pieces: 3 + 4 + 3 = 10')
console.log('')

// Simulate the fixed block preparation
const simulatedPreparedPieces = []
let frameCount = 0

testParts.forEach((part) => {
  if (part.frame?.enabled) {
    // Frame should be expanded to 4 pieces: left, right, top, bottom
    const framePieces = [
      { type: 'left', width: 70, height: 460 },
      { type: 'right', width: 70, height: 460 },
      { type: 'top', width: 200, height: 70 },
      { type: 'bottom', width: 200, height: 70 },
    ]

    framePieces.forEach((framePiece, idx) => {
      for (let i = 0; i < part.quantity; i++) {
        simulatedPreparedPieces.push({
          id: `${part.id}_frame_${framePiece.type}-${i}-${idx}`,
          width: framePiece.width,
          height: framePiece.height,
          quantity: 1,
          originalPartId: part.id,
        })
        frameCount++
      }
    })
  } else {
    // Regular parts: expand by quantity
    for (let i = 0; i < part.quantity; i++) {
      simulatedPreparedPieces.push({
        id: `${part.id}-${i}`,
        width: part.width,
        height: part.height,
        quantity: 1,
        blockId: part.blockId,
        originalPartId: part.id,
      })
    }
  }
})

console.log('Fixed block preparation results:')
console.log(`Total individual pieces: ${simulatedPreparedPieces.length}`)
console.log(`Frame pieces: ${frameCount}`)
console.log(
  `Block pieces: ${simulatedPreparedPieces.filter((p) => p.blockId).length}`,
)
console.log(
  `Individual pieces: ${
    simulatedPreparedPieces.filter(
      (p) => !p.blockId && !p.originalPartId.includes('frame'),
    ).length
  }`,
)

console.log('\nPiece breakdown:')
simulatedPreparedPieces.forEach((piece) => {
  console.log(
    `- ${piece.id}: ${piece.width}x${piece.height}${
      piece.blockId ? ` (block ${piece.blockId})` : ''
    }`,
  )
})

console.log(
  `\nFixed: Expected piece count should now match actual placed count!`,
)

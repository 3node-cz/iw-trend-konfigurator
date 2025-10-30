import React from 'react'
import { Container, Typography, Box } from '@mui/material'
import CuttingLayoutDiagram from './common/CuttingLayoutDiagram'
import { OptimizedGuillotineCuttingOptimizer } from '../utils/guillotineCutting'
import type { CuttingPiece } from '../types/shopify'

const CuttingLayoutDemo: React.FC = () => {
  // Mock cutting pieces data
  const mockPieces: CuttingPiece[] = [
    {
      id: '1',
      partName: 'Korpus',
      length: 2000, // mm
      width: 600,   // mm
      quantity: 2,
      allowRotation: false,
      withoutEdge: false,
      duplicate: false,
      edgeAllAround: null,
      edgeTop: null,
      edgeBottom: null,
      edgeLeft: null,
      edgeRight: null,
      notes: ''
    },
    {
      id: '2', 
      partName: 'Dvierka',
      length: 650,
      width: 400,
      quantity: 1,
      allowRotation: false,
      withoutEdge: false,
      duplicate: false,
      edgeAllAround: null,
      edgeTop: null,
      edgeBottom: null,
      edgeLeft: null,
      edgeRight: null,
      notes: ''
    },
    {
      id: '3',
      partName: 'Vrch_spodok',
      length: 550,
      width: 350,
      quantity: 5,
      allowRotation: false,
      withoutEdge: false,
      duplicate: false,
      edgeAllAround: null,
      edgeTop: null,
      edgeBottom: null,
      edgeLeft: null,
      edgeRight: null,
      notes: ''
    }
  ]

  // Standard board size (2800 x 2070 mm)
  const boardWidth = 2800
  const boardHeight = 2070

  // Generate the cutting layout
  const optimizer = new OptimizedGuillotineCuttingOptimizer(boardWidth, boardHeight)
  const layout = optimizer.optimize(mockPieces)

  return (
    <Container maxWidth={false} sx={{ maxWidth: '1920px', mx: 'auto', py: 3 }}>
      <Typography variant="h2" component="h1" sx={{ color: 'primary.main', fontWeight: 500, mb: 3 }}>
        Cutting Layout Demo
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        This demonstrates the guillotine cutting algorithm with SVG visualization. 
        The algorithm ensures that all cuts go straight across the board, mimicking real sawing operations.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Mock Data:</Typography>
        <ul>
          <li><strong>Board:</strong> {boardWidth} × {boardHeight} mm (standard DTD board)</li>
          <li><strong>Pieces:</strong> 
            <ul>
              <li>Korpus: 2000×600 mm (2 pieces)</li>
              <li>Dvierka: 650×400 mm (1 piece)</li>
              <li>Vrch_spodok: 550×350 mm (5 pieces)</li>
            </ul>
          </li>
        </ul>
      </Box>

      <CuttingLayoutDiagram 
        layout={layout}
        title={`Plán č. 1 - Počet materiálov: 1`}
      />

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Features:</Typography>
        <ul>
          <li>🔪 <strong>Guillotine cuts:</strong> All cuts go straight across the board</li>
          <li>📐 <strong>Automatic optimization:</strong> Pieces sorted by size for efficient cutting</li>
          <li>🔄 <strong>Rotation support:</strong> Pieces can be rotated if it improves efficiency</li>
          <li>📊 <strong>Waste calculation:</strong> Shows unused areas with hatching pattern</li>
          <li>🎨 <strong>Visual feedback:</strong> Different colors for pieces, cut lines shown as red dashed lines</li>
          <li>📏 <strong>Dimensions:</strong> Shows piece dimensions and rotation indicators</li>
        </ul>
      </Box>
    </Container>
  )
}

export default CuttingLayoutDemo
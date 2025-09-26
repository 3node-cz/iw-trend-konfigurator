import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material'
import {
  Calculate as CalculateIcon,
  Insights as InsightsIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material'
import Grid from '@mui/system/Grid'
import type { CuttingPiece, MaterialSearchResult } from '../types/shopify'
import { formatPriceNumber } from '../utils/formatting'

interface CuttingOptimizationPanelProps {
  material: MaterialSearchResult
  pieces: CuttingPiece[]
  onOptimizationComplete?: (results: any) => void
}

interface OptimizationResults {
  efficiency: number
  wastePercentage: number
  totalSheets: number
  totalCost: number
  recommendations: string[]
}

const CuttingOptimizationPanel: React.FC<CuttingOptimizationPanelProps> = ({
  material,
  pieces,
  onOptimizationComplete
}) => {
  const [isCalculating, setIsCalculating] = useState(false)
  const [results, setResults] = useState<OptimizationResults | null>(null)

  // Calculate basic statistics
  const totalPieces = pieces.reduce((sum, piece) => sum + piece.quantity, 0)
  const totalArea = pieces.reduce((sum, piece) => {
    return sum + (piece.length * piece.width * piece.quantity) / 1000000 // Convert mm² to m²
  }, 0)

  const handleOptimize = async () => {
    setIsCalculating(true)
    
    // Simulate optimization calculation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Mock optimization results
    const mockResults: OptimizationResults = {
      efficiency: 92.5,
      wastePercentage: 7.5,
      totalSheets: Math.ceil(totalArea / (material.dimensions ? (material.dimensions.width * material.dimensions.height / 1000000) : 5.6)),
      totalCost: parseFloat(material.variant?.price || "0") * Math.ceil(totalArea),
      recommendations: [
        'Optimalizovať rozloženie pre minimalizáciu odpadu',
        'Zvážiť otočenie niektorých kusov pre lepšie využitie',
        'Možnosť použiť menšie formáty materiálu'
      ]
    }
    
    setResults(mockResults)
    setIsCalculating(false)
    onOptimizationComplete?.(mockResults)
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <CalculateIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Optimalizácia rezania
        </Typography>
      </Box>

      {/* Current Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
              {totalPieces}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Celkový počet kusov
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
              {totalArea.toFixed(2)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Celková plocha (m²)
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
              {formatPriceNumber(parseFloat(material.variant?.price || "0") * totalArea)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Odhadovaná cena (EUR)
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Optimization Button */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={isCalculating ? <CircularProgress size={20} /> : <InsightsIcon />}
          onClick={handleOptimize}
          disabled={isCalculating || pieces.length === 0}
          sx={{ minWidth: 200 }}
        >
          {isCalculating ? 'Počítam optimalizáciu...' : 'Optimalizovať rozrez'}
        </Button>
      </Box>

      {/* Results */}
      {results && (
        <>
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <CheckCircleIcon color="success" />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
              Výsledky optimalizácie
            </Typography>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="h5" color="success.main" sx={{ fontWeight: 600 }}>
                  {results.efficiency}%
                </Typography>
                <Typography variant="caption">
                  Efektivita využitia
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="h5" color="warning.main" sx={{ fontWeight: 600 }}>
                  {results.wastePercentage}%
                </Typography>
                <Typography variant="caption">
                  Odpad
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>
                  {results.totalSheets}
                </Typography>
                <Typography variant="caption">
                  Potrebné tabule
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>
                  {formatPriceNumber(results.totalCost)}€
                </Typography>
                <Typography variant="caption">
                  Celková cena
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Recommendations */}
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Odporúčania na optimalizáciu:
            </Typography>
            {results.recommendations.map((recommendation, index) => (
              <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                • {recommendation}
              </Typography>
            ))}
          </Alert>
        </>
      )}

      {/* No pieces warning */}
      {pieces.length === 0 && (
        <Alert severity="warning">
          Pridajte kusy na rezanie pre spustenie optimalizácie
        </Alert>
      )}
    </Paper>
  )
}

export default CuttingOptimizationPanel
import React from 'react'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import {
  ExpandMore as ExpandMoreIcon,
  ContentCut as CutIcon,
  Straighten as EdgeIcon
} from '@mui/icons-material'
import type { OrderCalculations } from '../../hooks/useOrderCalculations'
import { formatPriceNumber } from '../../utils/formatting'

interface OrderCalculationsSummaryProps {
  calculations: OrderCalculations
}

const OrderCalculationsSummary: React.FC<OrderCalculationsSummaryProps> = ({ 
  calculations 
}) => {
  const { edgeConsumption, cuttingCosts, totals } = calculations

  if (totals.totalPieces === 0) {
    return null
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CutIcon color="primary" />
        Kalkulácia materiálov a rezania
      </Typography>

      {/* Edge Material Consumption */}
      {edgeConsumption.length > 0 && (
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon />}
            sx={{ backgroundColor: '#f8f9fa' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <EdgeIcon color="primary" />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Spotreba hranového materiálu
              </Typography>
              <Chip 
                label={`${formatPriceNumber(totals.totalEdgeLength)} m celkom`}
                color="primary"
                size="small"
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Materiál</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Hranový materiál</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Hrúbka</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Dĺžka (m)</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Počet kusov</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {edgeConsumption.map((consumption, index) =>
                    consumption.consumptionByThickness.map((thickness, thicknessIndex) => (
                      <TableRow key={`${index}-${thicknessIndex}`} hover>
                        <TableCell>
                          {thicknessIndex === 0 ? consumption.materialName : ''}
                        </TableCell>
                        <TableCell>
                          {thicknessIndex === 0 ? consumption.edgeMaterialName : ''}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${thickness.thickness} mm`}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {formatPriceNumber(thickness.totalLengthMeters)} m
                        </TableCell>
                        <TableCell>
                          {thickness.pieceCount}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, p: 1.5, backgroundColor: '#f8f9fa', borderRadius: 1, border: '1px solid #e0e0e0' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 500 }}>
                ℹ️ Informácia o výpočte
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Uvedená dĺžka zahŕňa buffer 30 mm na každú stranu (60 mm celkom na každú hranu) pre bezpečné ohranenie.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Summary Totals */}
      <Box sx={{ 
        display: 'flex', 
        gap: 4, 
        flexWrap: 'wrap', 
        p: 2, 
        backgroundColor: '#f0f7ff', 
        borderRadius: 1 
      }}>
        <Box>
          <Typography variant="caption" color="text.secondary">Celkom kusov</Typography>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {totals.totalPieces}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Materiálov</Typography>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {totals.totalMaterials}
          </Typography>
        </Box>
        {totals.totalEdgeLength > 0 && (
          <Box>
            <Typography variant="caption" color="text.secondary">Hranový materiál</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {formatPriceNumber(totals.totalEdgeLength)} m
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  )
}

export default OrderCalculationsSummary
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
          </AccordionDetails>
        </Accordion>
      )}

      {/* Cutting Costs */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          sx={{ backgroundColor: '#f8f9fa' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <CutIcon color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Náklady na rezanie
            </Typography>
            <Chip 
              label={`${formatPriceNumber(totals.totalCuttingCost)} €`}
              color="secondary"
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
                  <TableCell sx={{ fontWeight: 600 }}>Počet kusov</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Základné rezanie</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Komplexnosť</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Hrabanie</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Celkom</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cuttingCosts.map((cost, index) => (
                  <TableRow key={index} hover>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {cost.materialName}
                    </TableCell>
                    <TableCell>{cost.piecesCount}</TableCell>
                    <TableCell>
                      {formatPriceNumber(cost.baseCuttingCost)} €
                    </TableCell>
                    <TableCell>
                      {formatPriceNumber(cost.complexityCost)} €
                    </TableCell>
                    <TableCell>
                      {formatPriceNumber(cost.edgingCost)} € ({formatPriceNumber(cost.edgingLength)} m)
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {formatPriceNumber(cost.totalCost)} €
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Cost breakdown explanation */}
          <Box sx={{ mt: 2, p: 2, backgroundColor: '#f0f7ff', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              <strong>Vysvetlenie nákladov:</strong><br />
              • Základné rezanie: 0,50 € za kus<br />
              • Komplexnosť: +0,25 € za kus s hranami<br />
              • Hrabanie: 1,20 € za meter hranového materiálu<br />
              <br />
              <strong>Osamovanie tabule:</strong><br />
              • Štandardne sa orezáva 15mm z každej strany tabule pred rezaním<br />
              • Kusy s označením "Bez orezu" preskakujú tento krok
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

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
        <Box>
          <Typography variant="caption" color="text.secondary">Náklady na rezanie</Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'secondary.main' }}>
            {formatPriceNumber(totals.totalCuttingCost)} €
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}

export default OrderCalculationsSummary
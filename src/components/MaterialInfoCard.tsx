import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Divider
} from '@mui/material'
import type { MaterialSearchResult } from '../types/shopify'

interface MaterialInfoCardProps {
  material: MaterialSearchResult
}

const MaterialInfoCard: React.FC<MaterialInfoCardProps> = ({ material }) => {
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'success'
      case 'unavailable':
        return 'error'
      case 'limited':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'Skladom'
      case 'unavailable':
        return 'Na objednávku'
      case 'limited':
        return 'Obmedzene'
      default:
        return availability
    }
  }

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Materiál
        </Typography>
        
        <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
          {material.name}
        </Typography>
        
        <Typography variant="body2" color="primary" sx={{ fontWeight: 500, mb: 2 }}>
          {material.productCode}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Local Warehouse Availability */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Dostupnosť lokálneho skladu
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={getAvailabilityText(material.availability)}
                size="small"
                color={getAvailabilityColor(material.availability)}
                variant="outlined"
              />
              <Typography variant="caption" color="text.secondary">
                {material.warehouse}
              </Typography>
            </Box>
          </Box>

          {/* Central Warehouse Availability */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Dostupnosť centrálneho skladu
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={getAvailabilityText(material.availability)}
                size="small"
                color={getAvailabilityColor(material.availability)}
                variant="outlined"
              />
              <Typography variant="caption" color="text.secondary">
                Nitra
              </Typography>
            </Box>
          </Box>

          {/* Dimensions */}
          {material.dimensions && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Rozmery
              </Typography>
              <Typography variant="body2">
                {material.dimensions.width} × {material.dimensions.height} × {material.dimensions.thickness} mm
              </Typography>
            </Box>
          )}

          {/* Price */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Základná cena za MJ
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {material.price.amount.toFixed(4)} EUR {material.price.perUnit}
            </Typography>
            {material.discountInfo && (
              <Typography variant="caption" color="text.secondary">
                {material.discountInfo}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default MaterialInfoCard
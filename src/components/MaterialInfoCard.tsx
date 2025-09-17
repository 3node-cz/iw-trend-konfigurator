import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Avatar,
} from '@mui/material'
import type { MaterialSearchResult } from '../types/shopify'
import { AvailabilityChip } from './common'

interface MaterialInfoCardProps {
  material: MaterialSearchResult
}

const MaterialInfoCard: React.FC<MaterialInfoCardProps> = ({ material }) => {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 600 }}
        >
          Materiál
        </Typography>

        {/* Product Preview Section */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Avatar
            src={material.image}
            alt={material.name}
            sx={{
              width: 100,
              height: 100,
              borderRadius: 1,
              bgcolor: '#f5f5f5',
              border: '1px solid #e0e0e0',
            }}
            variant="rounded"
          >
            {!material.image && '📦'}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: 500, mb: 1, color: 'primary.main' }}
            >
              {material.name}
            </Typography>

            <Typography
              variant="body2"
              color="primary"
              sx={{ fontWeight: 500, mb: 1 }}
            >
              {material.productCode} - Egger
            </Typography>

            {/* Dimensions in compact format */}
            {material.dimensions && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                {material.dimensions.height}×{material.dimensions.width}×
                {material.dimensions.thickness} mm
              </Typography>
            )}

            {/* Price highlight */}
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: '#2e7d32' }}
            >
              {Number(material.price.amount).toFixed(4)} EUR{' '}
              {material.price.perUnit}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Dimensions */}
          {material.dimensions && (
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 0.5 }}
              >
                Rozmery
              </Typography>
              <Typography variant="body2">
                {material.dimensions.width} × {material.dimensions.height} ×{' '}
                {material.dimensions.thickness} mm
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default MaterialInfoCard

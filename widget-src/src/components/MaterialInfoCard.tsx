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
import { calculateAvailability } from '../utils/availability'
import { formatPrice } from '../utils/formatting'

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
            alt={material.title}
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
              {material.title || '[No Title]'}
            </Typography>

            <Typography
              variant="body2"
              color="primary"
              sx={{ fontWeight: 500, mb: 1 }}
            >
              {material.variant?.sku || material.handle || '[No SKU/Handle]'}
            </Typography>

            {/* Price highlight */}
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: 'text.primary' }}
            >
              {material.variant?.price ? formatPrice(material.variant.price) : '[No Price]'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Inventory - Show availability status only */}
          {material.variant?.inventoryQuantity !== undefined && (
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 0.5 }}
              >
                Dostupnosť
              </Typography>
              <AvailabilityChip
                availability={calculateAvailability(material)}
                size="small"
              />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default MaterialInfoCard

import React from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Avatar
} from '@mui/material'
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material'
import type { MaterialSearchResult } from '../../types/shopify'
import { AvailabilityChip } from './'

interface ProductCardProps {
  material: MaterialSearchResult
  isSelected?: boolean
  selectedMaterialIds?: string[]
  onAddMaterial?: (material: MaterialSearchResult) => void
  onRemoveMaterial?: (materialId: string) => void
}

const ProductCard: React.FC<ProductCardProps> = ({
  material,
  isSelected = false,
  selectedMaterialIds = [],
  onAddMaterial,
  onRemoveMaterial
}) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: 2, pb: 1, flex: 1 }}>
        {/* Product Image and Basic Info */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Avatar
            src={material.image}
            alt={material.name}
            sx={{
              width: 80,
              height: 80,
              borderRadius: 1,
              bgcolor: '#f5f5f5'
            }}
            variant="rounded"
          >
            {!material.image && '📦'}
          </Avatar>
          
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                color: '#1976d2',
                fontSize: '0.875rem',
                lineHeight: 1.2,
                mb: 0.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {material.name}
            </Typography>
            
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {material.productCode} - Egger
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <AvailabilityChip
                availability={material.availability}
                size="small"
              />
              <Typography variant="caption" color="text.secondary">
                {material.warehouse}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Dimensions */}
        {material.dimensions && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Rozmery (D×Š×Hr)
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {material.dimensions.height} × {material.dimensions.width} × {material.dimensions.thickness} mm
            </Typography>
          </Box>
        )}

        {/* Price */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Typography variant="caption" color="text.secondary">
            {material.price.perUnit}
          </Typography>
          <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 600 }}>
            €{material.price.amount.toFixed(2)}
          </Typography>
        </Box>

        {material.totalPrice && material.totalPrice.amount !== material.price.amount && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Pôvodná cena
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
            >
              €{material.totalPrice.amount.toFixed(2)}
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        {isSelected ? (
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<RemoveIcon />}
            onClick={() => onRemoveMaterial?.(material.id)}
            size="small"
          >
            Odstrániť
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => onAddMaterial?.(material)}
            disabled={selectedMaterialIds.includes(material.id)}
            size="small"
          >
            {selectedMaterialIds.includes(material.id) ? 'Pridané' : 'Pridať'}
          </Button>
        )}
      </CardActions>
    </Card>
  )
}

export default ProductCard
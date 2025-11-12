import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Avatar,
  Button,
} from '@mui/material'
import type { MaterialSearchResult } from '../types/shopify'
import { AvailabilityChip } from './common'
import { calculateAvailability } from '../utils/availability'
import { formatPrice } from '../utils/formatting'
import MaterialSearch from './MaterialSearch'
import MaterialResultsTable from './MaterialResultsTable'

interface MaterialInfoCardProps {
  material: MaterialSearchResult
  // Material search props
  onMaterialSearch?: (query: string, params?: { warehouse?: string; collection?: string }) => void
  isSearching?: boolean
  searchQuery?: string
  searchResults?: MaterialSearchResult[]
  onSelectMaterial?: (material: MaterialSearchResult) => void
  selectedMaterialIds?: string[]
  customerDiscount?: number
}

const MaterialInfoCard: React.FC<MaterialInfoCardProps> = ({
  material,
  onMaterialSearch,
  isSearching = false,
  searchQuery = '',
  searchResults = [],
  onSelectMaterial,
  selectedMaterialIds = [],
  customerDiscount = 0,
}) => {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 600 }}
        >
          Materiál
        </Typography>

        {/* Material Search */}
        {onMaterialSearch && (
          <Box sx={{ mb: 3 }}>
            <MaterialSearch
              onSearch={onMaterialSearch}
              isLoading={isSearching}
              placeholder="Vyhľadať a zmeniť materiál..."
              searchValue={searchQuery}
            />

            {searchResults.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <MaterialResultsTable
                  results={searchResults}
                  onAddMaterial={onSelectMaterial || (() => {})}
                  selectedMaterialIds={selectedMaterialIds}
                  customerDiscount={customerDiscount}
                />
              </Box>
            )}

            {searchQuery.length >= 2 &&
              searchResults.length === 0 &&
              !isSearching && (
                <Typography
                  variant="body2"
                  sx={{ mt: 2, color: "text.secondary", textAlign: "center" }}
                >
                  Nenašli sa žiadne materiály pre "{searchQuery}"
                </Typography>
              )}

            <Divider sx={{ my: 2 }} />
          </Box>
        )}

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
              sx={{ fontWeight: 500 }}
            >
              {material.variant?.sku || material.handle || '[No SKU/Handle]'}
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

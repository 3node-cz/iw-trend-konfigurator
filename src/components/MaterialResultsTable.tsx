import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Box,
  IconButton,
  Avatar
} from '@mui/material'
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material'
import type { MaterialSearchResult } from '../types/shopify'
import MaterialAllResultsModal from './MaterialAllResultsModal'
import { AvailabilityChip } from './common'

interface MaterialResultsTableProps {
  results: MaterialSearchResult[]
  onAddMaterial?: (material: MaterialSearchResult) => void
  onRemoveMaterial?: (materialId: string) => void
  showViewAllButton?: boolean
  isSelectedMaterials?: boolean
  selectedMaterialIds?: string[]
}

const MaterialResultsTable: React.FC<MaterialResultsTableProps> = ({
  results,
  onAddMaterial,
  onRemoveMaterial,
  showViewAllButton = false,
  isSelectedMaterials = false,
  selectedMaterialIds = []
}) => {
  const [showAllModal, setShowAllModal] = useState(false)

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {results.length} materiálov
        </Typography>
      </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600 }}>Názov</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rozmery</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>
                  Dostupnosť lokálneho skladu
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>
                  Dostupnosť centrálneho skladu
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>
                  Základná cena za MJ / Zľava za MJ
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>
                  Cena za ks/balenie
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>
                  Pošnúrované
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>
                  {isSelectedMaterials ? 'Akcie' : 'Zvoliť'}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((material) => (
                <TableRow key={material.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        src={material.image}
                        alt={material.name}
                        sx={{ width: 40, height: 40, borderRadius: 1 }}
                        variant="rounded"
                      >
                        📦
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {material.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {material.dimensions 
                        ? `${material.dimensions.width}×${material.dimensions.height}×${material.dimensions.thickness} mm`
                        : '-'
                      }
                    </Typography>
                  </TableCell>
                  
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                      <AvailabilityChip
                        availability={material.availability}
                        size="small"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {material.warehouse}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                      <AvailabilityChip
                        availability={material.availability}
                        size="small"
                      />
                      <Typography variant="caption" color="text.secondary">
                        Nitra
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {material.price.amount.toFixed(4)} EUR
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {material.price.perUnit}
                      </Typography>
                      {material.discountInfo && (
                        <Typography variant="caption" color="text.secondary">
                          {material.discountInfo}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {material.totalPrice?.amount.toFixed(4)} EUR
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        / ks
                      </Typography>
                      {material.quantity && (
                        <Typography variant="caption" color="text.secondary">
                          {material.quantity} ks / 1
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      s DPH
                    </Typography>
                  </TableCell>
                  
                  <TableCell sx={{ textAlign: 'center' }}>
                    {isSelectedMaterials ? (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onRemoveMaterial?.(material.id)}
                      >
                        <RemoveIcon />
                      </IconButton>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => onAddMaterial?.(material)}
                        disabled={selectedMaterialIds.includes(material.id)}
                        sx={{
                          backgroundColor: selectedMaterialIds.includes(material.id) ? '#ccc' : '#4caf50',
                          '&:hover': {
                            backgroundColor: selectedMaterialIds.includes(material.id) ? '#ccc' : '#45a049'
                          },
                          fontSize: '12px'
                        }}
                      >
                        {selectedMaterialIds.includes(material.id) ? 'Vybraté' : 'Zvoliť'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      {showViewAllButton && (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', borderTop: '1px solid #e0e0e0' }}>
          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => setShowAllModal(true)}
          >
            Zobraziť všetky
          </Button>
        </Box>
      )}

      {/* All Results Modal */}
      <MaterialAllResultsModal
        open={showAllModal}
        onClose={() => setShowAllModal(false)}
        results={results}
        onAddMaterial={onAddMaterial}
        selectedMaterialIds={selectedMaterialIds}
      />
    </>
  )
}

export default MaterialResultsTable
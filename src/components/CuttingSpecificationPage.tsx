import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import Grid from '@mui/system/Grid'
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon
} from '@mui/icons-material'
import MaterialInfoCard from './MaterialInfoCard'
import EdgeSelectionCard from './EdgeSelectionCard'
import CuttingPiecesTable from './CuttingPiecesTable'
import type { MaterialSearchResult, CuttingSpecification, CuttingPiece, EdgeMaterial } from '../types/shopify'

interface CuttingSpecificationPageProps {
  materials: MaterialSearchResult[]
  orderName: string
  existingSpecifications?: CuttingSpecification[]
  onBack?: () => void
  onContinue?: (specifications: CuttingSpecification[]) => void
}

const CuttingSpecificationPage: React.FC<CuttingSpecificationPageProps> = ({
  materials,
  orderName,
  existingSpecifications = [],
  onBack,
  onContinue
}) => {
  // Create state for each material's specification
  const [materialSpecs, setMaterialSpecs] = useState<{[materialId: string]: {
    selectedEdgeMaterial: EdgeMaterial | null
    glueType: string
    cuttingPieces: CuttingPiece[]
    allowRotation: boolean
  }}>(() => {
    const specs: {[materialId: string]: any} = {}
    materials.forEach(material => {
      const existingSpec = existingSpecifications.find(spec => spec.material.id === material.id)
      specs[material.id] = {
        selectedEdgeMaterial: existingSpec?.edgeMaterial || null,
        glueType: existingSpec?.glueType || 'PUR transparentná/bílá',
        cuttingPieces: existingSpec?.pieces || [],
        allowRotation: existingSpec?.allowRotation || false
      }
    })
    return specs
  })

  const handleAddPiece = (materialId: string) => {
    const newPiece: CuttingPiece = {
      id: `piece-${Date.now()}-${Math.random()}`,
      partName: '',
      length: 0,
      width: 0,
      quantity: 1,
      glueEdge: false,
      withoutEdge: false,
      duplicate: false,
      edgeAllAround: null,
      edgeTop: null,
      edgeBottom: null,
      edgeLeft: null,
      edgeRight: null,
      notes: ''
    }
    setMaterialSpecs(prev => ({
      ...prev,
      [materialId]: {
        ...prev[materialId],
        cuttingPieces: [...prev[materialId].cuttingPieces, newPiece]
      }
    }))
  }

  const handlePieceChange = (materialId: string, pieceId: string, updatedPiece: Partial<CuttingPiece>) => {
    setMaterialSpecs(prev => ({
      ...prev,
      [materialId]: {
        ...prev[materialId],
        cuttingPieces: prev[materialId].cuttingPieces.map(piece => {
          if (piece.id !== pieceId) return piece
          
          const updated = { ...piece, ...updatedPiece }
          
          // Handle "Hrana dookola" logic
          if ('edgeAllAround' in updatedPiece) {
            // When edgeAllAround is set, update all individual edges
            if (updatedPiece.edgeAllAround) {
              updated.edgeTop = updatedPiece.edgeAllAround
              updated.edgeBottom = updatedPiece.edgeAllAround
              updated.edgeLeft = updatedPiece.edgeAllAround
              updated.edgeRight = updatedPiece.edgeAllAround
            }
          } else if (['edgeTop', 'edgeBottom', 'edgeLeft', 'edgeRight'].some(key => key in updatedPiece)) {
            // When individual edge is changed, check if all edges are the same
            const { edgeTop, edgeBottom, edgeLeft, edgeRight } = updated
            if (edgeTop && edgeTop === edgeBottom && edgeTop === edgeLeft && edgeTop === edgeRight) {
              // All edges are the same, set edgeAllAround
              updated.edgeAllAround = edgeTop
            } else {
              // Edges are different, clear edgeAllAround
              updated.edgeAllAround = null
            }
          }
          
          return updated
        })
      }
    }))
  }

  const handleRemovePiece = (materialId: string, pieceId: string) => {
    setMaterialSpecs(prev => ({
      ...prev,
      [materialId]: {
        ...prev[materialId],
        cuttingPieces: prev[materialId].cuttingPieces.filter(piece => piece.id !== pieceId)
      }
    }))
  }

  const handleEdgeMaterialChange = (materialId: string, edgeMaterial: EdgeMaterial | null) => {
    setMaterialSpecs(prev => ({
      ...prev,
      [materialId]: {
        ...prev[materialId],
        selectedEdgeMaterial: edgeMaterial
      }
    }))
  }

  const handleGlueTypeChange = (materialId: string, glueType: string) => {
    setMaterialSpecs(prev => ({
      ...prev,
      [materialId]: {
        ...prev[materialId],
        glueType
      }
    }))
  }

  const handleRotationToggle = (materialId: string, allowRotation: boolean) => {
    setMaterialSpecs(prev => ({
      ...prev,
      [materialId]: {
        ...prev[materialId],
        allowRotation
      }
    }))
  }

  const handleContinue = () => {
    const specifications: CuttingSpecification[] = materials.map(material => ({
      material,
      edgeMaterial: materialSpecs[material.id].selectedEdgeMaterial,
      glueType: materialSpecs[material.id].glueType,
      pieces: materialSpecs[material.id].cuttingPieces,
      allowRotation: materialSpecs[material.id].allowRotation
    }))
    onContinue?.(specifications)
  }

  const getTotalPieces = () => {
    return Object.values(materialSpecs).reduce((total, spec) => total + spec.cuttingPieces.length, 0)
  }

  return (
    <Container maxWidth={false} sx={{ maxWidth: '1920px', mx: 'auto', py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
        >
          Späť
        </Button>
        <Typography variant="h4" component="h1" sx={{ color: '#1976d2', fontWeight: 500 }}>
          {orderName} - Špecifikácia rezania
        </Typography>
      </Box>

      {/* Multiple Materials - Scrollable Cards */}
      {materials.map((material, index) => {
        const materialSpec = materialSpecs[material.id]
        
        return (
          <Box key={material.id} sx={{ mb: 4 }}>
            {/* Material Header */}
            <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 500, mb: 2 }}>
              Materiál {index + 1} z {materials.length}
            </Typography>

            {/* Material and Edge Selection */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {/* Material Info Card */}
              <Grid size={{ xs: 12, md: 6 }}>
                <MaterialInfoCard material={material} />
              </Grid>
              
              {/* Edge Selection Card */}
              <Grid size={{ xs: 12, md: 6 }}>
                <EdgeSelectionCard
                  selectedEdge={materialSpec.selectedEdgeMaterial}
                  glueType={materialSpec.glueType}
                  onEdgeChange={(edge) => handleEdgeMaterialChange(material.id, edge)}
                  onGlueTypeChange={(glue) => handleGlueTypeChange(material.id, glue)}
                />
              </Grid>
            </Grid>

            {/* Cutting Options */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Možnosti rezania
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={materialSpec.allowRotation}
                    onChange={(e) => handleRotationToggle(material.id, e.target.checked)}
                  />
                }
                label="Povoliť rotáciu kusov pre lepšie využitie materiálu"
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Ak je zapnuté, algoritmus môže otočiť kusy o 90° pre efektívnejšie rozrezanie
              </Typography>
            </Paper>

            {/* Cutting Pieces Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Kusy na rezanie ({materialSpec.cuttingPieces.length})
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddPiece(material.id)}
                >
                  Pridať kus
                </Button>
              </Box>

              <CuttingPiecesTable
                pieces={materialSpec.cuttingPieces}
                edgeMaterial={materialSpec.selectedEdgeMaterial}
                onPieceChange={(pieceId, updatedPiece) => handlePieceChange(material.id, pieceId, updatedPiece)}
                onRemovePiece={(pieceId) => handleRemovePiece(material.id, pieceId)}
              />
            </Paper>


            {/* Divider between materials (except last one) */}
            {index < materials.length - 1 && (
              <Box sx={{ borderBottom: '2px solid #e0e0e0', mx: 2, mb: 4 }} />
            )}
          </Box>
        )
      })}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, position: 'sticky', bottom: 20, backgroundColor: 'white', p: 2, borderRadius: 1, boxShadow: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setMaterialSpecs(prev => {
            const newSpecs = { ...prev }
            Object.keys(newSpecs).forEach(materialId => {
              newSpecs[materialId] = {
                ...newSpecs[materialId],
                cuttingPieces: []
              }
            })
            return newSpecs
          })}
        >
          Vymazať všetko
        </Button>
        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={getTotalPieces() === 0}
        >
          Pokračovať ({getTotalPieces()} kusov)
        </Button>
      </Box>
    </Container>
  )
}

export default CuttingSpecificationPage
import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Button
} from '@mui/material'
import Grid from '@mui/system/Grid'
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon
} from '@mui/icons-material'
import MaterialInfoCard from './MaterialInfoCard'
import EdgeSelectionCard from './EdgeSelectionCard'
import CuttingPiecesTable from './CuttingPiecesTable'
import PiecePreviewDialog from './PiecePreviewDialog'
import { useMaterialSpecs } from '../hooks/useMaterialSpecs'
import type { MaterialSearchResult, CuttingSpecification, CuttingPiece } from '../types/shopify'

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
  console.log('🔍 CuttingSpecificationPage received materials:', materials);
  console.log('🔍 CuttingSpecificationPage existingSpecifications:', existingSpecifications);
  // State for piece preview dialog
  const [previewPiece, setPreviewPiece] = useState<CuttingPiece | null>(null)
  const [previewMaterial, setPreviewMaterial] = useState<MaterialSearchResult | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Use custom hook for material specs management
  const {
    materialSpecs,
    handleEdgeMaterialChange,
    handleGlueTypeChange,
    handleAddPiece,
    handlePieceChange,
    handleRemovePiece,
    clearAllPieces,
    generateSpecifications,
    getTotalPieces
  } = useMaterialSpecs(materials, existingSpecifications)

  const handleContinue = () => {
    const specifications = generateSpecifications()
    onContinue?.(specifications)
  }

  const handlePreviewPiece = (piece: CuttingPiece, material: MaterialSearchResult) => {
    setPreviewPiece(piece)
    setPreviewMaterial(material)
    setIsPreviewOpen(true)
  }

  const handleClosePreview = () => {
    setIsPreviewOpen(false)
    setPreviewPiece(null)
    setPreviewMaterial(null)
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
        <Typography variant="h4" component="h1" sx={{ color: 'primary.main', fontWeight: 500 }}>
          {orderName} - Špecifikácia rezania
        </Typography>
      </Box>

      {/* Multiple Materials - Scrollable Cards */}
      {materials.map((material, index) => {
        const materialSpec = materialSpecs[material.id]
        
        return (
          <Box key={material.id} sx={{ mb: 4 }}>
            {/* Material Header */}
            <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 500, mb: 2 }}>
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
                onPreviewPiece={(piece) => handlePreviewPiece(piece, material)}
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
          onClick={clearAllPieces}
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

      {/* Piece Preview Dialog */}
      <PiecePreviewDialog
        open={isPreviewOpen}
        piece={previewPiece}
        material={previewMaterial || undefined}
        onClose={handleClosePreview}
      />
    </Container>
  )
}

export default CuttingSpecificationPage
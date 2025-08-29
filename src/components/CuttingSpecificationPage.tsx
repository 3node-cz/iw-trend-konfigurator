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
import type { MaterialSearchResult, CuttingSpecification, CuttingPiece, EdgeMaterial } from '../types/shopify'

interface CuttingSpecificationPageProps {
  material: MaterialSearchResult
  orderName: string
  onBack?: () => void
  onContinue?: (specification: CuttingSpecification) => void
}

const CuttingSpecificationPage: React.FC<CuttingSpecificationPageProps> = ({
  material,
  orderName,
  onBack,
  onContinue
}) => {
  const [selectedEdgeMaterial, setSelectedEdgeMaterial] = useState<EdgeMaterial | null>(null)
  const [glueType, setGlueType] = useState('PUR transparentná/bílá')
  const [cuttingPieces, setCuttingPieces] = useState<CuttingPiece[]>([])

  const handleAddPiece = () => {
    const newPiece: CuttingPiece = {
      id: `piece-${Date.now()}`,
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
    setCuttingPieces(prev => [...prev, newPiece])
  }

  const handlePieceChange = (pieceId: string, updatedPiece: Partial<CuttingPiece>) => {
    setCuttingPieces(prev =>
      prev.map(piece => {
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
    )
  }

  const handleRemovePiece = (pieceId: string) => {
    setCuttingPieces(prev => prev.filter(piece => piece.id !== pieceId))
  }

  const handleContinue = () => {
    const specification: CuttingSpecification = {
      material,
      edgeMaterial: selectedEdgeMaterial,
      glueType,
      pieces: cuttingPieces
    }
    onContinue?.(specification)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
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

      {/* Material and Edge Selection */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Material Info Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <MaterialInfoCard material={material} />
        </Grid>
        
        {/* Edge Selection Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <EdgeSelectionCard
            selectedEdge={selectedEdgeMaterial}
            glueType={glueType}
            onEdgeChange={setSelectedEdgeMaterial}
            onGlueTypeChange={setGlueType}
          />
        </Grid>
      </Grid>

      {/* Cutting Pieces Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Kusy na rezanie ({cuttingPieces.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddPiece}
          >
            Pridať kus
          </Button>
        </Box>

        <CuttingPiecesTable
          pieces={cuttingPieces}
          edgeMaterial={selectedEdgeMaterial}
          onPieceChange={handlePieceChange}
          onRemovePiece={handleRemovePiece}
        />
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setCuttingPieces([])}
        >
          Vymazať všetko
        </Button>
        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={cuttingPieces.length === 0}
        >
          Pokračovať ({cuttingPieces.length} kusov)
        </Button>
      </Box>
    </Container>
  )
}

export default CuttingSpecificationPage
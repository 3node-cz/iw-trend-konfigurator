import { useState, useCallback, useEffect } from 'react'
import type {
  MaterialSearchResult,
  CuttingSpecification,
  CuttingPiece,
  EdgeMaterial,
} from '../types/shopify'

interface MaterialSpec {
  selectedEdgeMaterial: EdgeMaterial | null
  glueType: string
  cuttingPieces: CuttingPiece[]
}

export const useMaterialSpecs = (
  materials: MaterialSearchResult[],
  existingSpecifications: CuttingSpecification[] = [],
) => {
  const [materialSpecs, setMaterialSpecs] = useState<{
    [materialId: string]: MaterialSpec
  }>(() => {
    const specs: { [materialId: string]: MaterialSpec } = {}
    materials.forEach((material) => {
      const existingSpec = existingSpecifications.find(
        (spec) => spec.material.id === material.id,
      )
      specs[material.id] = {
        selectedEdgeMaterial: existingSpec?.edgeMaterial || null,
        glueType: existingSpec?.glueType || 'PUR transparentná/bílá',
        cuttingPieces: existingSpec?.pieces || [],
      }
    })
    return specs
  })

  // Track which pieces have been touched (user has interacted with them)
  const [touchedPieces, setTouchedPieces] = useState<Set<string>>(new Set())

  // Update materialSpecs when materials array changes, preserving existing data
  useEffect(() => {
    setMaterialSpecs((prevSpecs) => {
      const newSpecs: { [materialId: string]: MaterialSpec } = {}

      materials.forEach((material) => {
        if (prevSpecs[material.id]) {
          // Preserve existing specification if material already exists
          newSpecs[material.id] = prevSpecs[material.id]
        } else {
          // Initialize new material from existingSpecifications or defaults
          const existingSpec = existingSpecifications.find(
            (spec) => spec.material.id === material.id,
          )
          newSpecs[material.id] = {
            selectedEdgeMaterial: existingSpec?.edgeMaterial || null,
            glueType: existingSpec?.glueType || 'PUR transparentná/bílá',
            cuttingPieces: existingSpec?.pieces || [],
          }
        }
      })

      return newSpecs
    })
  }, [materials, existingSpecifications])

  const handleEdgeMaterialChange = useCallback(
    (materialId: string, edgeMaterial: EdgeMaterial | null) => {
      setMaterialSpecs((prev) => ({
        ...prev,
        [materialId]: {
          ...prev[materialId],
          selectedEdgeMaterial: edgeMaterial,
        },
      }))
    },
    [],
  )

  const handleGlueTypeChange = useCallback(
    (materialId: string, glueType: string) => {
      setMaterialSpecs((prev) => ({
        ...prev,
        [materialId]: {
          ...prev[materialId],
          glueType,
        },
      }))
    },
    [],
  )

  const handleAddPiece = useCallback((materialId: string) => {
    const newPiece: CuttingPiece = {
      id: `piece_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      partName: '',
      length: 0,
      width: 0,
      quantity: 1,
      allowRotation: false,
      withoutEdge: false,
      duplicate: false,
      edgeAllAround: null,
      edgeTop: null,
      edgeBottom: null,
      edgeLeft: null,
      edgeRight: null,
      notes: '',
    }

    setMaterialSpecs((prev) => ({
      ...prev,
      [materialId]: {
        ...prev[materialId],
        cuttingPieces: [...prev[materialId].cuttingPieces, newPiece],
      },
    }))
  }, [])

  const handlePieceChange = useCallback(
    (
      materialId: string,
      pieceId: string,
      updatedPiece: Partial<CuttingPiece>,
    ) => {
      // Mark piece as touched when user modifies width or length
      if ('length' in updatedPiece || 'width' in updatedPiece) {
        setTouchedPieces(prev => new Set(prev).add(pieceId))
      }

      setMaterialSpecs((prev) => ({
        ...prev,
        [materialId]: {
          ...prev[materialId],
          cuttingPieces: prev[materialId].cuttingPieces.map((piece) => {
            if (piece.id !== pieceId) return piece

            const updated = { ...piece, ...updatedPiece }

            // Note: The edge logic is now handled in CuttingPiecesTable component
            // This hook just applies the updates as-is

            return updated
          }),
        },
      }))
    },
    [],
  )

  const handleRemovePiece = useCallback(
    (materialId: string, pieceId: string) => {
      // Remove from touched pieces
      setTouchedPieces(prev => {
        const newTouched = new Set(prev)
        newTouched.delete(pieceId)
        return newTouched
      })

      setMaterialSpecs((prev) => ({
        ...prev,
        [materialId]: {
          ...prev[materialId],
          cuttingPieces: prev[materialId].cuttingPieces.filter(
            (piece) => piece.id !== pieceId,
          ),
        },
      }))
    },
    [],
  )

  const clearAllPieces = useCallback(() => {
    // Clear all touched pieces
    setTouchedPieces(new Set())

    setMaterialSpecs((prev) => {
      const newSpecs = { ...prev }
      Object.keys(newSpecs).forEach((materialId) => {
        newSpecs[materialId] = {
          ...newSpecs[materialId],
          cuttingPieces: [],
        }
      })
      return newSpecs
    })
  }, [])

  // Helper function to check if a piece is valid (has both width and height > 0 and within material bounds)
  const isValidPiece = useCallback((piece: CuttingPiece, materialId?: string): boolean => {
    if (piece.length <= 0 || piece.width <= 0) {
      return false
    }

    // Check material dimension constraints if materialId is provided
    if (materialId) {
      const material = materials.find(m => m.id === materialId)

      // Use default dimensions if not provided (standard DTD board size)
      const dimensions = material?.dimensions || {
        width: 2800,   // Standard DTD board width
        height: 2070,  // Standard DTD board height
        thickness: 18  // Standard thickness
      }

      const maxLength = Math.max(dimensions.width, dimensions.height)
      const maxWidth = Math.max(dimensions.width, dimensions.height)

      // Allow rotation - piece can fit in material either way
      const fitsNormally = piece.length <= maxLength && piece.width <= maxWidth
      const fitsRotated = piece.length <= maxWidth && piece.width <= maxLength

      return fitsNormally || fitsRotated
    }

    return true
  }, [materials])

  // Get valid pieces only (filter out empty ones)
  const getValidPieces = useCallback((materialId: string): CuttingPiece[] => {
    return materialSpecs[materialId]?.cuttingPieces.filter(piece => isValidPiece(piece, materialId)) || []
  }, [materialSpecs, isValidPiece])

  // Check if all materials have at least one valid piece
  const hasValidPiecesForAllMaterials = useCallback((): boolean => {
    return materials.every(material => getValidPieces(material.id).length > 0)
  }, [materials, getValidPieces])

  // Get validation errors for pieces (only for touched pieces)
  const getPieceValidationErrors = useCallback((materialId: string): { [pieceId: string]: string[] } => {
    const errors: { [pieceId: string]: string[] } = {}
    const pieces = materialSpecs[materialId]?.cuttingPieces || []
    const material = materials.find(m => m.id === materialId)


    pieces.forEach(piece => {

      // Only show errors for pieces that have been touched by the user
      if (!touchedPieces.has(piece.id)) {
        return
      }

      const pieceErrors: string[] = []

      if (piece.length <= 0 && piece.width <= 0) {
        // Both empty - this is ok, will be filtered out
        return
      }

      if (piece.length <= 0 && piece.width > 0) {
        pieceErrors.push('Dĺžka je povinná')
      }

      if (piece.width <= 0 && piece.length > 0) {
        pieceErrors.push('Šírka je povinná')
      }

      // Check material dimension constraints
      if (piece.length > 0 && piece.width > 0) {
        // Use default dimensions if not provided (standard DTD board size)
        const dimensions = material?.dimensions || {
          width: 2800,   // Standard DTD board width
          height: 2070,  // Standard DTD board height
          thickness: 18  // Standard thickness
        }

        const maxLength = Math.max(dimensions.width, dimensions.height)
        const maxWidth = Math.max(dimensions.width, dimensions.height)

        // Check if piece fits in material either way (with rotation)
        const fitsNormally = piece.length <= maxLength && piece.width <= maxWidth
        const fitsRotated = piece.length <= maxWidth && piece.width <= maxLength


        if (!fitsNormally && !fitsRotated) {
          pieceErrors.push(`Rozmery presahujú materiál (max ${maxLength}×${maxWidth} mm)`)
        }
      }

      if (pieceErrors.length > 0) {
        errors[piece.id] = pieceErrors
      }
    })

    return errors
  }, [materialSpecs, touchedPieces, materials])

  const generateSpecifications = useCallback((): CuttingSpecification[] => {
    return materials.map((material) => ({
      material,
      edgeMaterial: materialSpecs[material.id].selectedEdgeMaterial,
      glueType: materialSpecs[material.id].glueType,
      pieces: getValidPieces(material.id), // Only include valid pieces
    }))
  }, [materials, materialSpecs, getValidPieces])

  const getTotalPieces = useCallback(() => {
    return materials.reduce((total, material) => {
      return total + getValidPieces(material.id).length
    }, 0)
  }, [materials, getValidPieces])

  // Get total valid pieces for a specific material
  const getTotalPiecesForMaterial = useCallback((materialId: string) => {
    return getValidPieces(materialId).length
  }, [getValidPieces])

  // Remove a material and all its cutting pieces
  const removeMaterial = useCallback((materialId: string) => {
    setMaterialSpecs((prev) => {
      const newSpecs = { ...prev }
      // Get piece IDs to remove from touched pieces
      const piecesToRemove = newSpecs[materialId]?.cuttingPieces.map(p => p.id) || []

      // Remove from touched pieces
      setTouchedPieces(prevTouched => {
        const newTouched = new Set(prevTouched)
        piecesToRemove.forEach(pieceId => newTouched.delete(pieceId))
        return newTouched
      })

      delete newSpecs[materialId]
      return newSpecs
    })
  }, [])

  return {
    materialSpecs,
    handleEdgeMaterialChange,
    handleGlueTypeChange,
    handleAddPiece,
    handlePieceChange,
    handleRemovePiece,
    clearAllPieces,
    generateSpecifications,
    getTotalPieces,
    getTotalPiecesForMaterial,
    getValidPieces,
    hasValidPiecesForAllMaterials,
    getPieceValidationErrors,
    removeMaterial,
    isValidPiece,
  }
}

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

  // Track which specific fields have been touched (format: "pieceId:fieldName")
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

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
      isDupel: false,
      edgeAllAround: null,
      algorithmValue: 0,
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
      // Mark specific fields as touched when user modifies them
      if ('length' in updatedPiece) {
        setTouchedFields(prev => new Set(prev).add(`${pieceId}:length`))
      }
      if ('width' in updatedPiece) {
        setTouchedFields(prev => new Set(prev).add(`${pieceId}:width`))
      }

      // Mark piece as touched when user modifies width, length, quantity, or block number
      if ('length' in updatedPiece || 'width' in updatedPiece || 'quantity' in updatedPiece || 'algorithmValue' in updatedPiece) {
        setTouchedPieces(prev => new Set(prev).add(pieceId))

        // If block number changed, mark all pieces in the new block as touched for validation
        if ('algorithmValue' in updatedPiece && updatedPiece.algorithmValue && updatedPiece.algorithmValue > 0) {
          setMaterialSpecs((currentSpecs) => {
            const piecesInBlock = currentSpecs[materialId]?.cuttingPieces.filter(
              p => p.algorithmValue === updatedPiece.algorithmValue
            ) || []

            setTouchedPieces(prev => {
              const newTouched = new Set(prev)
              piecesInBlock.forEach(p => newTouched.add(p.id))
              return newTouched
            })

            return currentSpecs
          })
        }
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

      // Remove from touched fields
      setTouchedFields(prev => {
        const newTouched = new Set(prev)
        newTouched.delete(`${pieceId}:length`)
        newTouched.delete(`${pieceId}:width`)
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
    // Clear all touched fields
    setTouchedFields(new Set())

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

  // Check if ALL pieces are valid (no invalid pieces exist)
  const allPiecesAreValid = useCallback((): boolean => {
    return materials.every(material => {
      const pieces = materialSpecs[material.id]?.cuttingPieces || []
      // If there are no pieces, return false
      if (pieces.length === 0) return false
      // Check that all pieces are valid
      return pieces.every(piece => isValidPiece(piece, material.id))
    })
  }, [materials, materialSpecs, isValidPiece])

  // Get validation errors for pieces (only for touched pieces)
  const getPieceValidationErrors = useCallback((materialId: string): { [pieceId: string]: string[] } => {
    const errors: { [pieceId: string]: string[] } = {}
    const pieces = materialSpecs[materialId]?.cuttingPieces || []
    const material = materials.find(m => m.id === materialId)

    // Use default dimensions if not provided (standard DTD board size)
    const dimensions = material?.dimensions || {
      width: 2800,   // Standard DTD board width
      height: 2070,  // Standard DTD board height
      thickness: 18  // Standard thickness
    }

    const maxLength = Math.max(dimensions.width, dimensions.height)
    const maxWidth = Math.max(dimensions.width, dimensions.height)

    // Group pieces by block number for validation
    const blockGroups = new Map<number, CuttingPiece[]>()
    pieces.forEach(piece => {
      if (piece.algorithmValue > 0 && piece.length > 0 && piece.width > 0) {
        if (!blockGroups.has(piece.algorithmValue)) {
          blockGroups.set(piece.algorithmValue, [])
        }
        blockGroups.get(piece.algorithmValue)!.push(piece)
      }
    })

    // Validate blocks first and track which blocks have errors
    const blockErrors = new Map<number, string[]>()

    blockGroups.forEach((blockPieces, blockNumber) => {
      // Calculate total number of pieces including quantities
      const totalPieceCount = blockPieces.reduce((sum, p) => sum + p.quantity, 0)

      // Skip single-piece blocks (only if it's literally 1 piece, not 1 type with multiple quantity)
      if (blockPieces.length === 1 && blockPieces[0].quantity === 1) {
        return
      }

      const blockValidationErrors: string[] = []

      // Blocks are ALWAYS placed horizontally (side by side)
      // Calculate total width when pieces are placed side by side
      const totalWidthNormal = blockPieces.reduce((sum, p) => sum + (p.length * p.quantity), 0)
      const maxHeightNormal = Math.max(...blockPieces.map(p => p.width))

      // Check if rotation is allowed for ANY piece in the block
      const allowsRotation = blockPieces.some(p => p.allowRotation)

      // If rotation allowed, check rotated dimensions (rotate entire block as unit)
      // When rotated, pieces are still side by side but the whole block is rotated 90°
      const totalWidthRotated = blockPieces.reduce((sum, p) => sum + (p.width * p.quantity), 0)
      const maxHeightRotated = Math.max(...blockPieces.map(p => p.length))

      // Check if block fits on board (normal or rotated)
      const fitsNormal = totalWidthNormal <= dimensions.width && maxHeightNormal <= dimensions.height
      const fitsRotated = allowsRotation && totalWidthRotated <= dimensions.width && maxHeightRotated <= dimensions.height

      // Also check total area (< 80% of board to allow for waste)
      const totalArea = blockPieces.reduce((sum, p) => sum + (p.length * p.width * p.quantity), 0)
      const boardArea = dimensions.width * dimensions.height
      const blockFitsArea = totalArea <= boardArea * 0.8

      if (!fitsNormal && !fitsRotated) {
        if (allowsRotation) {
          blockValidationErrors.push(
            `Blok ${blockNumber}: ${totalWidthNormal}×${maxHeightNormal} mm (alebo ${totalWidthRotated}×${maxHeightRotated} mm otočené) nezmestí sa na dosku ${dimensions.width}×${dimensions.height} mm`
          )
        } else {
          blockValidationErrors.push(
            `Blok ${blockNumber}: ${totalWidthNormal}×${maxHeightNormal} mm nezmestí sa na dosku ${dimensions.width}×${dimensions.height} mm`
          )
        }
      } else if (!blockFitsArea) {
        blockValidationErrors.push(
          `Blok ${blockNumber} zaberá ${Math.round(totalArea / boardArea * 100)}% plochy dosky (max 80%)`
        )
      }

      if (blockValidationErrors.length > 0) {
        blockErrors.set(blockNumber, blockValidationErrors)
      }
    })

    pieces.forEach(piece => {
      const pieceErrors: string[] = []

      // ALWAYS show block errors (they affect optimization and should be immediately visible)
      // Add block errors to the FIRST piece in the block, regardless of touched state
      if (piece.algorithmValue > 0 && blockErrors.has(piece.algorithmValue)) {
        const blockPieces = blockGroups.get(piece.algorithmValue) || []
        const totalPieceCount = blockPieces.reduce((sum, p) => sum + p.quantity, 0)

        // Only add to first piece in the block (by ID sort for consistency)
        const sortedBlockPieces = [...blockPieces].sort((a, b) => a.id.localeCompare(b.id))

        // Show error if it's a real block (more than 1 total piece, or multiple piece types)
        if ((blockPieces.length > 1 || totalPieceCount > 1) && sortedBlockPieces[0].id === piece.id) {
          const blockErrorMessages = blockErrors.get(piece.algorithmValue) || []
          pieceErrors.push(...blockErrorMessages)
        }
      }

      // Only show individual piece errors for fields that have been touched by the user
      const lengthTouched = touchedFields.has(`${piece.id}:length`)
      const widthTouched = touchedFields.has(`${piece.id}:width`)

      if (lengthTouched || widthTouched) {
        if (piece.length <= 0 && piece.width <= 0) {
          // Both empty - this is ok, will be filtered out
          if (pieceErrors.length > 0) {
            errors[piece.id] = pieceErrors
          }
          return
        }

        // Only show length error if length field was touched
        if (lengthTouched && piece.length <= 0 && piece.width > 0) {
          pieceErrors.push('Dĺžka je povinná')
        }

        // Only show width error if width field was touched
        if (widthTouched && piece.width <= 0 && piece.length > 0) {
          pieceErrors.push('Šírka je povinná')
        }

        // Check material dimension constraints
        if (piece.length > 0 && piece.width > 0) {
          // Check if piece fits in material either way (with rotation)
          const fitsNormally = piece.length <= maxLength && piece.width <= maxWidth
          const fitsRotated = piece.length <= maxWidth && piece.width <= maxLength

          if (!fitsNormally && !fitsRotated) {
            pieceErrors.push(`Rozmery presahujú materiál (max ${maxLength}×${maxWidth} mm)`)
          }
        }
      }

      if (pieceErrors.length > 0) {
        errors[piece.id] = pieceErrors
      }
    })

    return errors
  }, [materialSpecs, touchedPieces, touchedFields, materials])

  const generateSpecifications = useCallback((): CuttingSpecification[] => {
    return materials
      .filter(material => materialSpecs[material.id]) // Only include materials with initialized specs
      .map((material) => ({
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

      // Remove from touched fields
      setTouchedFields(prevTouched => {
        const newTouched = new Set(prevTouched)
        piecesToRemove.forEach(pieceId => {
          newTouched.delete(`${pieceId}:length`)
          newTouched.delete(`${pieceId}:width`)
        })
        return newTouched
      })

      delete newSpecs[materialId]
      return newSpecs
    })
  }, [])

  // Mark a specific field as touched (e.g., when user blurs the field)
  const markFieldAsTouched = useCallback((pieceId: string, fieldName: 'length' | 'width') => {
    setTouchedFields(prev => new Set(prev).add(`${pieceId}:${fieldName}`))
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
    allPiecesAreValid,
    getPieceValidationErrors,
    removeMaterial,
    isValidPiece,
    markFieldAsTouched,
  }
}

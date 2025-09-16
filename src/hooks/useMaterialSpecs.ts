import { useState, useCallback } from 'react'
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

  const generateSpecifications = useCallback((): CuttingSpecification[] => {
    return materials.map((material) => ({
      material,
      edgeMaterial: materialSpecs[material.id].selectedEdgeMaterial,
      glueType: materialSpecs[material.id].glueType,
      pieces: materialSpecs[material.id].cuttingPieces,
    }))
  }, [materials, materialSpecs])

  const getTotalPieces = useCallback(() => {
    return Object.values(materialSpecs).reduce(
      (total, spec) => total + spec.cuttingPieces.length,
      0,
    )
  }, [materialSpecs])

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
  }
}

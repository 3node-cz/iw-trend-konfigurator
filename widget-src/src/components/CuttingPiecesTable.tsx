import React, { useMemo, useCallback } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Typography,
  Switch,
} from '@mui/material'
import {
  Delete as DeleteIcon,
} from '@mui/icons-material'
import type { CuttingPiece, EdgeMaterial } from '../types/shopify'
import {
  DebouncedTextInput,
  DebouncedNumberInput,
  EdgeThicknessSelect,
  HeaderWithHint,
  EdgeOrientationHint,
} from './common'
import PieceShapePreview from './common/PieceShapePreview'

interface CuttingPiecesTableProps {
  pieces: CuttingPiece[]
  edgeMaterial: EdgeMaterial | null
  onPieceChange: (pieceId: string, updatedPiece: Partial<CuttingPiece>) => void
  onRemovePiece: (pieceId: string) => void
  onPreviewPiece?: (piece: CuttingPiece) => void
}

const columnHelper = createColumnHelper<CuttingPiece>()

const CuttingPiecesTable: React.FC<CuttingPiecesTableProps> = ({
  pieces,
  edgeMaterial,
  onPieceChange,
  onRemovePiece,
  onPreviewPiece,
}) => {
  // Helper function to check if all edges have the same value
  const getEdgeAllAroundValue = useCallback(
    (piece: CuttingPiece): number | null => {
      const { edgeTop, edgeBottom, edgeLeft, edgeRight } = piece

      // Only set edgeAllAround if all four edges have the same value (including null)
      if (
        edgeTop === edgeBottom &&
        edgeBottom === edgeLeft &&
        edgeLeft === edgeRight
      ) {
        return edgeTop
      }
      return null
    },
    [],
  )

  // Enhanced change handler with reactive edge logic
  const handlePieceChange = useCallback(
    (pieceId: string, updates: Partial<CuttingPiece>) => {
      const piece = pieces.find((p) => p.id === pieceId)
      if (!piece) return

      let finalUpdates = { ...updates }

      // Handle edgeAllAround changes - set all individual edges
      if ('edgeAllAround' in updates) {
        const edgeAllAroundValue = updates.edgeAllAround
        finalUpdates = {
          ...finalUpdates,
          edgeTop: edgeAllAroundValue,
          edgeBottom: edgeAllAroundValue,
          edgeLeft: edgeAllAroundValue,
          edgeRight: edgeAllAroundValue,
        }
      }
      // Handle individual edge changes - update edgeAllAround reactively
      else if (
        ['edgeTop', 'edgeBottom', 'edgeLeft', 'edgeRight'].some(
          (key) => key in updates,
        )
      ) {
        const updatedPiece = { ...piece, ...finalUpdates }
        const newEdgeAllAround = getEdgeAllAroundValue(updatedPiece)
        finalUpdates.edgeAllAround = newEdgeAllAround
      }

      onPieceChange(pieceId, finalUpdates)
    },
    [onPieceChange, pieces, getEdgeAllAroundValue],
  )

  const handleRemovePiece = useCallback(
    (pieceId: string) => {
      onRemovePiece(pieceId)
    },
    [onRemovePiece],
  )

  const handlePreviewPiece = useCallback(
    (piece: CuttingPiece) => {
      onPreviewPiece?.(piece)
    },
    [onPreviewPiece],
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = useMemo<ColumnDef<CuttingPiece, any>[]>(
    () => [
      // Row number
      columnHelper.display({
        id: 'rowNumber',
        header: '#',
        cell: ({ row }) => (
          <Typography
            variant="body2"
            sx={{ fontWeight: 500 }}
          >
            {row.index + 1}
          </Typography>
        ),
        size: 40,
      }),

      // Preview
      columnHelper.display({
        id: 'preview',
        header: 'Náhľad',
        cell: ({ row }) => {
          const piece = row.original
          // Only show preview if piece has valid dimensions
          if (!piece.length || !piece.width) {
            return (
              <Box sx={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="caption" color="text.disabled">-</Typography>
              </Box>
            )
          }
          return (
            <Box
              sx={{
                cursor: onPreviewPiece ? 'pointer' : 'default',
                '&:hover': onPreviewPiece ? {
                  opacity: 0.8,
                  transform: 'scale(1.05)',
                } : {},
                transition: 'all 0.2s ease',
              }}
              onClick={() => onPreviewPiece && handlePreviewPiece(piece)}
              title={onPreviewPiece ? 'Kliknite pre detail náhľadu' : ''}
            >
              <PieceShapePreview
                piece={piece}
                containerSize={40}
                showBackground={false}
                showRotationIndicator={false}
                showEdges={true}
              />
            </Box>
          )
        },
        size: 50,
      }),

      // Part Name
      columnHelper.accessor('partName', {
        header: 'Názov dielca',
        size: 130,
        cell: ({ row, getValue }) => (
          <DebouncedTextInput
            initialValue={getValue() || ''}
            onChange={(value) =>
              handlePieceChange(row.original.id, { partName: value })
            }
            sx={{ minWidth: 120 }}
            placeholder="Názov dielca"
          />
        ),
      }),

      // Length
      columnHelper.accessor('length', {
        header: 'Dĺžka',
        size: 100,
        cell: ({ row, getValue }) => (
          <DebouncedNumberInput
            initialValue={getValue() || 0}
            onChange={(value) =>
              handlePieceChange(row.original.id, { length: value })
            }
            sx={{ width: 90 }}
            min={0}
          />
        ),
      }),

      // Width
      columnHelper.accessor('width', {
        header: 'Šírka',
        size: 100,
        cell: ({ row, getValue }) => (
          <DebouncedNumberInput
            initialValue={getValue() || 0}
            onChange={(value) =>
              handlePieceChange(row.original.id, { width: value })
            }
            sx={{ width: 90 }}
            min={0}
          />
        ),
      }),

      // Quantity
      columnHelper.accessor('quantity', {
        header: 'Počet',
        size: 80,
        cell: ({ row, getValue }) => (
          <DebouncedNumberInput
            initialValue={getValue()}
            onChange={(value) =>
              handlePieceChange(row.original.id, { quantity: value })
            }
            sx={{ width: 70 }}
            min={1}
          />
        ),
      }),

      // Povoliť rotáciu
      columnHelper.accessor('allowRotation', {
        header: 'Rotácia',
        size: 80,
        cell: ({ row, getValue }) => (
          <Switch
            checked={getValue()}
            onChange={(e) =>
              handlePieceChange(row.original.id, {
                allowRotation: e.target.checked,
              })
            }
          />
        ),
      }),

      // Without Edge
      columnHelper.accessor('withoutEdge', {
        header: 'Bez orezu',
        size: 80,
        cell: ({ row, getValue }) => (
          <Switch
            checked={getValue()}
            onChange={(e) =>
              handlePieceChange(row.original.id, {
                withoutEdge: e.target.checked,
              })
            }
          />
        ),
      }),

      // Dupel
      columnHelper.accessor('duplicate', {
        header: 'Dupel',
        size: 70,
        cell: ({ row, getValue }) => (
          <Switch
            checked={getValue()}
            onChange={(e) =>
              handlePieceChange(row.original.id, {
                duplicate: e.target.checked,
              })
            }
          />
        ),
      }),

      // Edge All Around
      columnHelper.accessor('edgeAllAround', {
        header: 'Hrana dookola',
        size: 90,
        cell: ({ row, getValue }) => (
          <EdgeThicknessSelect
            value={getValue()}
            onChange={(value) =>
              handlePieceChange(row.original.id, { edgeAllAround: value })
            }
            edgeMaterial={edgeMaterial}
            minWidth={80}
          />
        ),
      }),

      // Edge Top
      columnHelper.accessor('edgeTop', {
        header: () => (
          <HeaderWithHint
            title="Hrana vrch"
            hintTitle="Orientácia hrán"
            hintContent={<EdgeOrientationHint />}
          />
        ),
        size: 90,
        cell: ({ row, getValue }) => (
          <EdgeThicknessSelect
            value={getValue()}
            onChange={(value) =>
              handlePieceChange(row.original.id, { edgeTop: value })
            }
            edgeMaterial={edgeMaterial}
            minWidth={80}
          />
        ),
      }),

      // Edge Bottom
      columnHelper.accessor('edgeBottom', {
        header: () => (
          <HeaderWithHint
            title="Hrana spodok"
            hintTitle="Orientácia hrán"
            hintContent={<EdgeOrientationHint />}
          />
        ),
        size: 90,
        cell: ({ row, getValue }) => (
          <EdgeThicknessSelect
            value={getValue()}
            onChange={(value) =>
              handlePieceChange(row.original.id, { edgeBottom: value })
            }
            edgeMaterial={edgeMaterial}
            minWidth={80}
          />
        ),
      }),

      // Edge Left
      columnHelper.accessor('edgeLeft', {
        header: () => (
          <HeaderWithHint
            title="Hrana ľavá"
            hintTitle="Orientácia hrán"
            hintContent={<EdgeOrientationHint />}
          />
        ),
        size: 90,
        cell: ({ row, getValue }) => (
          <EdgeThicknessSelect
            value={getValue()}
            onChange={(value) =>
              handlePieceChange(row.original.id, { edgeLeft: value })
            }
            edgeMaterial={edgeMaterial}
            minWidth={80}
          />
        ),
      }),

      // Edge Right
      columnHelper.accessor('edgeRight', {
        header: () => (
          <HeaderWithHint
            title="Hrana pravá"
            hintTitle="Orientácia hrán"
            hintContent={<EdgeOrientationHint />}
          />
        ),
        size: 90,
        cell: ({ row, getValue }) => (
          <EdgeThicknessSelect
            value={getValue()}
            onChange={(value) =>
              handlePieceChange(row.original.id, { edgeRight: value })
            }
            edgeMaterial={edgeMaterial}
            minWidth={80}
          />
        ),
      }),

      // Notes
      columnHelper.accessor('notes', {
        header: 'Poznámka',
        size: 160,
        cell: ({ row, getValue }) => (
          <DebouncedTextInput
            initialValue={getValue()}
            onChange={(value) =>
              handlePieceChange(row.original.id, { notes: value })
            }
            sx={{ minWidth: 150 }}
            multiline
            rows={1}
          />
        ),
      }),

      // Actions
      columnHelper.display({
        id: 'actions',
        header: 'Akcie',
        cell: ({ row }) => (
          <IconButton
            size="small"
            color="error"
            onClick={() => handleRemovePiece(row.original.id)}
            title="Odstrániť dielec"
          >
            <DeleteIcon />
          </IconButton>
        ),
        size: 60,
      }),
    ],
    [
      edgeMaterial,
      handlePieceChange,
      handleRemovePiece,
      handlePreviewPiece,
      onPreviewPiece,
    ],
  )

  const table = useReactTable({
    data: pieces,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (pieces.length === 0) {
    return (
      <Box
        sx={{
          py: 8,
          textAlign: 'center',
          color: 'text.secondary',
          border: '2px dashed #e0e0e0',
          borderRadius: 1,
        }}
      >
        <Typography variant="body1">Žiadne kusy na rezanie</Typography>
        <Typography variant="body2">
          Kliknite na "Pridať kus" pre začiatok
        </Typography>
      </Box>
    )
  }

  return (
    <TableContainer sx={{ maxHeight: '70vh', overflowX: 'auto' }}>
      <Table
        stickyHeader
        size="small"
      >
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell
                  key={header.id}
                  sx={{
                    fontWeight: 600,
                    backgroundColor: '#f5f5f5',
                    whiteSpace: 'nowrap',
                    minWidth: header.column.columnDef.size || 'auto',
                    py: 1,
                    px: 1,
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              hover
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  sx={{
                    py: 0.5,
                    px: 1,
                    verticalAlign: 'middle',
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default CuttingPiecesTable

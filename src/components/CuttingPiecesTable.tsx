import React, { useMemo, useState, useCallback, useEffect } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Box,
  Typography,
  Switch
} from '@mui/material'
import {
  Delete as DeleteIcon
} from '@mui/icons-material'
import type { CuttingPiece, EdgeMaterial } from '../types/shopify'

interface CuttingPiecesTableProps {
  pieces: CuttingPiece[]
  edgeMaterial: EdgeMaterial | null
  onPieceChange: (pieceId: string, updatedPiece: Partial<CuttingPiece>) => void
  onRemovePiece: (pieceId: string) => void
}

const columnHelper = createColumnHelper<CuttingPiece>()

// Debounced Text Input Component
const DebouncedTextInput: React.FC<{
  initialValue: string
  onChange: (value: string) => void
  placeholder?: string
  sx?: any
  multiline?: boolean
  rows?: number
}> = ({ initialValue, onChange, placeholder, sx, multiline, rows }) => {
  const [value, setValue] = useState(initialValue)

  // Update local state when initialValue changes
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  // Debounced onChange
  useEffect(() => {
    const handler = setTimeout(() => {
      if (value !== initialValue) {
        onChange(value)
      }
    }, 600)

    return () => clearTimeout(handler)
  }, [value, onChange, initialValue])

  return (
    <TextField
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => onChange(value)} // Also update on blur for immediate feedback
      placeholder={placeholder}
      sx={sx}
      multiline={multiline}
      rows={rows}
    />
  )
}

// Debounced Number Input Component
const DebouncedNumberInput: React.FC<{
  initialValue: number
  onChange: (value: number) => void
  min?: number
  sx?: any
}> = ({ initialValue, onChange, min, sx }) => {
  const [value, setValue] = useState(initialValue.toString())

  // Update local state when initialValue changes
  useEffect(() => {
    setValue(initialValue.toString())
  }, [initialValue])

  // Debounced onChange
  useEffect(() => {
    const numValue = Number(value)
    const handler = setTimeout(() => {
      if (numValue !== initialValue && !isNaN(numValue)) {
        onChange(numValue)
      }
    }, 600)

    return () => clearTimeout(handler)
  }, [value, onChange, initialValue])

  const handleBlur = () => {
    const numValue = Number(value)
    if (!isNaN(numValue)) {
      onChange(numValue)
    } else {
      setValue(initialValue.toString()) // Reset to initial value if invalid
    }
  }

  return (
    <TextField
      type="number"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      sx={sx}
      slotProps={{ htmlInput: { min } }}
    />
  )
}

const CuttingPiecesTable: React.FC<CuttingPiecesTableProps> = ({
  pieces,
  edgeMaterial,
  onPieceChange,
  onRemovePiece
}) => {
  const edgeOptions = useMemo(() => {
    if (!edgeMaterial) return []
    return [
      { value: edgeMaterial.id, label: edgeMaterial.name },
      { value: 'none', label: 'Bez hrany' }
    ]
  }, [edgeMaterial])

  const columns = useMemo<ColumnDef<CuttingPiece, any>[]>(() => [
    // Row number
    columnHelper.display({
      id: 'rowNumber',
      header: '#',
      cell: ({ row }) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {row.index + 1}
        </Typography>
      ),
      size: 50
    }),

    // Part Name
    columnHelper.accessor('partName', {
      header: 'Názov dielca',
      cell: ({ row, getValue }) => (
        <DebouncedTextInput
          initialValue={getValue() || ''}
          onChange={(value) => onPieceChange(row.original.id, { partName: value })}
          sx={{ minWidth: 150 }}
          placeholder="Názov dielca"
        />
      )
    }),

    // Length
    columnHelper.accessor('length', {
      header: 'Dĺžka',
      cell: ({ row, getValue }) => (
        <DebouncedNumberInput
          initialValue={getValue() || 0}
          onChange={(value) => onPieceChange(row.original.id, { length: value })}
          sx={{ width: 120 }}
          min={0}
        />
      )
    }),

    // Width
    columnHelper.accessor('width', {
      header: 'Šírka',
      cell: ({ row, getValue }) => (
        <DebouncedNumberInput
          initialValue={getValue() || 0}
          onChange={(value) => onPieceChange(row.original.id, { width: value })}
          sx={{ width: 120 }}
          min={0}
        />
      )
    }),

    // Quantity
    columnHelper.accessor('quantity', {
      header: 'Počet',
      cell: ({ row, getValue }) => (
        <DebouncedNumberInput
          initialValue={getValue()}
          onChange={(value) => onPieceChange(row.original.id, { quantity: value })}
          sx={{ width: 80 }}
          min={1}
        />
      )
    }),

    // Letokruhy
    columnHelper.accessor('glueEdge', {
      header: 'Letokruhy',
      cell: ({ row, getValue }) => (
        <Switch
          checked={getValue()}
          onChange={(e) => onPieceChange(row.original.id, { glueEdge: e.target.checked })}
        />
      )
    }),

    // Without Edge
    columnHelper.accessor('withoutEdge', {
      header: 'Bez orezu',
      cell: ({ row, getValue }) => (
        <Switch
          checked={getValue()}
          onChange={(e) => onPieceChange(row.original.id, { withoutEdge: e.target.checked })}
        />
      )
    }),

    // Dupel
    columnHelper.accessor('duplicate', {
      header: 'Dupel',
      cell: ({ row, getValue }) => (
        <Switch
          checked={getValue()}
          onChange={(e) => onPieceChange(row.original.id, { duplicate: e.target.checked })}
        />
      )
    }),

    // Edge All Around
    columnHelper.accessor('edgeAllAround', {
      header: 'Hrana dookola',
      cell: ({ row, getValue }) => (
        <FormControl sx={{ minWidth: 150 }}>
          <Select
            value={getValue() || ''}
            onChange={(e) => onPieceChange(row.original.id, { edgeAllAround: e.target.value || null })}
            displayEmpty
          >
            <MenuItem value="">
              <em>Žiadna</em>
            </MenuItem>
            {edgeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )
    }),

    // Edge Top
    columnHelper.accessor('edgeTop', {
      header: 'Hrana vrch',
      cell: ({ row, getValue }) => (
        <FormControl sx={{ minWidth: 150 }}>
          <Select
            value={getValue() || ''}
            onChange={(e) => onPieceChange(row.original.id, { edgeTop: e.target.value || null })}
            displayEmpty
          >
            <MenuItem value="">
              <em>Žiadna</em>
            </MenuItem>
            {edgeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )
    }),

    // Edge Bottom
    columnHelper.accessor('edgeBottom', {
      header: 'Hrana spodok',
      cell: ({ row, getValue }) => (
        <FormControl sx={{ minWidth: 150 }}>
          <Select
            value={getValue() || ''}
            onChange={(e) => onPieceChange(row.original.id, { edgeBottom: e.target.value || null })}
            displayEmpty
          >
            <MenuItem value="">
              <em>Žiadna</em>
            </MenuItem>
            {edgeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )
    }),

    // Edge Left
    columnHelper.accessor('edgeLeft', {
      header: 'Hrana ľavá',
      cell: ({ row, getValue }) => (
        <FormControl sx={{ minWidth: 150 }}>
          <Select
            value={getValue() || ''}
            onChange={(e) => onPieceChange(row.original.id, { edgeLeft: e.target.value || null })}
            displayEmpty
          >
            <MenuItem value="">
              <em>Žiadna</em>
            </MenuItem>
            {edgeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )
    }),

    // Edge Right
    columnHelper.accessor('edgeRight', {
      header: 'Hrana pravá',
      cell: ({ row, getValue }) => (
        <FormControl sx={{ minWidth: 150 }}>
          <Select
            value={getValue() || ''}
            onChange={(e) => onPieceChange(row.original.id, { edgeRight: e.target.value || null })}
            displayEmpty
          >
            <MenuItem value="">
              <em>Žiadna</em>
            </MenuItem>
            {edgeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )
    }),

    // Notes
    columnHelper.accessor('notes', {
      header: 'Poznámka',
      cell: ({ row, getValue }) => (
        <DebouncedTextInput
          initialValue={getValue()}
          onChange={(value) => onPieceChange(row.original.id, { notes: value })}
          sx={{ minWidth: 200 }}
          multiline
          rows={1}
        />
      )
    }),

    // Actions
    columnHelper.display({
      id: 'actions',
      header: 'Akcie',
      cell: ({ row }) => (
        <IconButton
          size="small"
          color="error"
          onClick={() => onRemovePiece(row.original.id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
      size: 80
    })
  ], [edgeOptions, onPieceChange, onRemovePiece])

  const table = useReactTable({
    data: pieces,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  if (pieces.length === 0) {
    return (
      <Box 
        sx={{ 
          py: 8, 
          textAlign: 'center',
          color: 'text.secondary',
          border: '2px dashed #e0e0e0',
          borderRadius: 1
        }}
      >
        <Typography variant="body1">
          Žiadne kusy na rezanie
        </Typography>
        <Typography variant="body2">
          Kliknite na "Pridať kus" pre začiatok
        </Typography>
      </Box>
    )
  }

  return (
    <TableContainer sx={{ maxHeight: '70vh', overflowX: 'auto' }}>
      <Table stickyHeader size="small">
        <TableHead>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableCell
                  key={header.id}
                  sx={{ 
                    fontWeight: 600,
                    backgroundColor: '#f5f5f5',
                    whiteSpace: 'nowrap',
                    minWidth: header.column.columnDef.size || 'auto'
                  }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id} hover>
              {row.getVisibleCells().map(cell => (
                <TableCell 
                  key={cell.id}
                  sx={{ 
                    py: 1,
                    verticalAlign: 'top'
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
import React from 'react'
import { FormControl, Select, MenuItem } from '@mui/material'
import type { EdgeMaterial } from '../../types/shopify'
import { DIMENSIONS } from '../../constants'

interface EdgeThicknessSelectProps {
  value: number | null
  onChange: (value: number | null) => void
  edgeMaterial: EdgeMaterial | null
  minWidth?: number
  disabled?: boolean
  availableEdges?: EdgeMaterial[] // NEW: All available edge combinations
  isDupel?: boolean // NEW: Whether this is for a dupel piece (36mm vs 18mm)
}

const EdgeThicknessSelect: React.FC<EdgeThicknessSelectProps> = ({
  value,
  onChange,
  edgeMaterial,
  minWidth = 100,
  disabled = false,
  availableEdges = [],
  isDupel = false,
}) => {
  // Determine which widths to show - SHOW ALL OPTIONS REGARDLESS OF isDupel
  let widthOptions: number[] = []

  const boardThickness = isDupel ? 36 : 18

  console.log('🎯 [EdgeThicknessSelect] Rendering', {
    value,
    boardThickness,
    isDupel,
    edgeMaterialName: edgeMaterial?.name,
    availableEdgesCount: availableEdges.length
  })

  if (availableEdges && availableEdges.length > 0) {
    // Extract ALL unique widths from all edges (both 18mm and 36mm)
    const widths = availableEdges
      .map((edge) => edge.edgeWidth)
    widthOptions = [...new Set(widths)].sort((a, b) => a - b)

    console.log('🎯 [EdgeThicknessSelect] Available widths:', widthOptions)
    console.log('🎯 [EdgeThicknessSelect] Edges for this board thickness:',
      availableEdges.filter(e => e.boardThickness === boardThickness).map(e => ({
        width: e.edgeWidth,
        name: e.name,
        isPlaceholder: e.isPlaceholder
      }))
    )

    // If no widths found, show standard edge widths as fallback
    if (widthOptions.length === 0) {
      widthOptions = [...DIMENSIONS.EDGE_WIDTHS]
      console.log('⚠️ [EdgeThicknessSelect] No widths found, using defaults:', widthOptions)
    }
  } else {
    // Default fallback to standard edge widths
    widthOptions = [...DIMENSIONS.EDGE_WIDTHS]
    console.log('⚠️ [EdgeThicknessSelect] No available edges, using defaults:', widthOptions)
  }

  // Disable when no edge material selected or explicitly disabled
  const isDisabled = disabled || !edgeMaterial

  // Check if selected value corresponds to a placeholder edge for this board thickness
  const selectedEdge = availableEdges?.find(
    (edge) =>
      edge.edgeWidth === value &&
      edge.boardThickness === boardThickness
  )
  const isPlaceholder = selectedEdge?.isPlaceholder || false

  console.log('🎯 [EdgeThicknessSelect] Selected edge:', {
    value,
    selectedEdge: selectedEdge ? {
      name: selectedEdge.name,
      width: selectedEdge.edgeWidth,
      thickness: selectedEdge.boardThickness,
      isPlaceholder: selectedEdge.isPlaceholder
    } : 'NOT FOUND',
    isPlaceholder
  })

  return (
    <FormControl sx={{ minWidth }}>
      <Select
        value={value?.toString() || ''}
        onChange={(e) => {
          const selectedValue = e.target.value
          onChange(selectedValue ? Number(selectedValue) : null)
        }}
        displayEmpty
        size="small"
        disabled={isDisabled}
        sx={{
          // Highlight placeholder selections with a warning color
          ...(isPlaceholder && {
            '& .MuiSelect-select': {
              color: 'warning.main',
              fontWeight: 500,
            },
          }),
        }}
      >
        <MenuItem value="">
          <em>—</em>
        </MenuItem>
        {widthOptions.map((width) => {
          // Check if this width is a placeholder for the CURRENT PIECE'S board thickness
          const edge = availableEdges?.find(
            (e) =>
              e.edgeWidth === width &&
              e.boardThickness === boardThickness
          )
          const isPlaceholderOption = edge?.isPlaceholder || false

          return (
            <MenuItem
              key={width}
              value={width.toString()}
              sx={{
                ...(isPlaceholderOption && {
                  color: 'warning.main',
                  fontStyle: 'italic',
                }),
              }}
            >
              {width}
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}

export default EdgeThicknessSelect

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

  if (availableEdges && availableEdges.length > 0) {
    // Extract ALL unique widths from all edges (both 18mm and 36mm)
    const widths = availableEdges
      .map((edge) => edge.edgeWidth)
    widthOptions = [...new Set(widths)].sort((a, b) => a - b)

    // If no widths found, show standard edge widths as fallback
    if (widthOptions.length === 0) {
      widthOptions = [...DIMENSIONS.EDGE_WIDTHS]
    }
  } else {
    // Default fallback to standard edge widths
    widthOptions = [...DIMENSIONS.EDGE_WIDTHS]
  }

  // Disable when no edge material selected or explicitly disabled
  const isDisabled = disabled || !edgeMaterial

  // Check if selected value corresponds to a placeholder edge for this board thickness
  const boardThickness = isDupel ? 36 : 18
  const selectedEdge = availableEdges?.find(
    (edge) =>
      edge.edgeWidth === value &&
      edge.boardThickness === boardThickness
  )
  const isPlaceholder = selectedEdge?.isPlaceholder || false

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

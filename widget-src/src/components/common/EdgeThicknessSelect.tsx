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
}

const EdgeThicknessSelect: React.FC<EdgeThicknessSelectProps> = ({
  value,
  onChange,
  edgeMaterial,
  minWidth = 100,
  disabled = false,
}) => {
  // Use available thicknesses from the selected edge material
  // If no edge material is selected, show standard thickness options as fallback
  const thicknessOptions =
    edgeMaterial?.availableThicknesses || DIMENSIONS.EDGE_THICKNESSES

  // Disable when no edge material selected or explicitly disabled
  const isDisabled = disabled || !edgeMaterial

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
      >
        <MenuItem value="">
          <em>—</em>
        </MenuItem>
        {thicknessOptions.map((thickness) => (
          <MenuItem
            key={thickness}
            value={thickness.toString()}
          >
            {thickness}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default EdgeThicknessSelect

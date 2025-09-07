import React from 'react'
import { FormControl, Select, MenuItem } from '@mui/material'
import type { EdgeMaterial } from '../../types/shopify'

interface EdgeThicknessSelectProps {
  value: number | null
  onChange: (value: number | null) => void
  edgeMaterial: EdgeMaterial | null
  minWidth?: number
}

const EdgeThicknessSelect: React.FC<EdgeThicknessSelectProps> = ({
  value,
  onChange,
  edgeMaterial,
  minWidth = 100
}) => {
  // Use available thicknesses from the selected edge material
  // If no edge material is selected, show common thickness options as fallback
  const thicknessOptions = edgeMaterial?.availableThicknesses || [0.4, 0.8, 1, 2]

  return (
    <FormControl sx={{ minWidth }}>
      <Select
        value={value || ''}
        onChange={(e) => {
          const selectedValue = e.target.value
          onChange(selectedValue ? Number(selectedValue) : null)
        }}
        displayEmpty
        size="small"
      >
        <MenuItem value="">
          <em>—</em>
        </MenuItem>
        {thicknessOptions.map((thickness) => (
          <MenuItem key={thickness} value={thickness}>
            {thickness}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default EdgeThicknessSelect
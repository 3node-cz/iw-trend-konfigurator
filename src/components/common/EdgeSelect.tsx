import React from 'react'
import { FormControl, Select, MenuItem } from '@mui/material'

interface EdgeOption {
  value: string
  label: string
}

interface EdgeSelectProps {
  value: string | null
  onChange: (value: string | null) => void
  options: EdgeOption[]
  minWidth?: number
}

const EdgeSelect: React.FC<EdgeSelectProps> = ({
  value,
  onChange,
  options,
  minWidth = 150
}) => {
  return (
    <FormControl sx={{ minWidth }}>
      <Select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        displayEmpty
      >
        <MenuItem value="">
          <em>Žiadna</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default EdgeSelect
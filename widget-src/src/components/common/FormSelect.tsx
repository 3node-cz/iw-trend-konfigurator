import React from 'react'
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material'

interface FormSelectProps {
  label: string
  value: string
  onChange: (event: any) => void
  options: string[]
  error?: string
  required?: boolean
  size?: 'small' | 'medium'
  fullWidth?: boolean
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  size = 'small',
  fullWidth = true
}) => {
  return (
    <FormControl fullWidth={fullWidth} size={size} error={!!error}>
      <InputLabel required={required}>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}

export default FormSelect
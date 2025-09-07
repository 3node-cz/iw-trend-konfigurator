import React from 'react'
import { TextField } from '@mui/material'

interface FormTextFieldProps {
  label: string
  value: string
  onChange: (event: any) => void
  error?: string
  required?: boolean
  placeholder?: string
  multiline?: boolean
  rows?: number
  size?: 'small' | 'medium'
  fullWidth?: boolean
}

const FormTextField: React.FC<FormTextFieldProps> = ({
  label,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  multiline = false,
  rows,
  size = 'small',
  fullWidth = true
}) => {
  return (
    <TextField
      fullWidth={fullWidth}
      label={label}
      value={value}
      onChange={onChange}
      variant="outlined"
      size={size}
      placeholder={placeholder}
      error={!!error}
      helperText={error}
      required={required}
      multiline={multiline}
      rows={rows}
    />
  )
}

export default FormTextField
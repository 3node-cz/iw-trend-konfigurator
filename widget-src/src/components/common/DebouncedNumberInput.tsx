import React, { useState, useEffect } from 'react'
import { TextField } from '@mui/material'

interface DebouncedNumberInputProps {
  initialValue: number
  onChange: (value: number) => void
  min?: number
  sx?: any
  debounceMs?: number
  error?: boolean
  helperText?: string
}

/**
 * A debounced number input that delays onChange calls to prevent excessive re-renders
 * Updates on blur for immediate feedback and on timeout for delayed updates
 * Handles number validation and resets invalid values
 */
const DebouncedNumberInput: React.FC<DebouncedNumberInputProps> = ({
  initialValue,
  onChange,
  min,
  sx,
  debounceMs = 600,
  error = false,
  helperText
}) => {
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
    }, debounceMs)

    return () => clearTimeout(handler)
  }, [value, onChange, initialValue, debounceMs])

  const handleBlur = () => {
    const numValue = Number(value)
    if (!isNaN(numValue)) {
      // Only update if value actually changed to prevent unnecessary re-renders
      if (numValue !== initialValue) {
        onChange(numValue)
      }
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
      onFocus={(e) => {
        // Prevent browser from auto-scrolling to input
        e.target.scrollIntoView({ block: "nearest", behavior: "instant" })
      }}
      error={error}
      helperText={helperText}
      sx={sx}
      slotProps={{ htmlInput: { min } }}
    />
  )
}

export default DebouncedNumberInput
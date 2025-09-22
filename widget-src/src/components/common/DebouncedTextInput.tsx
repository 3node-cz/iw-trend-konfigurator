import React, { useState, useEffect } from 'react'
import { TextField } from '@mui/material'

interface DebouncedTextInputProps {
  initialValue: string
  onChange: (value: string) => void
  placeholder?: string
  sx?: any
  multiline?: boolean
  rows?: number
  debounceMs?: number
}

/**
 * A debounced text input that delays onChange calls to prevent excessive re-renders
 * Updates on blur for immediate feedback and on timeout for delayed updates
 */
const DebouncedTextInput: React.FC<DebouncedTextInputProps> = ({
  initialValue,
  onChange,
  placeholder,
  sx,
  multiline,
  rows,
  debounceMs = 600
}) => {
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
    }, debounceMs)

    return () => clearTimeout(handler)
  }, [value, onChange, initialValue, debounceMs])

  return (
    <TextField
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        // Only update if value actually changed to prevent unnecessary re-renders
        if (value !== initialValue) {
          onChange(value)
        }
      }}
      onFocus={(e) => {
        // Prevent browser from auto-scrolling to input
        e.target.scrollIntoView({ block: "nearest", behavior: "instant" })
      }}
      placeholder={placeholder}
      sx={sx}
      multiline={multiline}
      rows={rows}
    />
  )
}

export default DebouncedTextInput
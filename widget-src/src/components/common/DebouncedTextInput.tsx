import React, { useState, useEffect, useRef } from 'react'
import { TextField } from '@mui/material'

interface DebouncedTextInputProps {
  initialValue: string
  onChange: (value: string) => void
  placeholder?: string
  sx?: any
  multiline?: boolean
  rows?: number
}

/**
 * A controlled text input that only updates parent on blur
 * Prevents re-renders while typing and maintains focus
 */
const DebouncedTextInput: React.FC<DebouncedTextInputProps> = ({
  initialValue,
  onChange,
  placeholder,
  sx,
  multiline,
  rows
}) => {
  const [value, setValue] = useState(initialValue)
  const isFocusedRef = useRef(false)

  // Update local state when initialValue changes, but ONLY if input is not focused
  useEffect(() => {
    if (!isFocusedRef.current) {
      setValue(initialValue)
    }
  }, [initialValue])

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = true
    // Prevent browser from auto-scrolling to input
    e.target.scrollIntoView({ block: "nearest", behavior: "instant" })
  }

  const handleBlur = () => {
    isFocusedRef.current = false
    // Only update if value actually changed to prevent unnecessary re-renders
    if (value !== initialValue) {
      onChange(value)
    }
  }

  return (
    <TextField
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      onFocus={handleFocus}
      placeholder={placeholder}
      sx={sx}
      multiline={multiline}
      rows={rows}
    />
  )
}

export default DebouncedTextInput
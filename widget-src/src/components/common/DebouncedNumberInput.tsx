import React, { useState, useEffect, useRef } from 'react'
import { TextField } from '@mui/material'

interface DebouncedNumberInputProps {
  initialValue: number
  onChange: (value: number) => void
  onBlur?: () => void
  min?: number
  sx?: any
  error?: boolean
  helperText?: string
  placeholder?: string
  step?: number
}

/**
 * A controlled number input that only updates parent on blur
 * Prevents re-renders while typing and maintains focus
 * Handles number validation and resets invalid values
 */
const DebouncedNumberInput: React.FC<DebouncedNumberInputProps> = ({
  initialValue,
  onChange,
  onBlur: onBlurProp,
  min,
  sx,
  error = false,
  helperText,
  placeholder,
  step,
}) => {
  const [value, setValue] = useState(initialValue.toString())
  const isFocusedRef = useRef(false)

  // Update local state when initialValue changes, but ONLY if input is not focused
  useEffect(() => {
    if (!isFocusedRef.current) {
      setValue(initialValue.toString())
    }
  }, [initialValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value

    // Trim leading zeros while typing (but keep "0" for zero, and allow "0." for decimals)
    if (newValue !== '' && newValue !== '-' && newValue !== '0' && !newValue.startsWith('0.') && !newValue.startsWith('-0.')) {
      // Remove leading zeros: "0123" -> "123", "007" -> "7"
      newValue = newValue.replace(/^0+/, '') || '0'
    }

    setValue(newValue)
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = true
    // Prevent browser from auto-scrolling to input
    e.target.scrollIntoView({ block: "nearest", behavior: "instant" })
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = false

    // Always notify parent that field was touched/blurred
    if (onBlurProp) {
      onBlurProp()
    }

    let numValue = Number(value)

    // Handle empty string or invalid input
    if (value === '' || isNaN(numValue)) {
      // If min is set and it's >= 0, default to min, otherwise default to 0
      const defaultValue = min !== undefined && min >= 0 ? min : 0
      setValue(defaultValue.toString())
      if (defaultValue !== initialValue) {
        onChange(defaultValue)
      }
      return
    }

    // Apply min constraint if specified
    if (min !== undefined && numValue < min) {
      numValue = min
    }

    // Format the number properly on blur
    const formattedValue = numValue.toString()
    setValue(formattedValue)

    // Only update if value actually changed to prevent unnecessary re-renders
    if (numValue !== initialValue) {
      onChange(numValue)
    }
  }

  return (
    <TextField
      type="number"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      error={error}
      helperText={helperText}
      placeholder={placeholder}
      sx={sx}
      slotProps={{ htmlInput: { min, step } }}
    />
  )
}

export default DebouncedNumberInput
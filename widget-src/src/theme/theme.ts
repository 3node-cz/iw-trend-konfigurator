import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2e7d32',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    // TextField default props
    MuiTextField: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
      },
    },
    // Switch default props
    MuiSwitch: {
      defaultProps: {
        size: 'small',
      },
    },
    // Button default props
    MuiButton: {
      defaultProps: {
        variant: 'contained',
      },
      styleOverrides: {
        root: {
          textTransform: 'none', // Remove ALL CAPS
        },
      },
    },
    // Select default props
    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
    },
    // FormControl default props
    MuiFormControl: {
      defaultProps: {
        size: 'small',
      },
    },
    // Table styling for better density
    MuiTable: {
      defaultProps: {
        size: 'small',
      },
    },
    // Chip default props
    MuiChip: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
      },
    },
  },
})
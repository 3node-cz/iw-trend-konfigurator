import { createTheme } from "@mui/material/styles";

// Function to get primary color from Shopify configuration
const getPrimaryColor = () => {
  try {
    const widgetConfigs = (window as any).ConfiguratorConfig;
    if (widgetConfigs) {
      const firstBlockId = Object.keys(widgetConfigs)[0];
      const config = widgetConfigs[firstBlockId];
      return config?.settings?.primaryColor || "#2E7D32";
    }
    return "#2E7D32";
  } catch (error) {
    return "#2E7D32";
  }
};

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: getPrimaryColor(),
    },
    secondary: {
      main: "#dc004e",
    },
  },
  components: {
    // TextField default props
    MuiTextField: {
      defaultProps: {
        size: "small",
        variant: "outlined",
      },
    },
    // Switch default props
    MuiSwitch: {
      defaultProps: {
        size: "small",
      },
    },
    // Button default props
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
      styleOverrides: {
        root: {
          textTransform: "none", // Remove ALL CAPS
        },
      },
    },
    // Select default props
    MuiSelect: {
      defaultProps: {
        size: "small",
      },
    },
    // FormControl default props
    MuiFormControl: {
      defaultProps: {
        size: "small",
      },
    },
    // Table styling for better density
    MuiTable: {
      defaultProps: {
        size: "small",
      },
    },
    // Chip default props
    MuiChip: {
      defaultProps: {
        size: "small",
        variant: "outlined",
      },
    },
  },
});

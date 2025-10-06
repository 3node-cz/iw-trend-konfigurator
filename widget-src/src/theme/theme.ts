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

// Function to detect font from Shopify theme
const getShopifyThemeFont = () => {
  try {
    // First check if ConfiguratorConfig has fontFamily
    const widgetConfigs = (window as any).ConfiguratorConfig;
    if (widgetConfigs) {
      const firstBlockId = Object.keys(widgetConfigs)[0];
      const config = widgetConfigs[firstBlockId];
      if (config?.settings?.fontFamily) {
        return config.settings.fontFamily;
      }
    }

    // Fallback: try to detect from body element
    const bodyFont = window.getComputedStyle(document.body).fontFamily;
    if (bodyFont && bodyFont !== '') {
      return bodyFont;
    }

    // Fallback: check common Shopify theme selectors
    const selectors = [
      '.main-content',
      '.page-width',
      '.shopify-section',
      'main',
      '#shopify-section-header'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        const font = window.getComputedStyle(element).fontFamily;
        if (font && font !== '' && font !== 'inherit') {
          return font;
        }
      }
    }

    return 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  } catch (error) {
    return 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
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
  typography: {
    fontFamily: getShopifyThemeFont(),
  },
  components: {
    // Typography - make headers use primary color
    MuiTypography: {
      styleOverrides: {
        h1: {
          color: getPrimaryColor(),
        },
        h2: {
          color: getPrimaryColor(),
        },
        h3: {
          color: getPrimaryColor(),
        },
        h4: {
          color: getPrimaryColor(),
        },
        h5: {
          color: getPrimaryColor(),
        },
        h6: {
          color: getPrimaryColor(),
        },
      },
    },
    // TextField default props
    MuiTextField: {
      defaultProps: {
        size: "small",
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          // Fix disabled styling
          "& .Mui-disabled": {
            backgroundColor: "#f5f5f5",
            color: "rgba(0, 0, 0, 0.38)",
          },
        },
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
      styleOverrides: {
        select: {
          // Prevent text overflow
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
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
      styleOverrides: {
        root: {
          isolation: "isolate",
        },
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

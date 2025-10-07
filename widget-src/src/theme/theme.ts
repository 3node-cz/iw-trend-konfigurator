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

// Helper function to lighten color for better contrast
const lightenColor = (color: string, percent: number) => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
};

// Helper function to darken color
const darkenColor = (color: string, percent: number) => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = ((num >> 8) & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return "#" + (
    0x1000000 +
    (R > 0 ? R : 0) * 0x10000 +
    (G > 0 ? G : 0) * 0x100 +
    (B > 0 ? B : 0)
  ).toString(16).slice(1);
};

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: getPrimaryColor(),
      light: lightenColor(getPrimaryColor(), 20),
      dark: darkenColor(getPrimaryColor(), 10),
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: getShopifyThemeFont(),
    fontSize: 16,
    htmlFontSize: 16,
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
  },
  components: {
    // Typography - make headers use primary color with better styling
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
    // Button default props and styling
    MuiButton: {
      defaultProps: {
        variant: "contained",
        disableElevation: false,
      },
      styleOverrides: {
        root: {
          textTransform: "none", // Remove ALL CAPS
          fontWeight: 600,
          borderRadius: 8,
          padding: '8px 20px',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          },
        },
        containedPrimary: {
          background: getPrimaryColor(),
          '&:hover': {
            background: darkenColor(getPrimaryColor(), 8),
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: lightenColor(getPrimaryColor(), 45),
          },
        },
        text: {
          '&:hover': {
            backgroundColor: lightenColor(getPrimaryColor(), 45),
          },
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

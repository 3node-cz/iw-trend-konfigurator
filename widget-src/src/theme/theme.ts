import { createTheme } from "@mui/material/styles";

// Constants
const DEFAULT_PRIMARY_COLOR = "#2E7D32";
const DEFAULT_FONT_FAMILY =
  'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const SHOPIFY_SELECTORS = [
  ".main-content",
  ".page-width",
  ".shopify-section",
  "main",
  "#shopify-section-header",
] as const;

const COLOR_PERCENTAGES = {
  LIGHTEN: 20,
  LIGHTEN_HOVER: 45,
  DARKEN: 10,
  DARKEN_HOVER: 8,
} as const;

// Types
interface ConfiguratorSettings {
  primaryColor?: string;
  fontFamily?: string;
}

interface ConfiguratorConfig {
  settings?: ConfiguratorSettings;
}

interface WindowWithConfig extends Window {
  ConfiguratorConfig?: Record<string, ConfiguratorConfig>;
}

declare const window: WindowWithConfig;

// Cached values to avoid repeated DOM/config access
let cachedPrimaryColor: string | null = null;
let cachedFontFamily: string | null = null;

const getConfiguratorConfig = (): ConfiguratorConfig | null => {
  try {
    const widgetConfigs = window.ConfiguratorConfig;
    if (widgetConfigs && Object.keys(widgetConfigs).length > 0) {
      const firstBlockId = Object.keys(widgetConfigs)[0];
      return widgetConfigs[firstBlockId];
    }
    return null;
  } catch (error) {
    console.error("Error accessing ConfiguratorConfig:", error);
    return null;
  }
};

const getPrimaryColor = (): string => {
  if (cachedPrimaryColor) {
    return cachedPrimaryColor;
  }

  const config = getConfiguratorConfig();
  cachedPrimaryColor = config?.settings?.primaryColor || DEFAULT_PRIMARY_COLOR;
  return cachedPrimaryColor;
};

const getShopifyThemeFont = (): string => {
  if (cachedFontFamily) {
    return cachedFontFamily;
  }

  try {
    const config = getConfiguratorConfig();
    if (config?.settings?.fontFamily) {
      cachedFontFamily = config.settings.fontFamily;
      return cachedFontFamily;
    }

    const bodyFont = window.getComputedStyle(document.body).fontFamily;
    if (bodyFont && bodyFont !== "") {
      cachedFontFamily = bodyFont;
      return cachedFontFamily;
    }

    for (const selector of SHOPIFY_SELECTORS) {
      const element = document.querySelector(selector);
      if (element) {
        const font = window.getComputedStyle(element).fontFamily;
        if (font && font !== "" && font !== "inherit") {
          cachedFontFamily = font;
          return cachedFontFamily;
        }
      }
    }

    cachedFontFamily = DEFAULT_FONT_FAMILY;
    return cachedFontFamily;
  } catch (error) {
    console.error("Error detecting Shopify theme font:", error);
    cachedFontFamily = DEFAULT_FONT_FAMILY;
    return cachedFontFamily;
  }
};

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

const lightenColor = (color: string, percent: number): string => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = clamp((num >> 16) + amt, 0, 255);
  const G = clamp(((num >> 8) & 0x00ff) + amt, 0, 255);
  const B = clamp((num & 0x0000ff) + amt, 0, 255);

  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
};

const darkenColor = (color: string, percent: number): string => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = clamp((num >> 16) - amt, 0, 255);
  const G = clamp(((num >> 8) & 0x00ff) - amt, 0, 255);
  const B = clamp((num & 0x0000ff) - amt, 0, 255);

  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
};

const primaryColor = getPrimaryColor();

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: primaryColor,
      light: lightenColor(primaryColor, COLOR_PERCENTAGES.LIGHTEN),
      dark: darkenColor(primaryColor, COLOR_PERCENTAGES.DARKEN),
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: getShopifyThemeFont(),
    fontSize: 14,
    htmlFontSize: 16, // Browser default, set via :host in shadow root to isolate from host page font-size
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem", // 40px
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem", // 32px
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem", // 28px
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem", // 24px
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem", // 20px
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem", // 18px
    },
  },
  components: {
    // Typography - use primary color for main headings only
    MuiTypography: {
      styleOverrides: {
        h1: {
          color: primaryColor,
        },
        h2: {
          color: primaryColor,
        },
        h3: {
          color: "inherit",
        },
        h4: {
          color: "inherit",
        },
        h5: {
          color: "inherit", // Let individual components override if needed
        },
        h6: {
          color: "inherit",
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
          padding: "8px 20px",
          transition: "all 0.2s ease-in-out",
        },
        contained: {
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          },
        },
        containedPrimary: {
          background: primaryColor,
          "&:hover": {
            background: darkenColor(
              primaryColor,
              COLOR_PERCENTAGES.DARKEN_HOVER,
            ),
          },
        },
        outlined: {
          borderWidth: 2,
          borderColor: primaryColor,
          color: primaryColor,
          "&:hover": {
            borderWidth: 2,
            backgroundColor: primaryColor,
            color: "#ffffff",
          },
        },
        text: {
          "&:hover": {
            backgroundColor: lightenColor(
              primaryColor,
              COLOR_PERCENTAGES.LIGHTEN_HOVER,
            ),
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

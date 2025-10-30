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

// Create theme with shadow DOM support
export const createConfiguratorTheme = (
  shadowContainer?: HTMLElement,
) => {
  const primaryColor = getPrimaryColor();

  return createTheme({
    zIndex: {
      // Set very high z-index values to ensure dialogs appear above all Shopify theme content
      mobileStepper: 1000000,
      fab: 1000050,
      speedDial: 1000050,
      appBar: 1000100,
      drawer: 1000200,
      modal: 1000300,
      snackbar: 1000400,
      tooltip: 1000500,
    },
    typography: {
      // Tell MUI that the document root font-size is 10px (Shopify theme sets this)
      // This makes rem calculations work correctly: 1rem = 10px
      htmlFontSize: 10,
      // Set our desired base font size to 14px
      fontSize: 14,
      fontFamily: getShopifyThemeFont(),
      h1: {
        fontSize: "2.8rem", // 28px (2.8 * 10px) - Increased for better hierarchy
        fontWeight: 600,
        lineHeight: 1.2,
        color: "#333",
        marginBottom: "1.6rem", // 16px (1.6 * 10px)
      },
      h2: {
        fontSize: "2.2rem", // 22px (2.2 * 10px) - Slightly increased for better spacing
        fontWeight: 600,
        lineHeight: 1.3,
        color: "#333",
        marginBottom: "1.2rem", // 12px (1.2 * 10px)
      },
      h3: {
        fontSize: "1.8rem", // 18px (1.8 * 10px)
        fontWeight: 600,
        lineHeight: 1.4,
        color: "#333",
        marginBottom: "0.8rem", // 8px (0.8 * 10px)
      },
      h4: {
        fontSize: "1.6rem", // 16px (1.6 * 10px)
        fontWeight: 600,
        lineHeight: 1.4,
        color: "#333",
        marginBottom: "0.8rem", // 8px (0.8 * 10px)
      },
      body1: {
        fontSize: "1.4rem", // 14px (1.4 * 10px)
        lineHeight: 1.5,
      },
    },
    palette: {
      mode: "light",
      primary: {
        main: primaryColor,
        light: lightenColor(primaryColor, COLOR_PERCENTAGES.LIGHTEN),
        dark: darkenColor(primaryColor, COLOR_PERCENTAGES.DARKEN),
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#dc004e",
      },
      text: {
        primary: "#333",
        secondary: "#666",
      },
    },
    components: {
      // Typography text wrapping
      MuiTypography: {
        styleOverrides: {
          root: {
            textWrap: "pretty",
          },
        },
      },
      // Paper default props
      MuiPaper: {
        defaultProps: {
          elevation: 1,
        },
        styleOverrides: {
          root: {
            borderRadius: 8,
            // Ensure paper components work inside shadow DOM
            isolation: "isolate",
          },
        },
      },
      // Portal components for shadow DOM
      MuiModal: shadowContainer
        ? {
            defaultProps: {
              container: shadowContainer,
            },
          }
        : undefined,
      MuiDialog: shadowContainer
        ? {
            defaultProps: {
              container: shadowContainer,
            },
          }
        : undefined,
      MuiPopover: shadowContainer
        ? {
            defaultProps: {
              container: shadowContainer,
            },
          }
        : undefined,
      MuiPopper: shadowContainer
        ? {
            defaultProps: {
              container: shadowContainer,
            },
          }
        : undefined,
      // Button styling
      MuiButton: {
        defaultProps: {
          size: "medium",
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 6,
            textTransform: "none",
            fontWeight: 500,
            padding: "8px 16px",
            fontSize: "1.4rem", // 14px (1.4 * 10px)
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
};

// Note: No default theme export - theme is created dynamically with shadow container

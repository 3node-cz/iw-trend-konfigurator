import React from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { ScopedCssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfiguratorTheme } from "./theme/theme";
import App from "./App";
import type { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import printStyles from "./styles/print.css?raw";

// Shopify widget integration types
interface ShopifyCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  metafields: {
    saved_configurations?: string;
    discount_percentage?: string;
  };
}

interface ShopifyShop {
  domain: string;
  name: string;
}

export interface CuttingConfig {
  sawWidth: number;
  edgeBuffer: number;
  boardTrim: number;
  minPieceSize: number; // Minimum piece side length in mm
}

interface ShopifySettings {
  title: string;
  description: string;
  primaryColor: string;
  showCustomerDetails: boolean;
  showMetafields: boolean;
  cuttingConfig: CuttingConfig;
  transferLocations: string[];
  deliveryMethods: string[];
  processingTypes: string[];
  messages: {
    unavailableEdges: string;
    placeholderEdges: string;
  };
}

interface ShopifyWidgetConfig {
  customer: ShopifyCustomer | null;
  shop: ShopifyShop;
  settings: ShopifySettings;
  blockId: string;
}

declare global {
  interface Window {
    ConfiguratorConfig: Record<string, ShopifyWidgetConfig>;
  }
}

// Create a wrapper component that bridges Shopify data with your App
const ShopifyConfiguratorWidget: React.FC<{
  config: ShopifyWidgetConfig;
  emotionCache: EmotionCache;
  shadowContainer: HTMLElement;
}> = ({ config, emotionCache, shadowContainer }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  // Create theme with shadow container
  const theme = createConfiguratorTheme(shadowContainer);

  return (
    <CacheProvider value={emotionCache}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ScopedCssBaseline>
              <App />
            </ScopedCssBaseline>
          </LocalizationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </CacheProvider>
  );
};

// Initialize widgets when DOM is ready
function initializeConfigurators() {
  // Inject global print styles to show only configurator content
  if (!document.getElementById("configurator-global-print-styles")) {
    const globalPrintStylesElement = document.createElement("style");
    globalPrintStylesElement.id = "configurator-global-print-styles";
    globalPrintStylesElement.textContent = printStyles;
    document.head.appendChild(globalPrintStylesElement);
  }

  Object.keys(window.ConfiguratorConfig || {}).forEach((blockId) => {
    const config = window.ConfiguratorConfig[blockId];
    const container = document.getElementById(`react-root-${blockId}`);
    const loadingElement = document.getElementById(`loading-${blockId}`);

    if (container && config) {
      // Hide loading state
      if (loadingElement) {
        loadingElement.style.display = "none";
      }

      // Show React container
      container.style.display = "block";

      // Create Shadow DOM to isolate from Shopify theme styles
      const shadowRoot = container.attachShadow({ mode: "open" });

      // Add base styles to shadow root
      // Note: rem units still reference document root (10px in Shopify)
      // We handle this in theme.ts with htmlFontSize: 10
      const style = document.createElement("style");
      style.textContent = `
        :host {
          /* Reset all styles first, then override specific ones */
          all: initial;
          position: relative;
          /* Ensure the host element displays properly */
          display: block;
        }
      `;
      shadowRoot.appendChild(style);

      // Add print styles directly to shadow root
      const printStyleElement = document.createElement("style");
      printStyleElement.id = "configurator-print-styles";
      printStyleElement.textContent = `
        @media print {
          /* Hide navigation, buttons, and interactive elements */
          .no-print {
            display: none !important;
          }

          /* Hide helper messages */
          .print-hide-message {
            display: none !important;
          }

          /* Show print-only elements */
          .print-only {
            display: block !important;
          }

          /* Page setup */
          @page {
            size: A4;
            margin: 15mm;
          }

          /* General print styles - smaller font for better PDF layout */
          * {
            font-size: 9pt;
          }

          /* Remove container padding for print */
          .MuiContainer-root {
            padding-left: 0 !important;
            padding-right: 0 !important;
            padding-top: 0 !important;
          }

          /* Typography adjustments - smaller fonts for print */
          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
            page-break-inside: avoid;
          }

          h1, .MuiTypography-h1 {
            font-size: 18pt !important;
          }

          h2, .MuiTypography-h2 {
            font-size: 16pt !important;
          }

          h3, .MuiTypography-h3 {
            font-size: 14pt !important;
          }

          h4, .MuiTypography-h4 {
            font-size: 12pt !important;
          }

          h5, .MuiTypography-h5 {
            font-size: 11pt !important;
          }

          h6, .MuiTypography-h6 {
            font-size: 10pt !important;
          }

          .MuiTypography-body1 {
            font-size: 9pt !important;
          }

          .MuiTypography-body2 {
            font-size: 8pt !important;
          }

          .MuiTypography-caption {
            font-size: 7pt !important;
          }

          /* Smaller table text */
          .MuiTableCell-root {
            font-size: 8pt !important;
            padding: 4px 8px !important;
          }

          .MuiTableCell-head {
            font-size: 8.5pt !important;
            font-weight: 600 !important;
          }

          /* Remove shadows and backgrounds for cleaner print */
          .MuiPaper-root {
            box-shadow: none !important;
            border: 1px solid #ddd;
          }

          /* Make sure tables are visible */
          .MuiTableContainer-root {
            overflow: visible !important;
          }

          /* Alert boxes */
          .MuiAlert-root {
            border: 1px solid #ccc;
            border-left: 4px solid #2196f3;
            padding: 8px;
            margin: 8px 0;
          }

          /* Chips and badges */
          .MuiChip-root {
            border: 1px solid currentColor;
          }

          /* Cutting diagrams - scale down if needed */
          svg {
            max-width: 100% !important;
            height: auto !important;
          }

          /* Hide overflow scrolls */
          * {
            overflow: visible !important;
          }

          /* Links */
          a[href]:after {
            content: none !important;
          }

          /* Page break control - keep sections together */

          /* Paper components (main section blocks) - never break inside */
          .MuiPaper-root {
            page-break-inside: avoid;
            break-inside: avoid;
            page-break-before: auto;
            page-break-after: auto;
          }

          /* Grid items - keep together */
          .MuiGrid-root[class*="MuiGrid-item"] {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          /* Grid containers - allow breaks between items */
          .MuiGrid-container {
            page-break-inside: auto;
            break-inside: auto;
          }

          /* Alert boxes - keep together */
          .MuiAlert-root {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          /* Table rows - keep together */
          .MuiTableRow-root {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          /* Tables - allow breaks between rows if needed */
          table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: auto;
          }

          thead {
            display: table-header-group;
          }

          tr {
            page-break-inside: avoid;
            break-inside: avoid;
            page-break-after: auto;
          }

          /* Box components - allow breaks */
          .MuiBox-root {
            page-break-inside: auto;
            page-break-before: auto;
          }
        }

        /* Default state - hide print-only elements */
        @media screen {
          .print-only {
            display: none !important;
          }
        }
      `;
      shadowRoot.appendChild(printStyleElement);

      // Create a div inside shadow root for React to mount to
      const shadowContainer = document.createElement("div");
      shadowRoot.appendChild(shadowContainer);

      // Create Emotion cache for shadow DOM
      const emotionCache = createCache({
        key: `configurator-${blockId}`,
        container: shadowRoot as unknown as HTMLElement,
      });

      // Render the app inside shadow DOM
      const root = createRoot(shadowContainer);
      root.render(
        React.createElement(ShopifyConfiguratorWidget, {
          config,
          emotionCache,
          shadowContainer: shadowContainer,
        }),
      );
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeConfigurators);
} else {
  initializeConfigurators();
}

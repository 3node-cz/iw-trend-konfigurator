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

interface ShopifySettings {
  title: string;
  description: string;
  primaryColor: string;
  showCustomerDetails: boolean;
  showMetafields: boolean;
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
          /* High z-index to ensure dialogs appear above all page content */
          position: relative;
          z-index: 999999;
          /* Ensure the host element displays properly */
          display: block;
        }
      `;
      shadowRoot.appendChild(style);

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

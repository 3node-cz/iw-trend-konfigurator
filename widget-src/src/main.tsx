import React from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { ScopedCssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { theme } from "./theme/theme";
import App from "./App";

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
const ShopifyConfiguratorWidget: React.FC<{ config: ShopifyWidgetConfig }> = ({
  config,
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ScopedCssBaseline>
            <App />
          </ScopedCssBaseline>
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
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

      // Render the app
      const root = createRoot(container);
      root.render(React.createElement(ShopifyConfiguratorWidget, { config }));
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeConfigurators);
} else {
  initializeConfigurators();
}

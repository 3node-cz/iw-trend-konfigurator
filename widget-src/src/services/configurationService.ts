import type { OrderFormData } from "../schemas/orderSchema";
import type { CuttingSpecification } from "../types/shopify";
import type { AppView } from "../types/optimized-saved-config";
import type {
  SavedConfiguration,
  CustomerSavedConfigurations,
} from "../types/customerMetafields";
import {
  createSavedConfiguration,
  parseCustomerConfigurations,
  addConfigurationToSaved,
} from "../types/customerMetafields";

/**
 * Service for managing saved configurations in Shopify customer metafields
 */
export class ConfigurationService {
  private shopDomain: string;

  constructor(shopDomain: string) {
    this.shopDomain = shopDomain;
  }

  /**
   * Save a new configuration to customer metafields
   */
  async saveConfiguration(
    customerId: string,
    configurationName: string,
    orderInfo: OrderFormData,
    materials: Array<{
      id: string;
      code: string;
      name: string;
      quantity: number;
      price: number;
    }>,
    specifications: CuttingSpecification[],
    savedFromStep: AppView = 'recapitulation',
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get current saved configurations
      const currentConfigs = await this.getCurrentConfigurations(customerId);

      // Create new configuration
      const newConfiguration = createSavedConfiguration(
        configurationName,
        orderInfo,
        materials,
        specifications,
        savedFromStep,
      );

      // Add to existing configurations
      const updatedConfigs = addConfigurationToSaved(
        currentConfigs,
        newConfiguration,
      );

      // Save back to Shopify metafield
      const result = await this.updateCustomerMetafield(
        customerId,
        JSON.stringify(updatedConfigs),
      );

      return result;
    } catch (error) {
      console.error("Error saving configuration:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Get current saved configurations from customer metafields
   */
  private async getCurrentConfigurations(
    customerId: string,
  ): Promise<CustomerSavedConfigurations> {
    try {
      // Get current metafield value from Shopify widget config
      const widgetConfigs = (window as any).ConfiguratorConfig;
      if (widgetConfigs) {
        const firstBlockId = Object.keys(widgetConfigs)[0];
        const config = widgetConfigs[firstBlockId];
        // Access metafield with full namespace.key format as stored in liquid template
        const currentValue = config?.customer?.metafields?.['custom.saved_configurations'];

        console.log('📖 Loading saved configurations:', currentValue ? 'found' : 'not found');
        return parseCustomerConfigurations(currentValue);
      }

      return parseCustomerConfigurations(null);
    } catch (error) {
      console.error("Error getting current configurations:", error);
      return parseCustomerConfigurations(null);
    }
  }

  /**
   * Update customer metafield via Shopify app API
   */
  private async updateCustomerMetafield(
    customerId: string,
    configurationData: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch("/apps/configurator/api/update-metafield", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Shop-Domain": this.shopDomain,
        },
        body: JSON.stringify({
          customer_id: customerId,
          namespace: "custom",
          key: "saved_configurations",
          value: configurationData,
          type: "multi_line_text_field",
        }),
      });

      const result = await response.json();

      if (result.success) {
        return { success: true };
      } else {
        return {
          success: false,
          error: result.error || "Failed to save configuration",
        };
      }
    } catch (error) {
      console.error("Network error saving configuration:", error);
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }

  /**
   * Get all saved configurations for display
   */
  async getSavedConfigurations(): Promise<SavedConfiguration[]> {
    const configs = await this.getCurrentConfigurations("");
    return configs.savedConfigurations;
  }

  /**
   * Remove a saved configuration
   */
  async removeConfiguration(
    customerId: string,
    configurationId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const currentConfigs = await this.getCurrentConfigurations(customerId);

      const updatedConfigs = {
        ...currentConfigs,
        savedConfigurations: currentConfigs.savedConfigurations.filter(
          (config) => config.id !== configurationId,
        ),
        lastUpdated: new Date().toISOString(),
      };

      return await this.updateCustomerMetafield(
        customerId,
        JSON.stringify(updatedConfigs),
      );
    } catch (error) {
      console.error("Error removing configuration:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Delete a saved configuration (alias for removeConfiguration)
   */
  async deleteSavedConfiguration(
    configurationId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get customer ID from the global config
      const widgetConfigs = (window as any).ConfiguratorConfig;
      if (widgetConfigs) {
        const firstBlockId = Object.keys(widgetConfigs)[0];
        const config = widgetConfigs[firstBlockId];
        const customerId = config?.customer?.id;

        if (!customerId) {
          return {
            success: false,
            error: "Customer ID not found",
          };
        }

        return await this.removeConfiguration(customerId, configurationId);
      }

      return {
        success: false,
        error: "Configuration not available",
      };
    } catch (error) {
      console.error("Error deleting configuration:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}

/**
 * Create a configuration service instance
 * Gets shop domain from Shopify widget config
 */
export const createConfigurationService = (): ConfigurationService => {
  try {
    const widgetConfigs = (window as any).ConfiguratorConfig;
    if (widgetConfigs) {
      const firstBlockId = Object.keys(widgetConfigs)[0];
      const config = widgetConfigs[firstBlockId];
      const shopDomain = config?.shop?.domain || "unknown";

      return new ConfigurationService(shopDomain);
    }

    return new ConfigurationService("unknown");
  } catch (error) {
    console.error("Error creating configuration service:", error);
    return new ConfigurationService("unknown");
  }
};

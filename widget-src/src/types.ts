export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  metafields: {
    saved_configurations: string;
  };
}

export interface Shop {
  domain: string;
  name: string;
}

export interface Settings {
  title: string;
  description: string;
  primaryColor: string;
  showCustomerDetails: boolean;
  showMetafields: boolean;
}

export interface ConfiguratorProps {
  customer: Customer | null;
  shop: Shop;
  settings: Settings;
  blockId: string;
}

export interface ConfiguratorConfig {
  [blockId: string]: ConfiguratorProps;
}

declare global {
  interface Window {
    ConfiguratorConfig: ConfiguratorConfig;
    React: typeof import('react');
    ReactDOM: typeof import('react-dom/client');
  }
}
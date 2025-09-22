import React from 'react';
import { createRoot } from 'react-dom/client';
import ConfiguratorWidget from './components/ConfiguratorWidget';
import { ConfiguratorConfig } from './types';

declare global {
  interface Window {
    ConfiguratorConfig: ConfiguratorConfig;
    React: typeof React;
    ReactDOM: typeof import('react-dom/client');
  }
}

function initializeConfigurators() {
  Object.keys(window.ConfiguratorConfig || {}).forEach(blockId => {
    const config = window.ConfiguratorConfig[blockId];
    const container = document.getElementById(`react-root-${blockId}`);
    const loading = document.getElementById(`loading-${blockId}`);

    if (container && config) {
      if (loading) loading.style.display = 'none';
      container.style.display = 'block';

      const root = createRoot(container);
      root.render(React.createElement(ConfiguratorWidget, config));
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeConfigurators);
} else {
  initializeConfigurators();
}
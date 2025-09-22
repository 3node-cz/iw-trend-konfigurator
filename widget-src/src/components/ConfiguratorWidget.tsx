import React, { useState, useCallback } from 'react';
import { ConfiguratorProps } from '../types';

interface Message {
  type: 'success' | 'error';
  text: string;
}

const ConfiguratorWidget: React.FC<ConfiguratorProps> = ({
  customer,
  shop,
  settings,
  blockId
}) => {
  const [configData, setConfigData] = useState(
    customer?.metafields?.saved_configurations || ''
  );
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!customer) {
      setMessage({ type: 'error', text: 'Please login to save configurations' });
      return;
    }

    // Validate JSON format
    try {
      if (configData.trim()) {
        JSON.parse(configData);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Invalid JSON format. Please check your data.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/apps/configurator/api/update-metafield', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Shop-Domain': shop.domain
        },
        body: JSON.stringify({
          customer_id: customer.id,
          namespace: 'custom',
          key: 'saved_configurations',
          value: configData,
          type: 'multi_line_text_field'
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Configuration updated successfully!' });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update configuration' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }, [customer, shop.domain, configData]);

  return (
    <div className="configurator-widget" style={{ '--primary-color': settings.primaryColor } as React.CSSProperties}>
      <div className="configurator-header">
        <h3 style={{ color: settings.primaryColor }}>{settings.title}</h3>
        {settings.description && (
          <p className="configurator-description">{settings.description}</p>
        )}
      </div>

      {/* Customer Information Section */}
      <div className="customer-info-section">
        {customer ? (
          <div className="customer-welcome">
            <h4 style={{ color: settings.primaryColor }}>
              Welcome back, {customer.firstName || customer.email}! 👋
            </h4>

            {settings.showCustomerDetails && (
              <div className="customer-details">
                {(customer.firstName || customer.lastName) && (
                  <p><strong>Name:</strong> {customer.firstName} {customer.lastName}</p>
                )}
              </div>
            )}

            {settings.showMetafields && (
              <div className="customer-metafields">
                <h5>Your Saved Configurations:</h5>
                <div className="metafields-grid">
                  {customer.metafields?.saved_configurations ? (
                    <div className="metafield-item">
                      <span className="metafield-label">Configurations:</span>
                      <span className="metafield-value" style={{ color: settings.primaryColor }}>
                        {customer.metafields.saved_configurations.substring(0, 100)}...
                      </span>
                    </div>
                  ) : (
                    <p className="no-metafields">No saved configurations yet. Create your first configuration below!</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="customer-login-prompt" style={{ borderLeftColor: settings.primaryColor }}>
            <p>
              👤 <a href="/account/login" style={{ color: settings.primaryColor }}>Login</a> or{' '}
              <a href="/account/register" style={{ color: settings.primaryColor }}>create an account</a> to save your preferences and see personalized recommendations.
            </p>
          </div>
        )}
      </div>

      {customer && (
        <div className="configurator-form">
          <h5>Edit Your Configuration Data:</h5>

          <div className="configurator-option">
            <label htmlFor={`configurator-metafield-${blockId}`}>
              Saved Configurations (JSON):
            </label>
            <textarea
              id={`configurator-metafield-${blockId}`}
              name="saved_configurations"
              rows={8}
              className="configurator-textarea"
              placeholder="Enter your configuration data in JSON format..."
              value={configData}
              onChange={(e) => setConfigData(e.target.value)}
            />
            <small style={{ color: '#666' }}>
              Edit the JSON data above directly. Make sure to keep valid JSON format.
            </small>
          </div>

          <div className="configurator-actions">
            <button
              type="button"
              className="configurator-submit-btn"
              style={{ backgroundColor: settings.primaryColor }}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Configuration Data'}
            </button>
          </div>

          {message && (
            <div
              className={`configurator-message ${message.type}`}
              style={{
                borderColor: message.type === 'success' ? settings.primaryColor : '#dc3545',
                color: message.type === 'success' ? settings.primaryColor : '#dc3545'
              }}
            >
              {message.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConfiguratorWidget;
/**
 * Service for updating and retrieving customer metafields
 * Uses the backend API to interact with Shopify Admin API
 */

export interface UpdateMetafieldResult {
  success: boolean
  error?: string
}

/**
 * Update a customer metafield via backend API
 */
export const updateCustomerMetafield = async (
  namespace: string,
  key: string,
  value: string,
  type: string = 'json'
): Promise<UpdateMetafieldResult> => {
  try {
    // Get customer ID from window.ConfiguratorConfig
    const widgetConfigs = (window as any).ConfiguratorConfig
    if (!widgetConfigs) {
      console.error('No ConfiguratorConfig found')
      return { success: false, error: 'Customer configuration not found' }
    }

    const firstBlockId = Object.keys(widgetConfigs)[0]
    const customer = widgetConfigs[firstBlockId]?.customer

    if (!customer?.id) {
      console.error('No customer ID found in ConfiguratorConfig')
      return { success: false, error: 'Customer ID not found' }
    }

    console.log('💾 Updating customer metafield:', { namespace, key, customer_id: customer.id })

    const response = await fetch('/apps/configurator/api/update-metafield', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_id: customer.id,
        namespace,
        key,
        value,
        type,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ HTTP error updating metafield:', response.status, errorText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.error || !result.success) {
      console.error('❌ Backend error updating metafield:', result.error, result.details)
      return { success: false, error: result.error || 'Update failed' }
    }

    // Update the cached window.ConfiguratorConfig with the new value
    const metafieldKey = `${namespace}.${key}`
    if (customer.metafields) {
      customer.metafields[metafieldKey] = value
      console.log('🔄 Updated cached metafield in window.ConfiguratorConfig')
    }

    console.log('✅ Customer metafield updated successfully')
    return { success: true }
  } catch (error) {
    console.error('💥 Error updating customer metafield:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get a customer metafield value
 * This assumes the metafield is already loaded with the customer data
 */
export const getCustomerMetafield = async (
  namespace: string,
  key: string
): Promise<string | null> => {
  try {
    // Get customer data from window.ConfiguratorConfig
    const widgetConfigs = (window as any).ConfiguratorConfig
    if (!widgetConfigs) {
      console.warn('No ConfiguratorConfig found')
      return null
    }

    const firstBlockId = Object.keys(widgetConfigs)[0]
    const customer = widgetConfigs[firstBlockId]?.customer

    if (!customer) {
      console.warn('No customer found in ConfiguratorConfig')
      return null
    }

    // Look for the metafield in customer.metafields
    const metafieldKey = `${namespace}.${key}`
    const metafieldValue = customer.metafields?.[metafieldKey]

    return metafieldValue || null
  } catch (error) {
    console.error('Error getting customer metafield:', error)
    return null
  }
}

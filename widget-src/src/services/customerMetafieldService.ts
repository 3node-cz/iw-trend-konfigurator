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
    const response = await fetch('/apps/configurator/api/update-metafield', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        namespace,
        key,
        value,
        type,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.error) {
      return { success: false, error: result.error }
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating customer metafield:', error)
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

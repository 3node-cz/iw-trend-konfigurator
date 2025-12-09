import { SHOPIFY_CONFIG } from '../config/shopify'

// Customer types
export interface ShopifyCustomer {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  acceptsMarketing: boolean
  metafields: CustomerMetafield[]
}

export interface CustomerMetafield {
  namespace: string
  key: string
  value: string
  type: string
}

// Customer SKU-specific pricing
export interface CustomerSkuPricing {
  p: number  // Discounted price
  d: number  // Discount percentage
  b: number  // Base price
}

// Customer pricing data from metafield
export interface CustomerPricingData {
  [sku: string]: CustomerSkuPricing
}

// Specific customer data we need for orders
export interface CustomerOrderData {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string

  // Custom metafields for order defaults
  defaultCompany?: string
  defaultTransferLocation?: string
  defaultCostCenter?: string
  defaultCuttingCenter?: string
  defaultDeliveryMethod?: string
  defaultProcessingType?: string

  // Pricing data (from tags and metafields)
  tags?: string[]  // Customer tags (e.g., "discount_group:20_ZAK")
  pricesMetafield?: CustomerPricingData  // SKU-specific pricing
}

/**
 * Get the currently logged-in customer using Customer Access Token
 * This works with Shopify Storefront API
 */
export const getCurrentCustomer = async (customerAccessToken: string): Promise<ShopifyCustomer | null> => {
  const query = `
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        email
        firstName
        lastName
        phone
        acceptsMarketing
        metafields(identifiers: [
          {namespace: "custom", key: "default_company"},
          {namespace: "custom", key: "default_transfer_location"},
          {namespace: "custom", key: "default_cost_center"},
          {namespace: "custom", key: "default_cutting_center"},
          {namespace: "custom", key: "default_delivery_method"},
          {namespace: "custom", key: "default_processing_type"}
        ]) {
          namespace
          key
          value
          type
        }
      }
    }
  `

  try {
    const response = await fetch(SHOPIFY_CONFIG.SHOP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.STOREFRONT_API_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: { customerAccessToken }
      })
    })

    const data = await response.json()

    if (data.errors) {
      console.error('GraphQL errors:', data.errors)
      return null
    }

    return data.data?.customer || null
  } catch (error) {
    console.error('Error fetching customer:', error)
    return null
  }
}

/**
 * Convert Shopify customer data to our CustomerOrderData format
 */
export const convertToCustomerOrderData = (customer: ShopifyCustomer): CustomerOrderData => {
  const getMetafieldValue = (namespace: string, key: string): string | undefined => {
    return customer.metafields.find(m => m.namespace === namespace && m.key === key)?.value
  }

  return {
    id: customer.id,
    email: customer.email,
    firstName: customer.firstName,
    lastName: customer.lastName,
    phone: customer.phone,

    // Map metafields to order defaults
    defaultCompany: getMetafieldValue('custom', 'default_company') || 'IW TREND, s.r.o',
    defaultTransferLocation: getMetafieldValue('custom', 'default_transfer_location'),
    defaultCostCenter: getMetafieldValue('custom', 'default_cost_center'),
    defaultCuttingCenter: getMetafieldValue('custom', 'default_cutting_center'),
    defaultDeliveryMethod: getMetafieldValue('custom', 'default_delivery_method'),
    defaultProcessingType: getMetafieldValue('custom', 'default_processing_type')
  }
}

/**
 * Get customer access token from browser storage or URL
 * In a Shopify app, this would typically come from:
 * 1. localStorage (if stored after login)
 * 2. URL parameters (if passed from Shopify)
 * 3. Shopify App Bridge context
 */
export const getCustomerAccessToken = (): string | null => {
  // Method 1: Check localStorage
  const stored = localStorage.getItem('shopify_customer_access_token')
  if (stored) {
    return stored
  }

  // Method 2: Check URL parameters (common in Shopify apps)
  const urlParams = new URLSearchParams(window.location.search)
  const tokenFromUrl = urlParams.get('customer_access_token')
  if (tokenFromUrl) {
    // Store for future use
    localStorage.setItem('shopify_customer_access_token', tokenFromUrl)
    return tokenFromUrl
  }

  // Method 3: Check if running in Shopify context
  // This would be implemented based on your Shopify app setup
  return null
}

/**
 * Check if customer is logged in and return customer data
 */
export const getLoggedInCustomer = async (): Promise<CustomerOrderData | null> => {
  const token = getCustomerAccessToken()
  if (!token) {
    return null
  }

  const customer = await getCurrentCustomer(token)
  if (!customer) {
    return null
  }

  return convertToCustomerOrderData(customer)
}

/**
 * Store customer access token (called after successful login)
 */
export const storeCustomerAccessToken = (token: string): void => {
  localStorage.setItem('shopify_customer_access_token', token)
}

/**
 * Clear customer session (logout)
 */
export const clearCustomerSession = (): void => {
  localStorage.removeItem('shopify_customer_access_token')
}

/**
 * Fetch customer data by ID - using mock data for testing
 */
export const getCustomerById = async (customerId: string): Promise<CustomerOrderData | null> => {
  const numericId = customerId.replace('gid://shopify/Customer/', '')


  // Test data for development
  if (numericId === '24045487456638') {
    const mockCustomer: ShopifyCustomer = {
      id: `gid://shopify/Customer/${numericId}`,
      email: 'michal.bajcar@example.com',
      firstName: 'Michal',
      lastName: 'Bajcar',
      phone: '+421903123456',
      acceptsMarketing: true,
      metafields: [
        { namespace: 'custom', key: 'default_company', value: 'IW TREND, s.r.o', type: 'single_line_text_field' },
        { namespace: 'custom', key: 'default_transfer_location', value: 'CEN - IW TREND, s.r.o., Pri majerí 6, Bratislava', type: 'single_line_text_field' },
        { namespace: 'custom', key: 'default_cost_center', value: 'Bratislava', type: 'single_line_text_field' },
        { namespace: 'custom', key: 'default_cutting_center', value: 'Bratislava', type: 'single_line_text_field' },
        { namespace: 'custom', key: 'default_delivery_method', value: 'Osobný odber', type: 'single_line_text_field' },
        { namespace: 'custom', key: 'default_processing_type', value: 'Uskladniť', type: 'single_line_text_field' }
      ]
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return convertToCustomerOrderData(mockCustomer)
  }

  return null
}


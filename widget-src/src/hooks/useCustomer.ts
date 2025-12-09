import { useState, useEffect } from 'react'
import type { CustomerOrderData } from '../services/customerApi'

// Shopify widget customer data from window.ConfiguratorConfig
interface ShopifyCustomerData {
  id: string
  firstName: string
  lastName: string
  email: string
  tags?: string[]  // Customer tags (e.g., ["discount_group:20_ZAK"])
  metafields: {
    saved_configurations?: string
    prices?: string  // JSON string with SKU-specific pricing
  }
}

interface UseCustomerReturn {
  customer: CustomerOrderData | null
  isLoading: boolean
  isLoggedIn: boolean
  logout: () => void
  refreshCustomer: () => Promise<void>
  testCustomer: () => Promise<void>
}

/**
 * Convert Shopify widget customer data to CustomerOrderData format
 */
const convertShopifyCustomerToOrderData = (shopifyCustomer: ShopifyCustomerData): CustomerOrderData => {
  // Parse prices metafield if it exists
  let pricesMetafield = undefined
  if (shopifyCustomer.metafields.prices) {
    try {
      const parsed = JSON.parse(shopifyCustomer.metafields.prices)
      // Validate structure - should be an object (not array, not null)
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        // Basic validation: check if it has the expected SKU -> {p, d, b} structure
        const isValid = Object.values(parsed).every((value: any) =>
          typeof value === 'object' &&
          typeof value.p === 'number' &&
          typeof value.d === 'number' &&
          typeof value.b === 'number'
        )
        if (isValid) {
          pricesMetafield = parsed
        } else {
          console.error('❌ Invalid prices metafield structure: expected {sku: {p, d, b}}')
        }
      } else {
        console.error('❌ Invalid prices metafield structure: expected object, got', typeof parsed)
      }
    } catch (error) {
      console.error('❌ Failed to parse customer prices metafield:', error)
    }
  }

  return {
    id: shopifyCustomer.id,
    email: shopifyCustomer.email,
    firstName: shopifyCustomer.firstName,
    lastName: shopifyCustomer.lastName,
    phone: undefined, // Not available in widget data

    // Use default values for order defaults (these would be configured via metafields in future)
    defaultCompany: 'IW TREND, s.r.o',
    defaultTransferLocation: 'CEN - IW TREND, s.r.o., Pri majerí 6, Bratislava',
    defaultCostCenter: 'Bratislava',
    defaultCuttingCenter: 'Bratislava',
    defaultDeliveryMethod: 'Osobný odber',
    defaultProcessingType: 'Uskladniť',

    // Pricing data
    tags: shopifyCustomer.tags || [],
    pricesMetafield
  }
}

/**
 * Hook to manage customer authentication and data using Shopify widget data
 */
export const useCustomer = (): UseCustomerReturn => {
  const [customer, setCustomer] = useState<CustomerOrderData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadCustomerFromShopify = async () => {
    setIsLoading(true)
    try {
      // Fetch customer data from backend API
      const response = await fetch('/apps/configurator/api/customer-data')
      const result = await response.json()

      if (result.success && result.customer) {
        const customerData = convertShopifyCustomerToOrderData(result.customer)
        setCustomer(customerData)
        console.log('✅ Customer loaded from API:', {
          id: customerData.id,
          tagsCount: customerData.tags?.length || 0,
          hasPrices: !!customerData.pricesMetafield
        })
      } else {
        setCustomer(null)
      }
    } catch (error) {
      console.error('Error loading customer from API:', error)
      setCustomer(null)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // In Shopify widget context, logout would redirect to Shopify login
    console.log('Logout not implemented in widget context')
    setCustomer(null)
  }

  const refreshCustomer = async () => {
    loadCustomerFromShopify()
  }

  const testCustomer = async () => {
    setIsLoading(true)
    try {
      // Create test customer data for development
      const testCustomerData: CustomerOrderData = {
        id: 'gid://shopify/Customer/24045487456638',
        email: 'michal.bajcar@example.com',
        firstName: 'Michal',
        lastName: 'Bajcar',
        phone: '+421903123456',
        defaultCompany: 'IW TREND, s.r.o',
        defaultTransferLocation: 'CEN - IW TREND, s.r.o., Pri majerí 6, Bratislava',
        defaultCostCenter: 'Bratislava',
        defaultCuttingCenter: 'Bratislava',
        defaultDeliveryMethod: 'Osobný odber',
        defaultProcessingType: 'Uskladniť',
        tags: ['discount_group:25_ZAK']  // Use tag-based discount instead
      }
      setCustomer(testCustomerData)
    } catch (error) {
      console.error('Error loading test customer:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load customer on mount
  useEffect(() => {
    loadCustomerFromShopify()
  }, [])

  return {
    customer,
    isLoading,
    isLoggedIn: !!customer,
    logout,
    refreshCustomer,
    testCustomer
  }
}
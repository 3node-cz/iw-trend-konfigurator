import { useState, useEffect } from 'react'
import type { CustomerOrderData } from '../services/customerApi'

// Shopify widget customer data from window.ConfiguratorConfig
interface ShopifyCustomerData {
  id: string
  firstName: string
  lastName: string
  email: string
  metafields: {
    saved_configurations?: string
    discount_percentage?: string
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

    // Use discount percentage from Shopify metafield
    discountPercentage: shopifyCustomer.metafields.discount_percentage
      ? parseFloat(shopifyCustomer.metafields.discount_percentage)
      : 0
  }
}

/**
 * Hook to manage customer authentication and data using Shopify widget data
 */
export const useCustomer = (): UseCustomerReturn => {
  const [customer, setCustomer] = useState<CustomerOrderData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadCustomerFromShopify = () => {
    setIsLoading(true)
    try {
      // Get customer data from Shopify widget configuration
      const widgetConfigs = (window as any).ConfiguratorConfig
      if (widgetConfigs) {
        // Get the first available widget config (or you could pass blockId as parameter)
        const firstBlockId = Object.keys(widgetConfigs)[0]
        const config = widgetConfigs[firstBlockId]

        if (config?.customer) {
          const customerData = convertShopifyCustomerToOrderData(config.customer)
          setCustomer(customerData)
        } else {
          setCustomer(null)
        }
      } else {
        setCustomer(null)
      }
    } catch (error) {
      console.error('Error loading customer from Shopify:', error)
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
        discountPercentage: 25
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
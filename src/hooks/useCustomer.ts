import { useState, useEffect } from 'react'
import { getLoggedInCustomer, clearCustomerSession, getCustomerById } from '../services/customerApi'
import type { CustomerOrderData } from '../services/customerApi'

interface UseCustomerReturn {
  customer: CustomerOrderData | null
  isLoading: boolean
  isLoggedIn: boolean
  logout: () => void
  refreshCustomer: () => Promise<void>
  testCustomer: () => Promise<void>
}

/**
 * Hook to manage customer authentication and data
 */
export const useCustomer = (): UseCustomerReturn => {
  const [customer, setCustomer] = useState<CustomerOrderData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadCustomer = async () => {
    setIsLoading(true)
    try {
      const customerData = await getLoggedInCustomer()
      setCustomer(customerData)
    } catch (error) {
      console.error('Error loading customer:', error)
      setCustomer(null)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    clearCustomerSession()
    setCustomer(null)
  }

  const refreshCustomer = async () => {
    await loadCustomer()
  }

  const testCustomer = async () => {
    setIsLoading(true)
    try {
      const testCustomerData = await getCustomerById('24045487456638')
      setCustomer(testCustomerData)
    } catch (error) {
      console.error('Error loading test customer:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load customer on mount
  useEffect(() => {
    loadCustomer()
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
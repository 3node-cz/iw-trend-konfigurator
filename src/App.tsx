import React, { useState } from 'react'
import { Container } from '@mui/material'
import OrdersPage from './components/OrdersPage'
import MaterialSelectionPage from './components/MaterialSelectionPage'
import CuttingSpecificationPage from './components/CuttingSpecificationPage'
import OrderRecapitulationPage from './components/OrderRecapitulationPage'
import { submitOrderToShopify } from './services/shopifyApi'
import type { SelectedMaterial, OrderFormData, MaterialSearchResult, CuttingSpecification } from './types/shopify'

type AppView = 'orders' | 'material-selection' | 'cutting-specification' | 'recapitulation'

interface CompleteOrder {
  order: OrderFormData
  specification: CuttingSpecification
  submittedAt: Date
}

function App() {
  const [currentView, setCurrentView] = useState<AppView>('orders')
  const [currentOrder, setCurrentOrder] = useState<OrderFormData | null>(null)
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialSearchResult | null>(null)
  const [cuttingSpecification, setCuttingSpecification] = useState<CuttingSpecification | null>(null)

  const handleOrderCreated = (orderData: OrderFormData) => {
    setCurrentOrder(orderData)
    setCurrentView('material-selection')
  }

  const handleBackToOrders = () => {
    setCurrentView('orders')
    setCurrentOrder(null)
    setSelectedMaterial(null)
    setCuttingSpecification(null)
  }

  const handleBackToMaterialSelection = () => {
    setCurrentView('material-selection')
    setSelectedMaterial(null)
    setCuttingSpecification(null)
  }

  const handleBackToCuttingSpecification = () => {
    setCurrentView('cutting-specification')
  }

  const handleMaterialSelectionComplete = (selectedMaterials: SelectedMaterial[]) => {
    // For now, take the first selected material to proceed to cutting specification
    // TODO: Handle multiple materials - create separate cutting spec for each
    if (selectedMaterials.length > 0) {
      // Convert SelectedMaterial back to MaterialSearchResult format
      const materialResult: MaterialSearchResult = {
        id: selectedMaterials[0].id,
        code: selectedMaterials[0].code,
        name: selectedMaterials[0].name,
        productCode: '', // Would need to store this
        availability: 'available' as const,
        warehouse: '',
        price: {
          amount: selectedMaterials[0].price,
          currency: 'EUR',
          perUnit: '/ ks'
        },
        totalPrice: {
          amount: selectedMaterials[0].totalPrice,
          currency: 'EUR'
        },
        quantity: selectedMaterials[0].quantity
      }
      
      setSelectedMaterial(materialResult)
      setCurrentView('cutting-specification')
    }
  }

  const handleCuttingSpecificationComplete = (specification: CuttingSpecification) => {
    setCuttingSpecification(specification)
    setCurrentView('recapitulation')
  }

  const handleOrderSubmit = async (completeOrder: CompleteOrder) => {
    try {
      // Submit order to Shopify
      await submitOrderToShopify(completeOrder)
      
      // Reset state and go back to orders
      setCurrentView('orders')
      setCurrentOrder(null)
      setSelectedMaterial(null)
      setCuttingSpecification(null)
    } catch (error) {
      console.error('Failed to submit order:', error)
      // Handle error - could show error message to user
    }
  }

  return (
    <Container maxWidth={false} disableGutters>
      {currentView === 'orders' && (
        <OrdersPage onOrderCreated={handleOrderCreated} />
      )}
      {currentView === 'material-selection' && currentOrder && (
        <MaterialSelectionPage
          orderName={currentOrder.orderName}
          onBack={handleBackToOrders}
          onContinue={handleMaterialSelectionComplete}
        />
      )}
      {currentView === 'cutting-specification' && currentOrder && selectedMaterial && (
        <CuttingSpecificationPage
          material={selectedMaterial}
          orderName={currentOrder.orderName}
          onBack={handleBackToMaterialSelection}
          onContinue={handleCuttingSpecificationComplete}
        />
      )}
      {currentView === 'recapitulation' && currentOrder && cuttingSpecification && (
        <OrderRecapitulationPage
          order={currentOrder}
          specification={cuttingSpecification}
          onBack={handleBackToCuttingSpecification}
          onSubmitOrder={handleOrderSubmit}
        />
      )}
    </Container>
  )
}

export default App
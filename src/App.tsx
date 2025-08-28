import React, { useState } from 'react'
import { Container } from '@mui/material'
import OrdersPage from './components/OrdersPage'
import MaterialSelectionPage from './components/MaterialSelectionPage'
import type { SelectedMaterial, OrderFormData } from './types/shopify'

type AppView = 'orders' | 'material-selection'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('orders')
  const [currentOrder, setCurrentOrder] = useState<OrderFormData | null>(null)

  const handleOrderCreated = (orderData: OrderFormData) => {
    setCurrentOrder(orderData)
    setCurrentView('material-selection')
  }

  const handleBackToOrders = () => {
    setCurrentView('orders')
    setCurrentOrder(null)
  }

  const handleMaterialSelectionComplete = (selectedMaterials: SelectedMaterial[]) => {
    // TODO: Save order with materials
    console.log('Order completed with materials:', { order: currentOrder, materials: selectedMaterials })
    setCurrentView('orders')
    setCurrentOrder(null)
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
    </Container>
  )
}

export default App
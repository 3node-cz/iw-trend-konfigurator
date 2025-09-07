import { useState } from 'react'
import { Container } from '@mui/material'
import OrdersPage from './components/OrdersPage'
import MaterialSelectionPage from './components/MaterialSelectionPage'
import CuttingSpecificationPage from './components/CuttingSpecificationPage'
import OrderRecapitulationPage from './components/OrderRecapitulationPage'
import CuttingLayoutDemo from './components/CuttingLayoutDemo'
import { submitOrderToShopify } from './services/shopifyApi'
import type { SelectedMaterial, OrderFormData, CuttingSpecification, CompleteOrder } from './types/shopify'

type AppView = 'orders' | 'material-selection' | 'cutting-specification' | 'recapitulation' | 'cutting-demo'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('orders')
  const [currentOrder, setCurrentOrder] = useState<OrderFormData | null>(null)
  const [selectedMaterials, setSelectedMaterials] = useState<SelectedMaterial[]>([])
  const [cuttingSpecifications, setCuttingSpecifications] = useState<CuttingSpecification[]>([])

  const handleOrderCreated = (orderData: OrderFormData) => {
    setCurrentOrder(orderData)
    setCurrentView('material-selection')
    // Scroll to top when navigating to material selection
    window.scrollTo(0, 0)
  }

  const handleBackToOrders = () => {
    setCurrentView('orders')
    setCurrentOrder(null)
    setSelectedMaterials([])
    setCuttingSpecifications([])
    // Scroll to top when going back to orders
    window.scrollTo(0, 0)
  }

  const handleBackToMaterialSelection = () => {
    setCurrentView('material-selection')
    // Don't reset selectedMaterials or cutting specs - preserve them when going back
    window.scrollTo(0, 0)
  }

  const handleBackToCuttingSpecification = () => {
    setCurrentView('cutting-specification')
    window.scrollTo(0, 0)
  }

  const handleMaterialSelectionComplete = (materials: SelectedMaterial[]) => {
    // Store all selected materials
    setSelectedMaterials(materials)
    
    if (materials.length > 0) {
      setCurrentView('cutting-specification')
      window.scrollTo(0, 0)
    }
  }

  const handleCuttingSpecificationComplete = (specifications: CuttingSpecification[]) => {
    // Save all cutting specifications
    setCuttingSpecifications(specifications)
    setCurrentView('recapitulation')
    window.scrollTo(0, 0)
  }

  const handleOrderSubmit = async (completeOrder: CompleteOrder) => {
    try {
      // Submit order to Shopify
      await submitOrderToShopify(completeOrder)
      
      // Reset state and go back to orders
      setCurrentView('orders')
      setCurrentOrder(null)
      setSelectedMaterials([])
      setCuttingSpecifications([])
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
          initialSelectedMaterials={selectedMaterials}
          onBack={handleBackToOrders}
          onContinue={handleMaterialSelectionComplete}
        />
      )}
      {currentView === 'cutting-specification' && currentOrder && selectedMaterials.length > 0 && (
        <CuttingSpecificationPage
          materials={selectedMaterials.map(material => ({
            id: material.id,
            code: material.code,
            name: material.name,
            productCode: material.code,
            availability: 'available' as const,
            warehouse: 'Bratislava',
            price: {
              amount: material.price,
              currency: 'EUR',
              perUnit: '/ ks'
            },
            totalPrice: {
              amount: material.totalPrice,
              currency: 'EUR'
            },
            quantity: material.quantity,
            image: material.image
          }))}
          orderName={currentOrder.orderName}
          existingSpecifications={cuttingSpecifications}
          onBack={handleBackToMaterialSelection}
          onContinue={handleCuttingSpecificationComplete}
        />
      )}
      {currentView === 'recapitulation' && currentOrder && cuttingSpecifications.length > 0 && (
        <OrderRecapitulationPage
          order={currentOrder}
          specifications={cuttingSpecifications}
          onBack={handleBackToCuttingSpecification}
          onSubmitOrder={handleOrderSubmit}
        />
      )}
      {currentView === 'cutting-demo' && (
        <CuttingLayoutDemo />
      )}
    </Container>
  )
}

export default App
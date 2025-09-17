import { useState } from 'react'
import { Container, Box, Typography, CircularProgress } from '@mui/material'
import OrdersPage from './components/OrdersPage'
import MaterialSelectionPage from './components/MaterialSelectionPage'
import CuttingSpecificationPage from './components/CuttingSpecificationPage'
import OrderRecapitulationPage from './components/OrderRecapitulationPage'
import OrderSuccessPage from './components/OrderSuccessPage'
import CuttingLayoutDemo from './components/CuttingLayoutDemo'
import { submitOrderToShopify } from './services/shopifyApi'
import { loadOrderConfiguration } from './services/orderLoader'
import type {
  SelectedMaterial,
  OrderFormData,
  CuttingSpecification,
  CompleteOrder,
} from './types/shopify'
import type { SavedOrder } from './types/savedOrder'
import { useCustomer } from './hooks/useCustomer'

type AppView =
  | 'orders'
  | 'material-selection'
  | 'cutting-specification'
  | 'recapitulation'
  | 'success'
  | 'cutting-demo'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('orders')
  const [currentOrder, setCurrentOrder] = useState<OrderFormData | null>(null)
  const { customer, isLoading: customerLoading, isLoggedIn, testCustomer } = useCustomer()
  const [selectedMaterials, setSelectedMaterials] = useState<
    SelectedMaterial[]
  >([])
  const [cuttingSpecifications, setCuttingSpecifications] = useState<
    CuttingSpecification[]
  >([])
  const [checkoutUrl, setCheckoutUrl] = useState<string>('')

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
    setCheckoutUrl('')
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

  const handleCuttingSpecificationComplete = (
    specifications: CuttingSpecification[],
  ) => {
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
      setCheckoutUrl('')
    } catch (error) {
      console.error('Failed to submit order:', error)
      // Handle error - could show error message to user
    }
  }

  const handleLoadConfiguration = async (savedOrder: SavedOrder) => {
    console.log('🚀 Loading saved order configuration:', savedOrder.orderNumber)

    try {
      // Load configuration and fetch fresh material data
      const { orderInfo, specifications } = await loadOrderConfiguration(
        savedOrder,
      )

      // Set the loaded configuration into app state
      setCurrentOrder(orderInfo)
      setSelectedMaterials(
        specifications.map((spec) => ({
          id: spec.material.id,
          code: spec.material.code,
          name: spec.material.name,
          quantity: spec.pieces.reduce((sum, piece) => sum + piece.quantity, 0),
          price: spec.material.price.amount,
          totalPrice:
            spec.material.price.amount *
            spec.pieces.reduce((sum, piece) => sum + piece.quantity, 0),
          variantId: spec.material.variantId || spec.material.id,
          image: spec.material.image,
        })),
      )
      setCuttingSpecifications(specifications)

      // Navigate directly to order recap/summary
      setCurrentView('recapitulation')
      window.scrollTo(0, 0)
    } catch (error) {
      console.error('❌ Error loading configuration:', error)
      // Could show error message to user here
    }
  }

  const handleOrderSuccess = (url: string, orderName: string) => {
    setCheckoutUrl(url)
    setCurrentView('success')
    window.scrollTo(0, 0)
  }

  // Show loading spinner while customer data is being fetched
  if (customerLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Načítavam údaje...
        </Typography>
      </Container>
    )
  }

  return (
    <Container
      maxWidth={false}
      disableGutters
    >
      {/* Customer Info Bar */}
      <Box sx={{ p: 2, bgcolor: '#f5f5f5', mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isLoggedIn && customer ? (
          <Typography variant="caption">
            👤 Prihlásený: {customer.firstName} {customer.lastName} ({customer.email})
            {customer.discountPercentage > 0 && ` • Zľava: ${customer.discountPercentage}%`}
          </Typography>
        ) : (
          <Typography variant="caption">🔓 Nie je prihlásený zákazník</Typography>
        )}
        <button onClick={testCustomer} style={{ padding: '4px 8px', fontSize: '11px' }}>
          Test Customer 24045487456638
        </button>
      </Box>

      {currentView === 'orders' && (
        <OrdersPage
          onOrderCreated={handleOrderCreated}
          onLoadConfiguration={handleLoadConfiguration}
          customer={customer}
        />
      )}
      {currentView === 'material-selection' && currentOrder && (
        <MaterialSelectionPage
          orderName={currentOrder.orderName}
          initialSelectedMaterials={selectedMaterials}
          onBack={handleBackToOrders}
          onContinue={handleMaterialSelectionComplete}
        />
      )}
      {currentView === 'cutting-specification' &&
        currentOrder &&
        selectedMaterials.length > 0 && (
          <CuttingSpecificationPage
            materials={selectedMaterials.map((material) => ({
              id: material.id,
              code: material.code,
              name: material.name,
              productCode: material.code,
              availability: 'available' as const,
              warehouse: 'Bratislava',
              price: {
                amount: material.price,
                currency: 'EUR',
                perUnit: '/ ks',
              },
              totalPrice: {
                amount: material.totalPrice,
                currency: 'EUR',
              },
              quantity: material.quantity,
              image: material.image,
            }))}
            orderName={currentOrder.orderName}
            existingSpecifications={cuttingSpecifications}
            onBack={handleBackToMaterialSelection}
            onContinue={handleCuttingSpecificationComplete}
          />
        )}
      {currentView === 'recapitulation' &&
        currentOrder &&
        cuttingSpecifications.length > 0 && (
          <OrderRecapitulationPage
            order={currentOrder}
            specifications={cuttingSpecifications}
            onBack={handleBackToCuttingSpecification}
            onSubmitOrder={handleOrderSubmit}
            onOrderSuccess={handleOrderSuccess}
          />
        )}
      {currentView === 'success' && currentOrder && checkoutUrl && (
        <OrderSuccessPage
          checkoutUrl={checkoutUrl}
          orderName={currentOrder.orderName}
          onCreateNewOrder={handleBackToOrders}
        />
      )}
      {currentView === 'cutting-demo' && <CuttingLayoutDemo />}
    </Container>
  )
}

export default App

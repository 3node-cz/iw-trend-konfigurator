import { useState, useEffect } from 'react'
import { Container, Box, Typography, CircularProgress, ThemeProvider, Backdrop } from '@mui/material'
import OrdersPage from './components/OrdersPage'
import MaterialSelectionPage from './components/MaterialSelectionPage'
import CuttingSpecificationPage from './components/CuttingSpecificationPage'
import OrderRecapitulationPage from './components/OrderRecapitulationPage'
import OrderSuccessPage from './components/OrderSuccessPage'
import CuttingLayoutDemo from './components/CuttingLayoutDemo'
import { ApiTestForm } from './components/ApiTestForm'
import { submitOrderToShopify } from './services/shopifyApi'
import { loadOrderConfiguration } from './services/orderLoader'
import { transformToSelectedMaterial } from './utils/data-transformation'
import { theme } from './theme/theme'
import type {
  SelectedMaterial,
  OrderFormData,
  CuttingSpecification,
  CompleteOrder,
  MaterialSearchResult,
} from './types/shopify'
import type { SavedConfiguration, AppView } from './types/optimized-saved-config'
import { useCustomer } from './hooks/useCustomer'
import { useScrollIntoView } from './hooks/useScrollIntoView'

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
  const [loadingConfiguration, setLoadingConfiguration] = useState(false)

  // Scroll functionality
  const { scrollToWidget } = useScrollIntoView({
    behavior: 'smooth',
    offset: 20
  })

  // Scroll to widget whenever the view changes (step changes)
  useEffect(() => {
    if (currentView !== 'orders') {
      // Small delay to ensure content is rendered before scrolling
      const timer = setTimeout(() => {
        scrollToWidget()
      }, 200)

      return () => clearTimeout(timer)
    }
  }, [currentView, scrollToWidget])

  const handleOrderCreated = (orderData: OrderFormData) => {
    setCurrentOrder(orderData)
    setCurrentView('material-selection')
  }

  const handleBackToOrders = () => {
    setCurrentView('orders')
    setCurrentOrder(null)
    setSelectedMaterials([])
    setCuttingSpecifications([])
    setCheckoutUrl('')
  }

  const handleBackToMaterialSelection = () => {
    setCurrentView('material-selection')
    // Don't reset selectedMaterials or cutting specs - preserve them when going back
  }

  const handleBackToCuttingSpecification = () => {
    setCurrentView('cutting-specification')
  }

  const handleMaterialSelectionComplete = (materials: SelectedMaterial[]) => {
    // Store all selected materials
    setSelectedMaterials(materials)

    // Clean up cutting specifications for materials that were removed
    const materialIds = new Set(materials.map(m => m.id))
    setCuttingSpecifications(prevSpecs =>
      prevSpecs.filter(spec => materialIds.has(spec.material.id))
    )

    if (materials.length > 0) {
      setCurrentView('cutting-specification')
    }
  }

  const handleAddMaterialToCuttingSpec = (material: SelectedMaterial) => {
    // Add the new material to the selected materials list
    setSelectedMaterials(prevMaterials => {
      // Check if material is already in the list (by id)
      const exists = prevMaterials.find(m => m.id === material.id)
      if (exists) {
        return prevMaterials
      }

      return [...prevMaterials, material]
    })
  }

  const handleRemoveMaterialFromCuttingSpec = (materialId: string) => {
    // Remove the material from the selected materials list
    setSelectedMaterials(prevMaterials => {
      return prevMaterials.filter(m => m.id !== materialId)
    })

    // Also remove any cutting specifications for this material
    setCuttingSpecifications(prevSpecs => {
      return prevSpecs.filter(spec => spec.material.id !== materialId)
    })
  }

  const handleCuttingSpecificationComplete = (
    specifications: CuttingSpecification[],
  ) => {
    // Save all cutting specifications
    setCuttingSpecifications(specifications)
    setCurrentView('recapitulation')
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

  const handleLoadConfiguration = async (savedOrder: SavedConfiguration) => {
    setLoadingConfiguration(true)
    try {
      // Load configuration and fetch fresh material data
      const { orderInfo, specifications } = await loadOrderConfiguration(
        savedOrder,
      )

      // Check if we have any valid specifications
      if (specifications.length === 0) {
        alert('Nie je možné načítať uložené nastavenie. Materiály už nie sú dostupné v obchode.')
        return
      }

      // Set the loaded configuration into app state - fix date deserialization
      const fixedOrderInfo = {
        ...orderInfo,
        deliveryDate: new Date(orderInfo.deliveryDate) // Convert string back to Date object
      };
      setCurrentOrder(fixedOrderInfo)

      setSelectedMaterials(
        specifications.map((spec, index) => {
          try {
            const quantity = spec.pieces.reduce((sum, piece) => sum + piece.quantity, 0);
            return transformToSelectedMaterial(spec.material, quantity);
          } catch (err) {
            console.error(`Error processing spec ${index}:`, err, spec.material);
            throw err;
          }
        }),
      )
      setCuttingSpecifications(specifications)

      // Navigate to the step where the order was saved, or recapitulation as fallback
      const targetView = savedOrder.savedFromStep || 'recapitulation'
      setCurrentView(targetView)
    } catch (error) {
      console.error('Error loading configuration:', error)
      alert('Chyba pri načítaní uloženej konfigurácie.')
    } finally {
      setLoadingConfiguration(false)
    }
  }

  const handleOrderSuccess = (url: string, orderName: string) => {
    setCheckoutUrl(url)
    setCurrentView('success')
  }

  // Show loading spinner while customer data is being fetched
  if (customerLoading) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Načítavam údaje...
          </Typography>
        </Container>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
    <Container
      maxWidth={false}
      disableGutters
    >
      {/* API Test Form - Hidden for now */}
      {/* <ApiTestForm /> */}

      {/* Customer Info Bar - Debug Metafields - Hidden for now */}
      {/* <Box sx={{ p: 2, bgcolor: '#f5f5f5', mb: 1 }}>
        {isLoggedIn && customer ? (
          <Box>
            <Typography variant="caption" sx={{ display: 'block' }}>
              👤 Customer: {customer.firstName} {customer.lastName} ({customer.email})
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
              🔧 Debug Metafields:
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', ml: 2 }}>
              • discount_percentage: {String(customer.discountPercentage || 'not set')}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', ml: 2, fontFamily: 'monospace' }}>
              • saved_configurations: {(() => {
                try {
                  // Get raw Shopify data to show saved_configurations metafield
                  const widgetConfigs = (window as any).ConfiguratorConfig;
                  if (widgetConfigs) {
                    const firstBlockId = Object.keys(widgetConfigs)[0];
                    const config = widgetConfigs[firstBlockId];
                    const savedConfigs = config?.customer?.metafields?.saved_configurations;
                    if (savedConfigs !== undefined && savedConfigs !== null) {
                      // Decode HTML entities and format JSON
                      if (typeof savedConfigs === 'string') {
                        // Decode HTML entities like &quot; to "
                        const decodedString = savedConfigs
                          .replace(/&quot;/g, '"')
                          .replace(/&amp;/g, '&')
                          .replace(/&lt;/g, '<')
                          .replace(/&gt;/g, '>')
                          .replace(/&#39;/g, "'");

                        // Try to parse and format as pretty JSON
                        try {
                          const parsed = JSON.parse(decodedString);
                          const formatted = JSON.stringify(parsed, null, 2);
                          return formatted.length > 100
                            ? JSON.stringify(parsed) // Single line if too long
                            : formatted;
                        } catch {
                          // If not valid JSON, return decoded string
                          return decodedString.length > 100
                            ? decodedString.substring(0, 100) + '...'
                            : decodedString;
                        }
                      } else if (typeof savedConfigs === 'object') {
                        const jsonString = JSON.stringify(savedConfigs, null, 2);
                        return jsonString.length > 100
                          ? JSON.stringify(savedConfigs) // Single line if too long
                          : jsonString;
                      } else {
                        return String(savedConfigs);
                      }
                    }
                    return 'not set';
                  }
                  return 'not available';
                } catch (error) {
                  return 'error reading metafield';
                }
              })()}
            </Typography>
          </Box>
        ) : (
          <Typography variant="caption">🔓 Nie je prihlásený zákazník</Typography>
        )}
      </Box> */}

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
          orderData={currentOrder}
          initialSelectedMaterials={selectedMaterials}
          onBack={handleBackToOrders}
          onContinue={handleMaterialSelectionComplete}
        />
      )}
      {currentView === 'cutting-specification' &&
        currentOrder &&
        selectedMaterials.length > 0 && (
          <CuttingSpecificationPage
            key={selectedMaterials.map(m => m.id).join(',')}
            materials={selectedMaterials.map((material) => ({
              id: material.id,
              title: material.name,
              handle: material.code || 'unknown',
              vendor: '',
              productType: 'Material',
              tags: [],
              image: material.image,
              images: material.image ? [material.image] : [],
              variant: {
                id: material.variantId || material.id,
                title: material.name,
                sku: material.code || 'N/A',
                price: material.price.toString(),
                inventoryQuantity: 0,
                availableForSale: true,
                metafields: {}
              },
              metafields: {}
            } as MaterialSearchResult))}
            orderName={currentOrder.orderName}
            orderData={currentOrder}
            existingSpecifications={cuttingSpecifications}
            onBack={handleBackToMaterialSelection}
            onContinue={handleCuttingSpecificationComplete}
            onAddMaterial={handleAddMaterialToCuttingSpec}
            onRemoveMaterial={handleRemoveMaterialFromCuttingSpec}
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
          orderInfo={currentOrder}
          materials={selectedMaterials}
          specifications={cuttingSpecifications}
          onCreateNewOrder={handleBackToOrders}
        />
      )}
      {currentView === 'cutting-demo' && <CuttingLayoutDemo />}

      {/* Loading overlay for configuration loading */}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
        open={loadingConfiguration}
      >
        <CircularProgress color="inherit" size={40} />
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          Načítavam konfiguráciu...
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, textAlign: 'center', maxWidth: 300 }}>
          Získavam najnovšie údaje o materiáloch zo Shopify
        </Typography>
      </Backdrop>
    </Container>
    </ThemeProvider>
  )
}

export default App

import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import OrdersPage from "./components/OrdersPage";
import MaterialSelectionPage from "./components/MaterialSelectionPage";
import CuttingSpecificationPage from "./components/CuttingSpecificationPage";
import OrderRecapitulationPage from "./components/OrderRecapitulationPage";
import OrderSuccessPage from "./components/OrderSuccessPage";
import CuttingLayoutDemo from "./components/CuttingLayoutDemo";
import { submitOrderToShopify } from "./services/shopifyApi";
import { loadOrderConfiguration } from "./services/orderLoader";
import { transformToSelectedMaterial } from "./utils/data-transformation";
import type {
  SelectedMaterial,
  OrderFormData,
  CuttingSpecification,
  CompleteOrder,
  MaterialSearchResult,
  OrderCalculations,
} from "./types/shopify";
import type {
  SavedConfiguration,
  AppView,
} from "./types/optimized-saved-config";
import type { CuttingLayout } from "./utils/guillotineCutting";
import { useCustomer } from "./hooks/useCustomer";
import { useScrollIntoView } from "./hooks/useScrollIntoView";

function App() {
  const [currentView, setCurrentView] = useState<AppView>("orders");
  const [currentOrder, setCurrentOrder] = useState<OrderFormData | null>(null);
  const {
    customer,
    isLoading: customerLoading,
    isLoggedIn,
    testCustomer,
  } = useCustomer();

  // Get shop configuration from window.ConfiguratorConfig (already loaded by Liquid template)
  const getShopConfig = () => {
    try {
      const widgetConfigs = (window as any).ConfiguratorConfig;
      if (widgetConfigs) {
        const firstBlockId = Object.keys(widgetConfigs)[0];
        return widgetConfigs[firstBlockId]?.settings;
      }
    } catch (error) {
      console.error('Error accessing shop config:', error);
    }
    // Return defaults if not available
    return {
      cuttingConfig: { sawWidth: 2, edgeBuffer: 30, boardTrim: 15, minPieceSize: 10 },
      transferLocations: ["Bratislava", "Košice", "Žilina"],
      deliveryMethods: ["Doprava", "Osobný odber"],
      processingTypes: ["Zlikvidovať", "Osobný odber odpadu"],
    };
  };

  const shopConfig = getShopConfig();

  // Log configuration values from Shopify admin for testing
  useEffect(() => {
    console.log('⚙️ [Configuration] Shopify Admin Settings loaded:');
    console.log('   Saw Width (CUTTING_KERF):', shopConfig.cuttingConfig?.sawWidth || 'using default: 2', 'mm');
    console.log('   Edge Buffer:', shopConfig.cuttingConfig?.edgeBuffer || 'using default: 30', 'mm');
    console.log('   Board Trim:', shopConfig.cuttingConfig?.boardTrim || 'using default: 15', 'mm');
    console.log('   Minimum Piece Size:', shopConfig.cuttingConfig?.minPieceSize || 'using default: 10', 'mm');
    console.log('   Transfer Locations:', shopConfig.transferLocations);
    console.log('   Delivery Methods:', shopConfig.deliveryMethods);
    console.log('   Processing Types:', shopConfig.processingTypes);
    console.log('   Full config object:', shopConfig);
  }, [shopConfig.cuttingConfig?.sawWidth, shopConfig.cuttingConfig?.edgeBuffer, shopConfig.cuttingConfig?.boardTrim, shopConfig.cuttingConfig?.minPieceSize]);

  const [selectedMaterials, setSelectedMaterials] = useState<
    MaterialSearchResult[]
  >([]);
  const [cuttingSpecifications, setCuttingSpecifications] = useState<
    CuttingSpecification[]
  >([]);
  const [checkoutUrl, setCheckoutUrl] = useState<string>("");
  const [loadingConfiguration, setLoadingConfiguration] = useState(false);

  // View mode: 'create' for normal flow, 'view' for viewing existing orders
  const [viewMode, setViewMode] = useState<'create' | 'view'>('create');
  const [viewingOrderId, setViewingOrderId] = useState<string | null>(null);
  const [savedCuttingLayouts, setSavedCuttingLayouts] = useState<CuttingLayout[] | null>(null);
  const [savedOrderCalculations, setSavedOrderCalculations] = useState<OrderCalculations | null>(null);
  const [orderCreatedDate, setOrderCreatedDate] = useState<string | null>(null);

  // Scroll functionality
  const { scrollToWidget } = useScrollIntoView({
    behavior: "smooth",
    offset: 20,
  });

  // Scroll to widget whenever the view changes (step changes)
  useEffect(() => {
    if (currentView !== "orders") {
      // Small delay to ensure content is rendered before scrolling
      const timer = setTimeout(() => {
        scrollToWidget();
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [currentView, scrollToWidget]);

  // Check for orderId parameter in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    if (orderId) {
      console.log('🔍 Order ID detected in URL:', orderId);
      setViewingOrderId(orderId);
      setViewMode('view');
      loadOrderConfigurationById(orderId);
    }
  }, []); // Run once on mount

  const handleOrderCreated = (orderData: OrderFormData) => {
    setCurrentOrder(orderData);
    setCurrentView("cutting-specification");
  };

  const handleBackToOrders = () => {
    setCurrentView("orders");
    setCurrentOrder(null);
    setSelectedMaterials([]);
    setCuttingSpecifications([]);
    setCheckoutUrl("");
  };

  const handleBackToMaterialSelection = (
    specifications?: CuttingSpecification[],
  ) => {
    // Save specifications if provided (when coming back from cutting spec page)
    if (specifications) {
      setCuttingSpecifications(specifications);
    }
    // Go back to orders instead of material-selection (page merged)
    setCurrentView("orders");
  };

  const handleBackToCuttingSpecification = () => {
    // Ensure selectedMaterials is in sync with cuttingSpecifications
    // This prevents materials from being missing when navigating back
    if (cuttingSpecifications.length > 0) {
      setSelectedMaterials(cuttingSpecifications.map((spec) => spec.material));
    }
    setCurrentView("cutting-specification");
  };

  const handleMaterialSelectionComplete = (materials: MaterialSearchResult[]) => {
    // Store all selected materials
    setSelectedMaterials(materials);

    // Clean up cutting specifications for materials that were removed
    const materialIds = new Set(materials.map((m) => m.id));
    setCuttingSpecifications((prevSpecs) =>
      prevSpecs.filter((spec) => materialIds.has(spec.material.id)),
    );

    if (materials.length > 0) {
      setCurrentView("cutting-specification");
    }
  };

  const handleAddMaterialToCuttingSpec = (material: MaterialSearchResult) => {
    // Add the new material to the selected materials list
    setSelectedMaterials((prevMaterials) => {
      // Check if material is already in the list (by id)
      const exists = prevMaterials.find((m) => m.id === material.id);
      if (exists) {
        return prevMaterials;
      }

      return [...prevMaterials, material];
    });
  };

  const handleRemoveMaterialFromCuttingSpec = (materialId: string) => {
    // Remove the material from the selected materials list
    setSelectedMaterials((prevMaterials) => {
      return prevMaterials.filter((m) => m.id !== materialId);
    });

    // Also remove any cutting specifications for this material
    setCuttingSpecifications((prevSpecs) => {
      return prevSpecs.filter((spec) => spec.material.id !== materialId);
    });
  };

  const handleCuttingSpecificationComplete = (
    specifications: CuttingSpecification[],
  ) => {
    // Save all cutting specifications
    setCuttingSpecifications(specifications);
    setCurrentView("recapitulation");
  };

  const handleOrderSubmit = async (completeOrder: CompleteOrder) => {
    try {
      // Submit order to Shopify
      await submitOrderToShopify(completeOrder);

      // Reset state and go back to orders
      setCurrentView("orders");
      setCurrentOrder(null);
      setSelectedMaterials([]);
      setCuttingSpecifications([]);
      setCheckoutUrl("");
    } catch (error) {
      console.error("Failed to submit order:", error);
      // Handle error - could show error message to user
    }
  };

  const handleLoadConfiguration = async (savedOrder: SavedConfiguration) => {
    setLoadingConfiguration(true);
    try {
      // Load configuration and fetch fresh material data
      const { orderInfo, specifications } =
        await loadOrderConfiguration(savedOrder);

      // Check if we have any valid specifications
      if (specifications.length === 0) {
        alert(
          "Nie je možné načítať uložené nastavenie. Materiály už nie sú dostupné v obchode.",
        );
        return;
      }

      // Set the loaded configuration into app state - fix date deserialization
      const fixedOrderInfo = {
        ...orderInfo,
        deliveryDate: new Date(orderInfo.deliveryDate), // Convert string back to Date object
      };
      setCurrentOrder(fixedOrderInfo);

      // Keep the full MaterialSearchResult objects (don't transform to SelectedMaterial)
      // This preserves all fields needed by ProductSelectionCard (title, handle, variant, etc.)
      setSelectedMaterials(specifications.map((spec) => spec.material));
      setCuttingSpecifications(specifications);

      // Navigate to the step where the order was saved, or recapitulation as fallback
      const targetView = savedOrder.savedFromStep || "recapitulation";
      setCurrentView(targetView);
    } catch (error) {
      console.error("Error loading configuration:", error);
      alert("Chyba pri načítaní uloženej konfigurácie.");
    } finally {
      setLoadingConfiguration(false);
    }
  };

  const loadOrderConfigurationById = async (orderId: string) => {
    setLoadingConfiguration(true);
    try {
      console.log('🔍 Loading order configuration by ID:', orderId);

      const response = await fetch(
        `/apps/configurator/api/order-configuration?orderId=${orderId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to fetch order');
      }

      const data = await response.json();

      if (!data.success || !data.configuration) {
        throw new Error('Invalid response from server');
      }

      console.log('✅ Order configuration loaded:', data);

      const config = data.configuration;

      // Re-fetch materials and edges to get complete data (prices, images, etc.)
      // The metafield only stores IDs, titles, handles - we need full MaterialSearchResult objects
      const { searchMaterials, searchEdgeMaterials } = await import('./services/shopifyApi');

      // Collect unique material IDs
      const materialIds = [...new Set(config.specifications.map((spec: any) => spec.material.id))];
      console.log('📦 Re-fetching materials:', materialIds);

      // Collect unique edge IDs
      const edgeIds = new Set<string>();
      config.specifications.forEach((spec: any) => {
        if (spec.edgeMaterial?.id) edgeIds.add(spec.edgeMaterial.id);
        spec.pieces?.forEach((piece: any) => {
          if (piece.customEdgeTop?.id) edgeIds.add(piece.customEdgeTop.id);
          if (piece.customEdgeBottom?.id) edgeIds.add(piece.customEdgeBottom.id);
          if (piece.customEdgeLeft?.id) edgeIds.add(piece.customEdgeLeft.id);
          if (piece.customEdgeRight?.id) edgeIds.add(piece.customEdgeRight.id);
        });
      });
      console.log('🔲 Re-fetching edges:', Array.from(edgeIds));

      // Re-fetch all materials
      const materialCache = new Map();
      await Promise.all(
        materialIds.map(async (materialId: string) => {
          try {
            // Try numeric search first (same as orderLoader.ts)
            let numericId = materialId;
            if (materialId.includes('gid://shopify/')) {
              numericId = materialId.replace(/^gid:\/\/shopify\/(Product|ProductVariant)\//, '');
            }

            const results = await searchMaterials({ query: numericId, limit: 5 });
            if (results.length > 0) {
              materialCache.set(materialId, results[0]);
              console.log('✅ Material re-fetched:', materialId, results[0].title);
            } else {
              console.warn('⚠️ Material not found in Shopify:', materialId);
            }
          } catch (error) {
            console.error('❌ Failed to re-fetch material:', materialId, error);
          }
        })
      );

      // Re-fetch all edge materials
      const edgeCache = new Map();
      await Promise.all(
        Array.from(edgeIds).map(async (edgeId: string) => {
          try {
            let numericId = edgeId;
            if (edgeId.includes('gid://shopify/')) {
              numericId = edgeId.replace(/^gid:\/\/shopify\/(Product|ProductVariant)\//, '');
            }

            const results = await searchEdgeMaterials({ query: numericId, limit: 5 });
            if (results.length > 0) {
              const result = results[0];
              edgeCache.set(edgeId, {
                id: result.id,
                variantId: result.variant?.id,
                code: result.variant?.sku || result.handle,
                name: result.title,
                productCode: result.variant?.sku || result.handle,
                availability: 'available',
                edgeWidth: 0.8, // Default, will be overridden by saved value
                boardThickness: 18,
                warehouse: 'default',
                price: result.variant?.price ? {
                  amount: parseFloat(result.variant.price),
                  currency: 'EUR',
                  perUnit: 'm'
                } : undefined,
                image: result.image,
              });
            }
          } catch (error) {
            console.error('❌ Failed to re-fetch edge:', edgeId, error);
          }
        })
      );

      // Reconstruct specifications with complete data
      const reconstructedSpecs: CuttingSpecification[] = [];
      for (const savedSpec of config.specifications) {
        const material = materialCache.get(savedSpec.material.id);
        if (!material) {
          console.warn(`⚠️ Material ${savedSpec.material.id} not available - using fallback`);
          // Use fallback with saved data
          reconstructedSpecs.push({
            material: {
              id: savedSpec.material.id,
              title: savedSpec.material.title || '[Materiál nedostupný]',
              handle: savedSpec.material.handle || 'unavailable',
              vendor: '',
              productType: '',
              tags: [],
            },
            edgeMaterial: null,
            glueType: savedSpec.glueType,
            pieces: savedSpec.pieces || [],
          });
          continue;
        }

        // Get edge material and preserve saved edgeWidth
        let edgeMaterial = savedSpec.edgeMaterial?.id
          ? edgeCache.get(savedSpec.edgeMaterial.id) || null
          : null;

        // Preserve the saved edgeWidth value
        if (edgeMaterial && savedSpec.edgeMaterial?.edgeWidth) {
          edgeMaterial = {
            ...edgeMaterial,
            edgeWidth: savedSpec.edgeMaterial.edgeWidth,
          };
        }

        // Reconstruct pieces with custom edges, preserving their edgeWidths
        const pieces = savedSpec.pieces.map((piece: any) => {
          const reconstructedPiece = { ...piece };

          // Reconstruct custom edges with preserved edgeWidth values
          if (piece.customEdgeTop?.id) {
            const edge = edgeCache.get(piece.customEdgeTop.id);
            reconstructedPiece.customEdgeTop = edge ? {
              ...edge,
              edgeWidth: piece.customEdgeTop.edgeWidth || edge.edgeWidth,
            } : null;
          }

          if (piece.customEdgeBottom?.id) {
            const edge = edgeCache.get(piece.customEdgeBottom.id);
            reconstructedPiece.customEdgeBottom = edge ? {
              ...edge,
              edgeWidth: piece.customEdgeBottom.edgeWidth || edge.edgeWidth,
            } : null;
          }

          if (piece.customEdgeLeft?.id) {
            const edge = edgeCache.get(piece.customEdgeLeft.id);
            reconstructedPiece.customEdgeLeft = edge ? {
              ...edge,
              edgeWidth: piece.customEdgeLeft.edgeWidth || edge.edgeWidth,
            } : null;
          }

          if (piece.customEdgeRight?.id) {
            const edge = edgeCache.get(piece.customEdgeRight.id);
            reconstructedPiece.customEdgeRight = edge ? {
              ...edge,
              edgeWidth: piece.customEdgeRight.edgeWidth || edge.edgeWidth,
            } : null;
          }

          return reconstructedPiece;
        });

        reconstructedSpecs.push({
          material,
          edgeMaterial,
          glueType: savedSpec.glueType,
          pieces,
        });
      }

      console.log('✅ Specifications reconstructed with complete data:', reconstructedSpecs.length);

      // Extract saved layouts and calculations from metafield
      // These represent the actual order as it was submitted (with original prices)
      const savedLayouts = config.cuttingLayouts || null;
      const savedCalculations = config.orderCalculations || null;
      const createdDate = data.order?.createdAt || config.timestamp || null;

      console.log('📊 Saved cutting layouts:', savedLayouts?.length || 0);
      console.log('💰 Saved calculations:', savedCalculations ? 'available' : 'not available');
      console.log('📅 Order created:', createdDate);

      // Set the configuration into app state
      setCurrentOrder({
        ...config.order,
        deliveryDate: new Date(config.order.deliveryDate),
      });

      setSelectedMaterials(reconstructedSpecs.map((spec) => spec.material));
      setCuttingSpecifications(reconstructedSpecs);

      // Store saved data for view mode
      setSavedCuttingLayouts(savedLayouts);
      setSavedOrderCalculations(savedCalculations);
      setOrderCreatedDate(createdDate);

      // Navigate directly to recapitulation view (read-only)
      setCurrentView('recapitulation');

    } catch (error) {
      console.error('❌ Error loading order configuration:', error);
      alert(
        `Nepodarilo sa načítať konfiguráciu objednávky.\n\n` +
        `Chyba: ${error instanceof Error ? error.message : 'Neznáma chyba'}`
      );
      // Reset to normal mode if loading fails
      setViewMode('create');
      setViewingOrderId(null);
      setSavedCuttingLayouts(null);
      setSavedOrderCalculations(null);
      setOrderCreatedDate(null);
    } finally {
      setLoadingConfiguration(false);
    }
  };

  const [draftOrderId, setDraftOrderId] = useState<string>("");

  const handleOrderSuccess = (url: string, orderName: string, draftOrderId: string) => {
    setCheckoutUrl(url);
    setDraftOrderId(draftOrderId);
    setCurrentView("success");
  };

  // Show loading spinner while customer data is being fetched
  if (customerLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Načítavam údaje...
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth={false} disableGutters>
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

        {currentView === "orders" && (
          <OrdersPage
            onOrderCreated={handleOrderCreated}
            onLoadConfiguration={handleLoadConfiguration}
            customer={customer}
            shopConfig={shopConfig}
          />
        )}
        {currentView === "material-selection" && currentOrder && (
          <MaterialSelectionPage
            orderName={currentOrder.orderName}
            orderData={currentOrder}
            initialSelectedMaterials={selectedMaterials}
            onBack={handleBackToOrders}
            onContinue={handleMaterialSelectionComplete}
          />
        )}
        {currentView === "cutting-specification" &&
          currentOrder && (
            <CuttingSpecificationPage
              materials={selectedMaterials}
              orderName={currentOrder.orderName}
              orderData={currentOrder}
              existingSpecifications={cuttingSpecifications}
              onBack={handleBackToMaterialSelection}
              onContinue={handleCuttingSpecificationComplete}
              onAddMaterial={handleAddMaterialToCuttingSpec}
              onRemoveMaterial={handleRemoveMaterialFromCuttingSpec}
              cuttingConfig={shopConfig.cuttingConfig}
            />
          )}
        {currentView === "recapitulation" &&
          currentOrder &&
          cuttingSpecifications.length > 0 && (
            <OrderRecapitulationPage
              order={currentOrder}
              specifications={cuttingSpecifications}
              onBack={handleBackToCuttingSpecification}
              onSubmitOrder={handleOrderSubmit}
              onOrderSuccess={handleOrderSuccess}
              cuttingConfig={shopConfig.cuttingConfig}
              viewMode={viewMode}
              viewingOrderId={viewingOrderId}
              savedCuttingLayouts={savedCuttingLayouts}
              savedOrderCalculations={savedOrderCalculations}
              orderCreatedDate={orderCreatedDate}
            />
          )}
        {currentView === "success" && currentOrder && checkoutUrl && (
          <OrderSuccessPage
            checkoutUrl={checkoutUrl}
            orderName={currentOrder.orderName}
            draftOrderId={draftOrderId}
            orderInfo={currentOrder}
            materials={selectedMaterials}
            specifications={cuttingSpecifications}
            onCreateNewOrder={handleBackToOrders}
          />
        )}
        {currentView === "cutting-demo" && <CuttingLayoutDemo />}

        {/* Loading overlay for configuration loading */}
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
          open={loadingConfiguration}
        >
          <CircularProgress color="inherit" size={40} />
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Načítavam konfiguráciu...
          </Typography>
          <Typography
            variant="body2"
            sx={{ opacity: 0.8, textAlign: "center", maxWidth: 300 }}
          >
            Získavam najnovšie údaje o materiáloch zo Shopify
          </Typography>
        </Backdrop>
      </Container>
    </>
  );
}

export default App;

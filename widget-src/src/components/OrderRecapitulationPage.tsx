import React, { useState, useEffect, useRef } from "react";
import { calculateTotalPieces } from "../utils/data-transformation";
import { formatPriceNumber } from "../utils/formatting";
import { generateOrderPDF, downloadPDFBlob } from "../services/pdfGenerator";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import Grid from "@mui/system/Grid";
import type {
  OrderFormData,
  CuttingSpecification,
  CompleteOrder,
} from "../types/shopify";
import type { CuttingLayout } from "../utils/guillotineCutting";
import type { CuttingConfig } from "../main";
import {
  AvailabilityChip,
  CuttingDiagramThumbnail,
  CuttingDiagramDialog,
  OrderCalculationsSummary,
  SaveOrderButton,
} from "./common";
import OrderInvoiceTable from "./OrderInvoiceTable";
import CuttingPiecesTable from "./CuttingPiecesTable";
import { useCuttingLayouts, useOrderCalculations } from "../hooks";
import { useOrderSubmission } from "../hooks/useOrderSubmission";
import { useCustomer } from "../hooks/useCustomer";
import { useScrollOnStepChange } from "../hooks/useScrollIntoView";
import {
  groupCuttingLayouts,
  getGroupedLayoutTitle,
  getGroupedLayoutShortTitle,
  getGroupedLayoutDescription,
} from "../utils/layoutGrouping";
import { createDraftOrderService } from "../services/draftOrderService";
import { createSavedOrder } from "../types/savedOrder";
import { exportOrderToCsv } from "../services/csvExportService";

interface OrderRecapitulationPageProps {
  order: OrderFormData;
  specifications: CuttingSpecification[];
  cuttingConfig: CuttingConfig;
  onBack?: () => void;
  onSubmitOrder?: (completeOrder: CompleteOrder) => void;
  onOrderSuccess?: (checkoutUrl: string, orderName: string, draftOrderId: string, pdfBlob?: Blob) => void;
  viewMode?: 'create' | 'view';
  viewingOrderId?: string | null;
  savedCuttingLayouts?: CuttingLayout[] | null;
  savedOrderCalculations?: OrderCalculations | null;
  orderCreatedDate?: string | null;
}

const OrderRecapitulationPage: React.FC<OrderRecapitulationPageProps> = ({
  order,
  specifications,
  cuttingConfig,
  onBack,
  onSubmitOrder,
  onOrderSuccess,
  viewMode = 'create',
  viewingOrderId = null,
  savedCuttingLayouts = null,
  savedOrderCalculations = null,
  orderCreatedDate = null,
}) => {
  // Version marker for debugging
  useEffect(() => {
    console.log('🎯 [v4] OrderRecapitulationPage mounted - CODE VERSION 4 (Plain DIV wrapper)');
  }, []);

  const { customer } = useCustomer();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedDiagram, setSelectedDiagram] = useState<{
    layout: CuttingLayout;
    title: string;
    globalPieceTypes?: string[];
  } | null>(null);

  // Auto-scroll when component mounts (step change)
  useScrollOnStepChange();

  // Use custom hooks for cutting layouts and order calculations
  // In view mode, use saved data if available (original order prices/layouts)
  // In create mode, recalculate (current prices/layouts)
  const { cuttingLayouts: calculatedLayouts, overallStats: calculatedStats } = useCuttingLayouts(specifications, cuttingConfig);
  const calculatedOrderCalculations = useOrderCalculations(
    specifications,
    calculatedLayouts,
    undefined,
    cuttingConfig.edgeBuffer,
  );

  // Decide which data to use based on mode
  // IMPORTANT: We only save simplified layout data (no placedPieces or wasteArea)
  // So we always recalculate layouts for visualization
  // But we use saved orderCalculations for prices/totals in view mode
  const cuttingLayouts = calculatedLayouts; // Always recalculate for full visualization
  const overallStats = calculatedStats; // Always recalculate for accurate stats

  const orderCalculations = (viewMode === 'view' && savedOrderCalculations)
    ? savedOrderCalculations
    : calculatedOrderCalculations;

  // Auto-save draft order when reaching recapitulation page
  useEffect(() => {
    // Skip auto-save in view mode
    if (viewMode === 'view') {
      console.log('⚠️ Skipping auto-save: View mode active');
      return;
    }

    const autoSaveDraft = async () => {
      if (!customer) {
        console.log('⚠️ Skipping auto-save: No customer logged in');
        return;
      }

      try {
        console.log('💾 Auto-saving draft order...');
        const draftService = createDraftOrderService();

        // Create draft order with current state
        const draftOrder = createSavedOrder(
          order,
          specifications,
          cuttingLayouts,
          orderCalculations
        );

        // Set status to draft
        draftOrder.status = 'draft';

        await draftService.saveDraftOrder(draftOrder);
        console.log('✅ Draft order auto-saved successfully');
      } catch (error) {
        console.error('❌ Failed to auto-save draft order:', error);
        // Don't show error to user - auto-save is background operation
      }
    };

    autoSaveDraft();
  }, [viewMode]); // Only run once when component mounts or viewMode changes

  // Use order submission hook
  const {
    isSubmitting,
    error: submissionError,
    success: submissionSuccess,
    checkoutUrl,
    cartId,
    submitOrder,
    clearError,
    resetSuccess,
  } = useOrderSubmission();

  // Store generated PDF blob before navigation
  const [generatedPdfBlob, setGeneratedPdfBlob] = useState<Blob | null>(null);

  // Watch for successful submission and redirect to success page with PDF
  useEffect(() => {
    console.log('🔄 [v4] Navigation useEffect triggered:', {
      submissionSuccess,
      hasCheckoutUrl: !!checkoutUrl,
      hasCartId: !!cartId,
      hasCallback: !!onOrderSuccess,
      hasPdfBlob: !!generatedPdfBlob,
      pdfSize: generatedPdfBlob ? (generatedPdfBlob.size / 1024).toFixed(2) + ' KB' : 'none'
    });

    if (submissionSuccess && checkoutUrl && cartId && onOrderSuccess) {
      console.log('✈️ [v4] Navigating to success page with PDF blob:', !!generatedPdfBlob);
      // Navigate with the pre-generated PDF blob
      onOrderSuccess(checkoutUrl, order.orderName, cartId, generatedPdfBlob || undefined);
    }
  }, [submissionSuccess, checkoutUrl, cartId, onOrderSuccess, order.orderName, generatedPdfBlob]);

  const handleSubmitOrder = async () => {
    console.log('🚀 [v4] handleSubmitOrder called - NEW CODE RUNNING');
    console.log('🔍 [v4] Component state:', {
      submitSuccess,
      submissionSuccess,
      viewMode,
      hasCheckoutUrl: !!checkoutUrl,
      hasCartId: !!cartId
    });

    // Clear any previous errors
    if (submissionError) {
      clearError();
    }

    try {
      // STEP 1: Generate PDF while the container is still visible
      console.log('📄 [v4] STEP 1: Generating PDF before order submission...');
      console.log('🔍 [v4] Disabling submit button, showing loading state...');

      // Wait for React to finish any pending renders
      await new Promise(resolve => setTimeout(resolve, 300));

      console.log('🔍 [v4] Checking if container exists after delay...');

      // Try multiple methods to find the container
      let container = document.getElementById('order-recapitulation-container');
      console.log('🔍 [v4] Container found via getElementById:', !!container);

      // Try querySelector as fallback
      if (!container) {
        container = document.querySelector('#order-recapitulation-container') as HTMLElement | null;
        console.log('🔍 [v4] Container found via querySelector:', !!container);
      }

      // Check if we're in the right document
      console.log('🔍 [v4] Document title:', document.title);
      console.log('🔍 [v4] Current location:', window.location.href);

      if (!container) {
        console.error('❌ [v4] Container NOT found in DOM before PDF generation!');
        console.log('🔍 [v4] Available IDs in document:',
          Array.from(document.querySelectorAll('[id]')).map(el => el.id).slice(0, 20));
        console.log('🔍 [v4] Searching for any Container elements:',
          Array.from(document.querySelectorAll('[class*="Container"]')).slice(0, 5));
      } else {
        console.log('✅ [v4] Container EXISTS, dimensions:', {
          width: container.offsetWidth,
          height: container.offsetHeight,
          visible: container.offsetParent !== null
        });
      }

      try {
        const pdfBlob = await generateOrderPDF(order.orderName);
        console.log('✅ [v4] PDF generated successfully, size:', (pdfBlob.size / 1024).toFixed(2), 'KB');
        setGeneratedPdfBlob(pdfBlob);
      } catch (pdfError) {
        console.error('❌ [v4] PDF generation failed (non-blocking):', pdfError);
        // Continue with order submission even if PDF fails
        setGeneratedPdfBlob(null);
      }

      // STEP 2: Submit order to Shopify
      console.log('📤 [v4] STEP 2: Submitting order to Shopify...');
      const completeOrder: CompleteOrder = {
        order,
        specifications,
        cuttingLayouts,
        orderCalculations,
        submittedAt: new Date(),
      };

      await submitOrder(completeOrder);
      console.log('✅ [v4] Order submitted successfully');
    } catch (error) {
      console.error("❌ [v4] Order submission failed:", error);
      // Error is handled by the useOrderSubmission hook
    }
  };

  const totalPieces = calculateTotalPieces(specifications);

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // TEST: PDF Generation (temporary for testing)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleTestPDFGeneration = async () => {
    setIsGeneratingPDF(true);
    try {
      console.log('🧪 TEST: Generating PDF...');
      const pdfBlob = await generateOrderPDF(order.orderName);
      downloadPDFBlob(pdfBlob, `${order.orderName}-configuration.pdf`);
      console.log('✅ TEST: PDF downloaded successfully');
      alert('✅ PDF generated successfully! Check your downloads folder.');
    } catch (error) {
      console.error('❌ TEST: PDF generation failed:', error);
      alert(`❌ PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // CSV Export handlers
  const handleExportMens = () => {
    const completeOrder: CompleteOrder = {
      order,
      specifications,
      cuttingLayouts,
      orderCalculations,
    };
    exportOrderToCsv(completeOrder, 'MENS');
  };

  const handleExportStandard = () => {
    const completeOrder: CompleteOrder = {
      order,
      specifications,
      cuttingLayouts,
      orderCalculations,
    };
    exportOrderToCsv(completeOrder, 'STANDARD');
  };

  const handleExportBicorn = () => {
    const completeOrder: CompleteOrder = {
      order,
      specifications,
      cuttingLayouts,
      orderCalculations,
    };
    exportOrderToCsv(completeOrder, 'BICORN');
  };

  // Calculate discounted cutting cost
  const rawCuttingCost = orderCalculations.totals.totalCuttingCost;
  const discountedCuttingCost =
    order.discountPercentage > 0
      ? rawCuttingCost * (1 - order.discountPercentage / 100)
      : rawCuttingCost;

  // Check for unavailable products
  const unavailableProducts = specifications.reduce((acc, spec) => {
    if (!spec.material.variant?.availableForSale) {
      acc.push(`${spec.material.title} (materiál)`);
    }
    if (spec.edgeMaterial && spec.edgeMaterial.availability === "unavailable") {
      acc.push(`${spec.edgeMaterial.name} (hrana)`);
    }
    return acc;
  }, [] as string[]);

  if (submitSuccess) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
        <Typography variant="h4" sx={{ color: "success.main", mb: 2 }}>
          Zákazka bola úspešne odoslaná!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Vaša zákazka "{order.orderName}" bola odoslaná do systému Shopify a
          bude spracovaná.
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Vytvoriť novú zákazku
        </Button>
      </Container>
    );
  }

  return (
    <div id="order-recapitulation-container">
      <Container
        maxWidth={false}
        sx={{ maxWidth: "1920px", mx: "auto", py: 3 }}
      >
      {/* Print-only title */}
      <Box className="print-only" sx={{ mb: 3, textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: "primary.main" }}>
          {order.orderName} - Rekapitulácia zákazky
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Vytvorené: {new Date().toLocaleDateString("sk-SK")}
        </Typography>
      </Box>

      {/* View Mode Info Banner */}
      {viewMode === 'view' && viewingOrderId && (
        <Alert severity="info" sx={{ mb: 3 }} className="no-print">
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            📋 Prezeranie existujúcej objednávky
          </Typography>
          <Typography variant="body2">
            Prezeráte konfiguráciu objednávky ID: {viewingOrderId}. Môžete exportovať CSV alebo vytlačiť PDF.
          </Typography>
          {orderCreatedDate && savedOrderCalculations && (
            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
              💰 Ceny a celkové sumy zodpovedajú pôvodnej objednávke z {new Date(orderCreatedDate).toLocaleDateString('sk-SK', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}.
            </Typography>
          )}
        </Alert>
      )}

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
        className="no-print"
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {viewMode === 'create' && (
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={onBack}
              disabled={isSubmitting}
            >
              Späť
            </Button>
          )}
          <Typography
            variant="h2"
            component="h1"
            sx={{ fontWeight: 500, color: "primary.main" }}
          >
            {order.orderName} - Rekapitulácia zákazky
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            disabled={isSubmitting}
          >
            Tlačiť / PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportMens}
            disabled={isSubmitting}
          >
            CSV MENS
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportStandard}
            disabled={isSubmitting}
          >
            CSV Standard
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportBicorn}
            disabled={isSubmitting}
          >
            CSV BICORN
          </Button>
          {/* TEST: Temporary PDF generation button */}
          <Button
            variant="contained"
            color="secondary"
            startIcon={isGeneratingPDF ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
            onClick={handleTestPDFGeneration}
            disabled={isGeneratingPDF || isSubmitting}
          >
            {isGeneratingPDF ? 'Generating PDF...' : 'TEST PDF'}
          </Button>
          {viewMode === 'create' && customer && (
            <SaveOrderButton
              currentStep="recapitulation"
              orderData={order}
              selectedMaterials={specifications.map((spec) => ({
                id: spec.material.id,
                code: spec.material.variant?.sku || spec.material.handle,
                name: spec.material.title,
                quantity: calculateTotalPieces([spec]),
                price: parseFloat(spec.material.variant?.price || "0"),
                totalPrice:
                  parseFloat(spec.material.variant?.price || "0") *
                  calculateTotalPieces([spec]),
                variantId: spec.material.variant?.id || spec.material.id,
                image: spec.material.image || spec.material.images?.[0],
              }))}
              cuttingSpecifications={specifications}
              customerId={customer.id}
              disabled={isSubmitting}
              onSaveSuccess={() => {
                // Could show a success message
              }}
              onSaveError={(error) => {
                console.error("Save error:", error);
              }}
            />
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Order Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
              Informácie o zákazke
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Zákazník
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {order.company}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Prevádzková jednotka
                </Typography>
                <Typography variant="body2">
                  {order.transferLocation}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Nárezové centrum
                </Typography>
                <Typography variant="body2">{order.cuttingCenter}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Požadovaný dátum dodania
                </Typography>
                <Typography variant="body2">
                  {order.deliveryDate
                    ? order.deliveryDate.toLocaleDateString("sk-SK")
                    : "Neurčené"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Spôsob dopravy
                </Typography>
                <Typography variant="body2">{order.deliveryMethod}</Typography>
              </Box>

              {order.notes && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Poznámka
                  </Typography>
                  <Typography variant="body2">{order.notes}</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Order Invoice Table */}
      <OrderInvoiceTable
        specifications={specifications}
        cuttingLayouts={cuttingLayouts}
        orderCalculations={orderCalculations}
        order={order}
      />

      {/* Configuration Tables - Readonly view of cutting pieces (print only) */}
      {specifications.map((spec, index) => (
        <Paper key={index} sx={{ p: 3, mt: 3, mb: 3 }} className="print-only">
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Konfigurácia - {spec.material.title}
          </Typography>
          <CuttingPiecesTable
            pieces={spec.pieces}
            edgeMaterial={spec.edgeMaterial}
            availableEdges={spec.availableEdges}
            onPieceChange={() => {}} // No-op in readonly mode
            onRemovePiece={() => {}} // No-op in readonly mode
            readonly={true}
          />
        </Paper>
      ))}

      {/* Cutting Layout Diagrams - Grouped Thumbnail View */}
      {cuttingLayouts.length > 0 ? (
        <Paper sx={{ p: 3, mt: 3, mb: 3 }}>
          {(() => {
            // Group identical cutting layouts
            const groupedLayouts = groupCuttingLayouts(cuttingLayouts);
            const totalDiagrams = cuttingLayouts.length;
            const uniqueDiagrams = groupedLayouts.length;

            // Calculate global piece types for consistent coloring across all diagrams
            const globalPieceTypes = [
              ...new Set(
                specifications.flatMap((spec) =>
                  spec.pieces.map((piece) => piece.partName || piece.id),
                ),
              ),
            ];

            return (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Rozrezové plány
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                  className="print-hide-message"
                >
                  {totalDiagrams !== uniqueDiagrams
                    ? "Identické plány sú zoskupené s počítadlom. Kliknite na diagram pre detail."
                    : "Kliknite na diagram pre zobrazenie detailu"}
                </Typography>

                {/* Grouped Thumbnail Grid */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    justifyContent: "flex-start",
                  }}
                >
                  {groupedLayouts.map((groupData) => {
                    const shortTitle = getGroupedLayoutShortTitle(groupData);
                    const fullTitle = getGroupedLayoutTitle(groupData);
                    const description = getGroupedLayoutDescription(groupData);

                    return (
                      <CuttingDiagramThumbnail
                        key={`group-${groupData.groupId}`}
                        layout={groupData.layout}
                        title={shortTitle}
                        globalPieceTypes={globalPieceTypes}
                        count={groupData.count}
                        description={description}
                        onClick={() =>
                          setSelectedDiagram({
                            layout: groupData.layout,
                            title: fullTitle,
                            globalPieceTypes,
                          })
                        }
                      />
                    );
                  })}
                </Box>
              </>
            );
          })()}
        </Paper>
      ) : (
        <Paper sx={{ p: 3, mt: 3, mb: 3, textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 2, color: "warning.main" }}>
            Rozrezové plány
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Rozrezové plány sa zobrazia po pridaní kusov na rezanie s rozmermi.
          </Typography>
        </Paper>
      )}

      {/* Cutting Diagram Dialog */}
      <CuttingDiagramDialog
        open={!!selectedDiagram}
        layout={selectedDiagram?.layout || null}
        title={selectedDiagram?.title || ""}
        globalPieceTypes={selectedDiagram?.globalPieceTypes}
        onClose={() => setSelectedDiagram(null)}
      />

      {/* Total Summary */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: "#f0f7ff" }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          Celková rekapitulácia
        </Typography>
        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Materiály
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {specifications.length}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Celkový počet kusov
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {totalPieces}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Potrebné dosky
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {overallStats.totalBoards}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Celkový odpad
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "warning.main" }}
            >
              {formatPriceNumber(overallStats.totalWasteArea / 1000000)} m²
            </Typography>
          </Box>
          {overallStats.totalUnplacedPieces > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Neumiestnené kusy
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "error.main" }}
              >
                {overallStats.totalUnplacedPieces}
              </Typography>
            </Box>
          )}
          {orderCalculations.totals.totalEdgeLength > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Hranový materiál
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "info.main" }}
              >
                {formatPriceNumber(orderCalculations.totals.totalEdgeLength)} m
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Error Display */}
      {submissionError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
          {submissionError}
        </Alert>
      )}

      {/* Success Display */}
      {submissionSuccess && checkoutUrl && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={resetSuccess}
          action={
            <Button
              color="inherit"
              size="small"
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textTransform: "none" }}
            >
              Otvoriť košík →
            </Button>
          }
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            ✅ Zákazka bola úspešne pridaná do košíka!
          </Typography>
          <Typography variant="body2">
            Váš košík je pripravený v Shopify systéme. Kliknite na tlačidlo pre
            dokončenie objednávky.
          </Typography>
        </Alert>
      )}

      {/* Unplaced Pieces Warning */}
      {overallStats.totalUnplacedPieces > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            ⚠️ Kritická chyba: {overallStats.totalUnplacedPieces}{" "}
            {overallStats.totalUnplacedPieces === 1
              ? "kus sa nepodaril"
              : overallStats.totalUnplacedPieces < 5
                ? "kusy sa nepodarili"
                : "kusov sa nepodarilo"}{" "}
            umiestniť pri optimalizácii!
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Niektoré kusy sú príliš veľké alebo ich množstvo presahuje kapacitu materiálu.
            Prosím vráťte sa späť a:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            <li>
              <Typography variant="body2">Skontrolujte rozmery kusov (či sa zmestia na dosku)</Typography>
            </li>
            <li>
              <Typography variant="body2">Znížte počet kusov v blokoch</Typography>
            </li>
            <li>
              <Typography variant="body2">Upravte nastavenia blokov (rozdeľte do viacerých blokov)</Typography>
            </li>
          </ul>
          <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic", color: "error.dark" }}>
            Zákazku nie je možné odoslať kým nie sú všetky kusy úspešne umiestnené.
          </Typography>
        </Alert>
      )}

      {/* Unavailable Products Warning */}
      {unavailableProducts.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            ⚠️ Pozor: Niektoré produkty nie sú momentálne skladom
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Tieto produkty budú dodané na objednávku:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            {unavailableProducts.map((product, index) => (
              <li key={index}>
                <Typography variant="body2">{product}</Typography>
              </li>
            ))}
          </ul>
          <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>
            Dodacia lehota bude predĺžená podľa dostupnosti materiálov.
          </Typography>
        </Alert>
      )}

      {/* Action Buttons */}
      {viewMode === 'create' && (
        <Paper
          className="no-print"
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Alert severity="info" sx={{ flex: 1, mr: 3 }}>
            Skontrolujte všetky údaje pred odoslaním zákazky.
          </Alert>

          <Button
            variant="contained"
            size="large"
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SendIcon />
              )
            }
            onClick={handleSubmitOrder}
            disabled={isSubmitting || overallStats.totalUnplacedPieces > 0}
            sx={{
              minWidth: 200,
            }}
          >
            {isSubmitting ? "Odosielam..." : "Odoslať zákazku"}
          </Button>
        </Paper>
      )}
    </Container>
    </div>
  );
};

export default OrderRecapitulationPage;

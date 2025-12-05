import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  ShoppingCart as ShoppingCartIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  PictureAsPdf as PdfIcon,
} from "@mui/icons-material";
import type { OrderFormData } from "../schemas/orderSchema";
import type { CuttingSpecification } from "../types/shopify";
import { formatPriceNumber } from "../utils/formatting";
import { createConfigurationService } from "../services/configurationService";
import { useCustomer } from "../hooks/useCustomer";
import { generateOrderPDF } from "../services/pdfGenerator";
import { generateAndUploadOrderPDF } from "../services/pdfUploadService";

interface OrderSuccessPageProps {
  checkoutUrl: string;
  orderName: string;
  draftOrderId: string;
  orderInfo?: OrderFormData;
  materials?: Array<{
    id: string;
    code: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  specifications?: CuttingSpecification[];
  onCreateNewOrder?: () => void;
}

const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
  checkoutUrl,
  orderName,
  draftOrderId,
  orderInfo,
  materials,
  specifications,
  onCreateNewOrder,
}) => {
  const { customer, isLoggedIn } = useCustomer();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [configurationName, setConfigurationName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // PDF generation state
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Automatically generate and upload PDF after order success
  useEffect(() => {
    const generatePDF = async () => {
      if (!draftOrderId || !orderName) {
        console.log('⚠️ Skipping PDF generation: Missing draftOrderId or orderName');
        return;
      }

      setPdfGenerating(true);
      setPdfError(null);

      try {
        console.log('📄 Generating PDF for order:', orderName);

        const result = await generateAndUploadOrderPDF(
          draftOrderId,
          orderName,
          () => generateOrderPDF(orderName)
        );

        if (result.success) {
          console.log('✅ PDF generated and uploaded successfully:', result);
          setPdfSuccess(true);
        } else {
          console.warn('⚠️ PDF upload failed (non-critical):', result.error);
          setPdfError(result.error || 'PDF generation failed');
        }
      } catch (error) {
        console.error('❌ PDF generation error:', error);
        setPdfError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setPdfGenerating(false);
      }
    };

    // Trigger PDF generation automatically
    generatePDF();
  }, [draftOrderId, orderName]); // Only run when these values are available

  const canSaveConfiguration =
    isLoggedIn && customer && orderInfo && materials && specifications;

  const handleSaveConfiguration = async () => {
    if (!canSaveConfiguration || !configurationName.trim()) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      const configService = createConfigurationService();
      const result = await configService.saveConfiguration(
        customer.id,
        configurationName.trim(),
        orderInfo,
        materials,
        specifications,
      );

      if (result.success) {
        setSaveMessage({
          type: "success",
          text: "Konfigurácia bola úspešne uložená!",
        });
        setConfigurationName("");
        setTimeout(() => {
          setSaveDialogOpen(false);
          setSaveMessage(null);
        }, 2000);
      } else {
        setSaveMessage({
          type: "error",
          text: result.error || "Chyba pri ukladaní konfigurácie",
        });
      }
    } catch (error) {
      setSaveMessage({
        type: "error",
        text: "Neočakávaná chyba pri ukladaní konfigurácie",
      });
    }

    setSaving(false);
  };

  const calculateSummary = () => {
    if (!materials || !specifications) return null;

    const totalPieces = specifications.reduce(
      (sum, spec) =>
        sum +
        spec.pieces.reduce((pieceSum, piece) => pieceSum + piece.quantity, 0),
      0,
    );
    const totalCost = materials.reduce(
      (sum, material) => sum + material.price * material.quantity,
      0,
    );

    return { totalPieces, totalCost };
  };

  const summary = calculateSummary();

  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
      <Paper sx={{ p: 6, borderRadius: 2 }}>
        <CheckCircleIcon sx={{ fontSize: 100, color: "primary.main", mb: 3 }} />

        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          Zákazka bola úspešne pridaná do košíka!
        </Typography>

        <Typography variant="h6" sx={{ mb: 4, fontWeight: 500 }}>
          "{orderName}"
        </Typography>

        {/* PDF Generation Status */}
        {pdfGenerating && (
          <Alert severity="info" sx={{ mb: 3, maxWidth: 600, mx: "auto" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2">
                Generujem PDF konfiguráciu...
              </Typography>
            </Box>
            <LinearProgress sx={{ mt: 1 }} />
          </Alert>
        )}

        {pdfSuccess && (
          <Alert severity="success" icon={<PdfIcon />} sx={{ mb: 3, maxWidth: 600, mx: "auto" }}>
            <Typography variant="body2">
              ✅ PDF konfigurácia bola úspešne vygenerovaná a pripojená k objednávke
            </Typography>
          </Alert>
        )}

        {pdfError && (
          <Alert severity="warning" sx={{ mb: 3, maxWidth: 600, mx: "auto" }}>
            <Typography variant="body2">
              ⚠️ PDF konfigurácia sa nepodarila vygenerovať (neovplyvňuje objednávku)
            </Typography>
            <Typography variant="caption" sx={{ display: "block", mt: 0.5, opacity: 0.8 }}>
              {pdfError}
            </Typography>
          </Alert>
        )}

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingCartIcon />}
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              minWidth: 250,
              py: 1.5,
              fontSize: "1.1rem",
            }}
          >
            Otvoriť košík a dokončiť objednávku
          </Button>

          {canSaveConfiguration && (
            <Button
              variant="outlined"
              size="large"
              startIcon={<SaveIcon />}
              onClick={() => setSaveDialogOpen(true)}
              sx={{
                minWidth: 200,
                py: 1.5,
                fontSize: "1.1rem",
              }}
            >
              Uložiť konfiguráciu
            </Button>
          )}

          {onCreateNewOrder && (
            <Button
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<RefreshIcon />}
              onClick={onCreateNewOrder}
              sx={{
                minWidth: 200,
                py: 1.5,
                fontSize: "1.1rem",
              }}
            >
              Vytvoriť novú zákazku
            </Button>
          )}
        </Box>
      </Paper>

      {/* Save Configuration Dialog */}
      <Dialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {saveMessage?.type === "success"
            ? "Konfigurácia uložená"
            : "Uložiť konfiguráciu"}
        </DialogTitle>
        <DialogContent>
          {saveMessage ? (
            <Alert severity={saveMessage.type} sx={{ mb: 2 }}>
              {saveMessage.text}
            </Alert>
          ) : (
            <>
              <Typography
                variant="body2"
                sx={{ mb: 3, color: "text.secondary" }}
              >
                Zadajte názov pre túto konfiguráciu. Budete si ju môcť neskôr
                znovu načítať.
              </Typography>

              <TextField
                autoFocus
                label="Názov konfigurácie"
                fullWidth
                value={configurationName}
                onChange={(e) => setConfigurationName(e.target.value)}
                placeholder="napr. Kuchynské skrinky - projekt 2024"
                disabled={saving}
                error={
                  !configurationName.trim() && configurationName.length > 0
                }
                helperText={
                  !configurationName.trim() && configurationName.length > 0
                    ? "Názov je povinný"
                    : ""
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          {saveMessage?.type === "success" ? (
            <Button
              onClick={() => setSaveDialogOpen(false)}
              variant="contained"
            >
              Zavrieť
            </Button>
          ) : (
            <>
              <Button
                onClick={() => setSaveDialogOpen(false)}
                disabled={saving}
              >
                Zrušiť
              </Button>
              <Button
                onClick={handleSaveConfiguration}
                variant="contained"
                disabled={!configurationName.trim() || saving}
                startIcon={saving ? undefined : <SaveIcon />}
              >
                {saving ? "Ukladám..." : "Uložiť"}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderSuccessPage;

import React, { useState, useCallback, useMemo, memo } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Divider,
  Alert,
  IconButton,
} from "@mui/material";
import Grid from "@mui/system/Grid";
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import MaterialInfoCard from "./MaterialInfoCard";
import EdgeSelectionCard from "./EdgeSelectionCard";
import CuttingPiecesTable from "./CuttingPiecesTable";
import PiecePreviewDialog from "./PiecePreviewDialog";
import MaterialSearch from "./MaterialSearch";
import MaterialResultsTable from "./MaterialResultsTable";
import { SaveOrderButton } from "./common";
import { useMaterialSpecs } from "../hooks/useMaterialSpecs";
import { useMaterialSearch } from "../hooks/useMaterialSearch";
import { useCustomer } from "../hooks/useCustomer";
import { useScrollOnStepChange } from "../hooks/useScrollIntoView";
import { useCuttingLayouts } from "../hooks/useCuttingLayouts";
import type {
  MaterialSearchResult,
  CuttingSpecification,
  CuttingPiece,
  SelectedMaterial,
} from "../types/shopify";
import type { OrderFormData } from "../schemas/orderSchema";
import { transformToSelectedMaterial } from "../utils/data-transformation";

interface CuttingSpecificationPageProps {
  materials: MaterialSearchResult[];
  orderName: string;
  orderData?: OrderFormData | null;
  existingSpecifications?: CuttingSpecification[];
  onBack?: () => void;
  onContinue?: (specifications: CuttingSpecification[]) => void;
  onAddMaterial?: (material: SelectedMaterial) => void;
  onRemoveMaterial?: (materialId: string) => void;
}

// Memoized wrapper to prevent unnecessary re-renders of CuttingPiecesTable
interface MaterialTableWrapperProps {
  materialId: string;
  material: MaterialSearchResult;
  pieces: CuttingPiece[];
  edgeMaterial: any;
  validationErrors: { [pieceId: string]: string[] };
  onPieceChange: (materialId: string, pieceId: string, updatedPiece: Partial<CuttingPiece>) => void;
  onRemovePiece: (materialId: string, pieceId: string) => void;
  onPreviewPiece: (piece: CuttingPiece, material: MaterialSearchResult) => void;
  onFieldBlur: (materialId: string, pieceId: string, fieldName: 'length' | 'width') => void;
}

const MaterialTableWrapper = memo<MaterialTableWrapperProps>(({
  materialId,
  material,
  pieces,
  edgeMaterial,
  validationErrors,
  onPieceChange,
  onRemovePiece,
  onPreviewPiece,
  onFieldBlur,
}) => {
  // Use refs to store latest values without causing re-renders
  const materialRef = React.useRef(material);
  const onPieceChangeRef = React.useRef(onPieceChange);
  const onRemovePieceRef = React.useRef(onRemovePiece);
  const onPreviewPieceRef = React.useRef(onPreviewPiece);
  const onFieldBlurRef = React.useRef(onFieldBlur);

  // Update refs when props change
  React.useEffect(() => {
    materialRef.current = material;
    onPieceChangeRef.current = onPieceChange;
    onRemovePieceRef.current = onRemovePiece;
    onPreviewPieceRef.current = onPreviewPiece;
    onFieldBlurRef.current = onFieldBlur;
  });

  // Create stable callbacks that NEVER change
  const handlePieceChange = useCallback(
    (pieceId: string, updatedPiece: Partial<CuttingPiece>) => {
      onPieceChangeRef.current(materialId, pieceId, updatedPiece);
    },
    [materialId]
  );

  const handleRemovePiece = useCallback(
    (pieceId: string) => {
      onRemovePieceRef.current(materialId, pieceId);
    },
    [materialId]
  );

  const handlePreviewPiece = useCallback(
    (piece: CuttingPiece) => {
      onPreviewPieceRef.current(piece, materialRef.current);
    },
    []
  );

  const handleFieldBlur = useCallback(
    (pieceId: string, fieldName: 'length' | 'width') => {
      onFieldBlurRef.current(materialId, pieceId, fieldName);
    },
    [materialId]
  );

  return (
    <CuttingPiecesTable
      pieces={pieces}
      edgeMaterial={edgeMaterial}
      onPieceChange={handlePieceChange}
      onRemovePiece={handleRemovePiece}
      onPreviewPiece={handlePreviewPiece}
      onFieldBlur={handleFieldBlur}
      validationErrors={validationErrors}
    />
  );
});

const CuttingSpecificationPage: React.FC<CuttingSpecificationPageProps> = ({
  materials,
  orderName,
  orderData,
  existingSpecifications = [],
  onBack,
  onContinue,
  onAddMaterial,
  onRemoveMaterial,
}) => {
  const { customer } = useCustomer();

  // Auto-scroll when component mounts (step change)
  useScrollOnStepChange();

  // State for piece preview dialog
  const [previewPiece, setPreviewPiece] = useState<CuttingPiece | null>(null);
  const [previewMaterial, setPreviewMaterial] =
    useState<MaterialSearchResult | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Material search hook
  const {
    searchResults,
    isLoadingSearch,
    searchQuery,
    showingAvailableOnly,
    handleSearch,
    handleShowAll,
    clearResults,
  } = useMaterialSearch();

  // Use custom hook for material specs management
  const {
    materialSpecs,
    handleEdgeMaterialChange,
    handleGlueTypeChange,
    handleAddPiece,
    handlePieceChange,
    handleRemovePiece,
    clearAllPieces,
    generateSpecifications,
    getTotalPieces,
    getTotalPiecesForMaterial,
    getValidPieces,
    hasValidPiecesForAllMaterials,
    getPieceValidationErrors,
    removeMaterial,
    isValidPiece,
    markFieldAsTouched,
  } = useMaterialSpecs(materials, existingSpecifications);

  // Calculate cutting layouts to check for unplaced pieces
  const specifications = generateSpecifications();
  const { overallStats } = useCuttingLayouts(specifications);

  // Check if there are any validation errors across all materials
  const hasAnyValidationErrors = useCallback(() => {
    return materials.some((material) => {
      const validationErrors = getPieceValidationErrors(material.id);
      return Object.keys(validationErrors).length > 0;
    });
  }, [materials, getPieceValidationErrors]);

  const handleContinue = () => {
    // Check if all materials have at least one valid piece
    if (!hasValidPiecesForAllMaterials()) {
      alert(
        "Každý materiál musí mať aspoň jeden platný kus s dĺžkou a šírkou.",
      );
      return;
    }

    // Check if there are any validation errors
    if (hasAnyValidationErrors()) {
      alert("Opravte chyby v kusoch pred pokračovaním.");
      return;
    }

    const specifications = generateSpecifications();
    onContinue?.(specifications);
  };

  const handleRemoveMaterial = (materialId: string, materialName: string) => {
    const confirmed = window.confirm(
      `Odstrániť materiál "${materialName}" a všetky jeho kusy?`,
    );
    if (confirmed) {
      removeMaterial(materialId);
      // Notify parent component to remove from materials array
      onRemoveMaterial?.(materialId);
    }
  };

  const handlePreviewPiece = useCallback((
    piece: CuttingPiece,
    material: MaterialSearchResult,
  ) => {
    setPreviewPiece(piece);
    setPreviewMaterial(material);
    setIsPreviewOpen(true);
  }, []);

  const handleClosePreview = useCallback(() => {
    setIsPreviewOpen(false);
    setPreviewPiece(null);
    setPreviewMaterial(null);
  }, []);

  const handleAddMaterialToOrder = (material: MaterialSearchResult) => {
    if (onAddMaterial) {
      const selectedMaterial = transformToSelectedMaterial(material);
      onAddMaterial(selectedMaterial);

      // Clear search results after adding
      clearResults();
    }
  };

  return (
    <Container maxWidth={false} sx={{ maxWidth: "1920px", mx: "auto", py: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
          >
            Späť
          </Button>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 500, color: "primary.main" }}
          >
            {orderName} - Špecifikácia rezania
          </Typography>
        </Box>

        {customer && (
          <SaveOrderButton
            currentStep="cutting-specification"
            orderData={orderData}
            selectedMaterials={materials.map((m) =>
              transformToSelectedMaterial(m),
            )}
            cuttingSpecifications={Object.values(materialSpecs)}
            customerId={customer.id}
            onSaveSuccess={() => {
              // Could show a success message
            }}
            onSaveError={(error) => {
              console.error("Save error:", error);
            }}
          />
        )}
      </Box>

      {/* Multiple Materials - Scrollable Cards */}
      {materials.filter(material => materialSpecs[material.id]).map((material, index) => {
        const materialSpec = materialSpecs[material.id];

        // Double-check materialSpec exists (defense against race conditions)
        if (!materialSpec) {
          return null;
        }

        const validPiecesCount = getTotalPiecesForMaterial(material.id);
        const validationErrors = getPieceValidationErrors(material.id);
        const hasValidationErrors = Object.keys(validationErrors).length > 0;

        return (
          <Box key={material.id} sx={{ mb: 4 }}>
            {/* Material Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography
                  variant="h5"
                  sx={{ color: "primary.main", fontWeight: 500 }}
                >
                  Materiál {index + 1} z {materials.length}
                </Typography>
                {validPiecesCount > 0 && (
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    ({validPiecesCount} platných kusov)
                  </Typography>
                )}
              </Box>

              {materials.length > 1 && (
                <IconButton
                  onClick={() =>
                    handleRemoveMaterial(material.id, material.title)
                  }
                  color="error"
                  size="small"
                  sx={{ ml: 2 }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>

            {/* Material and Edge Selection */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {/* Material Info Card */}
              <Grid size={{ xs: 12, md: 6 }}>
                <MaterialInfoCard material={material} />
              </Grid>

              {/* Edge Selection Card */}
              <Grid size={{ xs: 12, md: 6 }}>
                <EdgeSelectionCard
                  selectedEdge={materialSpec?.selectedEdgeMaterial || null}
                  glueType={materialSpec?.glueType || 'PUR transparentná/bílá'}
                  onEdgeChange={(edge) =>
                    handleEdgeMaterialChange(material.id, edge)
                  }
                  onGlueTypeChange={(glue) =>
                    handleGlueTypeChange(material.id, glue)
                  }
                />
              </Grid>
            </Grid>

            {/* Cutting Pieces Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6">
                  Kusy na rezanie ({materialSpec?.cuttingPieces?.length || 0})
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddPiece(material.id)}
                >
                  Pridať kus
                </Button>
              </Box>

              <MaterialTableWrapper
                materialId={material.id}
                material={material}
                pieces={materialSpec?.cuttingPieces || []}
                edgeMaterial={materialSpec?.selectedEdgeMaterial || null}
                onPieceChange={handlePieceChange}
                onRemovePiece={handleRemovePiece}
                onPreviewPiece={handlePreviewPiece}
                onFieldBlur={(materialId, pieceId, fieldName) =>
                  markFieldAsTouched(pieceId, fieldName)
                }
                validationErrors={validationErrors}
              />

              {/* Warning for unplaced pieces */}
              {overallStats.totalUnplacedPieces > 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  ⚠️ Upozornenie: {overallStats.totalUnplacedPieces}{" "}
                  {overallStats.totalUnplacedPieces === 1
                    ? "kus sa nepodaril"
                    : overallStats.totalUnplacedPieces < 5
                      ? "kusy sa nepodarili"
                      : "kusov sa nepodarilo"}{" "}
                  umiestniť pri optimalizácii. Skontrolujte rozmery a počet
                  kusov.
                </Alert>
              )}
            </Paper>

            {/* Divider between materials (except last one) */}
            {index < materials.length - 1 && (
              <Box sx={{ borderBottom: "2px solid #e0e0e0", mx: 2, mb: 4 }} />
            )}
          </Box>
        );
      })}

      {/* Add More Materials Section */}
      {onAddMaterial && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <SearchIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Pridať ďalšie materiály
            </Typography>
          </Box>

          <MaterialSearch
            onSearch={handleSearch}
            isLoading={isLoadingSearch}
            placeholder="Vyhľadajte materiály na pridanie..."
            searchValue={searchQuery}
          />

          {searchResults.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <MaterialResultsTable
                results={searchResults}
                onAddMaterial={handleAddMaterialToOrder}
                selectedMaterialIds={materials.map((m) => m.id)} // Pass current material IDs to prevent duplicates
              />
            </Box>
          )}

          {searchQuery.length >= 2 &&
            searchResults.length === 0 &&
            !isLoadingSearch && (
              <Typography
                variant="body2"
                sx={{ mt: 2, color: "text.secondary", textAlign: "center" }}
              >
                Nenašli sa žiadne materiály pre "{searchQuery}"
              </Typography>
            )}
        </Paper>
      )}

      {/* Action Buttons */}
      <Box
        sx={{
          position: "sticky",
          bottom: 20,
          backgroundColor: "white",
          p: 2,
          borderRadius: 1,
          boxShadow: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            "@media (max-width: 768px)": {
              flexDirection: "column",
              alignItems: "stretch",
            },
          }}
        >
          {/* Help Message */}
          <Alert
            severity="info"
            sx={{
              flex: 1,
              minWidth: { xs: "auto", md: "300px" },
              mb: 0,
            }}
          >
            <Typography variant="body2">
              💡 Pre pokračovanie musia mať všetky kusy vyplnenú dĺžku aj šírku
            </Typography>
          </Alert>

          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,

              justifyContent: { xs: "center", md: "flex-end" },
              minWidth: { xs: "auto", md: "200px" },
            }}
          >
            <Button variant="outlined" onClick={clearAllPieces}>
              Vymazať všetko
            </Button>
            <Button
              variant="contained"
              onClick={handleContinue}
              disabled={
                getTotalPieces() === 0 ||
                !hasValidPiecesForAllMaterials() ||
                hasAnyValidationErrors()
              }
            >
              Pokračovať ({getTotalPieces()} platných kusov)
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Piece Preview Dialog */}
      <PiecePreviewDialog
        open={isPreviewOpen}
        piece={previewPiece}
        material={previewMaterial || undefined}
        onClose={handleClosePreview}
      />
    </Container>
  );
};

export default CuttingSpecificationPage;

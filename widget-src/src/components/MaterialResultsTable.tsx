import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Box,
  IconButton,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import type { MaterialSearchResult } from "../types/shopify";
import MaterialAllResultsModal from "./MaterialAllResultsModal";
import { AvailabilityChip } from "./common";
import { calculateAvailability } from "../utils/availability";
import { formatPrice } from "../utils/formatting";

interface MaterialResultsTableProps {
  results: MaterialSearchResult[];
  onAddMaterial?: (material: MaterialSearchResult) => void;
  onRemoveMaterial?: (materialId: string) => void;
  showViewAllButton?: boolean;
  isSelectedMaterials?: boolean;
  selectedMaterialIds?: string[];
}

const MaterialResultsTable: React.FC<MaterialResultsTableProps> = ({
  results,
  onAddMaterial,
  onRemoveMaterial,
  showViewAllButton = false,
  isSelectedMaterials = false,
  selectedMaterialIds = [],
}) => {
  const [showAllModal, setShowAllModal] = useState(false);

  return (
    <>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: 600, width: "50px" }}>
                Obrázok
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Názov</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Kód</TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                Dostupnosť
              </TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: "right" }}>
                Cena za MJ
              </TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                {isSelectedMaterials ? "Akcie" : "Zvoliť"}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((material, index) => {
              // Calculate availability using unified function
              const availability = calculateAvailability(material);

              // Extract pricing info from customer pricing service metadata
              const customerPrice = parseFloat(material.variant?.price || "0");
              const basePrice = parseFloat((material.variant as any)?._basePrice || material.variant?.price || "0");
              const customerDiscount = (material.variant as any)?._customerDiscount || 0;
              const hasCustomerDiscount = customerDiscount > 0;

              // Extract package info
              const packageSize =
                material.metafields?.["custom.package_size"] ||
                material.variant?.metafields?.["custom.package_size"] ||
                "1";
              const isPackageDivisible =
                material.metafields?.["custom.package_divisible"] === "true" ||
                material.variant?.metafields?.["custom.package_divisible"] ===
                  "true";

              return (
                <TableRow key={material.id} hover>
                  {/* Image */}
                  <TableCell>
                    <Avatar
                      src={material.image}
                      alt={material.title}
                      sx={{ width: 40, height: 40, borderRadius: 1 }}
                      variant="rounded"
                    >
                      📦
                    </Avatar>
                  </TableCell>

                  {/* Name */}
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {material.title}
                    </Typography>
                    {material.dimensions && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mt: 0.5 }}
                      >
                        {material.dimensions.height} ×{" "}
                        {material.dimensions.width} ×{" "}
                        {material.dimensions.thickness} mm
                      </Typography>
                    )}
                  </TableCell>

                  {/* Code */}
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {material.variant?.sku || material.handle || "-"}
                    </Typography>
                  </TableCell>

                  {/* Availability - combined from local and central warehouse */}
                  <TableCell sx={{ textAlign: "center" }}>
                    <AvailabilityChip
                      availability={availability}
                      size="small"
                    />
                  </TableCell>

                  {/* Price with customer discount indicator */}
                  <TableCell sx={{ textAlign: "right" }}>
                    {hasCustomerDiscount ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            textDecoration: 'line-through',
                            color: 'text.secondary'
                          }}
                        >
                          {formatPrice(basePrice.toString())}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: 'success.main'
                            }}
                          >
                            {formatPrice(customerPrice.toString())}
                          </Typography>
                          <Chip
                            label={`-${customerDiscount}%`}
                            size="small"
                            color="success"
                            sx={{ height: 20, fontSize: '11px' }}
                          />
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {formatPrice(customerPrice.toString())}
                      </Typography>
                    )}
                  </TableCell>

                  {/* Action button */}
                  <TableCell sx={{ textAlign: "center" }}>
                    {isSelectedMaterials ? (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onRemoveMaterial?.(material.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => onAddMaterial?.(material)}
                        disabled={selectedMaterialIds.includes(material.id)}
                        sx={{
                          fontSize: "12px",
                        }}
                      >
                        {selectedMaterialIds.includes(material.id)
                          ? "Vybraté"
                          : "Zvoliť"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {showViewAllButton && false && (
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "center",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => setShowAllModal(true)}
          >
            Zobraziť všetky
          </Button>
        </Box>
      )}

      {/* All Results Modal */}
      <MaterialAllResultsModal
        open={showAllModal}
        onClose={() => setShowAllModal(false)}
        results={results}
        onAddMaterial={onAddMaterial}
        selectedMaterialIds={selectedMaterialIds}
      />
    </>
  );
};

export default MaterialResultsTable;

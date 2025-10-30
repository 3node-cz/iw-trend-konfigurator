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
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import type { MaterialSearchResult } from "../types/shopify";
import MaterialAllResultsModal from "./MaterialAllResultsModal";
import { AvailabilityChip } from "./common";
import { formatPrice } from "../utils/formatting";

interface MaterialResultsTableProps {
  results: MaterialSearchResult[];
  onAddMaterial?: (material: MaterialSearchResult) => void;
  onRemoveMaterial?: (materialId: string) => void;
  showViewAllButton?: boolean;
  isSelectedMaterials?: boolean;
  selectedMaterialIds?: string[];
  customerDiscount?: number; // Customer discount percentage, only show discount columns if > 0
}

const MaterialResultsTable: React.FC<MaterialResultsTableProps> = ({
  results,
  onAddMaterial,
  onRemoveMaterial,
  showViewAllButton = false,
  isSelectedMaterials = false,
  selectedMaterialIds = [],
  customerDiscount = 0,
}) => {
  const [showAllModal, setShowAllModal] = useState(false);

  // Only show discount columns if customer has a discount
  const showDiscountColumns = customerDiscount > 0;

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
                Dostupnosť lokálneho skladu
              </TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                Dostupnosť centrálneho skladu
              </TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: "right" }}>
                {showDiscountColumns ? "Základná cena za MJ" : "Cena za MJ"}
              </TableCell>
              {showDiscountColumns && (
                <TableCell sx={{ fontWeight: 600, textAlign: "right" }}>
                  Zľava na MJ
                </TableCell>
              )}
              {showDiscountColumns && (
                <TableCell sx={{ fontWeight: 600, textAlign: "right" }}>
                  Cena po zľavách
                </TableCell>
              )}
              <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                {isSelectedMaterials ? "Akcie" : "Zvoliť"}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((material) => {
              // Extract warehouse availability from metafields
              const localWarehouseStock =
                material.metafields?.["custom.local_warehouse_stock"] ||
                material.variant?.metafields?.["custom.local_warehouse_stock"];
              const centralWarehouseStock =
                material.metafields?.["custom.central_warehouse_stock"] ||
                material.variant?.metafields?.[
                  "custom.central_warehouse_stock"
                ];

              // Extract pricing info
              const basePrice = material.variant?.price || "0";
              const discount =
                material.metafields?.["custom.discount"] ||
                material.variant?.metafields?.["custom.discount"] ||
                "0";
              const discountPercentage = parseFloat(discount);
              const basePriceNum = parseFloat(basePrice);
              const finalPrice =
                discountPercentage > 0
                  ? basePriceNum * (1 - discountPercentage / 100)
                  : basePriceNum;

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

                  {/* Local warehouse availability */}
                  <TableCell sx={{ textAlign: "center" }}>
                    <AvailabilityChip
                      availability={
                        localWarehouseStock &&
                        parseInt(localWarehouseStock) > 0
                          ? "available"
                          : "unavailable"
                      }
                      size="small"
                    />
                  </TableCell>

                  {/* Central warehouse availability */}
                  <TableCell sx={{ textAlign: "center" }}>
                    <AvailabilityChip
                      availability={
                        centralWarehouseStock &&
                        parseInt(centralWarehouseStock) > 0
                          ? "available"
                          : "unavailable"
                      }
                      size="small"
                    />
                  </TableCell>

                  {/* Base price */}
                  <TableCell sx={{ textAlign: "right" }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatPrice(basePrice)}
                    </Typography>
                  </TableCell>

                  {/* Discount - only show if customer has discount */}
                  {showDiscountColumns && (
                    <TableCell sx={{ textAlign: "right" }}>
                      {discountPercentage > 0 ? (
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: "error.main" }}
                        >
                          -{discountPercentage}%
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          -
                        </Typography>
                      )}
                    </TableCell>
                  )}

                  {/* Final price after discount - only show if customer has discount */}
                  {showDiscountColumns && (
                    <TableCell sx={{ textAlign: "right" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color:
                            discountPercentage > 0
                              ? "primary.main"
                              : "text.primary",
                        }}
                      >
                        {formatPrice(finalPrice.toString())}
                      </Typography>
                    </TableCell>
                  )}

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
        customerDiscount={customerDiscount}
      />
    </>
  );
};

export default MaterialResultsTable;

import React, { useMemo, useCallback, useRef, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Typography,
  Switch,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import type { CuttingPiece, EdgeMaterial } from "../types/shopify";
import {
  DebouncedTextInput,
  DebouncedNumberInput,
  EdgeThicknessSelect,
  HelpTooltip,
  WoodGrainVisualization,
} from "./common";
import PieceShapePreview from "./common/PieceShapePreview";

interface CuttingPiecesTableProps {
  pieces: CuttingPiece[];
  edgeMaterial: EdgeMaterial | null;
  onPieceChange: (pieceId: string, updatedPiece: Partial<CuttingPiece>) => void;
  onRemovePiece: (pieceId: string) => void;
  onPreviewPiece?: (piece: CuttingPiece) => void;
  validationErrors?: { [pieceId: string]: string[] };
}

const columnHelper = createColumnHelper<CuttingPiece>();

const CuttingPiecesTable: React.FC<CuttingPiecesTableProps> = ({
  pieces,
  edgeMaterial,
  onPieceChange,
  onRemovePiece,
  onPreviewPiece,
  validationErrors = {},
}) => {
  // Use refs to store current values to avoid recreating callbacks
  const piecesRef = useRef(pieces);
  const validationErrorsRef = useRef(validationErrors);


  // Update refs when values change
  useEffect(() => {
    piecesRef.current = pieces;
  }, [pieces]);

  useEffect(() => {
    validationErrorsRef.current = validationErrors;
  }, [validationErrors]);

  // Helper function to check if all edges have the same value
  const getEdgeAllAroundValue = useCallback(
    (piece: CuttingPiece): number | null => {
      const { edgeTop, edgeBottom, edgeLeft, edgeRight } = piece;

      // Only set edgeAllAround if all four edges have the same value (including null)
      if (
        edgeTop === edgeBottom &&
        edgeBottom === edgeLeft &&
        edgeLeft === edgeRight
      ) {
        return edgeTop;
      }
      return null;
    },
    [],
  );

  // Enhanced change handler with reactive edge logic
  // Use ref to access pieces without adding it to dependencies
  const handlePieceChange = useCallback(
    (pieceId: string, updates: Partial<CuttingPiece>) => {
      const piece = piecesRef.current.find((p) => p.id === pieceId);
      if (!piece) return;

      let finalUpdates = { ...updates };

      // Handle edgeAllAround changes - set all individual edges
      if ("edgeAllAround" in updates) {
        const edgeAllAroundValue = updates.edgeAllAround;
        finalUpdates = {
          ...finalUpdates,
          edgeTop: edgeAllAroundValue,
          edgeBottom: edgeAllAroundValue,
          edgeLeft: edgeAllAroundValue,
          edgeRight: edgeAllAroundValue,
        };
      }
      // Handle individual edge changes - update edgeAllAround reactively
      else if (
        ["edgeTop", "edgeBottom", "edgeLeft", "edgeRight"].some(
          (key) => key in updates,
        )
      ) {
        const updatedPiece = { ...piece, ...finalUpdates };
        const newEdgeAllAround = getEdgeAllAroundValue(updatedPiece);
        finalUpdates.edgeAllAround = newEdgeAllAround;
      }

      onPieceChange(pieceId, finalUpdates);
    },
    [onPieceChange, getEdgeAllAroundValue],
  );

  const handleRemovePiece = useCallback(
    (pieceId: string) => {
      onRemovePiece(pieceId);
    },
    [onRemovePiece],
  );

  const handlePreviewPiece = useCallback(
    (piece: CuttingPiece) => {
      onPreviewPiece?.(piece);
    },
    [onPreviewPiece],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = useMemo<ColumnDef<CuttingPiece, any>[]>(
    () => [
      // Row number
      columnHelper.display({
        id: "rowNumber",
        header: "#",
        cell: ({ row }) => (
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row.index + 1}
          </Typography>
        ),
        size: 40,
      }),

      // Preview
      columnHelper.display({
        id: "preview",
        header: "Náhľad",
        cell: ({ row }) => {
          const piece = row.original;
          // Only show preview if piece has valid dimensions
          if (!piece.length || !piece.width) {
            return (
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="caption" color="text.disabled">
                  -
                </Typography>
              </Box>
            );
          }
          return (
            <Box
              sx={{
                cursor: onPreviewPiece ? "pointer" : "default",
                "&:hover": onPreviewPiece
                  ? {
                      opacity: 0.8,
                      transform: "scale(1.05)",
                    }
                  : {},
                transition: "all 0.2s ease",
              }}
              onClick={() => onPreviewPiece && handlePreviewPiece(piece)}
              title={onPreviewPiece ? "Kliknite pre detail náhľadu" : ""}
            >
              <PieceShapePreview
                piece={piece}
                containerSize={80}
                showBackground={false}
                showRotationIndicator={false}
                showEdges={true}
              />
            </Box>
          );
        },
        size: 90,
      }),

      // Part Name and Quantity
      columnHelper.display({
        id: "nameAndQuantity",
        header: () => (
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, display: "block" }}
            >
              Názov dielca
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, display: "block" }}
            >
              Počet
            </Typography>
          </Box>
        ),
        size: 150,
        cell: ({ row }) => {
          const piece = row.original;
          return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <DebouncedTextInput
                initialValue={piece.partName || ""}
                onChange={(value) =>
                  handlePieceChange(row.original.id, { partName: value })
                }
                sx={{ minWidth: 130 }}
                placeholder="Názov dielca"
              />
              <DebouncedNumberInput
                initialValue={piece.quantity}
                onChange={(value) =>
                  handlePieceChange(row.original.id, { quantity: value })
                }
                sx={{ minWidth: 130 }}
                min={1}
                placeholder="Počet"
              />
            </Box>
          );
        },
      }),

      // Dimensions (Length x Width)
      columnHelper.display({
        id: "dimensions",
        header: () => (
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, display: "block" }}
            >
              Dĺžka
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, display: "block" }}
            >
              Šírka
            </Typography>
          </Box>
        ),
        size: 120,
        cell: ({ row }) => {
          const piece = row.original;
          const errors = validationErrorsRef.current[piece.id] || [];
          const hasLengthError = errors.some(
            (error) =>
              error.includes("Dĺžka") || error.includes("Rozmery presahujú"),
          );
          const hasWidthError = errors.some(
            (error) =>
              error.includes("Šírka") || error.includes("Rozmery presahujú"),
          );

          return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <DebouncedNumberInput
                initialValue={piece.length || 0}
                onChange={(value) =>
                  handlePieceChange(row.original.id, { length: value })
                }
                sx={{
                  width: 100,
                  "& .MuiOutlinedInput-root": hasLengthError
                    ? {
                        borderColor: "error.main",
                        "&:hover": { borderColor: "error.main" },
                      }
                    : {},
                }}
                min={0}
                error={hasLengthError}
                placeholder="Dĺžka"
              />
              <DebouncedNumberInput
                initialValue={piece.width || 0}
                onChange={(value) =>
                  handlePieceChange(row.original.id, { width: value })
                }
                sx={{
                  width: 100,
                  "& .MuiOutlinedInput-root": hasWidthError
                    ? {
                        borderColor: "error.main",
                        "&:hover": { borderColor: "error.main" },
                      }
                    : {},
                }}
                min={0}
                error={hasWidthError}
                placeholder="Šírka"
              />
            </Box>
          );
        },
      }),

      // Options (Rotation, Without Edge, Dupel)
      columnHelper.display({
        id: "options",
        header: "Nastavenia",
        size: 150,
        cell: ({ row }) => {
          const piece = row.original;
          return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Switch
                  size="small"
                  checked={piece.allowRotation}
                  onChange={(e) =>
                    handlePieceChange(row.original.id, {
                      allowRotation: e.target.checked,
                    })
                  }
                />
                <Typography variant="caption">Rotácia</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Switch
                  size="small"
                  checked={piece.withoutEdge}
                  onChange={(e) =>
                    handlePieceChange(row.original.id, {
                      withoutEdge: e.target.checked,
                    })
                  }
                />
                <Typography variant="caption">Bez orezu</Typography>
                <HelpTooltip
                  title={
                    <>
                      Štandardne sa z každej strany tabule orezáva 15mm
                      (2800×2070mm → 2770×2040mm).
                      <br />
                      Zapnutím tejto možnosti sa orez preskočí.
                    </>
                  }
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Switch
                  size="small"
                  checked={piece.isDupel || false}
                  onChange={(e) =>
                    handlePieceChange(row.original.id, {
                      isDupel: e.target.checked,
                    })
                  }
                />
                <Typography variant="caption">Dupel</Typography>
                <HelpTooltip
                  title={
                    <>
                      Dupel je lepený diel z 2ks rovnakej veľkosti a hrúbky
                      (napr. 18mm → 36mm).
                      <br />
                      Lepí sa z 2 väčších kusov (+20mm na každú stranu), potom
                      sa sformátuje na presný rozmer.
                      <br />
                      Pri optimalizácii sa počíta s dvojnásobným počtom dielcov
                      a väčšími rozmermi.
                    </>
                  }
                />
              </Box>
            </Box>
          );
        },
      }),

      // Edge All Around + Block Input
      columnHelper.display({
        id: "edgeAllAroundAndBlock",
        header: () => (
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, display: "block" }}
            >
              Hrana dookola
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 600 }}
              >
                Blok
              </Typography>
              <HelpTooltip
                title={
                  <>
                    Blok označuje skupinu dielcov, ktoré majú byť nadelené z jednej tabule.
                    <br />
                    Rôzne bloky budú optimalizované samostatne.
                  </>
                }
              />
            </Box>
          </Box>
        ),
        size: 140,
        cell: ({ row }) => {
          const piece = row.original;
          return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <EdgeThicknessSelect
                value={piece.edgeAllAround}
                onChange={(value) =>
                  handlePieceChange(row.original.id, { edgeAllAround: value })
                }
                edgeMaterial={edgeMaterial}
                minWidth={65}
              />
              <DebouncedNumberInput
                initialValue={piece.algorithmValue || 0}
                onChange={(value) =>
                  handlePieceChange(row.original.id, {
                    algorithmValue: Math.max(0, Math.floor(value)),
                  })
                }
                sx={{ minWidth: 65 }}
                min={0}
                step={1}
              />
            </Box>
          );
        },
      }),

      // Individual Edges (2x2 grid)
      columnHelper.display({
        id: "individualEdges",
        header: () => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              Hrany
            </Typography>
            <HelpTooltip
              title={
                <Box sx={{ py: 1, maxWidth: 300 }}>
                  <Typography variant="caption" sx={{ display: "block", mb: 2, fontWeight: 600 }}>
                    Orientácia hrán pri porezávaní materiálu:
                  </Typography>

                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 2,
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    backgroundColor: '#fafafa'
                  }}>
                    <WoodGrainVisualization
                      width={180}
                      height={100}
                      grainDirection="horizontal"
                      showLabels={true}
                      showArrows={false}
                    />
                  </Box>

                  <Typography variant="caption" sx={{ display: "block", mt: 2 }}>
                    Hrany sa aplikujú podľa tejto orientácie pri rezaní materiálu. Smery vlákien dreva sú znázornené horizontálnymi čiarami.
                  </Typography>
                </Box>
              }
            />
          </Box>
        ),
        size: 160,
        cell: ({ row }) => {
          const piece = row.original;
          return (
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0.5 }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontSize: "0.65rem", mb: 0.5 }}
                >
                  Vrchná
                </Typography>
                <EdgeThicknessSelect
                  value={piece.edgeTop}
                  onChange={(value) =>
                    handlePieceChange(row.original.id, { edgeTop: value })
                  }
                  edgeMaterial={edgeMaterial}
                  minWidth={60}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontSize: "0.65rem", mb: 0.5 }}
                >
                  Spodná
                </Typography>
                <EdgeThicknessSelect
                  value={piece.edgeBottom}
                  onChange={(value) =>
                    handlePieceChange(row.original.id, { edgeBottom: value })
                  }
                  edgeMaterial={edgeMaterial}
                  minWidth={60}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontSize: "0.65rem", mb: 0.5 }}
                >
                  Ľavá
                </Typography>
                <EdgeThicknessSelect
                  value={piece.edgeLeft}
                  onChange={(value) =>
                    handlePieceChange(row.original.id, { edgeLeft: value })
                  }
                  edgeMaterial={edgeMaterial}
                  minWidth={60}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontSize: "0.65rem", mb: 0.5 }}
                >
                  Pravá
                </Typography>
                <EdgeThicknessSelect
                  value={piece.edgeRight}
                  onChange={(value) =>
                    handlePieceChange(row.original.id, { edgeRight: value })
                  }
                  edgeMaterial={edgeMaterial}
                  minWidth={60}
                />
              </Box>
            </Box>
          );
        },
      }),

      // Notes
      columnHelper.accessor("notes", {
        header: "Poznámka",
        size: 200,
        cell: ({ row, getValue }) => (
          <DebouncedTextInput
            initialValue={getValue() || ""}
            onChange={(value) =>
              handlePieceChange(row.original.id, { notes: value })
            }
            sx={{
              minWidth: 180,
            }}
            multiline
            rows={3}
            placeholder="Poznámka ku kusu..."
          />
        ),
      }),

      // Actions
      columnHelper.display({
        id: "actions",
        header: "Akcie",
        cell: ({ row }) => {
          const piece = row.original;
          return (
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <IconButton
                size="small"
                color="primary"
                onClick={() => handlePreviewPiece(piece)}
                title="Zobraziť náhľad"
                disabled={!onPreviewPiece || !piece.length || !piece.width}
              >
                <VisibilityIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleRemovePiece(row.original.id)}
                title="Odstrániť dielec"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          );
        },
        size: 80,
      }),
    ],
    [
      edgeMaterial,
      handlePieceChange,
      handleRemovePiece,
      handlePreviewPiece,
      onPreviewPiece,
    ],
  );

  const table = useReactTable({
    data: pieces,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (pieces.length === 0) {
    return (
      <Box
        sx={{
          py: 8,
          textAlign: "center",
          color: "text.secondary",
          border: "2px dashed #e0e0e0",
          borderRadius: 1,
        }}
      >
        <Typography variant="body1">Žiadne kusy na rezanie</Typography>
        <Typography variant="body2">
          Kliknite na "Pridať kus" pre začiatok
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer sx={{ maxHeight: "70vh", overflowX: "auto" }}>
      <Table stickyHeader size="small">
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell
                  key={header.id}
                  sx={{
                    fontWeight: 600,
                    backgroundColor: "#f5f5f5",
                    whiteSpace: "nowrap",
                    minWidth: header.column.columnDef.size || "auto",
                    py: 1,
                    px: 1,
                    textAlign: "center",
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => {
            const piece = row.original;
            const errors = validationErrorsRef.current[piece.id] || [];
            const hasErrors = errors.length > 0;

            return (
              <React.Fragment key={row.id}>
                {/* Main piece row */}
                <TableRow hover>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      sx={{
                        py: 0.5,
                        px: 1,
                        verticalAlign: "middle",
                        borderBottom: hasErrors
                          ? "none"
                          : "1px solid rgba(224, 224, 224, 1)",
                        height: "80px",
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Error row - shown below the piece if there are errors */}
                {hasErrors && (
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      sx={{
                        py: 1,
                        px: 2,
                        backgroundColor: "#fff3e0",
                        borderBottom: "1px solid rgba(224, 224, 224, 1)",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "error.main",
                            fontWeight: 600,
                          }}
                        >
                          ⚠️ Chyby pre kus {row.index + 1}:
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "error.main",
                          }}
                        >
                          {errors.join(", ")}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CuttingPiecesTable;

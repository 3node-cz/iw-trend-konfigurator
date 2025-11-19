import React, { useMemo, useCallback, useRef, useEffect, useState } from "react";
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
  Tooltip,
  Alert,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Tune as TuneIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";
import type { CuttingPiece, EdgeMaterial } from "../types/shopify";
import {
  DebouncedTextInput,
  DebouncedNumberInput,
  EdgeThicknessSelect,
  HelpTooltip,
  WoodGrainVisualization,
  CustomEdgeDialog,
} from "./common";
import PieceShapePreview from "./common/PieceShapePreview";
import NotesDialog from "./common/NotesDialog";

interface CuttingPiecesTableProps {
  pieces: CuttingPiece[];
  edgeMaterial: EdgeMaterial | null;
  availableEdges?: EdgeMaterial[]; // All available edge combinations (3 widths × 2 thicknesses)
  onPieceChange: (pieceId: string, updatedPiece: Partial<CuttingPiece>) => void;
  onRemovePiece: (pieceId: string) => void;
  onCopyPiece?: (piece: CuttingPiece) => void;
  onPreviewPiece?: (piece: CuttingPiece) => void;
  onFieldBlur?: (pieceId: string, fieldName: 'length' | 'width') => void;
  validationErrors?: { [pieceId: string]: string[] };
  readonly?: boolean; // If true, show static text instead of editable inputs
}

const columnHelper = createColumnHelper<CuttingPiece>();

const CuttingPiecesTable: React.FC<CuttingPiecesTableProps> = ({
  pieces,
  edgeMaterial,
  availableEdges = [],
  onPieceChange,
  onRemovePiece,
  onCopyPiece,
  onPreviewPiece,
  onFieldBlur,
  validationErrors = {},
  readonly = false,
}) => {
  // Get messages from settings
  const messages = useMemo(() => {
    try {
      const widgetConfigs = (window as any).ConfiguratorConfig;
      if (widgetConfigs) {
        const firstBlockId = Object.keys(widgetConfigs)[0];
        const config = widgetConfigs[firstBlockId];
        return config?.settings?.messages || {
          unavailableEdges: 'Hrany označené oranžovou farbou nie sú dostupné pre vybranú hrúbku dosky (18mm alebo 36mm pri dupeli). Môžete ich vybrať, ale prosíme uveďte do poznámky alternatívu alebo potvrďte voľbu.',
          placeholderEdges: 'Vybrané hrany sú len náhradné hodnoty. Prosím, aktualizujte ich na skutočné hrany pred odoslaním.'
        };
      }
    } catch (error) {
      console.error('Error loading messages from settings:', error);
    }
    return {
      unavailableEdges: 'Hrany označené oranžovou farbou nie sú dostupné pre vybranú hrúbku dosky (18mm alebo 36mm pri dupeli). Môžete ich vybrať, ale prosíme uveďte do poznámky alternatívu alebo potvrďte voľbu.',
      placeholderEdges: 'Vybrané hrany sú len náhradné hodnoty. Prosím, aktualizujte ich na skutočné hrany pred odoslaním.'
    };
  }, []);

  // Use refs to store current values to avoid recreating callbacks
  const piecesRef = useRef(pieces);
  const validationErrorsRef = useRef(validationErrors);

  // State for notes dialog
  const [notesDialog, setNotesDialog] = useState<{
    open: boolean;
    pieceId: string;
    value: string;
  }>({
    open: false,
    pieceId: "",
    value: "",
  });

  // State for custom edge dialog
  const [customEdgeDialog, setCustomEdgeDialog] = useState<{
    open: boolean;
    pieceId: string;
    piece: CuttingPiece | null;
  }>({
    open: false,
    pieceId: "",
    piece: null,
  });


  // Update refs when values change
  useEffect(() => {
    piecesRef.current = pieces;
  }, [pieces]);

  useEffect(() => {
    validationErrorsRef.current = validationErrors;
  }, [validationErrors]);

  // Helper function to determine which field has errors (DRY principle)
  const getFieldErrors = useCallback((errors: string[]) => {
    // Check if errors relate to length, width, or both
    // Patterns that indicate field-specific errors:
    // - "Dĺžka" -> length field
    // - "Šírka" -> width field
    // - "Rozmery presahujú", "nezmestí sa" -> both fields (dimensional)
    // - "Blok" -> block errors shown on first piece (not field-specific)

    const hasLengthError = errors.some((error) =>
      error.includes("Dĺžka")
    );
    const hasWidthError = errors.some((error) =>
      error.includes("Šírka")
    );
    // Dimensional errors affect both length and width
    const hasDimensionalError = errors.some((error) =>
      error.includes("Rozmery presahujú") ||
      error.includes("nezmestí sa") ||
      error.includes("rotácia zakázaná")
    );

    return {
      hasLengthError: hasLengthError || hasDimensionalError,
      hasWidthError: hasWidthError || hasDimensionalError,
    };
  }, []);

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

  // Helper function to get edge display text for readonly mode
  const getEdgeDisplayText = useCallback((edgeWidth: number | null): string => {
    if (edgeWidth === null) return "-";
    return `${edgeWidth}mm`;
  }, []);

  // Enhanced change handler with reactive edge logic
  // Use ref to access pieces without adding it to dependencies
  const handlePieceChange = useCallback(
    (pieceId: string, updates: Partial<CuttingPiece>) => {
      const piece = piecesRef.current.find((p) => p.id === pieceId);
      if (!piece) return;

      let finalUpdates = { ...updates };

      // Handle edgeAllAround changes - set all individual edges AND clear custom edges
      if ("edgeAllAround" in updates) {
        const edgeAllAroundValue = updates.edgeAllAround;
        finalUpdates = {
          ...finalUpdates,
          edgeTop: edgeAllAroundValue,
          edgeBottom: edgeAllAroundValue,
          edgeLeft: edgeAllAroundValue,
          edgeRight: edgeAllAroundValue,
          // Clear custom edges when using edgeAllAround
          customEdgeTop: null,
          customEdgeBottom: null,
          customEdgeLeft: null,
          customEdgeRight: null,
        };
      }
      // Handle custom edge changes - clear edgeAllAround
      else if (
        ["customEdgeTop", "customEdgeBottom", "customEdgeLeft", "customEdgeRight"].some(
          (key) => key in updates,
        )
      ) {
        // Clear edgeAllAround when custom edges are set
        finalUpdates.edgeAllAround = null;
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

      // Part Name (separate)
      columnHelper.display({
        id: "partName",
        header: "Názov",
        size: 150,
        cell: ({ row }) => {
          const piece = row.original;
          return readonly ? (
            <Typography variant="body2">{piece.partName || "-"}</Typography>
          ) : (
            <DebouncedTextInput
              initialValue={piece.partName || ""}
              onChange={(value) =>
                handlePieceChange(row.original.id, { partName: value })
              }
              sx={{ width: "100%" }}
              placeholder="Názov"
            />
          );
        },
      }),

      // Length (separate)
      columnHelper.display({
        id: "length",
        header: "Dĺžka",
        size: 90,
        cell: ({ row }) => {
          const piece = row.original;
          const errors = validationErrorsRef.current[piece.id] || [];
          const { hasLengthError } = getFieldErrors(errors);

          return readonly ? (
            <Typography variant="body2">{piece.length || 0}mm</Typography>
          ) : (
            <DebouncedNumberInput
              initialValue={piece.length || 0}
              onChange={(value) =>
                handlePieceChange(row.original.id, { length: value })
              }
              onBlur={() => onFieldBlur?.(row.original.id, 'length')}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": hasLengthError
                  ? {
                      borderColor: "error.main",
                      "&:hover": { borderColor: "error.main" },
                    }
                  : {},
              }}
              min={0}
              error={hasLengthError}
              placeholder="L"
            />
          );
        },
      }),

      // Width (separate)
      columnHelper.display({
        id: "width",
        header: "Šírka",
        size: 90,
        cell: ({ row }) => {
          const piece = row.original;
          const errors = validationErrorsRef.current[piece.id] || [];
          const { hasWidthError } = getFieldErrors(errors);

          return readonly ? (
            <Typography variant="body2">{piece.width || 0}mm</Typography>
          ) : (
            <DebouncedNumberInput
              initialValue={piece.width || 0}
              onChange={(value) =>
                handlePieceChange(row.original.id, { width: value })
              }
              onBlur={() => onFieldBlur?.(row.original.id, 'width')}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": hasWidthError
                  ? {
                      borderColor: "error.main",
                      "&:hover": { borderColor: "error.main" },
                    }
                  : {},
              }}
              min={0}
              error={hasWidthError}
              placeholder="W"
            />
          );
        },
      }),

      // Quantity (separate)
      columnHelper.display({
        id: "quantity",
        header: "Počet",
        size: 75,
        cell: ({ row }) => {
          const piece = row.original;
          return readonly ? (
            <Typography variant="body2">{piece.quantity}ks</Typography>
          ) : (
            <DebouncedNumberInput
              initialValue={piece.quantity}
              onChange={(value) =>
                handlePieceChange(row.original.id, { quantity: value })
              }
              sx={{ width: "100%" }}
              min={1}
              placeholder="Ks"
            />
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

          if (readonly) {
            const options = [];
            if (piece.allowRotation) options.push("Rotácia");
            if (piece.withoutEdge) options.push("Bez orezu");
            if (piece.isDupel) options.push("Dupel");

            return (
              <Typography variant="body2">
                {options.length > 0 ? options.join(", ") : "-"}
              </Typography>
            );
          }

          return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  padding: "4px 8px",
                  borderRadius: "4px",
                  transition: "all 0.2s ease",
                  "&:focus-within": {
                    outline: "2px solid",
                    outlineColor: "primary.main",
                    outlineOffset: "2px",
                    boxShadow: "0 0 0 4px rgba(25, 118, 210, 0.15)",
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                  },
                }}
              >
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  padding: "4px 8px",
                  borderRadius: "4px",
                  transition: "all 0.2s ease",
                  "&:focus-within": {
                    outline: "2px solid",
                    outlineColor: "primary.main",
                    outlineOffset: "2px",
                    boxShadow: "0 0 0 4px rgba(25, 118, 210, 0.15)",
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                  },
                }}
              >
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  padding: "4px 8px",
                  borderRadius: "4px",
                  transition: "all 0.2s ease",
                  "&:focus-within": {
                    outline: "2px solid",
                    outlineColor: "primary.main",
                    outlineOffset: "2px",
                    boxShadow: "0 0 0 4px rgba(25, 118, 210, 0.15)",
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                  },
                }}
              >
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

      // Edge All Around column
      columnHelper.display({
        id: "edgeAllAround",
        header: "Hrana dookola",
        size: 80,
        cell: ({ row }) => {
          const piece = row.original;
          return readonly ? (
            <Typography variant="body2">{getEdgeDisplayText(piece.edgeAllAround)}</Typography>
          ) : (
            <EdgeThicknessSelect
              value={piece.edgeAllAround}
              onChange={(value) =>
                handlePieceChange(row.original.id, { edgeAllAround: value })
              }
              edgeMaterial={edgeMaterial}
              availableEdges={availableEdges}
              isDupel={piece.isDupel}
              minWidth={70}
            />
          );
        },
      }),

      // Bottom Edge column
      columnHelper.display({
        id: "edgeBottom",
        header: "Spodná",
        size: 70,
        cell: ({ row }) => {
          const piece = row.original;
          return readonly ? (
            <Typography variant="body2">{getEdgeDisplayText(piece.edgeBottom)}</Typography>
          ) : (
            <EdgeThicknessSelect
              value={piece.edgeBottom}
              onChange={(value) =>
                handlePieceChange(row.original.id, { edgeBottom: value })
              }
              edgeMaterial={piece.customEdgeBottom || edgeMaterial}
              availableEdges={availableEdges}
              isDupel={piece.isDupel}
              minWidth={60}
            />
          );
        },
      }),

      // Top Edge column
      columnHelper.display({
        id: "edgeTop",
        header: "Vrchná",
        size: 70,
        cell: ({ row }) => {
          const piece = row.original;
          return readonly ? (
            <Typography variant="body2">{getEdgeDisplayText(piece.edgeTop)}</Typography>
          ) : (
            <EdgeThicknessSelect
              value={piece.edgeTop}
              onChange={(value) =>
                handlePieceChange(row.original.id, { edgeTop: value })
              }
              edgeMaterial={piece.customEdgeTop || edgeMaterial}
              availableEdges={availableEdges}
              isDupel={piece.isDupel}
              minWidth={60}
            />
          );
        },
      }),

      // Left Edge column
      columnHelper.display({
        id: "edgeLeft",
        header: "Ľavá",
        size: 70,
        cell: ({ row }) => {
          const piece = row.original;
          return readonly ? (
            <Typography variant="body2">{getEdgeDisplayText(piece.edgeLeft)}</Typography>
          ) : (
            <EdgeThicknessSelect
              value={piece.edgeLeft}
              onChange={(value) =>
                handlePieceChange(row.original.id, { edgeLeft: value })
              }
              edgeMaterial={piece.customEdgeLeft || edgeMaterial}
              availableEdges={availableEdges}
              isDupel={piece.isDupel}
              minWidth={60}
            />
          );
        },
      }),

      // Right Edge column
      columnHelper.display({
        id: "edgeRight",
        header: "Pravá",
        size: 70,
        cell: ({ row }) => {
          const piece = row.original;
          return readonly ? (
            <Typography variant="body2">{getEdgeDisplayText(piece.edgeRight)}</Typography>
          ) : (
            <EdgeThicknessSelect
              value={piece.edgeRight}
              onChange={(value) =>
                handlePieceChange(row.original.id, { edgeRight: value })
              }
              edgeMaterial={piece.customEdgeRight || edgeMaterial}
              availableEdges={availableEdges}
              isDupel={piece.isDupel}
              minWidth={60}
            />
          );
        },
      }),

      // Custom Edge Button column - hide in readonly mode
      ...(!readonly ? [columnHelper.display({
        id: "customEdgeButton",
        header: "",
        size: 50,
        cell: ({ row }) => {
          const piece = row.original;
          const hasAnyEdge = piece.edgeTop || piece.edgeBottom || piece.edgeLeft || piece.edgeRight;

          return hasAnyEdge ? (
            <Tooltip title="Nastaviť inú hranu pre jednotlivé strany">
              <IconButton
                size="small"
                onClick={() =>
                  setCustomEdgeDialog({
                    open: true,
                    pieceId: row.original.id,
                    piece: row.original,
                  })
                }
              >
                <TuneIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : null;
        },
      })] : []),

      // Block column (moved after edges)
      columnHelper.display({
        id: "block",
        header: () => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "center" }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              Blok
            </Typography>
            {!readonly && <HelpTooltip
              title={
                <>
                  Blok označuje skupinu dielcov, ktoré majú byť nadelené z jednej tabule.
                  <br />
                  Rôzne bloky budú optimalizované samostatne.
                </>
              }
            />}
          </Box>
        ),
        size: 70,
        cell: ({ row }) => {
          const piece = row.original;
          return readonly ? (
            <Typography variant="body2">{piece.algorithmValue || 0}</Typography>
          ) : (
            <DebouncedNumberInput
              initialValue={piece.algorithmValue || 0}
              onChange={(value) =>
                handlePieceChange(row.original.id, {
                  algorithmValue: Math.max(0, Math.floor(value)),
                })
              }
              sx={{ width: "100%" }}
              min={0}
              step={1}
            />
          );
        },
      }),

      // Notes
      columnHelper.accessor("notes", {
        header: "Poznámka",
        size: 200,
        cell: ({ row, getValue }) => readonly ? (
          <Typography variant="body2" sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>
            {getValue() || "-"}
          </Typography>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <DebouncedTextInput
              initialValue={getValue() || ""}
              onChange={(value) =>
                handlePieceChange(row.original.id, { notes: value })
              }
              sx={{
                flex: 1,
                minWidth: 120,
                "& .MuiInputBase-input": {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }
              }}
              placeholder="Poznámka"
            />
            <Tooltip title="Upraviť poznámku">
              <IconButton
                size="small"
                onClick={() =>
                  setNotesDialog({
                    open: true,
                    pieceId: row.original.id,
                    value: getValue() || "",
                  })
                }
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      }),

      // Preview Button - Miniature shape (keep in readonly for visual reference)
      columnHelper.display({
        id: "preview",
        header: "Náhľad",
        size: 80,
        cell: ({ row }) => {
          const piece = row.original;
          return (
            <Tooltip title={readonly ? "Náhľad dielca" : "Kliknutím zobraziť náhľad dielca"}>
              <Box
                onClick={() => !readonly && onPreviewPiece?.(piece)}
                sx={{
                  cursor: !readonly && onPreviewPiece ? 'pointer' : 'default',
                  opacity: 1,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': !readonly && onPreviewPiece ? {
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  } : {},
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <PieceShapePreview
                  piece={piece}
                  containerSize={60}
                  showBackground={false}
                  showEdges={true}
                  showRotationIndicator={false}
                />
              </Box>
            </Tooltip>
          );
        },
      }),

      // Copy Piece Button - hide in readonly mode
      ...(!readonly ? [columnHelper.display({
        id: "copyPiece",
        header: "Kopírovať",
        size: 90,
        cell: ({ row }) => {
          const piece = row.original;
          return (
            <Tooltip title="Kopírovať dielec">
              <IconButton
                size="small"
                color="primary"
                onClick={() => onCopyPiece?.(piece)}
                disabled={!onCopyPiece}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          );
        },
      })] : []),

      // Delete Button - hide in readonly mode
      ...(!readonly ? [columnHelper.display({
        id: "actions",
        header: "Odstrániť",
        size: 90,
        cell: ({ row }) => {
          return (
            <Tooltip title="Odstrániť dielec">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleRemovePiece(row.original.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          );
        },
      })] : []),
    ],
    [
      edgeMaterial,
      availableEdges,
      handlePieceChange,
      handleRemovePiece,
      onCopyPiece,
      getFieldErrors,
      readonly,
      getEdgeDisplayText,
    ],
  );

  const table = useReactTable({
    data: pieces,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Check if any piece has placeholder edges (edges that start with "...")
  const hasPlaceholderEdges = useMemo(() => {
    return pieces.some((piece) => {
      const customEdges = [
        piece.customEdgeTop,
        piece.customEdgeBottom,
        piece.customEdgeLeft,
        piece.customEdgeRight,
      ];
      return customEdges.some(
        (edge) => edge && edge.title && edge.title.startsWith("...")
      );
    });
  }, [pieces]);

  // Check if any edge thickness is unavailable (placeholder) for current board thickness
  const hasUnavailableEdgeThicknesses = useMemo(() => {
    console.log('🔍 [hasUnavailableEdgeThicknesses] Checking pieces:', pieces.length)
    console.log('🔍 [hasUnavailableEdgeThicknesses] Available edges:', availableEdges?.length || 0)

    if (availableEdges && availableEdges.length > 0) {
      console.log('🔍 [hasUnavailableEdgeThicknesses] Edge matrix:')
      availableEdges.forEach(edge => {
        const icon = edge.isPlaceholder ? '⚠️' : '✅'
        console.log(`   ${icon} ${edge.edgeWidth}mm × ${edge.boardThickness}mm - ${edge.name}`)
      })
    }

    const result = pieces.some((piece) => {
      const boardThickness = piece.isDupel ? 36 : 18;
      const edgeValues = [
        piece.edgeTop,
        piece.edgeBottom,
        piece.edgeLeft,
        piece.edgeRight,
        piece.edgeAllAround,
      ].filter((val) => val !== null);

      console.log(`🔍 [Piece ${piece.partName || piece.id}]:`, {
        isDupel: piece.isDupel,
        boardThickness,
        edgeValues
      })

      const hasPlaceholder = edgeValues.some((edgeWidth) => {
        const edge = availableEdges?.find(
          (e) => e.edgeWidth === edgeWidth && e.boardThickness === boardThickness
        );

        console.log(`   🔍 Looking for edge: ${edgeWidth}mm × ${boardThickness}mm →`, {
          found: !!edge,
          edgeName: edge?.name,
          isPlaceholder: edge?.isPlaceholder || false
        })

        return edge?.isPlaceholder || false;
      });

      if (hasPlaceholder) {
        console.log(`   ⚠️ Piece has placeholder edges!`)
      }

      return hasPlaceholder
    });

    console.log('🔍 [hasUnavailableEdgeThicknesses] Final result:', result)
    return result
  }, [pieces, availableEdges]);

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
          Kliknite na "Pridať kus"
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer sx={{ overflowX: "auto" }}>
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
                    {row.getVisibleCells().map((cell) => {
                      // Determine if this is an edge column with a custom edge
                      const columnId = cell.column.id;
                      const hasCustomEdge =
                        (columnId === "edgeTop" && piece.customEdgeTop) ||
                        (columnId === "edgeBottom" && piece.customEdgeBottom) ||
                        (columnId === "edgeLeft" && piece.customEdgeLeft) ||
                        (columnId === "edgeRight" && piece.customEdgeRight);

                      return (
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
                            backgroundColor: hasCustomEdge
                              ? "rgba(255, 193, 7, 0.08)"
                              : "transparent",
                            borderLeft: hasCustomEdge
                              ? "3px solid rgba(255, 193, 7, 0.6)"
                              : "none",
                            transition: "background-color 0.2s ease",
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      );
                    })}
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

      {/* Warning message for unavailable edge thicknesses */}
      {hasUnavailableEdgeThicknesses && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {messages.unavailableEdges}
        </Alert>
      )}

      {/* Warning message for placeholder edges */}
      {hasPlaceholderEdges && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {messages.placeholderEdges}
        </Alert>
      )}

      <NotesDialog
        open={notesDialog.open}
        initialValue={notesDialog.value}
        onClose={() =>
          setNotesDialog({ open: false, pieceId: "", value: "" })
        }
        onSave={(notes) => handlePieceChange(notesDialog.pieceId, { notes })}
      />

      <CustomEdgeDialog
        open={customEdgeDialog.open}
        onClose={() =>
          setCustomEdgeDialog({ open: false, pieceId: "", piece: null })
        }
        onSave={(edges) => {
          handlePieceChange(customEdgeDialog.pieceId, {
            customEdgeTop: edges.customEdgeTop,
            customEdgeBottom: edges.customEdgeBottom,
            customEdgeLeft: edges.customEdgeLeft,
            customEdgeRight: edges.customEdgeRight,
          });
        }}
        initialEdges={{
          customEdgeTop: customEdgeDialog.piece?.customEdgeTop,
          customEdgeBottom: customEdgeDialog.piece?.customEdgeBottom,
          customEdgeLeft: customEdgeDialog.piece?.customEdgeLeft,
          customEdgeRight: customEdgeDialog.piece?.customEdgeRight,
        }}
      />
    </>
  );
};

export default CuttingPiecesTable;

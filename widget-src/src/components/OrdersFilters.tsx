import React, { useState, useEffect } from "react";
import { Box, Paper, TextField, Button } from "@mui/material";
import Grid from "@mui/system/Grid";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface OrdersFiltersProps {
  onFiltersChange?: (filters: {
    searchText: string;
    dateFrom: Date | null;
    dateTo: Date | null;
  }) => void;
}

const OrdersFilters: React.FC<OrdersFiltersProps> = ({ onFiltersChange }) => {
  const [searchText, setSearchText] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  // Real-time filtering - emit changes whenever filters change
  useEffect(() => {
    onFiltersChange?.({
      searchText,
      dateFrom,
      dateTo,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, dateFrom, dateTo]); // onFiltersChange omitted to prevent infinite renders

  const handleClearFilters = () => {
    setSearchText("");
    setDateFrom(null);
    setDateTo(null);
  };

  const hasActiveFilters = searchText || dateFrom || dateTo;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} sx={{ alignItems: "center" }}>
          {/* Search Input */}
          <Grid size={{ xs: 12, md: 5 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Zadejte číslo zákazky, název zákazky, adresa převzdávací jednotky"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "white" } }}
            />
          </Grid>

          {/* Date Range */}
          <Grid size={{ xs: 12, md: 3 }}>
            <DatePicker
              label="Datum objednání od"
              value={dateFrom}
              onChange={(date) => setDateFrom(date)}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  sx: {
                    "& .MuiOutlinedInput-root": { backgroundColor: "white" },
                  },
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <DatePicker
              label="Datum objednání do"
              value={dateTo}
              onChange={(date) => setDateTo(date)}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  sx: {
                    "& .MuiOutlinedInput-root": { backgroundColor: "white" },
                  },
                },
              }}
            />
          </Grid>

          {/* Clear Filters Button - Only show if filters are active */}
          <Grid size={{ xs: 12, md: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {hasActiveFilters && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ClearIcon />}
                  onClick={handleClearFilters}
                  sx={{ minWidth: "auto", px: 2 }}
                >
                  Zrušiť
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </LocalizationProvider>
  );
};

export default OrdersFilters;

import React, { useState, useEffect } from "react";
import { Box, Container, Alert, Collapse, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import OrdersHeader from "./OrdersHeader";
import OrdersFilters from "./OrdersFilters";
import OrdersTable from "./OrdersTable";
import type { OrderFormData } from "../types/shopify";
import type { SavedConfiguration } from "../types/optimized-saved-config";
import type { CustomerOrderData } from "../services/customerApi";
import type { ShopConfig } from "../main";

interface OrdersPageProps {
  onOrderCreated?: (orderData: OrderFormData) => void;
  onLoadConfiguration?: (order: SavedConfiguration) => void; // Navigate to order summary with loaded config
  customer?: CustomerOrderData | null;
  shopConfig: ShopConfig;
}

const OrdersPage: React.FC<OrdersPageProps> = ({
  onOrderCreated,
  onLoadConfiguration,
  customer,
  shopConfig,
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [filters, setFilters] = useState<{
    searchText: string;
    dateFrom: Date | null;
    dateTo: Date | null;
  }>({
    searchText: "",
    dateFrom: null,
    dateTo: null,
  });

  const handleOrderCreated = (orderData: OrderFormData) => {
    // Generate a mock order number for the success message
    const orderNumber = Math.floor(Math.random() * 900000000) + 100000000;
    setAlertMessage(`Zákazka ${orderNumber} byla uložena`);
    setShowAlert(true);

    // Call the parent callback
    onOrderCreated?.(orderData);
  };

  const handleDeleteOrder = (order: SavedConfiguration) => {
    // For now, just show an alert
    setAlertMessage(`Zákazka ${order.name} bola označená na zmazanie`);
    setShowAlert(true);
  };

  const handleFiltersChange = (newFilters: {
    searchText: string;
    dateFrom: Date | null;
    dateTo: Date | null;
  }) => {
    setFilters(newFilters);
  };

  // Auto-hide alert after 5 seconds
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Success/Error Alert Bar */}
      <Collapse in={showAlert}>
        <Alert
          severity="success"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setShowAlert(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ borderRadius: 0 }}
        >
          {alertMessage}
        </Alert>
      </Collapse>

      <Container
        maxWidth={false}
        sx={{ maxWidth: "1920px", mx: "auto", py: 3 }}
      >
        <OrdersHeader onOrderCreated={handleOrderCreated} customer={customer} shopConfig={shopConfig} />
        {/* Temporarily hidden - filters section */}
        {/* <OrdersFilters onFiltersChange={handleFiltersChange} /> */}
        <OrdersTable
          onLoadConfiguration={onLoadConfiguration}
          onDeleteOrder={handleDeleteOrder}
          filters={filters}
        />
      </Container>
    </Box>
  );
};

export default OrdersPage;

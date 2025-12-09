import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Alert,
  TextField,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import Grid from "@mui/system/Grid";
import { z } from "zod";
import {
  orderSchema,
  type OrderFormData,
  getFieldErrors,
  createOrderWithCustomerDefaults,
} from "../schemas/orderSchema";
import { FormTextField, FormSelect } from "./common"
import type { CustomerOrderData } from "../services/customerApi";
import { ORDER_CONFIG } from "../constants";
import type { ShopConfig } from "../main";

interface CreateOrderModalProps {
  open: boolean;
  onClose: () => void;
  onOrderCreated?: (orderData: OrderFormData) => void;
  customer?: CustomerOrderData | null;
  shopConfig: ShopConfig;
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  open,
  onClose,
  onOrderCreated,
  customer,
  shopConfig,
}) => {

  const [formData, setFormData] = useState<OrderFormData>(() => {
    const defaultDeliveryDate = new Date();
    defaultDeliveryDate.setDate(defaultDeliveryDate.getDate() + ORDER_CONFIG.DEFAULT_DELIVERY_DAYS);

    const customerDefaults = createOrderWithCustomerDefaults(customer);

    // Validate processingType - ensure it's in available options before spreading
    if (customerDefaults.processingType && !shopConfig.processingTypes.includes(customerDefaults.processingType)) {
      console.warn(`⚠️ Customer's processingType "${customerDefaults.processingType}" not in available options, using default`);
      customerDefaults.processingType = shopConfig.processingTypes[0] || "Zlikvidovať";
    }

    return {
      orderName: "",
      deliveryDate: defaultDeliveryDate,
      notes: "",
      customerName: "",
      company: "",
      transferLocation: "",
      costCenter: shopConfig.transferLocations[0]?.split(" - ")[0] || "", // Set first branch as default
      cuttingCenter: "",
      deliveryMethod: shopConfig.deliveryMethods[0] || "", // Set first delivery method as default
      processingType: shopConfig.processingTypes[0] || "Zlikvidovať",
      discountPercentage: 0, // Always initialize to prevent undefined.toString() crash
      ...customerDefaults,
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form data when dialog opens with fresh customer data
  React.useEffect(() => {
    if (open) {
      const defaultDeliveryDate = new Date();
      defaultDeliveryDate.setDate(defaultDeliveryDate.getDate() + ORDER_CONFIG.DEFAULT_DELIVERY_DAYS);

      const customerDefaults = createOrderWithCustomerDefaults(customer);

      // Validate processingType - ensure it's in available options before spreading
      if (customerDefaults.processingType && !shopConfig.processingTypes.includes(customerDefaults.processingType)) {
        console.warn(`⚠️ Customer's processingType "${customerDefaults.processingType}" not in available options, using default`);
        customerDefaults.processingType = shopConfig.processingTypes[0] || "Zlikvidovať";
      }

      setFormData({
        orderName: "",
        deliveryDate: defaultDeliveryDate,
        notes: "",
        customerName: "",
        company: "",
        transferLocation: "",
        costCenter: shopConfig.transferLocations[0]?.split(" - ")[0] || "", // Set first branch as default
        cuttingCenter: "",
        deliveryMethod: shopConfig.deliveryMethods[0] || "", // Set first delivery method as default
        processingType: shopConfig.processingTypes[0] || "Zlikvidovať",
        discountPercentage: 0,
        ...customerDefaults,
      });
      setErrors({});
    }
  }, [open, customer, shopConfig]);

  // Use dynamic options from shop config
  const locations = shopConfig.transferLocations;
  const deliveryMethods = shopConfig.deliveryMethods;
  const processingTypes = shopConfig.processingTypes;

  const handleSubmit = () => {
    try {
      // Validate form with Zod
      const validatedData = orderSchema.parse(formData);

      // Clear errors if validation passes
      setErrors({});

      // Handle form submission
      onOrderCreated?.(validatedData);
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        const fieldErrors = getFieldErrors(error);
        setErrors(fieldErrors);
      }
    }
  };

  const clearFieldError = (field: keyof OrderFormData) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleFieldChange = (field: keyof OrderFormData) => (event: any) => {
    const value = event.target.value;

    // Clear error for this field when user makes changes
    clearFieldError(field);

    // Real-time validation for this field only
    if (value.trim()) {
      try {
        const fieldSchema = orderSchema.shape[field];
        if (fieldSchema) {
          fieldSchema.parse(value);
        }
      } catch (error) {
        // Field is still invalid, but don't show error until form submit
      }
    }

    if (field === "costCenter") {
      // When costCenter (Pobočka) changes, auto-populate transferLocation and cuttingCenter
      let transferLocation = "";

      if (value === "Žilina") {
        transferLocation = "ZIL - IW TREND, s.r.o., K cintorínu, Žilina";
      } else if (value === "Partizánske") {
        transferLocation = "PAR - IW TREND, s.r.o., Nitrianska cesta 50360, CEBO HOLDING, Partizánske";
      } else if (value === "Bratislava") {
        transferLocation = "CEN - IW TREND, s.r.o., Pri majerí 6, Bratislava";
      }

      // Clear errors for auto-populated fields too
      clearFieldError("transferLocation");
      clearFieldError("cuttingCenter");

      // Update all three fields
      setFormData((prev) => ({
        ...prev,
        costCenter: value,
        transferLocation: transferLocation,
        cuttingCenter: value,
      }));
    } else {
      // Handle number fields specially
      const processedValue =
        field === "discountPercentage" ? parseFloat(value) || 0 : value;

      setFormData((prev) => ({
        ...prev,
        [field]: processedValue,
      }));
    }
  };

  const handleCheckboxChange =
    (field: keyof OrderFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.checked,
      }));
    };

  // Dialog renders in shadow DOM (no explicit container)
  return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: "600px" },
        }}
      >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ color: "primary.main", fontWeight: 600 }}
        >
          Zákazka formátovania
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: "grey.500" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Miesto prevzatia a nárezové centrum sa automaticky nastavia podľa vybranej pobočky
        </Alert>

        <Alert severity="info" sx={{ mb: 3 }}>
          Předpokládaný datum výroby bude {ORDER_CONFIG.DEFAULT_DELIVERY_DAYS} dní od vytvoření objednávky
        </Alert>

        <Grid container spacing={3}>
          {/* Customer Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormTextField
              label="Meno zákazníka"
              value={formData.customerName}
              onChange={handleFieldChange("customerName")}
              error={errors.customerName}
              placeholder="Zadajte meno zákazníka"
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormTextField
              label="Firma"
              value={formData.company}
              onChange={handleFieldChange("company")}
              error={errors.company}
              required
            />
          </Grid>

          {/* Branch - drives transferLocation and cuttingCenter */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormSelect
              label="Pobočka"
              value={formData.costCenter}
              onChange={handleFieldChange("costCenter")}
              options={["Bratislava", "Žilina", "Partizánske"]}
              error={errors.costCenter}
              required
            />
          </Grid>

          {/* Order Details */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormTextField
              label="Názov zákazky"
              value={formData.orderName}
              onChange={handleFieldChange("orderName")}
              placeholder="Názov projektu"
              error={errors.orderName}
              required
            />
          </Grid>

          {/* Delivery and Processing */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormSelect
              label="Spôsob dopravy"
              value={formData.deliveryMethod}
              onChange={handleFieldChange("deliveryMethod")}
              options={deliveryMethods}
              error={errors.deliveryMethod}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormSelect
              label="Spracovania odpadu"
              value={formData.processingType}
              onChange={handleFieldChange("processingType")}
              options={processingTypes}
              error={errors.processingType}
              required
            />
          </Grid>

          {/* Notes */}
          <Grid size={{ xs: 12 }}>
            <FormTextField
              label="Poznámka"
              value={formData.notes}
              onChange={handleFieldChange("notes")}
              error={errors.notes}
              multiline
              rows={3}
              placeholder="Zadajte poznámku..."
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button variant="contained" onClick={handleSubmit}>
          Vytvoriť
        </Button>
      </DialogActions>
      </Dialog>
  );
};

export default CreateOrderModal;

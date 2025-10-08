import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button
} from '@mui/material'
import {
  Add as AddIcon
} from '@mui/icons-material'
import CreateOrderModal from './CreateOrderModal'
import type { OrderFormData } from '../types/shopify'
import type { CustomerOrderData } from '../services/customerApi'

interface OrdersHeaderProps {
  onOrderCreated?: (orderData: OrderFormData) => void
  customer?: CustomerOrderData | null
}

const OrdersHeader: React.FC<OrdersHeaderProps> = ({ onOrderCreated, customer }) => {
  const [modalOpen, setModalOpen] = useState(false)

  const handleCreateOrder = () => {
    // Test: Log computed font sizes to verify rem calculations
    const button = document.querySelector('button[aria-label*="Vytvořit"], button:has(span:contains("Vytvořit"))');
    if (button) {
      const styles = window.getComputedStyle(button);
      console.log('🧪 Shadow DOM rem test:', {
        buttonFontSize: styles.fontSize,
        buttonPadding: styles.padding,
        htmlBaseFontSize: window.getComputedStyle(document.documentElement).fontSize,
        shadowRootHostFontSize: button.closest('[data-configurator-widget]')
          ? window.getComputedStyle(button.closest('[data-configurator-widget]')!).fontSize
          : 'N/A'
      });
    }
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  return (
    <>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}
      >
        <Typography variant="h4" component="h1" sx={{ color: 'primary.main', fontWeight: 500 }}>
          Zákazky
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateOrder}
          sx={{
            px: 3
          }}
        >
          Vytvořit novou zákazku
        </Button>
      </Box>

      <CreateOrderModal
        open={modalOpen}
        onClose={handleCloseModal}
        onOrderCreated={onOrderCreated}
        customer={customer}
      />
    </>
  )
}

export default OrdersHeader
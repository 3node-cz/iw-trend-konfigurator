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

interface OrdersHeaderProps {
  onOrderCreated?: (orderData: OrderFormData) => void
}

const OrdersHeader: React.FC<OrdersHeaderProps> = ({ onOrderCreated }) => {
  const [modalOpen, setModalOpen] = useState(false)

  const handleCreateOrder = () => {
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
        <Typography variant="h4" component="h1" sx={{ color: '#1976d2', fontWeight: 500 }}>
          Zákazky
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateOrder}
          sx={{
            bgcolor: '#4caf50',
            '&:hover': {
              bgcolor: '#45a049'
            },
            textTransform: 'none',
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
      />
    </>
  )
}

export default OrdersHeader
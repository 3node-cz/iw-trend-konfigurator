import React from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Button
} from '@mui/material'
import {
  CheckCircle as CheckCircleIcon,
  ShoppingCart as ShoppingCartIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'

interface OrderSuccessPageProps {
  checkoutUrl: string
  orderName: string
  onCreateNewOrder?: () => void
}

const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
  checkoutUrl,
  orderName,
  onCreateNewOrder
}) => {
  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <Paper sx={{ p: 6, borderRadius: 2 }}>
        <CheckCircleIcon sx={{ fontSize: 100, color: 'success.main', mb: 3 }} />
        
        <Typography variant="h4" sx={{ color: 'success.main', mb: 2, fontWeight: 600 }}>
          Zákazka bola úspešne pridaná do košíka!
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 8, fontWeight: 500 }}>
          "{orderName}"
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingCartIcon />}
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ 
              minWidth: 250,
              py: 1.5,
              fontSize: '1.1rem',
              bgcolor: 'success.main',
              '&:hover': {
                bgcolor: 'success.dark'
              }
            }}
          >
            Otvoriť košík a dokončiť objednávku
          </Button>
          
          {onCreateNewOrder && (
            <Button
              variant="outlined"
              size="large"
              startIcon={<RefreshIcon />}
              onClick={onCreateNewOrder}
              sx={{ 
                minWidth: 200,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Vytvoriť novú zákazku
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  )
}

export default OrderSuccessPage
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
        
        <Typography variant="h3" sx={{ color: 'success.main', mb: 2, fontWeight: 600 }}>
          Zákazka bola úspešne pridaná do košíka!
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
          "{orderName}"
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Vaša zákazka s konfiguráciou materiálov a rozrezových plánov bola úspešne pridaná do košíka v Shopify systéme. 
          Kliknite na tlačidlo nižšie pre dokončenie objednávky a platby.
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
        
        <Box sx={{ mt: 4, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2" color="info.dark">
            <strong>Ďalšie kroky:</strong> V košíku skontrolujte všetky položky a pokračujte k platbe. 
            Rozrezové plány a špecifikácie sú uložené ako súčasť objednávky.
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default OrderSuccessPage
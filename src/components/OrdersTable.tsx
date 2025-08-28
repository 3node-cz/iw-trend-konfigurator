import React from 'react'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Typography
} from '@mui/material'
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon
} from '@mui/icons-material'

interface Order {
  id: string
  type: string
  orderNumber: string
  customerName: string
  orderDate: string
  state: string
  location: string
  supplier: string
  company: string
  actions: string
}

const dummyOrders: Order[] = [
  {
    id: '1',
    type: 'Detail',
    orderNumber: '251064269',
    customerName: 'Polica Aricoma',
    orderDate: '',
    state: 'Rozrezávaná',
    location: 'Bratislava',
    supplier: 'Demos obchod',
    company: 'IW TREND, s.r.o',
    actions: 'edit'
  },
  {
    id: '2',
    type: 'Detail',
    orderNumber: '251015834',
    customerName: 'Skrinka SA2',
    orderDate: '',
    state: 'Rozrezávaná',
    location: 'Bratislava',
    supplier: 'Demos obchod',
    company: 'IW TREND, s.r.o',
    actions: 'edit'
  },
  {
    id: '3',
    type: 'Detail',
    orderNumber: '251001287',
    customerName: 'Skrinka SA1',
    orderDate: '',
    state: 'Rozrezávaná',
    location: 'Bratislava',
    supplier: 'Demos obchod',
    company: 'IW TREND, s.r.o',
    actions: 'edit'
  },
  {
    id: '4',
    type: 'Detail',
    orderNumber: '241080221',
    customerName: 'Skrinka SA',
    orderDate: '',
    state: 'Rozrezávaná',
    location: 'Bratislava',
    supplier: 'Demos obchod',
    company: 'IW TREND, s.r.o',
    actions: 'edit'
  },
  {
    id: '5',
    type: 'Detail',
    orderNumber: '241088929',
    customerName: 'Skrinka SA',
    orderDate: '',
    state: 'Rozrezávaná',
    location: 'Dolný Hričov',
    supplier: 'Demos obchod',
    company: 'IW TREND, s.r.o',
    actions: 'edit'
  },
  {
    id: '6',
    type: 'Detail',
    orderNumber: '222090290',
    customerName: 'skruska',
    orderDate: '',
    state: 'Rozrezávaná',
    location: 'Centrála',
    supplier: 'Demos obchod',
    company: 'IW TREND, s.r.o',
    actions: 'edit'
  },
  {
    id: '7',
    type: 'Detail',
    orderNumber: '2009.4227210',
    customerName: 'Skruska',
    orderDate: '',
    state: 'Rozrezávaná',
    location: 'Bratislava',
    supplier: 'Demos obchod',
    company: 'IW TREND, s.r.o',
    actions: 'edit'
  }
]

const getStateColor = (state: string) => {
  switch (state) {
    case 'Rozrezávaná':
      return 'warning'
    case 'Hotová':
      return 'success'
    case 'Formátování':
      return 'info'
    default:
      return 'default'
  }
}

const OrdersTable: React.FC = () => {
  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600 }}>Typ zákazky</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Číslo zákazky</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Názov zákazky</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Číslo objednávky</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Stav</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Dátum objednania</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Plán dokončenia</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Pobočka</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Spolok dodávateľa</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Príloha</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Pozmenitenie</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Zákazník</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyOrders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>
                  <Chip 
                    label="Detail" 
                    size="small" 
                    color="success" 
                    variant="filled"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                    {order.orderNumber}
                  </Typography>
                </TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>
                  <Chip 
                    label={order.state} 
                    size="small" 
                    color={getStateColor(order.state)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>{order.location}</TableCell>
                <TableCell>{order.supplier}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">{order.company}</Typography>
                    <IconButton size="small" color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Table Footer with Pagination Info */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e0e0e0' }}>
        <Typography variant="body2" color="text.secondary">
          Zobrazuje sa 1 až 7 z 7 záznamov
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Stránka 1 z 1
        </Typography>
      </Box>
    </Paper>
  )
}

export default OrdersTable
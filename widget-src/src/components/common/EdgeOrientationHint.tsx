import React from 'react'
import { Box, Typography } from '@mui/material'
import WoodGrainVisualization from './WoodGrainVisualization'

const EdgeOrientationHint: React.FC = () => {
  return (
    <Box sx={{ py: 1 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Orientácia hrán pri porezávaní materiálu:
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mb: 2,
        p: 4,
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        backgroundColor: '#fafafa'
      }}>
        <WoodGrainVisualization 
          width={200}
          height={120}
          grainDirection="horizontal"
          showLabels={true}
          showArrows={false}
        />
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
        Hrany sa aplikujú podľa tejto orientácie pri rezaní materiálu. Smery vlákien dreva sú znázornené horizontálnymi čiarami.
      </Typography>
    </Box>
  )
}

export default EdgeOrientationHint
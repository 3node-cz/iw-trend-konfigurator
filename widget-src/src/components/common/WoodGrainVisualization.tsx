import React from 'react'
import { Box, Typography } from '@mui/material'
import woodGrainImage from '../../assets/paper-wood-grain.jpg'

interface WoodGrainVisualizationProps {
  width?: number
  height?: number
  grainDirection?: 'horizontal' | 'vertical'
  showLabels?: boolean
  showArrows?: boolean
}

const WoodGrainVisualization: React.FC<WoodGrainVisualizationProps> = ({
  width = 200,
  height = 120,
  grainDirection = 'horizontal',
  showLabels = true,
  showArrows = false
}) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <Box
        sx={{
          width,
          height,
          border: '2px solid #333',
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent'
        }}
      >
        {/* Wood grain background layer */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${woodGrainImage}), linear-gradient(${grainDirection === 'vertical' ? '0deg' : '90deg'},
              #D2B48C 0%,
              #DEB887 10%,
              #D2B48C 20%,
              #DEB887 30%,
              #D2B48C 40%,
              #DEB887 50%,
              #D2B48C 60%,
              #DEB887 70%,
              #D2B48C 80%,
              #DEB887 90%,
              #D2B48C 100%)`,
            backgroundSize: 'cover, 100% 100%',
            backgroundPosition: 'center, center',
            backgroundRepeat: 'no-repeat, no-repeat',
            transform: 'scale(1.8)',
            transformOrigin: 'center'
          }}
        />
        
        {/* Semi-transparent overlay for better text visibility */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            zIndex: 1
          }}
        />
        
        {/* Arrows indicating grain direction */}
        {showArrows && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 2
            }}
          >
            <svg width={width} height={height}>
              {grainDirection === 'horizontal' ? (
                <>
                  <defs>
                    <marker
                      id="arrowhead-horizontal"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 10 3.5, 0 7"
                        fill="#FF4444"
                      />
                    </marker>
                  </defs>
                  <line
                    x1="20"
                    y1={height / 2}
                    x2={width - 30}
                    y2={height / 2}
                    stroke="#FF4444"
                    strokeWidth="3"
                    markerEnd="url(#arrowhead-horizontal)"
                  />
                </>
              ) : (
                <>
                  <defs>
                    <marker
                      id="arrowhead-vertical"
                      markerWidth="7"
                      markerHeight="10"
                      refX="3.5"
                      refY="9"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 3.5 10, 7 0"
                        fill="#FF4444"
                      />
                    </marker>
                  </defs>
                  <line
                    x1={width / 2}
                    y1="20"
                    x2={width / 2}
                    y2={height - 30}
                    stroke="#FF4444"
                    strokeWidth="3"
                    markerEnd="url(#arrowhead-vertical)"
                  />
                </>
              )}
            </svg>
          </Box>
        )}
        
        {/* Center label */}
        <Typography 
          variant="body2" 
          sx={{
            color: '#333',
            fontWeight: 600,
            textAlign: 'center',
            zIndex: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            px: 1,
            py: 0.5,
            borderRadius: 0.5,
            fontSize: '0.75rem'
          }}
        >
          Materiál
        </Typography>
      </Box>
      
      {/* Direction labels */}
      {showLabels && (
        <>
          <Typography 
            variant="caption" 
            sx={{ 
              position: 'absolute',
              top: -20,
              left: '50%',
              transform: 'translateX(-50%)',
              fontWeight: 600,
              color: 'primary.main'
            }}
          >
            vrch
          </Typography>
          
          <Typography 
            variant="caption" 
            sx={{ 
              position: 'absolute',
              bottom: -20,
              left: '50%',
              transform: 'translateX(-50%)',
              fontWeight: 600
            }}
          >
            spodok
          </Typography>
          
          <Typography 
            variant="caption" 
            sx={{ 
              position: 'absolute',
              left: -30,
              top: '50%',
              transform: 'translateY(-50%) rotate(-90deg)',
              fontWeight: 600
            }}
          >
            ľavá
          </Typography>
          
          <Typography 
            variant="caption" 
            sx={{ 
              position: 'absolute',
              right: -30,
              top: '50%',
              transform: 'translateY(-50%) rotate(90deg)',
              fontWeight: 600
            }}
          >
            pravá
          </Typography>
        </>
      )}
    </Box>
  )
}

export default WoodGrainVisualization
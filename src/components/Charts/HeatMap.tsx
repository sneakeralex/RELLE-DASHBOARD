import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

interface HeatMapProps {
  title: string;
  data: number[][];
  xLabels: string[];
  yLabels: string[];
  colorScale?: string[];
  maxValue?: number;
}

const HeatMap: React.FC<HeatMapProps> = ({
  title,
  data,
  xLabels,
  yLabels,
  colorScale = ['#f8f9fa', '#e2e3fe', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'],
  maxValue
}) => {
  // Find the maximum value in the data if not provided
  const max = maxValue || Math.max(...data.flat());
  
  // Function to get color based on value
  const getColor = (value: number) => {
    if (value === 0) return colorScale[0];
    
    const normalizedValue = value / max;
    const index = Math.min(
      Math.floor(normalizedValue * (colorScale.length - 1)),
      colorScale.length - 1
    );
    
    return colorScale[index];
  };
  
  // Function to get text color based on background color
  const getTextColor = (bgColor: string) => {
    // Convert hex to RGB
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return black or white based on brightness
    return brightness > 125 ? '#000000' : '#ffffff';
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" align="center" gutterBottom>
        {title}
      </Typography>
      
      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ display: 'flex', minWidth: xLabels.length * 60 }}>
          {/* Y-axis labels */}
          <Box sx={{ display: 'flex', flexDirection: 'column', mr: 1, mt: 4 }}>
            {yLabels.map((label, index) => (
              <Box 
                key={index} 
                sx={{ 
                  height: 40, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'flex-end',
                  pr: 1,
                  fontWeight: 'bold',
                  fontSize: '0.75rem'
                }}
              >
                {label}
              </Box>
            ))}
          </Box>
          
          {/* Heatmap grid */}
          <Box sx={{ flexGrow: 1 }}>
            {/* X-axis labels */}
            <Box sx={{ display: 'flex', mb: 1 }}>
              {xLabels.map((label, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    width: 60, 
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.75rem'
                  }}
                >
                  {label}
                </Box>
              ))}
            </Box>
            
            {/* Heatmap cells */}
            {data.map((row, rowIndex) => (
              <Box key={rowIndex} sx={{ display: 'flex' }}>
                {row.map((value, colIndex) => {
                  const bgColor = getColor(value);
                  const textColor = getTextColor(bgColor);
                  
                  return (
                    <Box 
                      key={colIndex} 
                      sx={{ 
                        width: 60, 
                        height: 40, 
                        backgroundColor: bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: textColor,
                        border: '1px solid #fff',
                        fontWeight: 'medium',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          zIndex: 1,
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      {value}
                    </Box>
                  );
                })}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      
      {/* Legend */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ mr: 1 }}>Low</Typography>
          <Box sx={{ display: 'flex' }}>
            {colorScale.map((color, index) => (
              <Box 
                key={index} 
                sx={{ 
                  width: 20, 
                  height: 20, 
                  backgroundColor: color,
                  border: '1px solid #fff'
                }} 
              />
            ))}
          </Box>
          <Typography variant="caption" sx={{ ml: 1 }}>High</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default HeatMap;

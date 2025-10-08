import React from 'react';
import { Tooltip, Typography } from '@mui/material';
import { HelpOutline as HelpIcon } from '@mui/icons-material';

interface HelpTooltipProps {
  title: string | React.ReactNode;
  children?: React.ReactNode;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({ title, children }) => {
  const tooltipContent = typeof title === 'string' ? (
    <Typography variant="caption">{title}</Typography>
  ) : (
    title
  );

  return (
    <Tooltip title={tooltipContent} arrow>
      {children || (
        <HelpIcon
          sx={{
            fontSize: 14,
            color: 'text.secondary',
            cursor: 'help',
          }}
        />
      )}
    </Tooltip>
  );
};

export default HelpTooltip;

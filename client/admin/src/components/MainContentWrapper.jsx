// src/components/MainContentWrapper.jsx
import React from 'react';
import { Box } from '@mui/material';

const MainContentWrapper = ({ children }) => {
  return (
    <Box
      sx={{
        marginTop: 'px', // Height of navbar
        minHeight: 'calc(100vh - 64px)',
        
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        padding: { xs: '16px', sm: '0px' },
        boxSizing: 'border-box',
      }}
    >
      {children}
    </Box>
  );
};

export default MainContentWrapper;
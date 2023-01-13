import { Box, Typography } from '@mui/material';
import React from 'react';
import Label from '../../Label';

const StockStatus = () => {
  return (
    <Box sx={{ marginBottom: '20px' }}>
      <Typography variant="body1">Status Stok</Typography>
      <Label
        variant="ghost"
        // color={stockStatus === 'normal' ? 'primary' : 'error'}
      >
        {/* {startCase(stockStatus)} */}
        Test
      </Label>
      <Typography variant="body2" sx={{ marginTop: '8px' }} color="error">
        {' '}
        Sesuai dengan kesedian stok yang dipilih!
      </Typography>
    </Box>
  );
};

export default StockStatus;

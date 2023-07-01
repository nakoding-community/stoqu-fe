import React from 'react';
import startCase from 'lodash/startCase';
import { Box, Typography } from '@mui/material';

import { useLocation } from 'react-router';
import Label from '../../../Label';

import { useCreateOrder } from '../../../../hooks/useCreateOrderV2';

const StockStatus = () => {
  const location = useLocation();
  const isCreatePage = location.pathname.includes('new');

  const items = useCreateOrder((state) => state.payloadBody.items);

  const getStockStatus = () => {
    if (isCreatePage) {
      return 'NORMAL';
    }

    const abnormal = items?.filter((item) => {
      return item?.total !== item?.totalPacked;
    });

    return abnormal?.length > 0 ? 'ABNORMAL' : 'NORMAL';
  };

  const stockStatus = getStockStatus();

  return (
    <Box sx={{ marginBottom: '20px' }}>
      <Typography variant="body1">Status Stok</Typography>
      <Label variant="ghost" color={stockStatus === 'NORMAL' ? 'success' : 'default'}>
        {startCase(stockStatus)}
      </Label>
      <Typography variant="body2" sx={{ marginTop: '8px' }} color="error">
        {' '}
        Sesuai dengan kesedian stok!
      </Typography>
    </Box>
  );
};

export default StockStatus;

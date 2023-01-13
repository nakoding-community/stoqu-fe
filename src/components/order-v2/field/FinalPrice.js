import React from 'react';
import { shallow } from 'zustand/shallow';
import { TextField } from '@mui/material';
import { useCreateOrder } from '../../../hooks/useCreateOrderV2';

const FinalPrice = () => {
  const { finalPrice } = useCreateOrder(
    (state) => ({
      finalPrice: state.payloadBody.finalPrice,
    }),
    shallow
  );

  return (
    <TextField
      value={finalPrice}
      id="outlined-basic"
      type="number"
      label="Harga Akhir"
      variant="outlined"
      size="medium"
      sx={{ mb: '20px', width: '100%' }}
      disabled
    />
  );
};

export default FinalPrice;

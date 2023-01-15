import React from 'react';
import { shallow } from 'zustand/shallow';
import { TextField } from '@mui/material';
import { useCreateOrder } from '../../../../hooks/useCreateOrderV2';
import { convertToRupiah } from '../../../../utils/helperUtils';

const FinalPrice = () => {
  const { getTotalProductPrice, shipmentPrice } = useCreateOrder(
    (state) => ({
      getTotalProductPrice: state.getTotalProductPrice,
      shipmentPrice: state.payloadBody.shipmentPrice,
      items: state.payloadBody.items,
    }),
    shallow
  );

  const totalProductPrice = getTotalProductPrice();

  const finalPrice = parseFloat(totalProductPrice) + parseFloat(shipmentPrice || 0);

  return (
    <TextField
      value={convertToRupiah(finalPrice)}
      id="outlined-basic"
      label="Harga Akhir"
      variant="outlined"
      size="medium"
      sx={{ mb: '20px', width: '100%' }}
      disabled
    />
  );
};

export default FinalPrice;

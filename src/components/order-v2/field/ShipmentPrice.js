import React from 'react';
import { shallow } from 'zustand/shallow';
import { TextField } from '@mui/material';
import { useCreateOrder } from '../../../hooks/useCreateOrderV2';

const ShipmentPrice = () => {
  const { shipmentPrice, immerSetState } = useCreateOrder(
    (state) => ({
      shipmentPrice: state.payloadBody.shipmentPrice,
      immerSetState: state.immerSetState,
    }),
    shallow
  );

  const onChange = (e) => {
    immerSetState((draft) => {
      draft.payloadBody.shipmentPrice = e.target.value;
    });
  };

  return (
    <TextField
      value={shipmentPrice}
      id="outlined-basic"
      type="number"
      label="Harga Pengiriman"
      variant="outlined"
      size="medium"
      sx={{ mb: '20px', width: '100%' }}
      onChange={onChange}
    />
  );
};

export default ShipmentPrice;

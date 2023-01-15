import React from 'react';
import { shallow } from 'zustand/shallow';
import { TextField } from '@mui/material';
import { useCreateOrder } from '../../../../hooks/useCreateOrderV2';

const ShipmentNumber = () => {
  const { shipmentNumber, immerSetState } = useCreateOrder(
    (state) => ({
      shipmentNumber: state.payloadBody.shipmentNumber,
      immerSetState: state.immerSetState,
    }),
    shallow
  );

  const onChange = (e) => {
    immerSetState((draft) => {
      draft.payloadBody.shipmentNumber = e.target.value;
    });
  };

  return (
    <TextField
      value={shipmentNumber}
      id="outlined-basic"
      type="number"
      label="No. Pengiriman"
      variant="outlined"
      size="medium"
      sx={{ mb: '20px', width: '100%' }}
      onChange={onChange}
    />
  );
};

export default ShipmentNumber;

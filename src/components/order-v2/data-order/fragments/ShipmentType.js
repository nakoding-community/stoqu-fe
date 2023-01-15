import React from 'react';
import { shallow } from 'zustand/shallow';
import { TextField } from '@mui/material';
import { useCreateOrder } from '../../../../hooks/useCreateOrderV2';

const ShipmentType = () => {
  const { shipmentType, immerSetState } = useCreateOrder(
    (state) => ({
      shipmentType: state.payloadBody.shipmentType,
      immerSetState: state.immerSetState,
    }),
    shallow
  );

  const onChange = (e) => {
    immerSetState((draft) => {
      draft.payloadBody.shipmentType = e.target.value;
    });
  };

  return (
    <TextField
      value={shipmentType}
      id="outlined-basic"
      type="text"
      label="Tipe Pengiriman"
      variant="outlined"
      size="medium"
      sx={{ mb: '20px', width: '100%' }}
      onChange={onChange}
    />
  );
};

export default ShipmentType;

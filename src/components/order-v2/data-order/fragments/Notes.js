import React from 'react';
import { TextField } from '@mui/material';
import { shallow } from 'zustand/shallow';
import { useCreateOrder } from '../../../../hooks/useCreateOrderV2';

export const Notes = () => {
  const { notes, immerSetState } = useCreateOrder(
    (state) => ({
      notes: state.payloadBody.notes,
      immerSetState: state.immerSetState,
    }),
    shallow
  );

  const onChange = (e) => {
    immerSetState((draft) => {
      draft.payloadBody.notes = e.target.value;
    });
  };

  return (
    <>
      <TextField
        value={notes}
        id="outlined-basic"
        type="text"
        label="Catatan"
        variant="outlined"
        size="medium"
        sx={{ mt: '24px', width: '100%' }}
        onChange={onChange}
        multiline
        minRows={3}
        maxRows={4}
      />
    </>
  );
};

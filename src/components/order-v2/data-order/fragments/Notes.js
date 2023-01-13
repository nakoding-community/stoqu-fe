import React from 'react';
import { TextField } from '@mui/material';
import { shallow } from 'zustand/shallow';
import { useLocation } from 'react-router';
import { useCreateOrder } from '../../../../hooks/useCreateOrderV2';

export const Notes = () => {
  const location = useLocation();
  const isCreatePage = location.pathname.includes('new');

  const isReady = false;

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
      {!isCreatePage ? (
        isReady && (
          <TextField
            value={notes}
            id="outlined-basic"
            type="text"
            label="Catatan"
            variant="outlined"
            size="medium"
            sx={{ mt: '24px', width: '100%' }}
            onChange={onChange}
            // disabled={!isUserAbleToEdit}
            multiline
            minRows={3}
            maxRows={4}
          />
        )
      ) : (
        <TextField
          value={notes}
          id="outlined-basic"
          type="text"
          label="Catatan"
          variant="outlined"
          size="medium"
          sx={{ mt: '24px', width: '100%' }}
          onChange={onChange}
          // disabled={!isUserAbleToEdit}
          multiline
          minRows={3}
          maxRows={4}
        />
      )}
    </>
  );
};

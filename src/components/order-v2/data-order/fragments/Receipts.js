import { IconButton, Link, Stack, TextField } from '@mui/material';
import { shallow } from 'zustand/shallow';
import React, { useState } from 'react';
import Iconify from '../../../Iconify';

import { useCreateOrder } from '../../../../hooks/useCreateOrderV2';

const Receipts = () => {
  const [inputLinkPayment, setInputLinkPayment] = useState('');

  const { receipts, immerSetState } = useCreateOrder(
    (state) => ({
      receipts: state.payloadBody.receipts,
      immerSetState: state.immerSetState,
    }),
    shallow
  );

  const updateReceiptsStateHandler = (method, deleteIndex) => {
    if (method === 'add') {
      if (inputLinkPayment) {
        const copyReceipts = [...receipts];
        const newData = {
          id: '',
          action: 'insert',
          receiptUrl: inputLinkPayment,
        };
        copyReceipts.push(newData);
        immerSetState((draft) => {
          draft.payloadBody.receipts = copyReceipts;
        });
        setInputLinkPayment('');
      }
    } else {
      const copyReceipts = [...receipts];

      if (copyReceipts[deleteIndex].id === '') {
        copyReceipts.splice(deleteIndex, 1);
        immerSetState((draft) => {
          draft.payloadBody.receipts = copyReceipts;
        });
      } else {
        copyReceipts[deleteIndex].action = 'delete';

        immerSetState((draft) => {
          draft.payloadBody.receipts = copyReceipts;
        });
      }
    }
  };

  return (
    <>
      <TextField
        id="outlined-basic"
        type="text"
        label="Link Status Pembayaran"
        variant="outlined"
        size="medium"
        sx={{ mb: '20px', width: '100%' }}
        value={inputLinkPayment}
        onChange={(e) => setInputLinkPayment(e.target.value)}
        InputProps={{
          endAdornment: (
            <IconButton size="small" color="default" onClick={() => updateReceiptsStateHandler('add')}>
              <Iconify icon="mdi:plus" />
            </IconButton>
          ),
        }}
        // disabled={!isUserAbleToEdit}
      />
      {receipts
        ?.filter((receipt) => receipt?.action !== 'delete')
        ?.map((receipt, index) => (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            key={`${receipt.id}-${receipt.name}-${index}`}
          >
            <Link variant="body2" color="blue">
              {receipt?.receiptUrl}
            </Link>
            <IconButton
              size="small"
              color="error"
              onClick={() => updateReceiptsStateHandler('delete', index)}
              // disabled={!isUserAbleToEdit}
            >
              <Iconify icon="eva:trash-2-outline" />
            </IconButton>
          </Stack>
        ))}
    </>
  );
};

export default Receipts;

/* eslint-disable prefer-const */
import { IconButton, Link, Stack, TextField } from '@mui/material';
import cloneDeep from 'lodash/cloneDeep';
import { v4 as uuidv4 } from 'uuid';
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

  const updateReceiptsStateHandler = (method, uuid) => {
    if (method === 'add') {
      if (inputLinkPayment) {
        const copyReceipts = cloneDeep(receipts);
        const newData = {
          id: '',
          action: 'insert',
          receiptUrl: inputLinkPayment,
          uuid: uuidv4(),
        };
        copyReceipts.push(newData);
        immerSetState((draft) => {
          draft.payloadBody.receipts = copyReceipts;
        });
        setInputLinkPayment('');
      }
    } else {
      const copyReceipts = cloneDeep(receipts);
      const deleteIndex = copyReceipts?.findIndex((receipt) => receipt?.uuid === uuid);

      if (copyReceipts[deleteIndex].id === '') {
        copyReceipts.splice(deleteIndex, 1);
      } else {
        copyReceipts[deleteIndex].action = 'delete';
      }

      immerSetState((draft) => {
        draft.payloadBody.receipts = copyReceipts;
      });
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
              onClick={() => updateReceiptsStateHandler('delete', receipt?.uuid)}
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

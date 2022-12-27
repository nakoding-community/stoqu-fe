import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useConfirm } from 'material-ui-confirm';

import { Stack, DialogActions, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import Modal from '../Modal';
import InfiniteCombobox from '../../combobox/InfiniteCombobox';

// eslint-disable-next-line react/prop-types
function ModalStockMovement({ open, onClose }) {
  return (
    <Modal title="Stok Movement" open={open} onClose={onClose} maxWidth="sm">
      <DialogForm onClose={onClose} />
    </Modal>
  );
}

function DialogForm({ onClose }) {
  const confirm = useConfirm();
  const queryClient = useQueryClient();

  const submitModalHandler = async () => {};

  const confrimHandler = (e) => {
    e.preventDefault();

    confirm().then(() => {
      submitModalHandler(e);
    });
  };

  return (
    <Stack component="form" onSubmit={confrimHandler}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <InfiniteCombobox
          // value={selectedProducts?.[0]?.id}
          label="Cari Produk"
          type="products"
          // onChange={onChangeProductHandler}
          required
          // excludeIds={selectedProducts?.map(({ id }) => id)}
          // labelText={productLabel}
        />
        <InfiniteCombobox
          // value={selectedProducts?.[0]?.id}
          label="Cari Rak"
          type="types"
          // onChange={onChangeProductHandler}
          required
          // excludeIds={selectedProducts?.map(({ id }) => id)}
          // labelText={productLabel}
        />
        <InfiniteCombobox
          // value={selectedProducts?.[0]?.id}
          label="Lookup"
          type="lookupStocks"
          // onChange={onChangeProductHandler}
          required
          // excludeIds={selectedProducts?.map(({ id }) => id)}
          // labelText={productLabel}
        />
        <InfiniteCombobox
          // value={selectedProducts?.[0]?.id}
          label="Paket Tujuan"
          type="types"
          // onChange={onChangeProductHandler}
          required
          // excludeIds={selectedProducts?.map(({ id }) => id)}
          // labelText={productLabel}
        />
      </Stack>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Close
        </Button>

        <LoadingButton type="submit" variant="contained" loading={false}>
          Save
        </LoadingButton>
      </DialogActions>
    </Stack>
  );
}

export default ModalStockMovement;

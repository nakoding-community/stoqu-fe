import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Stack, TextField, DialogActions, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import Modal from '../../modal/Modal';

import InfiniteCombobox from '../../combobox/InfiniteCombobox';
import { useCreateOrder } from '../../../hooks/useCreateOrderV2';

export const ModalCreateOrder = ({ open, onClose }) => {
  return (
    <Modal title={'Tambah Produk'} open={open} onClose={onClose}>
      <DialogForm onClose={onClose} />
    </Modal>
  );
};

const initialForm = {
  selectedProduct: {
    id: '',
    label: '',
  },
  total: '',
  price: '',
  rack: {
    id: '',
    label: '',
  },
};

const DialogForm = ({ onClose }) => {
  const [formData, setFormData] = useState(initialForm);

  const productPrice = parseFloat(formData?.selectedProduct?.priceFinal || 0);

  const immerSetState = useCreateOrder((state) => state.immerSetState);

  const save = (e) => {
    e.preventDefault();
    const newData = {
      action: 'insert',
      id: '',
      price: formData?.price,
      productId: formData?.selectedProduct?.id,
      rackId: formData?.rack?.id,
      status: 'PENDING', // ashandi todo
      stockLookups: [],
      total: formData?.total,

      product: formData?.selectedProduct,
      uuid: uuidv4(),
    };

    immerSetState((draft) => {
      draft.payloadBody.items = [...draft.payloadBody.items, newData];
    });

    onClose();

    setFormData(initialForm);
  };

  return (
    <Stack component="form">
      <Stack spacing={3} sx={{ p: 3 }}>
        <InfiniteCombobox
          value={formData?.selectedProduct?.id}
          label="Cari Produk (*)"
          type="products"
          labelText={formData?.selectedProduct?.label}
          onChange={(e) => {
            setFormData({
              ...formData,
              selectedProduct: {
                ...e,
                id: e?.id,
                label: e?.label,
              },
            });
          }}
        />

        <TextField
          value={formData?.total}
          id="outlined-basic"
          label="Jumlah (*)"
          variant="outlined"
          onChange={(e) => {
            setFormData({
              ...formData,
              total: e.target.value,
            });
          }}
        />
        <TextField
          value={parseFloat(formData?.total || 0) * productPrice}
          id="outlined-basic"
          label="Estimasi Harga"
          variant="outlined"
          disabled
        />
        <TextField
          value={formData?.price}
          id="outlined-basic"
          label="Harga Akhir (*)"
          variant="outlined"
          onChange={(e) => {
            setFormData({
              ...formData,
              price: e.target.value,
            });
          }}
        />
        <InfiniteCombobox
          label="Cari Rak *"
          type="racks"
          onChange={(e) => {
            setFormData({
              ...formData,
              rack: {
                id: e?.id,
                label: e?.label,
              },
            });
          }}
          required
          value={formData?.rack?.id}
          labelText={formData?.rack?.label}
        />
      </Stack>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Close
        </Button>
        <LoadingButton type="submit" variant="contained" disabled={false} onClick={save}>
          Save
        </LoadingButton>
      </DialogActions>
    </Stack>
  );
};

/* eslint-disable no-lonely-if */
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import isEmpty from 'lodash/isEmpty';

import { Stack, TextField, DialogActions, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import Modal from '../../modal/Modal';

import InfiniteCombobox from '../../combobox/InfiniteCombobox';
import { useCreateOrder } from '../../../hooks/useCreateOrderV2';

export const ModalCreateProduct = ({ open, onClose, productDetail }) => {
  return (
    <Modal title={'Tambah Produk'} open={open} onClose={onClose}>
      <DialogForm onClose={onClose} productDetail={productDetail} />
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

const DialogForm = ({ onClose, productDetail }) => {
  const [formData, setFormData] = useState(initialForm);

  const isCreate = isEmpty(productDetail);

  const productPrice = parseFloat(formData?.selectedProduct?.priceFinal || 0);

  const immerSetState = useCreateOrder((state) => state.immerSetState);

  const save = (e) => {
    e.preventDefault();

    const newData = {
      price: formData?.price,
      productId: formData?.selectedProduct?.id,
      rackId: formData?.rack?.id,
      status: 'PENDING', // ashandi todo
      stockLookups: [],
      total: formData?.total,

      product: formData?.selectedProduct,
      rack: formData?.rack,
      uuid: uuidv4(),
    };

    if (isCreate) {
      newData.action = 'insert';
      newData.id = '';
    } else {
      if (productDetail?.id === '') {
        newData.action = 'insert';
        newData.id = '';
      } else {
        newData.action = 'update';
        newData.id = productDetail?.id;
      }
    }

    immerSetState((draft) => {
      let newItems = [...draft.payloadBody.items];

      if (isCreate) {
        newItems = [...newItems, newData];
      } else {
        const editIndex = newItems?.findIndex((item) => item?.uuid === productDetail?.uuid);
        newItems[editIndex] = newData;
      }

      draft.payloadBody.items = newItems;
    });

    onClose();

    setFormData(initialForm);
  };

  useEffect(() => {
    setFormData({
      selectedProduct: {
        ...productDetail?.product,
        id: productDetail?.productId,
        label: productDetail?.product?.name,
      },
      total: productDetail?.total,
      price: productDetail?.price,
      rack: {
        id: productDetail?.rackId,
        label: productDetail?.rack?.label,
      },
    });
  }, [productDetail]);

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
          disabled={!isEmpty(productDetail)}
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
        {/* <TextField
          value={parseFloat(formData?.total || 0) * productPrice}
          id="outlined-basic"
          label="Estimasi Harga"
          variant="outlined"
          disabled
        /> */}
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

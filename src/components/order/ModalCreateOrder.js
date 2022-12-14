import React, { useEffect, useState } from 'react';
import startCase from 'lodash/startCase';
import { useDebounce } from 'use-debounce';

import { Stack, TextField, DialogActions, Button, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import Modal from '../modal/Modal';

import useCreateOrder from '../../hooks/useCreateOrder';
import InfiniteCombobox from '../combobox/InfiniteCombobox';
import { useForm } from '../../hooks/useForm';
import { checkStockStatus } from '../../client/stocksClient';

export const ModalCreateOrder = ({ open, onClose, editData, editId, getBrandsHandler }) => {
  return (
    <Modal title={'Tambah Produk'} open={open} onClose={onClose}>
      <DialogForm onClose={onClose} editData={editData} editId={editId} getBrandsHandler={getBrandsHandler} />
    </Modal>
  );
};

const DialogForm = ({ onClose, editData, editId, getBrandsHandler }) => {
  const [formState, inputChangeHandler, setFormData] = useForm(initialFormData);

  const { isCreatePage, detailOrderState, createProductHandler } = useCreateOrder();

  const [productStatus, setProductStatus] = useState('');

  const { quantity, price, selectedProduct, labelText } = formState;

  const [quantityDebounce] = useDebounce(quantity, 300);

  const productPriceIdr = parseFloat(selectedProduct?.priceIdr || 0);

  const isButtonDisabled = quantity === '' || price === '' || selectedProduct === '';

  const changeLabelText = (newObjValue) => {
    inputChangeHandler('labelText', {
      ...formState.labelText,
      ...newObjValue,
    });
  };

  const submitModalHandler = async (e) => {
    e.preventDefault();

    const item = {
      brand: selectedProduct?.brand?.brand,
      price: parseFloat(price),
      productId: selectedProduct?.id,
      quantity: parseFloat(quantity),
      stock: productStatus,
      type: `${selectedProduct?.type?.value} ${selectedProduct?.type?.unit?.unit}`,
      variant: selectedProduct?.variant?.variant,
    };

    if (!isCreatePage) {
      item.orderId = detailOrderState?.id;
    }

    createProductHandler(item);
    onClose();
  };

  const checkProductAvailbility = async () => {
    const { data } = await checkStockStatus({ productId: selectedProduct?.id, total: parseFloat(quantity) });
    if (data) {
      setProductStatus(data?.status);
    }
  };

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    }
  }, [editData, setFormData]);

  useEffect(() => {
    if (quantityDebounce) {
      checkProductAvailbility();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantityDebounce]);

  return (
    <Stack component="form" onSubmit={submitModalHandler}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <InfiniteCombobox
          value={selectedProduct?.id}
          label="Cari Produk (*)"
          type="products"
          onChange={(e) => {
            inputChangeHandler('selectedProduct', e);
            changeLabelText({ productName: e?.label });
          }}
          labelText={labelText?.productName}
        />

        <TextField
          value={quantity}
          id="outlined-basic"
          label="Jumlah (*)"
          variant="outlined"
          onChange={(e) => inputChangeHandler('quantity', e.target.value)}
        />
        {productStatus !== 'available' && (
          <Typography color="error" sx={{ marginTop: '8px !important' }}>
            {startCase(productStatus)}
          </Typography>
        )}
        <TextField
          value={parseFloat(quantity || 0) * productPriceIdr}
          id="outlined-basic"
          label="Estimasi Harga"
          variant="outlined"
          disabled
        />
        <TextField
          value={price}
          id="outlined-basic"
          label="Harga Akhir (*)"
          variant="outlined"
          onChange={(e) => inputChangeHandler('price', e.target.value)}
        />
      </Stack>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Close
        </Button>
        <LoadingButton type="submit" variant="contained" disabled={isButtonDisabled}>
          Save
        </LoadingButton>
      </DialogActions>
    </Stack>
  );
};

const initialFormData = {
  selectedProduct: '',
  quantity: '',
  price: '',
  labelText: {},
};

import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import parseInt from 'lodash/parseInt';
import { Stack, TextField, DialogActions, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import Modal from '../Modal';
import { createProducts, editProduct } from '../../../client/productsClient';
import { useForm } from '../../../hooks/useForm';
import InfiniteCombobox from '../../combobox/InfiniteCombobox';
import { getDollarToIdrPrice } from '../../../client/currenciesClient';
import KEY from '../../../constant/queryKey';

export const ModalCreateEditProduct = ({ open, onClose, editData, editId }) => {
  const title = editData ? 'Edit Produk' : 'Tambah Produk';

  return (
    <Modal title={title} open={open} onClose={onClose}>
      <DialogForm onClose={onClose} editData={editData} editId={editId} />
    </Modal>
  );
};

const DialogForm = ({ onClose, editData, editId }) => {
  const queryClient = useQueryClient();
  const [formState, inputChangeHandler, setFormData] = useForm(initialFormInput);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    name,
    brandId,
    variantId,
    typeId,
    priceIdr,
    priceUsd,
    // estimatePriceIdr,
    labelText,
  } = formState;

  const isButtonDisabled = editData
    ? name === '' || priceUsd === '' || priceIdr === ''
    : brandId === '' || variantId === '' || typeId === '';
  // priceIdr === '' ||
  // priceUsd === '' ||
  // estimatePriceIdr === '';

  const changeLabelText = (newObjValue) => {
    inputChangeHandler('labelText', {
      ...formState.labelText,
      ...newObjValue,
    });
  };

  const submitModalHandler = async (e) => {
    setIsSubmitting(true);

    e.preventDefault();

    const createBody = {
      brandId,
      name,
      packetId: typeId,
      priceFinal: parseInt(formState.priceIdr),
      priceUsd: parseInt(formState.priceUsd),
      variantId,
    };

    const editBody = {
      id: formState.id,
      name: formState.name,
      priceFinal: parseInt(formState.priceIdr),
      priceUsd: parseInt(formState.priceUsd),
    };

    const { isSuccess } = editData ? await editProduct(editId, editBody) : await createProducts(createBody);
    if (isSuccess) {
      toast.success(`Berhasil ${editData ? 'mengubah' : 'menambahkan'} produk`);
      onClose();
      queryClient.invalidateQueries([KEY.products.all], { refetchType: editData ? 'none' : 'active' });

      if (editData) {
        queryClient.invalidateQueries([KEY.products.detail, editId]);
      }
    }

    setIsSubmitting(false);
  };

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    }
  }, [editData, setFormData]);

  useEffect(() => {
    const getIdrEstimatePrice = async () => {
      const { data } = await getDollarToIdrPrice({ usd: parseInt(priceUsd) });
      if (data) {
        inputChangeHandler('estimatePriceIdr', data?.idr);
      }
    };

    if (priceUsd) {
      getIdrEstimatePrice();
    }
  }, [priceUsd, inputChangeHandler]);

  return (
    <Stack component="form" onSubmit={submitModalHandler}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <TextField
          type="text"
          label="Nama Produk"
          variant="outlined"
          value={name}
          onChange={(e) => inputChangeHandler('name', e.target.value)}
        />
        <InfiniteCombobox
          value={brandId}
          label="Cari Brand (*)"
          type="brands"
          onChange={(e) => {
            inputChangeHandler('brandId', e.id);
            inputChangeHandler('variantId', '');
            changeLabelText({ brand: e?.label });
          }}
          disabled={editData !== null}
          labelText={labelText?.brand}
        />
        <InfiniteCombobox
          value={variantId}
          label="Cari Varian (*)"
          type="variants"
          onChange={(e) => {
            inputChangeHandler('variantId', e.id);
            changeLabelText({ variant: e?.label });
          }}
          disabled={editData !== null}
          additionalQuery={{ brandId }}
          labelText={labelText?.variant}
        />
        <InfiniteCombobox
          value={typeId}
          label="Cari Paket (*)"
          type="types"
          onChange={(e) => {
            inputChangeHandler('typeId', e.id);
            changeLabelText({ type: e?.label });
          }}
          disabled={editData !== null}
          labelText={labelText?.type}
        />
        {/* <TextField
          type="number"
          label="Harga USD"
          variant="outlined"
          value={priceUsd}
          onChange={(e) => inputChangeHandler('priceUsd', e.target.value)}
        /> */}
        {/* <TextField type="number" label="Estimasi Harga" variant="outlined" value={estimatePriceIdr} disabled /> */}
        {/* <TextField
          type="number"
          label="Harga Akhir (*)"
          variant="outlined"
          value={priceIdr}
          onChange={(e) => inputChangeHandler('priceIdr', e.target.value)}
        /> */}
      </Stack>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Close
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} disabled={isButtonDisabled}>
          Save
        </LoadingButton>
      </DialogActions>
    </Stack>
  );
};

const initialFormInput = {
  name: '',
  brandId: '',
  variantId: '',
  typeId: '',
  priceUsd: '',
  priceIdr: '1',
  estimatePriceIdr: '',
  labelText: {},
};

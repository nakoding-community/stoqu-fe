import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Stack, TextField, DialogActions, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import Modal from '../Modal';
import { createBrand, editBrand } from '../../../client/brandsClient';
import { useForm } from '../../../hooks/useForm';
import InfiniteCombobox from '../../combobox/InfiniteCombobox';

import KEY from '../../../constant/queryKey';

export const ModalCreateEditBrand = ({ open, onClose, editData, editId }) => {
  const title = editData ? 'Edit Brand' : 'Tambah Brand';

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
  const [supplierLabel, setSupplierLabel] = useState(null);

  const { brand, supplierId } = formState;

  const isButtonDisabled = brand === '';

  const submitModalHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { isSuccess } = editData ? await editBrand(editId, formState) : await createBrand(formState);
    if (isSuccess) {
      toast.success(`Berhasil ${editData ? 'mengubah' : 'menambahkan'} brand`);
      onClose();

      queryClient.invalidateQueries([KEY.attribute.brands.all]);
    }

    setIsSubmitting(false);
  };

  useEffect(() => {
    if (editData) {
      setFormData({
        brand: editData?.brandName,
        supplierId: editData?.supplierId,
      });
      setSupplierLabel(editData?.supplierName);
    }
  }, [editData, setFormData]);

  return (
    <Stack component="form" onSubmit={submitModalHandler}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <TextField
          value={brand}
          id="outlined-basic"
          label="Brand (*)"
          variant="outlined"
          onChange={(e) => inputChangeHandler('brand', e.target.value)}
        />
        <InfiniteCombobox
          value={supplierId}
          label={`Supplier`}
          sx={{ marginBottom: '20px' }}
          type="users"
          additionalQuery={{ filterRole: 'supplier' }}
          onChange={(e) => {
            inputChangeHandler('supplierId', e?.id);
            setSupplierLabel(e?.label);
          }}
          labelText={supplierLabel}
        />
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
  supplierId: '',
  brand: '',
};

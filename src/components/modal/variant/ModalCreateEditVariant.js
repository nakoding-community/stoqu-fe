import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Stack, TextField, DialogActions, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';

import Modal from '../Modal';

import { createVariant, editVariant } from '../../../client/variantsClient';
import { useForm } from '../../../hooks/useForm';

import KEY from '../../../constant/queryKey';

export const ModalCreateEditVariant = ({ open, onClose, editVariantId, editVariantData, brandId }) => {
  const title = editVariantData ? 'Edit Varian' : 'Tambah Varian';

  return (
    <Modal title={title} open={open} onClose={onClose}>
      <DialogForm onClose={onClose} editVariantId={editVariantId} brandId={brandId} editVariantData={editVariantData} />
    </Modal>
  );
};

const DialogForm = ({ onClose, editVariantId, brandId, editVariantData }) => {
  const queryClient = useQueryClient();

  const [formState, inputChangeHandler, setFormData] = useForm(initialFormInput);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { code, name, itl, uniqueCode } = formState;

  const isButtonDisabled = name === '' || itl === '';

  const submitModalHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const body = {
      ...formState,
      brandId,
    };

    if (editVariantId) {
      delete body.brandId;
    }

    if (body?.code) {
      delete body.code;
    }

    const { isSuccess } = editVariantData
      ? await editVariant(editVariantId, { ...body, id: editVariantId })
      : await createVariant(body);
    if (isSuccess) {
      toast.success(`Berhasil ${editVariantData ? 'mengubah' : 'menambahkan'} varian`);
      onClose();
      queryClient.invalidateQueries([KEY.attribute.brands.all]);
    }

    setIsSubmitting(false);
  };

  useEffect(() => {
    if (editVariantData) {
      setFormData(editVariantData);
    }
  }, [editVariantData, setFormData]);

  return (
    <Stack component="form" onSubmit={submitModalHandler}>
      <Stack spacing={3} sx={{ p: 3 }}>
        {editVariantId && (
          <TextField
            value={code}
            label="Kode (*)"
            variant="outlined"
            onChange={(e) => inputChangeHandler('code', e.target.value)}
            disabled={editVariantId != null}
          />
        )}
        <TextField
          value={name}
          label="Varian (*)"
          variant="outlined"
          onChange={(e) => inputChangeHandler('name', e.target.value)}
        />
        <TextField
          value={itl}
          label="ITL (*)"
          variant="outlined"
          onChange={(e) => inputChangeHandler('itl', e.target.value)}
        />
        <TextField
          value={uniqueCode}
          id="outlined-basic"
          label="Kode Unik"
          variant="outlined"
          onChange={(e) => inputChangeHandler('uniqueCode', e.target.value)}
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
  code: '',
  name: '',
  itl: '',
  uniqueCode: '',
};

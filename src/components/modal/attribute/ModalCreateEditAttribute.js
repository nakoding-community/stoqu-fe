import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import parseInt from 'lodash/parseInt';
import { Stack, TextField, DialogActions, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import Modal from '../Modal';
import ComboboxUnits from '../../combobox/ComboboxUnits';
import { createType, editType } from '../../../client/typesClient';
import { useForm } from '../../../hooks/useForm';
import KEY from '../../../constant/queryKey';

export const ModalCreateEditAttribute = ({ open, onClose, editData, editId }) => {
  const title = editData ? 'Edit Tipe' : 'Tambah Tipe';

  return (
    <Modal title={title} open={open} onClose={onClose}>
      <DialogForm onClose={onClose} editData={editData} editId={editId} />
    </Modal>
  );
};

const DialogForm = ({ onClose, editData, editId }) => {
  const [formState, inputChangeHandler, setFormData] = useForm(initialFormInput);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  const isButtonDisabled = formState?.unitId === '' || formState?.value === '';

  const submitModalHandler = async (e) => {
    setIsSubmitting(true);

    e.preventDefault();
    const body = {
      ...formState,
      value: parseInt(formState.value),
    };
    const { isSuccess } = editData ? await editType(editId, body) : await createType(body);
    if (isSuccess) {
      toast.success(`Berhasil ${editData ? 'mengubah' : 'menambahkan'} tipe`);
      onClose();

      queryClient.invalidateQueries([KEY.attribute.types.all], { refetchType: editData ? 'none' : 'active' });

      if (editData) {
        queryClient.invalidateQueries([KEY.attribute.types.detail, editId]);
      }
    }

    setIsSubmitting(false);
  };

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    }
  }, [editData, setFormData]);

  return (
    <Stack component="form" onSubmit={submitModalHandler}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <ComboboxUnits
          label="Unit (*)"
          defaultValue={formState?.unitId}
          onChange={(e) => inputChangeHandler('unitId', e.id)}
        />
        <TextField
          value={formState?.value}
          type="number"
          id="value"
          label="Value (*)"
          variant="outlined"
          onChange={(e) => inputChangeHandler('value', e.target.value)}
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
  // code: '',
  unitId: '',
  value: '',
};

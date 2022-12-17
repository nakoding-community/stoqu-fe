import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import parseInt from 'lodash/parseInt';
import { Stack, TextField, DialogActions, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import Modal from '../Modal';
import ComboboxUnits from '../../combobox/ComboboxUnits';
import { useForm } from '../../../hooks/useForm';
import { useCreatePacket, useEditPacket } from '../../../hooks/api/usePacket';

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

  const { mutate: createPacket } = useCreatePacket();
  const { mutate: editPacket } = useEditPacket(editId);

  const isButtonDisabled = formState?.unitId === '' || formState?.value === '';

  const submitModalHandler = async (e) => {
    setIsSubmitting(true);

    e.preventDefault();
    const body = {
      ...formState,
      value: parseInt(formState.value),
    };

    const mutateFn = editData ? editPacket : createPacket;

    mutateFn(body, {
      onSuccess: () => {
        // ** Show toast success
        toast.success(`Berhasil ${editData ? 'mengubah' : 'menambahkan'} tipe`);

        // ** Close modal
        onClose();

        // ** Invalidate packets list data
        queryClient.invalidateQueries(['packets', 'list'], { refetchType: editData ? 'none' : 'active' });

        // ** Invalidate packet detail data
        if (editData) {
          queryClient.invalidateQueries(['packets', 'detail', editId]);
        }
      },
    });

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
  unitId: '',
  value: '',
};

import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
// import parseInt from 'lodash/parseInt';
import { Stack, TextField, DialogActions, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';

import Modal from '../Modal';

import { useForm } from '../../../hooks/useForm';
import InfiniteCombobox from '../../combobox/InfiniteCombobox';

import { useCreateConvertionUnit, useEditConvertionUnit } from '../../../hooks/api/useConvertionUnit';

export const ModalCreateEditConvertion = ({ open, onClose, editData, editId }) => {
  const title = editData ? 'Edit Tipe Konversi' : 'Tambah Tipe Konversi';

  return (
    <Modal title={title} open={open} onClose={onClose}>
      <DialogForm onClose={onClose} editData={editData} editId={editId} />
    </Modal>
  );
};

const DialogForm = ({ onClose, editData, editId }) => {
  const queryClient = useQueryClient();
  const [formState, inputChangeHandler, setFormData] = useForm(initialFormInput);

  const { origin, destination, total, labelText } = formState;

  const isButtonDisabled = origin === '' || destination === '' || total === '';

  const { mutate: createConvertionUnit, isLoading: isCreateSubmitting } = useCreateConvertionUnit();
  const { mutate: editConvertionUnit, isLoading: isEditSubmitting } = useEditConvertionUnit(editId);

  const changeLabelText = (newObjValue) => {
    inputChangeHandler('labelText', {
      ...labelText,
      ...newObjValue,
    });
  };

  const submitModalHandler = async (e) => {
    e.preventDefault();
    const body = {
      ...formState,
      total: parseFloat(total),
    };

    delete body.labelText;

    if (editData) {
      body.id = editId;
    }

    const mutateFn = editData ? editConvertionUnit : createConvertionUnit;
    mutateFn(body, {
      onSuccess: () => {
        toast.success(`Berhasil ${editData ? 'mengubah' : 'menambahkan'} tipe konversi`);
        onClose();

        queryClient.invalidateQueries(['convertion-units', 'list']);
      },
    });
  };

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    }
  }, [editData, setFormData]);

  return (
    <Stack component="form" onSubmit={submitModalHandler}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <InfiniteCombobox
          value={origin}
          label="Tipe Awal (*)"
          type="units"
          onChange={(e) => {
            inputChangeHandler('origin', e?.id);
            changeLabelText({ origin: e?.label });
          }}
          labelText={labelText?.origin}
        />
        <InfiniteCombobox
          value={destination}
          label="Tipe Akhir (*)"
          type="units"
          onChange={(e) => {
            inputChangeHandler('destination', e?.id);
            changeLabelText({ destination: e?.label });
          }}
          labelText={labelText?.destination}
        />
        <TextField
          value={total}
          type="number"
          id="value"
          label="Total Konversi (*)"
          variant="outlined"
          onChange={(e) => inputChangeHandler('total', e.target.value)}
        />
      </Stack>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Close
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isCreateSubmitting || isEditSubmitting}
          disabled={isButtonDisabled}
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Stack>
  );
};

const initialFormInput = {
  origin: '',
  destination: '',
  total: '',
};

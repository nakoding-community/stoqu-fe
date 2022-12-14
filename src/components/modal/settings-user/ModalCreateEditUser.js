import React, { useEffect, useState } from 'react';
import parseInt from 'lodash/parseInt';
import { Stack, TextField, DialogActions, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';

import Modal from '../Modal';
import ComboboxUnits from '../../combobox/ComboboxUnits';

import { createUser, editUser } from '../../../client/usersClient';
import { useForm } from '../../../hooks/useForm';
import InfiniteCombobox from '../../combobox/InfiniteCombobox';

export const ModalCreateEditUser = ({ open, onClose, editData, editId, getUsersHandler }) => {
  const title = editData ? 'Edit USer' : 'Tambah User';

  return (
    <Modal title={title} open={open} onClose={onClose}>
      <DialogForm onClose={onClose} editData={editData} editId={editId} getUsersHandler={getUsersHandler} />
    </Modal>
  );
};

const DialogForm = ({ onClose, editData, editId, getUsersHandler }) => {
  const [formState, inputChangeHandler, setFormData] = useForm(initialFormInput);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { email, name, password, phoneNumber, roleId, labelText } = formState;

  const isButtonDisabled =
    email === '' || name === '' || phoneNumber === '' || roleId === '' || (editData ? false : password === '');

  const changeLabelText = (newObjValue) => {
    inputChangeHandler('labelText', {
      ...labelText,
      ...newObjValue,
    });
  };

  const submitModalHandler = async (e) => {
    setIsSubmitting(true);

    e.preventDefault();
    const body = {
      ...formState,
    };

    // delete labelText
    if (body?.labelText) {
      delete body?.labelText;
    }

    // when password is null when edit, delete it from payload
    if (editData) {
      if (!body?.password) {
        delete body?.password;
      }
    }

    const { isSuccess } = editData ? await editUser(editId, body) : await createUser(body);
    if (isSuccess) {
      toast.success(`Berhasil ${editData ? 'mengubah' : 'menambahkan'} user`);
      onClose();
      getUsersHandler();
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
        <InfiniteCombobox
          value={roleId}
          label="Role (*)"
          type="roles"
          onChange={(e) => {
            inputChangeHandler('roleId', e?.id);
            changeLabelText({ role: e?.label });
          }}
          labelText={labelText?.role}
        />
        <TextField
          value={name}
          type="text"
          id="name"
          label="Nama (*)"
          variant="outlined"
          onChange={(e) => inputChangeHandler('name', e.target.value)}
        />
        <TextField
          value={email}
          type="email"
          id="email"
          label="Email (*)"
          variant="outlined"
          onChange={(e) => inputChangeHandler('email', e.target.value)}
        />
        <TextField
          value={phoneNumber}
          type="number"
          id="no"
          label="No Hp (*)"
          variant="outlined"
          onChange={(e) => inputChangeHandler('phoneNumber', e.target.value)}
        />
        <TextField
          value={password}
          type="text"
          id="password"
          label={`Password ${editData ? '' : '(*)'}`}
          variant="outlined"
          onChange={(e) => inputChangeHandler('password', e.target.value)}
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
  email: '',
  name: '',
  password: '',
  phoneNumber: '',
  roleId: '',
};

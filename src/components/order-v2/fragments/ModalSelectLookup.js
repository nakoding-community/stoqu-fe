import React from 'react';

import { Stack, DialogActions, Button, TextField, InputAdornment, Box, Typography, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import Modal from '../../modal/Modal';
import Iconify from '../../Iconify';

export const ModalSelectLookup = ({ open, onClose, productDetail }) => {
  return (
    <Modal title={'Pilih Lookup'} open={open} onClose={onClose}>
      <DialogForm onClose={onClose} productDetail={productDetail} />
    </Modal>
  );
};

const DialogForm = ({ onClose }) => {
  return (
    <Stack component="form">
      <Stack spacing={3}>
        <TextField
          sx={{ px: 3, mt: '16px' }}
          placeholder="Cari..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            ),
          }}
        />

        <Stack
          width="100%"
          direction="row"
          alignItems="center"
          sx={{
            px: 3,
            py: 1,
            '&:hover': {
              backgroundColor: '#eceff1',
            },
          }}
        >
          <Checkbox />
          <Box sx={{ marginLeft: '12px' }}>
            <Typography variant="body1">Code 1</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Subtitle
            </Typography>
          </Box>
        </Stack>
      </Stack>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Close
        </Button>
        <LoadingButton type="submit" variant="contained" disabled={false}>
          Save
        </LoadingButton>
      </DialogActions>
    </Stack>
  );
};

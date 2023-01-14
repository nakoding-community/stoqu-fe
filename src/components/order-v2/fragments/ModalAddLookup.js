import React from 'react';

import {
  Stack,
  IconButton,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
  TableHead,
  Tooltip,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import Modal from '../../modal/Modal';

import Iconify from '../../Iconify';

export const ModalAddLookup = ({ open, onClose, productDetail }) => {
  return (
    <Modal title={'Tambah Lookup'} open={open} onClose={onClose} maxWidth="md">
      <DialogForm onClose={onClose} productDetail={productDetail} />
    </Modal>
  );
};

const DialogForm = ({ onClose }) => {
  return (
    <Stack component="form">
      <Stack spacing={3} sx={{ p: 3 }}>
        <TableContainer sx={{ minWidth: 720, pt: '12px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Kode</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>A</TableCell>
                <TableCell>
                  <Tooltip title="Hapus Lookup">
                    <IconButton size="small" color="error">
                      <Iconify icon="eva:trash-2-outline" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
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

import React, { useState } from 'react';

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

import Modal from '../../modal/Modal';

import Iconify from '../../Iconify';
import { ModalSelectLookup } from './ModalSelectLookup';
import { useCreateOrder } from '../../../hooks/useCreateOrderV2';

const AddLookupButton = ({ setShowModalSelectLookup }) => {
  return (
    <Button
      variant="contained"
      startIcon={<Iconify icon="eva:plus-fill" />}
      onClick={() => setShowModalSelectLookup(true)}
    >
      Tambah
    </Button>
  );
};

export const ModalLookup = ({ open, onClose, productDetail }) => {
  const [showModalSelectLookup, setShowModalSelectLookup] = useState(false);

  return (
    <Modal
      title={'Tambah Lookup'}
      open={open}
      onClose={onClose}
      maxWidth="md"
      headerButtonComponent={<AddLookupButton setShowModalSelectLookup={setShowModalSelectLookup} />}
    >
      <DialogForm
        onClose={onClose}
        showModalSelectLookup={showModalSelectLookup}
        setShowModalSelectLookup={setShowModalSelectLookup}
        productDetail={productDetail}
      />
    </Modal>
  );
};

const DialogForm = ({ onClose, showModalSelectLookup, setShowModalSelectLookup, productDetail }) => {
  const { immerSetState, stockLookups } = useCreateOrder((state) => {
    const itemIndex = state.payloadBody.items.findIndex((item) => item.uuid === productDetail?.uuid);
    return {
      immerSetState: state.immerSetState,
      stockLookups: state.payloadBody.items[itemIndex].stockLookups,
    };
  });

  const onClickSaveSelectedLookups = (selectedLookups) => {
    immerSetState((draft) => {
      const itemIndex = draft.payloadBody.items.findIndex((item) => item.uuid === productDetail?.uuid);
      draft.payloadBody.items[itemIndex].stockLookups = selectedLookups;
    });
  };

  return (
    <>
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
                {stockLookups?.map((lookup, index) => (
                  <TableRow key={lookup?.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{lookup?.code}</TableCell>
                    <TableCell>
                      <Tooltip title="Hapus Lookup">
                        <IconButton size="small" color="error">
                          <Iconify icon="eva:trash-2-outline" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </Stack>
      <ModalSelectLookup
        open={showModalSelectLookup}
        onClose={() => setShowModalSelectLookup(false)}
        saveCallback={onClickSaveSelectedLookups}
        selectedLookups={stockLookups}
      />
    </>
  );
};

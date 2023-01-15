import React, { useState } from 'react';

import cloneDeep from 'lodash/cloneDeep';

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
      stockLookups: state.payloadBody.items[itemIndex].stockLookups?.filter((lookup) => lookup?.action !== 'delete'),
    };
  });

  const onClickSaveSelectedLookups = (selectedLookups) => {
    immerSetState((draft) => {
      const itemIndex = draft.payloadBody.items.findIndex((item) => item.uuid === productDetail?.uuid);
      draft.payloadBody.items[itemIndex].stockLookups = selectedLookups;
    });
  };

  const onClickDeleteLookup = (deleteLookup) => {
    immerSetState((draft) => {
      const itemIndex = draft.payloadBody.items.findIndex((item) => item.uuid === productDetail?.uuid);

      let newStockLookups = cloneDeep(draft.payloadBody.items[itemIndex].stockLookups);
      const lookupIndex = newStockLookups?.findIndex((lookup) => lookup?.id === deleteLookup?.id);
      const lookupItem = newStockLookups[lookupIndex];

      if (lookupItem?.action === 'insert') {
        newStockLookups = newStockLookups?.filter((lookup) => lookup?.id !== deleteLookup?.id);
      } else {
        newStockLookups[lookupIndex].action = 'delete';
      }

      draft.payloadBody.items[itemIndex].stockLookups = newStockLookups;
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
                {stockLookups?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ textAlign: 'center' }}>
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                ) : (
                  stockLookups?.map((lookup, index) => (
                    <TableRow key={lookup?.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{lookup?.code}</TableCell>
                      <TableCell>
                        <Tooltip title="Hapus Lookup">
                          <IconButton size="small" color="error" onClick={() => onClickDeleteLookup(lookup)}>
                            <Iconify icon="eva:trash-2-outline" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
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

import React, { useEffect, useState } from 'react';
import {
  Stack,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  TableRow,
  TableCell,
  TableHead,
  IconButton,
  Tooltip,
} from '@mui/material';
import Iconify from '../../Iconify';
import Modal from '../Modal';
import ModalLookups from './ModalLookups';
import Label from '../../Label';
import Scrollbar from '../../Scrollbar';

// eslint-disable-next-line react/prop-types
function ModalItems({ open, onClose, stockData }) {
  return (
    <Modal title="Items" open={open} onClose={onClose} maxWidth="md">
      <ModalContent stockData={stockData} />
    </Modal>
  );
}

function ModalContent({ stockData }) {
  const products = stockData?.stockLookups || [];
  const [showModal, setShowModal] = useState(false);
  const [lookupData, setLookupData] = useState(null);

  const showModalHandler = (data) => {
    setShowModal(true);
    setLookupData(data);
  };

  const closeModalHandler = () => {
    setShowModal(false);
    setLookupData(null);
  };

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Scrollbar sx={{ maxHeight: '350px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nama Produk</TableCell>
              <TableCell>Tipe Konversi</TableCell>
              <TableCell>Tipe</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products?.map((row) => (
              <TableRow key={row?.id}>
                <TableCell>{`${row?.product?.brandName} - ${row?.product?.variantName}`}</TableCell>
                <TableCell>
                  {row?.convertType ? (
                    <Label variant={'ghost'} color={row?.convertType === 'origin' ? 'success' : 'warning'}>
                      {row?.convertType}
                    </Label>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{`${row?.product?.packetValue} ${row?.product?.unitName}`}</TableCell>
                <TableCell>
                  <Tooltip title="Lookup items">
                    <IconButton size="small" color="success" onClick={() => showModalHandler(row)}>
                      <Iconify icon="eva:search-outline" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
      <ModalLookups open={showModal} onClose={closeModalHandler} lookupData={lookupData} />
    </Stack>
  );
}

export default ModalItems;

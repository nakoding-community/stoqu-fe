import React, { useState } from 'react';
import { Stack, Table, TableCell, TableHead, TableRow, TableBody, Tooltip, IconButton } from '@mui/material';
import Modal from '../Modal';
import Iconify from '../../Iconify';
import ModalStockLookup from './ModaStockLookup';

const ModalStockRack = ({ open, onClose, data, getStocksHandler }) => {
  const title = 'Stok Rak';

  return (
    <Modal title={title} open={open} onClose={onClose} maxWidth="md">
      <DialogForm data={data} getStocksHandler={getStocksHandler} />
    </Modal>
  );
};

const DialogForm = ({ data, getStocksHandler }) => {
  const [showLookupStockModal, setShowLookupStockModal] = useState(false);
  const [stockRackId, setStockRackId] = useState(null);

  const { stockRacks } = data || {};

  return (
    <>
      <Stack>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rak</TableCell>
                <TableCell>Total Segel</TableCell>
                <TableCell>Total Tidak Segel</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockRacks?.length > 0 &&
                stockRacks?.map((rack) => (
                  <TableRow key={rack?.id}>
                    <TableCell>{rack?.rack?.name}</TableCell>
                    <TableCell>{rack?.totalSeal}</TableCell>
                    <TableCell>{rack?.totalNotSeal}</TableCell>
                    <TableCell>{rack?.total}</TableCell>
                    <TableCell>
                      <Tooltip title="Lookup Stok">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => {
                            setShowLookupStockModal(true);
                            setStockRackId(rack?.id);
                          }}
                        >
                          <Iconify icon="eva:search-outline" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Stack>
      </Stack>
      <ModalStockLookup
        data={data}
        stockRackId={stockRackId}
        open={showLookupStockModal}
        onClose={() => {
          setShowLookupStockModal(false);
          setStockRackId(null);
        }}
        detailLookupStockData={data}
        getStocksHandler={getStocksHandler}
      />
    </>
  );
};

export default ModalStockRack;

import React from 'react';
import { Stack, TextField } from '@mui/material';
import Modal from '../Modal';

export const ModalDetailStock = ({ open, onClose, detailStockData }) => {
  const title = 'Detail Stok';

  return (
    <Modal title={title} open={open} onClose={onClose}>
      <DialogForm detailStockData={detailStockData} />
    </Modal>
  );
};

const DialogForm = ({ detailStockData }) => {
  return (
    <Stack>
      <Stack spacing={3} sx={{ p: 3 }}>
        {/* <TextField
          value={detailStockData?.productName}
          type="text"
          id="brand"
          label="Nama Produk"
          variant="outlined"
          disabled
        /> */}
        <TextField id="code" value={detailStockData?.productCode} label="Kode" variant="outlined" disabled />
        <TextField
          value={detailStockData?.brandName}
          type="text"
          id="brand"
          label="Brand"
          variant="outlined"
          disabled
        />
        <TextField
          value={detailStockData?.variantName}
          type="text"
          id="variant"
          label="Varian"
          variant="outlined"
          disabled
        />
        <TextField
          value={`${detailStockData?.packetValue} ${detailStockData?.unitName}`}
          type="text"
          id="type"
          label="Tipe"
          variant="outlined"
          disabled
        />
        <TextField
          value={detailStockData?.totalSeal}
          type="text"
          id="totalseal"
          label="Total Segel"
          variant="outlined"
          disabled
        />
        <TextField
          value={detailStockData?.totalNotSeal}
          type="text"
          id="totalnotseal"
          label="Total Tidak Segel"
          variant="outlined"
          disabled
        />
        <TextField
          value={detailStockData?.totalSeal + detailStockData?.totalNotSeal}
          type="text"
          id="totalstock"
          label="Total Stock"
          variant="outlined"
          disabled
        />
      </Stack>
    </Stack>
  );
};

import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useConfirm } from 'material-ui-confirm';
import { useTheme, alpha } from '@mui/material/styles';

import { Stack, DialogActions, Button, Box, Typography, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import Modal from '../Modal';
import InfiniteCombobox from '../../combobox/InfiniteCombobox';
import Iconify from '../../Iconify';

// eslint-disable-next-line react/prop-types
function ModalStockMovement({ open, onClose }) {
  return (
    <Modal title="Stok Movement" open={open} onClose={onClose} maxWidth="sm">
      <DialogForm onClose={onClose} />
    </Modal>
  );
}

function DialogForm({ onClose }) {
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const theme = useTheme();

  const submitModalHandler = async () => {
    const body = {
      destination: {
        rackId: '',
      },
      origin: {
        productId: '',
        rackId: '',
        stockLookupIds: [],
      },
    };
  };

  const confrimHandler = (e) => {
    e.preventDefault();

    confirm().then(() => {
      submitModalHandler(e);
    });
  };

  return (
    <Stack component="form" onSubmit={confrimHandler}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <InfiniteCombobox
          // value={selectedProducts?.[0]?.id}
          label="Cari Produk"
          type="products"
          // onChange={onChangeProductHandler}
          required
          // excludeIds={selectedProducts?.map(({ id }) => id)}
          // labelText={productLabel}
        />
        <InfiniteCombobox
          // value={selectedProducts?.[0]?.id}
          label="Rak Origin"
          type="racks"
          // onChange={onChangeProductHandler}
          required
          // excludeIds={selectedProducts?.map(({ id }) => id)}
          // labelText={productLabel}
        />
        <InfiniteCombobox
          // value={selectedProducts?.[0]?.id}
          label="Rak Destination"
          type="racks"
          // onChange={onChangeProductHandler}
          required
          // excludeIds={selectedProducts?.map(({ id }) => id)}
          // labelText={productLabel}
        />
        <InfiniteCombobox
          // value={selectedProducts?.[0]?.id}
          label="Lookup"
          type="lookupStocks"
          // onChange={onChangeProductHandler}
          required
          // excludeIds={selectedProducts?.map(({ id }) => id)}
          // labelText={productLabel}
        />
        <Stack direction="row" alignItems={'center'}>
          <Box
            sx={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
              color: theme.palette.success.dark,
              backgroundColor: alpha(theme.palette.success.main, 0.16),
            }}
          >
            <Iconify icon="mdi:office-building-settings" sx={{ width: '20px', height: '20px' }} />
          </Box>
          <Stack width="100%" direction="row" alignItems={'center'} justifyContent="space-between">
            <Box>
              <Typography variant="body1">Lookup 1</Typography>
            </Box>
            <Stack flexDirection="row" alignItems={'center'}>
              <IconButton size="small" color="error" onClick={() => null}>
                <Iconify icon="eva:trash-2-outline" />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Close
        </Button>

        <LoadingButton type="submit" variant="contained" loading={false}>
          Save
        </LoadingButton>
      </DialogActions>
    </Stack>
  );
}

export default ModalStockMovement;

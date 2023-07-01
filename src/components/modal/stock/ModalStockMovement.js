import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useConfirm } from 'material-ui-confirm';
import { useTheme, alpha } from '@mui/material/styles';
import isEmpty from 'lodash/isEmpty';

import { Stack, DialogActions, Button, Box, Typography, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { toast } from 'react-toastify';
import Modal from '../Modal';
import InfiniteCombobox from '../../combobox/InfiniteCombobox';
import Iconify from '../../Iconify';
import { getStocks, stockMovement } from '../../../clientv2/stockClient';

// eslint-disable-next-line react/prop-types
function ModalStockMovement({ open, onClose, getStocksHandler }) {
  return (
    <Modal title="Stok Movement" open={open} onClose={onClose} maxWidth="sm">
      <DialogForm onClose={onClose} getStocksHandler={getStocksHandler} />
    </Modal>
  );
}

function DialogForm({ onClose, getStocksHandler }) {
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const theme = useTheme();

  const [productId, setProductId] = useState('');
  const [productLabel, setProductLabel] = useState('');

  const [rackOriginId, setRackOriginId] = useState('');
  const [rackOriginLabel, setRackOriginLabel] = useState('');

  const [rackDestinationId, setRackDestinationId] = useState('');
  const [rackDestinationLabel, setRackDestinationLabel] = useState('');

  const [lookupStocks, setLookupStocks] = useState([]);

  const isButtonDisabled =
    isEmpty(productId) || isEmpty(rackOriginId) || isEmpty(rackDestinationId) || isEmpty(lookupStocks);

  const submitModalHandler = async () => {
    const body = {
      destination: {
        rackId: rackDestinationId,
      },
      origin: {
        productId,
        rackId: rackOriginId,
        stockLookupIds: lookupStocks?.map((stock) => stock?.id),
      },
    };

    const { isSuccess } = await stockMovement(body);

    if (isSuccess) {
      getStocksHandler();
      queryClient.invalidateQueries(['stock-histories', 'list']);

      toast.success('Berhasil melakukan movement stok');
      onClose();
    }
  };

  const onChangeProductHandler = (e) => {
    setProductId(e?.id);
    setProductLabel(e?.label);
    setLookupStocks([]);
  };

  const onChangeRackOriginHandler = (e) => {
    setRackOriginId(e?.id);
    setRackOriginLabel(e?.label);
    setLookupStocks([]);
  };

  const onChangeRackDestinationHandler = (e) => {
    setRackDestinationId(e?.id);
    setRackDestinationLabel(e?.label);
  };

  const onChangeLookupStocksHandler = (e) => {
    setLookupStocks([...lookupStocks, e]);
  };

  const removeLookupHandler = (item) => {
    const newData = lookupStocks?.filter((data) => data?.id !== item?.id);
    setLookupStocks(newData);
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
          label="Cari Produk *"
          onChange={onChangeProductHandler}
          required
          value={productId}
          labelText={productLabel}
          queryFunction={getStocks}
          restructureOptions={(options) =>
            options?.map((option) => {
              return {
                id: option?.productId,
                label: `${option?.productCode} - ${option?.brandName} - ${option?.variantName} - ${option?.packetValue}${option?.unitName}`,
              };
            })
          }
        />
        <InfiniteCombobox
          label="Cari Rak *"
          type="racks"
          onChange={onChangeRackOriginHandler}
          required
          value={rackOriginId}
          labelText={rackOriginLabel}
        />
        <InfiniteCombobox
          label="Rak Tujuan *"
          type="racks"
          onChange={onChangeRackDestinationHandler}
          required
          value={rackDestinationId}
          labelText={rackDestinationLabel}
        />
        <InfiniteCombobox
          label="Lookup *"
          type="lookupStocks"
          onChange={onChangeLookupStocksHandler}
          required
          additionalQuery={{ productId, rackId: rackOriginId }}
        />
        {lookupStocks?.map((lookupStock) => (
          <Stack direction="row" alignItems={'center'} key={lookupStock?.id}>
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
                <Typography variant="body1">{lookupStock?.label}</Typography>
              </Box>
              <Stack flexDirection="row" alignItems={'center'}>
                <IconButton size="small" color="error" onClick={() => removeLookupHandler(lookupStock)}>
                  <Iconify icon="eva:trash-2-outline" />
                </IconButton>
              </Stack>
            </Stack>
          </Stack>
        ))}
      </Stack>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Close
        </Button>

        <LoadingButton type="submit" variant="contained" loading={false} disabled={isButtonDisabled}>
          Save
        </LoadingButton>
      </DialogActions>
    </Stack>
  );
}

export default ModalStockMovement;

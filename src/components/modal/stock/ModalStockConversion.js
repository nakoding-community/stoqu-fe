import React, { useState } from 'react';
import parseInt from 'lodash/parseInt';
import isEmpty from 'lodash/isEmpty';
import { useQueryClient } from '@tanstack/react-query';
import { useConfirm } from 'material-ui-confirm';
import { Box, Stack, Typography, IconButton, TextField, DialogActions, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTheme, alpha } from '@mui/material/styles';
import { toast } from 'react-toastify';
import InfiniteCombobox from '../../combobox/InfiniteCombobox';
import Modal from '../Modal';
import Iconify from '../../Iconify';
import { getStocks, stockConvertion } from '../../../clientv2/stockClient';

// eslint-disable-next-line react/prop-types
function ModalStockConversion({
  open,
  onClose,
  getStocksHandler,
  editConversionStockData,
  showModalSuccessCreateTrxHandler,
}) {
  return (
    <Modal title="Konversi Stok" open={open} onClose={onClose} maxWidth="sm">
      <DialogForm
        onClose={onClose}
        editConversionStockData={editConversionStockData}
        showModalSuccessCreateTrxHandler={showModalSuccessCreateTrxHandler}
        getStocksHandler={getStocksHandler}
      />
    </Modal>
  );
}

const DialogForm = ({ onClose, getStocksHandler, editConversionStockData, showModalSuccessCreateTrxHandler }) => {
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const theme = useTheme();

  const [quantity, setQuantity] = useState('');

  const [productId, setProductId] = useState('');
  const [productLabel, setProductLabel] = useState('');

  const [rackId, setRackId] = useState('');
  const [rackLabel, setRackLabel] = useState('');

  const [lookupStocks, setLookupStocks] = useState([]);

  const [packetId, setPacketId] = useState('');
  const [packetLabel, setPacketLabel] = useState('');

  const isButtonDisabled =
    isEmpty(productId) || isEmpty(rackId) || isEmpty(lookupStocks) || isEmpty(packetId) || isEmpty(quantity);

  const onChangeProductHandler = (e) => {
    setProductId(e?.id);
    setProductLabel(e?.label);
    setLookupStocks([]);
  };

  const onChangeRackHandler = (e) => {
    setRackId(e?.id);
    setRackLabel(e?.label);
    setLookupStocks([]);
  };

  const onChangeLookupStocksHandler = (e) => {
    setLookupStocks([...lookupStocks, e]);
  };

  const removeLookupHandler = (item) => {
    const newData = lookupStocks?.filter((data) => data?.id !== item?.id);
    setLookupStocks(newData);
  };

  const onChangePacketHandler = (e) => {
    setPacketId(e?.id);
    setPacketLabel(e?.label);
  };

  const submitModalHandler = async (e) => {
    e.preventDefault();

    const body = {
      destination: {
        packetId,
        total: parseInt(quantity),
      },
      origin: {
        productId,
        rackId,
        stockLookupIds: lookupStocks?.map((stock) => stock?.id),
      },
    };

    const { data, isSuccess } = await stockConvertion(body);
    if (isSuccess) {
      onClose();
      toast.success(`Berhasil mengkonversi stok`);

      getStocksHandler();
      queryClient.invalidateQueries(['stock-histories', 'list']);

      // need timeout because be need time to refetch data
      setTimeout(() => {
        showModalSuccessCreateTrxHandler(data, 'conversion');
      }, 250);
    }
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
          onChange={onChangeRackHandler}
          required
          value={rackId}
          labelText={rackLabel}
        />

        <InfiniteCombobox
          label="Lookup *"
          type="lookupStocks"
          onChange={onChangeLookupStocksHandler}
          required
          additionalQuery={{ productId, rackId }}
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

        <InfiniteCombobox
          label="Paket Destination (*)"
          type="types"
          onChange={onChangePacketHandler}
          labelText={packetLabel}
          value={packetId}
        />

        <TextField
          label="Jumlah"
          variant="outlined"
          size="small"
          sx={{ marginBottom: '8px' }}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </Stack>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Close
        </Button>

        <LoadingButton type="submit" variant="contained" disabled={isButtonDisabled}>
          Save
        </LoadingButton>
      </DialogActions>
    </Stack>
  );
};

export default ModalStockConversion;

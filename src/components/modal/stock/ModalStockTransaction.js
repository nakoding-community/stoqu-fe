import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useConfirm } from 'material-ui-confirm';
import parseInt from 'lodash/parseInt';
import { toast } from 'react-toastify';
import { Box, Stack, Typography, IconButton, Tabs, Tab, TextField, DialogActions, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTheme, alpha } from '@mui/material/styles';
import InfiniteCombobox from '../../combobox/InfiniteCombobox';
import Modal from '../Modal';
import useTabs from '../../../hooks/useTabs';

import { createStockTransaction } from '../../../client/stocksClient';

import KEY from '../../../constant/queryKey';
import Iconify from '../../Iconify';

// eslint-disable-next-line react/prop-types
function ModalStockTransaction({ open, onClose, getStocksHandler, showModalSuccessCreateTrxHandler }) {
  return (
    <Modal title="Transaksi Stok" open={open} onClose={onClose} maxWidth="sm">
      <DialogForm
        onClose={onClose}
        getStocksHandler={getStocksHandler}
        showModalSuccessCreateTrxHandler={showModalSuccessCreateTrxHandler}
      />
    </Modal>
  );
}

function DialogForm({ onClose, getStocksHandler, showModalSuccessCreateTrxHandler }) {
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const theme = useTheme();

  const { currentTab, onChangeTab } = useTabs('in');

  const [orderId, setOrderId] = useState('');
  const [orderLabel, setOrderLabel] = useState('');

  const [productId, setProductId] = useState('');
  const [productLabel, setProductLabel] = useState('');

  const [rackId, setRackId] = useState('');
  const [rackLabel, setRackLabel] = useState('');

  const [quantity, setQuantity] = useState('');

  const TABS = [
    { value: 'in', label: 'Masuk' },
    { value: 'out', label: 'Keluar' },
  ];

  const onChangeOrderHandler = (e) => {
    setOrderId(e?.id);
    setOrderLabel(e?.label);
  };

  const onChangeProductHandler = (e) => {
    setProductId(e?.id);
    setProductLabel(e?.name);
  };

  const onChangeRackHandler = (e) => {
    setRackId(e?.id);
    setRackLabel(e?.label);
  };

  const submitModalHandler = async () => {
    // const body = {
    //   trxType: currentTab,
    //   orderTrxId: orderId,
    //   products: getRestructuedProduct(),
    // };

    const body = {
      orderTrxId: '', // perlu confirm ambil dari mana
      products: [
        {
          id: '',
          quantity: 0,
          rackId: '',
          stockLookupIds: [],
          stockTrxItemLookup_ids: [],
        },
      ],
      trxType: currentTab,
    };

    const { data, isSuccess } = await createStockTransaction(body);
    if (isSuccess) {
      onClose();
      toast.success(`Berhasil membuat transaksi`);

      await getStocksHandler();
      queryClient.invalidateQueries([KEY.stocks.histories.all]);

      // need timeout because be need time to refetch data
      setTimeout(() => {
        showModalSuccessCreateTrxHandler(data, 'transaction');
      }, 250);
    }
  };

  const confrimHandler = (e) => {
    e.preventDefault();

    confirm().then(() => {
      submitModalHandler(e);
    });
  };

  useEffect(() => {
    setOrderId('');
    setOrderLabel('');
    setProductLabel('');
  }, [currentTab]);

  return (
    <Stack component="form" onSubmit={confrimHandler}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={currentTab}
          onChange={onChangeTab}
          sx={{ px: 2, bgcolor: 'background.neutral' }}
        >
          {TABS.map((tab) => (
            <Tab
              disableRipple
              key={tab.value}
              value={tab.value}
              label={
                <Stack spacing={1} direction="row" alignItems="center">
                  <div>{tab.label}</div>
                </Stack>
              }
            />
          ))}
        </Tabs>
        <InfiniteCombobox
          value={orderId}
          label="Cari Pesanan"
          type="orders"
          onChange={onChangeOrderHandler}
          disabled={currentTab === 'out'}
          labelText={orderLabel}
        />
        <InfiniteCombobox
          label="Cari Produk"
          type="products"
          onChange={onChangeProductHandler}
          required
          value={productId}
          labelText={productLabel}
        />
        <InfiniteCombobox
          label="Cari Rak"
          type="racks"
          onChange={onChangeRackHandler}
          required
          value={rackId}
          labelText={rackLabel}
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

        {currentTab === 'out' && (
          <InfiniteCombobox
            // value={selectedProducts?.[0]?.id}
            label="Lookup"
            type="lookupStocks"
            // onChange={onChangeProductHandler}
            required
            // excludeIds={selectedProducts?.map(({ id }) => id)}
            // labelText={productLabel}
          />
        )}
        {currentTab === 'out' && (
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
        )}
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

export default ModalStockTransaction;

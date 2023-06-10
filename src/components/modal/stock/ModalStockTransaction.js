import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useConfirm } from 'material-ui-confirm';
import parseInt from 'lodash/parseInt';
import { toast } from 'react-toastify';
import { Box, Stack, Typography, IconButton, Tabs, Tab, TextField, DialogActions, Button, Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTheme, alpha } from '@mui/material/styles';
import isEmpty from 'lodash/isEmpty';
import InfiniteCombobox from '../../combobox/InfiniteCombobox';
import Modal from '../Modal';
import useTabs from '../../../hooks/useTabs';

import KEY from '../../../constant/queryKey';
import Iconify from '../../Iconify';
import { getStocks, stockTransaction } from '../../../clientv2/stockClient';
import DownloadProductCodePDF from '../../PDF/DownloadProductCodePDF';
import { getOrders } from '../../../clientv2/orderClient';

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

  const [orderTrxId, setOrderTrxId] = useState('');
  const [orderLabel, setOrderLabel] = useState('');

  const [productId, setProductId] = useState('');
  const [productLabel, setProductLabel] = useState('');
  const [productData, setProductData] = useState(null);

  const [rackId, setRackId] = useState('');
  const [rackLabel, setRackLabel] = useState('');

  const [quantity, setQuantity] = useState('');

  const [lookupStocks, setLookupStocks] = useState([]);
  const [valueStrings, setValueStrings] = useState(null);

  const TABS = [
    { value: 'in', label: 'Masuk' },
    { value: 'out', label: 'Keluar' },
  ];

  const isButtonDisabled = () => {
    if (currentTab === 'in') {
      return isEmpty(productId) || isEmpty(rackId) || isEmpty(quantity);
    }

    if (currentTab === 'out') {
      return isEmpty(productId) || isEmpty(rackId) || isEmpty(quantity) || isEmpty(lookupStocks);
    }
  };

  const onChangeOrderHandler = (e) => {
    setOrderTrxId(e?.id);
    setOrderLabel(e?.label);
  };

  const onChangeProductHandler = (e) => {
    setProductId(e?.id);
    setProductLabel(e?.label);
    setProductData(e);
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

  const submitModalHandler = async () => {
    const body = {
      orderTrxId,
      products: [
        {
          id: productId,
          quantity: parseInt(quantity),
          rackId,
          stockLookupIds: lookupStocks?.map((stock) => stock?.id),
          stockTrxItemLookup_ids: [],
        },
      ],
      trxType: currentTab,
    };

    const { data, isSuccess } = await stockTransaction(body);
    if (isSuccess) {
      onClose();
      toast.success(`Berhasil membuat transaksi`);

      getStocksHandler();
      queryClient.invalidateQueries(['stock-histories', 'list']);

      // need timeout because be need time to refetch data
      setTimeout(() => {
        showModalSuccessCreateTrxHandler(data, 'transaction', productData, quantity);
      }, 250);
    }
  };

  const confrimHandler = (e) => {
    e.preventDefault();

    confirm().then(() => {
      submitModalHandler(e);
    });
  };

  const onClickDownload = (code) => {
    setValueStrings([code]);

    setTimeout(() => {
      setValueStrings([]);
    }, 250);
  };

  useEffect(() => {
    setOrderTrxId('');
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
          value={orderTrxId}
          label="Cari Pesanan"
          type="orders"
          onChange={onChangeOrderHandler}
          labelText={orderLabel}
          required
          queryFunction={getOrders}
          restructureOptions={(options) =>
            options?.map((option) => {
              return {
                ...option,
                id: option?.id,
                label: `${option?.code}`,
              };
            })
          }
        />
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
                ...option,
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
            label="Lookup *"
            type="lookupStocks"
            onChange={onChangeLookupStocksHandler}
            required
            additionalQuery={{ productId, rackId }}
          />
        )}
        {currentTab === 'out' && (
          <>
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
                    <Tooltip title="Download QR Code">
                      <IconButton size="small" color="success" onClick={() => onClickDownload(lookupStock?.label)}>
                        <Iconify icon="ion:qr-code" />
                      </IconButton>
                    </Tooltip>
                    <IconButton size="small" color="error" onClick={() => removeLookupHandler(lookupStock)}>
                      <Iconify icon="eva:trash-2-outline" />
                    </IconButton>
                  </Stack>
                </Stack>
                <DownloadProductCodePDF useButton={false} valueStrings={valueStrings} />
              </Stack>
            ))}
          </>
        )}
      </Stack>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Close
        </Button>
        <LoadingButton type="submit" variant="contained" loading={false} disabled={isButtonDisabled()}>
          Save
        </LoadingButton>
      </DialogActions>
    </Stack>
  );
}

export default ModalStockTransaction;

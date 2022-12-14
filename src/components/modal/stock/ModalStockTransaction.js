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
import Iconify from '../../Iconify';
import useTabs from '../../../hooks/useTabs';

import { createStockTransaction } from '../../../client/stocksClient';
import { getProductCountEstimation } from '../../../client/productsClient';

import KEY from '../../../constant/queryKey';

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

  const { currentTab, onChangeTab } = useTabs('in');

  const [orderId, setOrderId] = useState('');
  const [orderCode, setOrderCode] = useState('');
  const [orderLabel, setOrderLabel] = useState('');

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productLabel, setProductLabel] = useState('');

  const TABS = [
    { value: 'in', label: 'Masuk' },
    { value: 'out', label: 'Keluar' },
  ];

  const onChangeOrderHandler = (e) => {
    setOrderId(e?.id);
    setOrderCode(e?.code);
    setOrderLabel(e?.label);
  };

  const isProductAlreadySelected = (id) => {
    return selectedProducts?.filter((sel) => sel?.id === id)?.length > 0;
  };

  const isButtonDisabled = () => {
    if (selectedProducts?.length === 0) {
      return true;
    }

    return (
      selectedProducts?.filter(
        (sel) =>
          sel?.quantity === '' ||
          parseFloat(sel?.quantity) === 0 ||
          sel?.quantity === null ||
          sel?.quantity === undefined
      )?.length > 0
    );
  };

  const getProductCountEstimationHandler = async (productCode) => {
    const { data } = await getProductCountEstimation(orderCode, productCode);
    if (data) {
      return data?.count;
    }
  };

  const onChangeProductHandler = async (e) => {
    if (e && !isProductAlreadySelected(e?.id)) {
      let estimateQuantity = 0;
      if (currentTab === 'in') {
        const countEstimate = await getProductCountEstimationHandler(e?.code);
        estimateQuantity = countEstimate;
      }
      const product = {
        id: e?.id,
        productName: `${e?.brand?.brand} - ${e?.variant?.variant} ${e?.type?.value} ${e?.type?.unit?.unit}`,
        productCode: e?.code,
        quantity: '',
        estimateQuantity,
      };

      setProductLabel(e?.label);
      setSelectedProducts((prev) => [...prev, product]);
    }
  };

  const getRestructuedProduct = () => {
    return selectedProducts?.map((product) => {
      return {
        id: product?.id,
        quantity: parseInt(product?.quantity),
        estimateQuantity: parseInt(product?.estimateQuantity),
      };
    });
  };

  const submitModalHandler = async () => {
    const body = {
      trxType: currentTab,
      orderTrxId: orderId,
      products: getRestructuedProduct(),
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
    setOrderCode('');
    setSelectedProducts([]);
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
          value={selectedProducts?.[0]?.id}
          label="Cari Produk"
          type="products"
          onChange={onChangeProductHandler}
          required
          excludeIds={selectedProducts?.map(({ id }) => id)}
          labelText={productLabel}
        />
        {selectedProducts?.map((product, index) => (
          <SelectedProduct
            key={product?.id}
            index={index}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            currentTab={currentTab}
            {...product}
          />
        ))}
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

const SelectedProduct = ({
  index,
  productCode,
  productName,
  quantity,
  estimateQuantity,
  selectedProducts,
  setSelectedProducts,
  currentTab,
}) => {
  const theme = useTheme();

  const [productQuantity, setProductQuantity] = useState(quantity);
  const [productEstimateQuantity, setProductEstimateQuantity] = useState(estimateQuantity);

  const onChangeProductQuantityHandler = (e) => {
    const inputValue = e.target.value;
    setProductQuantity(inputValue);

    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index].quantity = inputValue;
    setSelectedProducts(newSelectedProducts);
  };

  const onChangeProductEstimateQuantityHandler = (e) => {
    const inputValue = e.target.value;
    setProductEstimateQuantity(inputValue);

    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index].estimateQuantity = inputValue;
    setSelectedProducts(newSelectedProducts);
  };

  const onDeleteProductHandler = () => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts.splice(index, 1);
    setSelectedProducts(newSelectedProducts);
  };

  return (
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
          <Typography variant="body1">{productName}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {productCode}
          </Typography>
        </Box>
        <Stack width={'50%'} flexDirection="row" alignItems={'center'}>
          <Box>
            <TextField
              id="outlined-basic"
              label="Jumlah Aktual"
              variant="outlined"
              size="small"
              sx={{ marginBottom: '8px' }}
              value={productQuantity}
              onChange={onChangeProductQuantityHandler}
              required
            />
            {currentTab === 'in' && (
              <TextField
                id="outlined-basic"
                label="Jumlah Estimasi"
                variant="outlined"
                size="small"
                value={productEstimateQuantity}
                onChange={onChangeProductEstimateQuantityHandler}
              />
            )}
          </Box>
          <IconButton size="small" color="error" onClick={onDeleteProductHandler}>
            <Iconify icon="eva:trash-2-outline" />
          </IconButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ModalStockTransaction;

import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useConfirm } from 'material-ui-confirm';
import { Box, Stack, Typography, IconButton, Divider, TextField, DialogActions, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTheme, alpha } from '@mui/material/styles';
import { toast } from 'react-toastify';
import InfiniteCombobox from '../../combobox/InfiniteCombobox';
import Modal from '../Modal';
import Iconify from '../../Iconify';
import { stockConvertion } from '../../../client/stocksClient';
import KEY from '../../../constant/queryKey';

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

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productLabel, setProductLabel] = useState('');

  const [selectedLookupStocks, setSelectedLookupStocks] = useState([]);
  const [lookupLabel, setLookupLabel] = useState('');

  const [selectedProductType, setSelectedProductType] = useState([]);
  const [productTypeLabel, setProductTypeLabel] = useState('');

  const [quantity, setQuantity] = useState('');

  const isNoQuantity = quantity === '' || parseFloat(quantity) === 0 || quantity === null || quantity === undefined;

  const isButtonDisabled = selectedProducts?.length === 0 || selectedLookupStocks?.length === 0 || isNoQuantity;

  const onChangeQuantityHandler = (e) => {
    setQuantity(e.target.value);
  };

  const onChangeProductHandler = (e) => {
    setProductLabel(e?.label);
    if (e) {
      const product = {
        id: e?.id,
        title: `${e?.brand?.brand} - ${e?.variant?.variant} ${e?.type?.value} ${e?.type?.unit?.unit}`,
        subTitle: e?.code,
      };

      setSelectedProducts([product]);
    }
  };

  const isLookupStocksAlreadySelected = (id) => {
    return selectedLookupStocks?.filter((sel) => sel?.id === id)?.length > 0;
  };

  const onChangeLookupStockHandler = (e) => {
    setLookupLabel(e?.label);
    if (e && !isLookupStocksAlreadySelected(e?.id)) {
      const lookupStock = {
        id: e?.id,
        title: e?.code,
        subTitle: `Sisa: ${e?.name} `,
      };

      setSelectedLookupStocks((prev) => [...prev, lookupStock]);
    }
  };

  const onChangeProductTypeHandler = (e) => {
    setProductTypeLabel(e?.label);
    if (e) {
      const productType = {
        id: e?.id,
        title: e?.name,
        subTitle: e?.code,
      };

      setSelectedProductType([productType]);
    }
  };

  const getProductLookupStocksIds = () => {
    return selectedLookupStocks?.map((stock) => {
      return stock?.id;
    });
  };

  const submitModalHandler = async (e) => {
    e.preventDefault();
    const body = {
      trxType: 'convert',
      productOriginId: selectedProducts?.[0]?.id,
      productLookupOriginIds: getProductLookupStocksIds(),
      productDestinationId: selectedProductType?.[0]?.id,
      quantity: parseFloat(quantity),
      orderTrxId: null,
    };
    const { data, isSuccess } = await stockConvertion(body);
    if (isSuccess) {
      onClose();
      toast.success(`Berhasil mengkonversi stok`);

      await getStocksHandler();
      queryClient.invalidateQueries([KEY.stocks.histories.all]);

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

  useEffect(() => {
    if (editConversionStockData) {
      setSelectedProducts([
        {
          id: editConversionStockData?.product?.id,
          title: `${editConversionStockData?.brand?.brand} - ${editConversionStockData?.variant?.variant} ${editConversionStockData?.type?.value} ${editConversionStockData?.type?.unit?.unit}`,
          subTitle: editConversionStockData?.product?.code,
        },
      ]);
    }
  }, [editConversionStockData]);

  return (
    <Stack component="form" onSubmit={confrimHandler}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <InfiniteCombobox
          label="Cari Produk (*)"
          type="products"
          onChange={onChangeProductHandler}
          labelText={productLabel}
          excludeIds={selectedProducts?.map((product) => product?.id)}
        />
        {/* {selectedProducts?.map((product, index) => (
          <SelectedData
            key={product?.id}
            index={index}
            selectedData={selectedProducts}
            setSelectedData={setSelectedProducts}
            withDelete={false}
            {...product}
          />
        ))} */}
        {/* <Divider sx={{ borderStyle: 'dotted', borderSpacing: '2' }} /> */}

        <InfiniteCombobox
          label="Cari Lookup (*)"
          disabled={selectedProducts?.length === 0}
          type={'lookupStocks'}
          additionalQuery={{ productId: selectedProducts?.[0]?.id }}
          onChange={onChangeLookupStockHandler}
          labelText={lookupLabel}
          excludeIds={selectedLookupStocks?.map((lookup) => lookup?.id)}
        />
        {selectedLookupStocks?.map((lookup, index) => (
          <SelectedData
            key={lookup?.id}
            index={index}
            selectedData={selectedLookupStocks}
            setSelectedData={setSelectedLookupStocks}
            {...lookup}
          />
        ))}

        <InfiniteCombobox
          disabled={selectedProducts?.length === 0}
          label="Cari Tipe (*)"
          type="types"
          additionalQuery={{ productId: selectedProducts?.[0]?.id }}
          onChange={onChangeProductTypeHandler}
          excludeIds={selectedProductType?.map((product) => product?.id) || []}
          labelText={productTypeLabel}
        />
        {selectedProductType?.map((product, index) => (
          <SelectedData
            key={product?.id}
            index={index}
            selectedData={selectedProductType}
            setSelectedData={setSelectedProductType}
            iconType="warning"
            onChangeQuantityHandler={onChangeQuantityHandler}
            quantity={quantity}
            withDelete={false}
            {...product}
          />
        ))}
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

const SelectedData = ({
  index,
  subTitle,
  title,

  selectedData,
  setSelectedData,
  withDelete = true,
  iconType = 'success',
  onChangeQuantityHandler,
  quantity,
}) => {
  const theme = useTheme();

  const onDeleteProductHandler = () => {
    const newSelectedProducts = [...selectedData];
    newSelectedProducts.splice(index, 1);
    setSelectedData(newSelectedProducts);
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
          color: iconType === 'success' ? theme.palette.success.dark : theme.palette.warning.dark,
          backgroundColor: alpha(
            iconType === 'success' ? theme.palette.success.main : theme.palette.warning.main,
            0.16
          ),
        }}
      >
        <Iconify
          icon={iconType === 'success' ? 'mdi:office-building-settings' : 'mdi:cart'}
          sx={{ width: '20px', height: '20px' }}
        />
      </Box>
      <Stack width="100%" direction="row" alignItems={'center'} justifyContent="space-between">
        <Box>
          <Typography variant="body1">{title}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {subTitle}
          </Typography>
        </Box>
        {iconType === 'warning' && (
          <TextField
            id="outlined-basic"
            label="Jumlah (*)"
            variant="outlined"
            size="small"
            value={quantity}
            onChange={onChangeQuantityHandler}
            type="number"
          />
        )}
        {withDelete && (
          <IconButton size="small" color="error" onClick={onDeleteProductHandler}>
            <Iconify icon="eva:trash-2-outline" />
          </IconButton>
        )}
      </Stack>
    </Stack>
  );
};

export default ModalStockConversion;

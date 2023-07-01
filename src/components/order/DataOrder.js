import startCase from 'lodash/startCase';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useConfirm } from 'material-ui-confirm';

// @mui
import { Box, Card, Stack, TextField, IconButton, Grid, Typography, Link } from '@mui/material';
import useCreateOrder from '../../hooks/useCreateOrder';
import Iconify from '../Iconify';

import Label from '../Label';

import InfiniteCombobox from '../combobox/InfiniteCombobox';
import { getStatusColor } from '../../utils/helperUtils';

const DataOrder = () => {
  const confirm = useConfirm();

  const [inputLinkPayment, setInputLinkPayment] = useState('');
  const [showComboboxStatus, setShowComboboxStatus] = useState(false);

  const {
    createOrderState,
    changeCreateOrderState,
    totalPrice,
    cancelOrderHandler,
    isUserAbleToEdit,
    isReady,
    changeLabelText,
  } = useCreateOrder();
  const location = useLocation();

  const {
    trxType,
    customerId,
    supplierId,
    picId,

    paymentStatus,
    receipts,
    shipmentType,
    shipmentNumber,
    shipmentPrice,
    stockStatus,
    status,
    labelText,
    notes,
  } = createOrderState;

  const isCreatePage = location.pathname.includes('new');

  const onChangeInputLinkPayment = (e) => {
    setInputLinkPayment(e.target.value);
  };

  const updateReceiptsStateHandler = (method, deleteIndex) => {
    if (method === 'add') {
      if (inputLinkPayment) {
        const copyReceipts = [...receipts];
        const newData = {
          receiptUrl: inputLinkPayment,
        };
        copyReceipts.push(newData);
        changeCreateOrderState('receipts', copyReceipts);
        setInputLinkPayment('');
      }
    } else {
      const copyReceipts = [...receipts];
      copyReceipts.splice(deleteIndex, 1);
      changeCreateOrderState('receipts', copyReceipts);
    }
  };

  const onChangeStatusHandler = (e) => {
    if (e?.id === 'canceled') {
      confirm().then(async () => {
        cancelOrderHandler();
      });
    } else {
      changeCreateOrderState('status', e?.id);
    }
  };

  return (
    <>
      <Card>
        <Stack sx={{ py: 2.5, px: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <InfiniteCombobox
                value={trxType}
                label="Tipe Transaksi (*)"
                sx={{ marginBottom: '20px' }}
                type="typeTransaction"
                useStaticOption
                staticOptions={[
                  { id: 'in', label: 'Masuk' },
                  { id: 'out', label: 'Keluar' },
                ]}
                onChange={(e) => changeCreateOrderState('trxType', e?.id)}
                disabled={!isCreatePage || !isUserAbleToEdit}
              />
              <InfiniteCombobox
                value={customerId}
                label={`Customer ${trxType === 'out' ? '(*)' : ''}`}
                sx={{ marginBottom: '20px' }}
                type="users"
                additionalQuery={{ filterRole: 'customer' }}
                onChange={(e) => {
                  changeCreateOrderState('customerId', e?.id);
                  changeLabelText({ customerName: e?.label });
                }}
                useCreateOnEnter
                disabled={!isUserAbleToEdit}
                labelText={labelText?.customerName}
              />
              <InfiniteCombobox
                value={supplierId}
                label={`Supplier ${trxType === 'in' ? '(*)' : ''}`}
                sx={{ marginBottom: '20px' }}
                type="users"
                additionalQuery={{ filterRole: 'supplier' }}
                onChange={(e) => {
                  changeCreateOrderState('supplierId', e?.id);
                  changeLabelText({ supplierName: e?.label });
                }}
                disabled={!isUserAbleToEdit}
                labelText={labelText?.supplierName}
              />
              <InfiniteCombobox
                value={picId}
                label="PIC (*)"
                sx={{ marginBottom: '20px' }}
                type="users"
                additionalQuery={{ filterRole: 'admin' }}
                onChange={(e) => {
                  changeCreateOrderState('picId', e?.id);
                  changeLabelText({ picName: e?.label });
                }}
                disabled={!isUserAbleToEdit}
                labelText={labelText?.picName}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                value={shipmentPrice}
                id="outlined-basic"
                type="number"
                label="Harga Pengiriman"
                variant="outlined"
                size="medium"
                sx={{ mb: '20px', width: '100%' }}
                onChange={(e) => changeCreateOrderState('shipmentPrice', e.target.value)}
                disabled={!isUserAbleToEdit}
              />
              <InfiniteCombobox
                value={paymentStatus}
                label="Status Pembayaran (*)"
                sx={{ marginBottom: '20px' }}
                useStaticOption
                staticOptions={[
                  { id: 'complete', label: 'Lunas' },
                  { id: 'progress', label: 'Down Payment (DP)' },
                  { id: 'pending', label: 'Belum Dibayar' },
                ]}
                onChange={(e) => changeCreateOrderState('paymentStatus', e?.id)}
                disabled={!isUserAbleToEdit}
              />
              <TextField
                id="outlined-basic"
                type="text"
                label="Link Status Pembayaran"
                variant="outlined"
                size="medium"
                sx={{ mb: '20px', width: '100%' }}
                value={inputLinkPayment}
                onChange={onChangeInputLinkPayment}
                InputProps={{
                  endAdornment: (
                    <IconButton size="small" color="default" onClick={() => updateReceiptsStateHandler('add')}>
                      <Iconify icon="mdi:plus" />
                    </IconButton>
                  ),
                }}
                disabled={!isUserAbleToEdit}
              />
              {receipts?.length > 0 &&
                receipts?.map((receipt, index) => (
                  <Stack direction="row" alignItems="center" justifyContent="space-between" key={index}>
                    <Link variant="body2" color="blue">
                      {receipt?.receiptUrl}
                    </Link>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => updateReceiptsStateHandler('delete', index)}
                      disabled={!isUserAbleToEdit}
                    >
                      <Iconify icon="eva:trash-2-outline" />
                    </IconButton>
                  </Stack>
                ))}
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                value={shipmentType}
                id="outlined-basic"
                type="text"
                label="Tipe Pengiriman"
                variant="outlined"
                size="medium"
                sx={{ mb: '20px', width: '100%' }}
                onChange={(e) => changeCreateOrderState('shipmentType', e.target.value)}
                disabled={!isUserAbleToEdit}
              />
              <TextField
                value={shipmentNumber}
                id="outlined-basic"
                type="number"
                label="No. Pengiriman"
                variant="outlined"
                size="medium"
                sx={{ mb: '20px', width: '100%' }}
                onChange={(e) => changeCreateOrderState('shipmentNumber', e.target.value)}
                disabled={!isUserAbleToEdit}
              />
              <TextField
                value={Number.isNaN(totalPrice) ? '' : totalPrice}
                id="outlined-basic"
                type="number"
                label="Harga Akhir"
                variant="outlined"
                size="medium"
                sx={{ mb: '20px', width: '100%' }}
                disabled
              />
              {!isCreatePage ? (
                isReady && (
                  <TextField
                    value={notes}
                    id="outlined-basic"
                    type="text"
                    label="Catatan"
                    variant="outlined"
                    size="medium"
                    sx={{ mb: '20px', width: '100%' }}
                    onChange={(e) => changeCreateOrderState('notes', e.target.value)}
                    disabled={!isUserAbleToEdit}
                    multiline
                    minRows={3}
                    maxRows={4}
                  />
                )
              ) : (
                <TextField
                  value={notes}
                  id="outlined-basic"
                  type="text"
                  label="Catatan"
                  variant="outlined"
                  size="medium"
                  sx={{ mb: '20px', width: '100%' }}
                  onChange={(e) => changeCreateOrderState('notes', e.target.value)}
                  disabled={!isUserAbleToEdit}
                  multiline
                  minRows={3}
                  maxRows={4}
                />
              )}
            
              <Box sx={{ marginBottom: '20px' }}>
                <Typography variant="body1">Status Stok</Typography>
                <Label variant="ghost" color={stockStatus === 'NORMAL' ? 'primary' : 'error'}>
                  {startCase(stockStatus)}
                </Label>
                <Typography variant="body2" sx={{ marginTop: '8px' }} color="error">
                  {' '}
                  Sesuai dengan kesedian stok!
                </Typography>
              </Box>
            
              <Box>
                {showComboboxStatus ? (
                  <InfiniteCombobox
                    label="Status"
                    autoFocus
                    onBlur={() => setShowComboboxStatus(!showComboboxStatus)}
                    useStaticOption
                    staticOptions={[
                      { id: 'progress', label: 'Progress' },
                      { id: 'pending', label: 'Pending' },
                      { id: 'complete', label: 'Complete' },
                      { id: 'canceled', label: 'Canceled' },
                    ]}
                    open
                    onChange={onChangeStatusHandler}
                  />
                ) : (
                  <>
                    <Typography variant="body1">Status</Typography>
                    <Label
                      variant="ghost"
                      color={getStatusColor(status)}
                      onClick={() => {
                        // eslint-disable-next-line no-unused-expressions
                        isUserAbleToEdit && setShowComboboxStatus(!showComboboxStatus);
                      }}
                      sx={{ cursor: isUserAbleToEdit ? 'pointer' : '' }}
                    >
                      {startCase(status)}
                    </Label>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </>
  );
};

const initialFormInput = {
  trxType: '',
  customerId: '',
  supplierId: '',
  picId: '',
  price: '',
  paymentStatus: '',
  receipts: [],
  shipmentType: '',
  shipmentNumber: '',
  shipmentPrice: '',
  stockStatus: '',
  // items: [],
};

export default DataOrder;

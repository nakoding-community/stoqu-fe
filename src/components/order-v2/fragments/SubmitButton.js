import { useLocation, useNavigate } from 'react-router';
import { Box, Button } from '@mui/material';
import { toast } from 'react-toastify';
import parseInt from 'lodash/parseInt';
import React from 'react';
import Iconify from '../../Iconify';
import { useCreateOrder } from '../../../hooks/useCreateOrderV2';
import { useUpsertOrder } from '../../../api/userOrder';

const SubmitButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isCreatePage = location.pathname.includes('new');

  const payloadBody = useCreateOrder((state) => state.payloadBody);
  const getTotalProductPrice = useCreateOrder((state) => state.getTotalProductPrice);

  const { mutate, isLoading } = useUpsertOrder();

  const getRestructuredItems = (items) => {
    const newItems = items?.map((item) => ({
      action: item?.action,
      id: item?.id,
      price: parseFloat(item?.price),
      productId: item?.productId,
      rackId: item?.rackId,
      status: item?.status,
      stockLookups: item?.stockLookups,
      total: parseInt(item?.total),
    }));

    return { items: newItems?.length > 0 ? newItems : [] };
  };

  const getRestructuredReceipts = (receipts) => {
    const newReceipts = receipts?.map((receipt) => ({
      action: receipt?.action,
      id: receipt?.id,
      receiptUrl: receipt?.receiptUrl,
    }));

    return { receipts: newReceipts?.length > 0 ? newReceipts : [] };
  };

  const getFinalPrice = (shipmentPrice) => {
    const totalProductPrice = getTotalProductPrice();

    const finalPrice = parseFloat(totalProductPrice) + parseFloat(shipmentPrice || 0);

    return { finalPrice };
  };

  const getStockStatus = (items) => {
    if (isCreatePage) {
      return { stockStatus: 'NORMAL' };
    }

    const abnormal = items?.filter((item) => {
      return item?.total !== item?.totalPacked;
    });

    return { stockStatus: abnormal?.length > 0 ? 'ABNORMAL' : 'NORMAL' };
  };

  const onClick = () => {
    const body = {
      ...payloadBody,
      shipmentPrice: parseFloat(payloadBody?.shipmentPrice),
      price: parseFloat(getTotalProductPrice()),
      ...getStockStatus(payloadBody?.items),
      ...getFinalPrice(payloadBody?.shipmentPrice),
      ...getRestructuredItems(payloadBody?.items),
      ...getRestructuredReceipts(payloadBody?.receipts),
    };

    mutate(body, {
      onSuccess: () => {
        navigate('/dashboard/order');
        toast.success(`Berhasil ${isCreatePage ? 'membuat' : 'mengubah'} pesanan`);
      },
    });
  };

  return (
    <Box sx={{ mt: '16px', display: 'flex', justifyContent: 'flex-end' }}>
      <Button variant="contained" startIcon={<Iconify icon="eva:edit-fill" />} onClick={onClick} disabled={isLoading}>
        Submit
      </Button>
    </Box>
  );
};

export default SubmitButton;

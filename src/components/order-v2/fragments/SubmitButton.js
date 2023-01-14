import { useNavigate } from 'react-router';
import { Box, Button } from '@mui/material';
import parseInt from 'lodash/parseInt';
import React from 'react';
import Iconify from '../../Iconify';
import { useCreateOrder } from '../../../hooks/useCreateOrderV2';
import { useUpsertOrder } from '../../../api/userOrder';

const SubmitButton = () => {
  const navigate = useNavigate();

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

  const onClick = () => {
    const body = {
      ...payloadBody,
      shipmentPrice: parseFloat(payloadBody?.shipmentPrice),
      stockStatus: 'NORMAL',
      price: parseFloat(getTotalProductPrice()),
      ...getFinalPrice(payloadBody?.shipmentPrice),
      ...getRestructuredItems(payloadBody?.items),
      ...getRestructuredReceipts(payloadBody?.receipts),
    };

    mutate(body, {
      onSuccess: () => {
        navigate('/dashboard/order');
      },
    });

    console.log('body', body);
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

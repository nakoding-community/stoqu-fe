import { useLocation, useNavigate, useParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { toast } from 'react-toastify';
import parseInt from 'lodash/parseInt';
import React, { useCallback, useEffect, useMemo } from 'react';
import Iconify from '../../Iconify';
import { useCreateOrder } from '../../../hooks/useCreateOrderV2';
import { useUpsertOrder } from '../../../api/userOrder';

const SubmitButton = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isCreatePage = location.pathname.includes('new');

  const queryClient = useQueryClient();

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
      stockLookups: item?.stockLookups?.map((lookup) => ({
        id: lookup?.id,
        action: lookup?.action || 'insert',
      })),
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

  const getFinalPrice = useCallback(
    (shipmentPrice) => {
      const totalProductPrice = getTotalProductPrice();

      const finalPrice = parseFloat(totalProductPrice) + parseFloat(shipmentPrice || 0);

      return { finalPrice };
    },
    [getTotalProductPrice]
  );

  const getStockStatus = useCallback(
    (items) => {
      if (isCreatePage) {
        return { stockStatus: 'NORMAL' };
      }

      const abnormal = items?.filter((item) => {
        return item?.total !== item?.totalPacked;
      });

      return { stockStatus: abnormal?.length > 0 ? 'ABNORMAL' : 'NORMAL' };
    },
    [isCreatePage]
  );

  const body = useMemo(
    () => ({
      ...payloadBody,
      shipmentPrice: parseFloat(payloadBody?.shipmentPrice),
      price: parseFloat(getTotalProductPrice()),
      ...getStockStatus(payloadBody?.items),
      ...getFinalPrice(payloadBody?.shipmentPrice),
      ...getRestructuredItems(payloadBody?.items),
      ...getRestructuredReceipts(payloadBody?.receipts),
    }),
    [getFinalPrice, getStockStatus, getTotalProductPrice, payloadBody]
  );

  const onClick = () => {
    mutate(body, {
      onSuccess: () => {
        navigate('/dashboard/order');
        toast.success(`Berhasil ${isCreatePage ? 'membuat' : 'mengubah'} pesanan`);
      },
    });
  };

  useEffect(() => {
    if (!isCreatePage) {
      const queryData = queryClient.getQueryData(['order-detail', id]);
      if (!queryData?.data?.isRead) {
        const withIsReadBody = {
          ...body,
          isRead: true,
        };

        mutate(withIsReadBody);
      }
    }
  }, [isCreatePage, id, queryClient, body, mutate]);

  return (
    <Box sx={{ mt: '16px', display: 'flex', justifyContent: 'flex-end' }}>
      <LoadingButton
        variant="contained"
        startIcon={<Iconify icon="eva:edit-fill" />}
        onClick={onClick}
        loading={isLoading}
      >
        Submit
      </LoadingButton>
    </Box>
  );
};

export default SubmitButton;

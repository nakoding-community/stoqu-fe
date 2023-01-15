import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Container } from '@mui/material';

import useSettings from '../hooks/useSettings';

import Page from '../components/Page';

import Header from '../components/order-v2/Header';
import DataOrder from '../components/order-v2/data-order/DataOrder';
import DataProduct from '../components/order-v2/data-product/DataProduct';
import { CreateOrderProvider } from '../hooks/useCreateOrderV2';
import SubmitButton from '../components/order-v2/fragments/SubmitButton';
import { useGetOrderById } from '../api/userOrder';

const OrderDetailPageV2 = () => {
  const { themeStretch } = useSettings();
  const location = useLocation();
  const isCreatePage = location.pathname.includes('new');

  return (
    <Page title={`${isCreatePage ? 'Tambah' : 'Ubah'} Pesanan`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Header />
        <DataOrder />
        <DataProduct />
        <SubmitButton />
      </Container>
    </Page>
  );
};

const OrderDetailWrapper = () => {
  const { id } = useParams();
  const location = useLocation();
  const isCreatePage = location.pathname.includes('new');

  const { data, isFetched } = useGetOrderById(id, {
    enabled: !isCreatePage,
  });

  const getRestructuredItems = (items) => {
    const newItems = items?.map((item) => ({
      action: 'update',
      id: item?.id,

      price: item?.price,
      productId: item?.productId,
      rackId: item?.rackId,
      status: item?.status,
      stockLookups: item?.orderTrxItemLookups?.map((lookup) => ({ ...lookup, action: 'update' })),
      total: item?.total,
      totalPacked: item?.totalPacked,

      product: item?.product,
      rack: item?.rack,
      uuid: uuidv4(),
    }));

    return newItems?.length > 0 ? newItems : [];
  };

  const getRestructuredReceipts = (receipts) => {
    const newReceipts = receipts?.map((receipt) => ({
      action: 'update',
      id: receipt?.id,
      receiptUrl: receipt?.receiptUrl,
      uuid: uuidv4(),
    }));

    return newReceipts?.length > 0 ? newReceipts : [];
  };

  const payloadBody = {
    customerId: data?.data?.customerId,
    finalPrice: data?.data?.finalPrice,
    id: data?.data?.id,
    isRead: data?.data?.isRead,
    items: getRestructuredItems(data?.data?.items),
    notes: data?.data?.notes,
    paymentStatus: data?.data?.paymentStatus,
    picId: data?.data?.picId,
    price: data?.data?.price,
    receipts: getRestructuredReceipts(data?.data?.receipts),
    shipmentNumber: data?.data?.shipmentNumber,
    shipmentPrice: data?.data?.shipmentPrice,
    shipmentType: data?.data?.shipmentType,
    status: data?.data?.status,
    stockStatus: data?.data?.stockStatus,
    supplierId: data?.data?.supplierId,
    trxType: data?.data?.trxType,
  };

  const labelText = {
    customerName: data?.data?.customerName,
    supplierName: data?.data?.supplierName,
    picName: data?.data?.picName,
  };

  return (
    <>
      {(isCreatePage ? true : isFetched) && (
        <CreateOrderProvider {...(!isCreatePage && { payloadBody, labelText })}>
          <OrderDetailPageV2 />
        </CreateOrderProvider>
      )}
    </>
  );
};

export default OrderDetailWrapper;

import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container, Button } from '@mui/material';

import { CreateOrderContextProvider } from '../contexts/CreateOrderContext';

import useSettings from '../hooks/useSettings';
import useCreateOrder from '../hooks/useCreateOrder';

import Page from '../components/Page';

import Iconify from '../components/Iconify';
import DataOrder from '../components/order/DataOrder';
import DataProduct from '../components/order/DataProduct';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';

export default function OrderDetailPage() {
  const { themeStretch } = useSettings();
  const location = useLocation();
  const isCreatePage = location.pathname.includes('new');

  return (
    <Page title={`${isCreatePage ? 'Tambah' : 'Ubah'} Pesanan`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CreateOrderContextProvider>
          <Header isCreatePage={isCreatePage} />
          <DataOrder />
          <DataProduct />
          {isCreatePage && <ButtonSubmit />}
        </CreateOrderContextProvider>
      </Container>
    </Page>
  );
}

const Header = ({ isCreatePage }) => {
  const { id } = useParams();

  const { detailOrderState, processOrderHandler, isUserAbleToEdit, isAbleToSubmit } = useCreateOrder();

  return (
    <HeaderBreadcrumbs
      useBadge={false}
      heading={`Data Pesanan ${detailOrderState?.code ? `#${detailOrderState?.code}` : ''}`}
      links={[]}
      action={
        !isCreatePage && (
          <Button
            color="warning"
            variant="contained"
            startIcon={<Iconify icon="eva:edit-fill" />}
            onClick={() => processOrderHandler(id)}
            disabled={!isUserAbleToEdit || !isAbleToSubmit}
          >
            Ubah
          </Button>
        )
      }
    />
  );
};

const ButtonSubmit = () => {
  const { processOrderHandler, isAbleToSubmit, createOrderState } = useCreateOrder();
  const { items } = createOrderState || [];

  return (
    <Button
      variant="contained"
      startIcon={<Iconify icon="eva:edit-fill" />}
      sx={{ marginTop: '20px' }}
      onClick={processOrderHandler}
      disabled={!isAbleToSubmit || items?.length === 0}
    >
      Submit
    </Button>
  );
};

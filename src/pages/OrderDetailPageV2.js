import React from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';

import { CreateOrderContextProvider } from '../contexts/CreateOrderContext';

import useSettings from '../hooks/useSettings';

import Page from '../components/Page';

import Header from '../components/order-v2/Header';
import DataOrder from '../components/order-v2/DataOrder';

const OrderDetailPageV2 = () => {
  const { themeStretch } = useSettings();
  const location = useLocation();
  const isCreatePage = location.pathname.includes('new');

  return (
    <Page title={`${isCreatePage ? 'Tambah' : 'Ubah'} Pesanan`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CreateOrderContextProvider>
          <Header isCreatePage={isCreatePage} />
          <DataOrder />
          {/* <DataProduct /> */}
          {/* {isCreatePage && <ButtonSubmit />} */}
        </CreateOrderContextProvider>
      </Container>
    </Page>
  );
};

export default OrderDetailPageV2;

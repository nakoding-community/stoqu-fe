import React from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { Box, Button, Container } from '@mui/material';

import { CreateOrderContextProvider } from '../contexts/CreateOrderContext';

import useSettings from '../hooks/useSettings';

import Page from '../components/Page';

import Header from '../components/order-v2/Header';
import DataOrder from '../components/order-v2/DataOrder';
import DataProduct from '../components/order-v2/DataProduct';
import Iconify from '../components/Iconify';
import { CreateOrderProvider, useCreateOrder } from '../hooks/useCreateOrderV2';

const OrderDetailPageV2 = () => {
  const { themeStretch } = useSettings();
  const location = useLocation();
  const isCreatePage = location.pathname.includes('new');

  // const payloadBody = useCreateOrder((state) => state.payloadBody);
  // console.log('payloadBody', payloadBody);

  return (
    <Page title={`${isCreatePage ? 'Tambah' : 'Ubah'} Pesanan`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CreateOrderContextProvider>
          <Header isCreatePage={isCreatePage} />
          <DataOrder />
          <DataProduct />
          {/* {isCreatePage && <ButtonSubmit />} */}
          <Box sx={{ mt: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:edit-fill" />}
              // sx={{ marginTop: '20px' }}
              // onClick={processOrderHandler}
              // disabled={!isAbleToSubmit || items?.length === 0}
            >
              Submit
            </Button>
          </Box>
        </CreateOrderContextProvider>
      </Container>
    </Page>
  );
};

const OrderDetailWrapper = () => {
  return (
    <CreateOrderProvider>
      <OrderDetailPageV2 />
    </CreateOrderProvider>
  );
};

export default OrderDetailWrapper;

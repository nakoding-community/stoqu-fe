import React from 'react';

import { Card, Stack } from '@mui/material';

import Scrollbar from '../../Scrollbar';

import Header from './fragments/Header';
import { Overall } from './fragments/Overall';
import TableComponent from './fragments/Table';

const DataProduct = () => {
  return (
    <>
      <Stack sx={{ marginTop: '30px' }}>
        <Header />
      </Stack>

      <Overall />

      <Card sx={{ marginTop: '0px' }}>
        <Scrollbar>
          <TableComponent />
        </Scrollbar>
      </Card>

      {/* <ModalCreateOrder open={showModal} onClose={closeModalHandler} />
      <ModalStockLookup
        type="product"
        open={showLookupStockModal}
        onClose={closeLookupStockModalHandler}
        detailLookupStockData={detailLookupStockData}
      /> */}
    </>
  );
};

export default DataProduct;

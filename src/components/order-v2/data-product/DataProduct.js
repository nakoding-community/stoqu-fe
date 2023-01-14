import React, { useState } from 'react';

import { Card, Stack } from '@mui/material';

import Scrollbar from '../../Scrollbar';

import Header from './fragments/Header';
import { Overall } from './fragments/Overall';
import TableComponent from './fragments/Table';
import { ModalCreateProduct } from '../fragments/ModalCreateProduct';

const DataProduct = () => {
  const [showModalCreateProduct, setShowModalCreateProduct] = useState(false);
  const [productDetail, setProductDetail] = useState(null);

  return (
    <>
      <Stack sx={{ marginTop: '30px' }}>
        <Header setShowModalCreateProduct={setShowModalCreateProduct} setProductDetail={setProductDetail} />
      </Stack>

      <Overall />

      <Card sx={{ marginTop: '0px' }}>
        <Scrollbar>
          <TableComponent setShowModalCreateProduct={setShowModalCreateProduct} setProductDetail={setProductDetail} />
        </Scrollbar>
      </Card>

      <ModalCreateProduct
        productDetail={productDetail}
        open={showModalCreateProduct}
        onClose={() => setShowModalCreateProduct(false)}
      />

      {/* 
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

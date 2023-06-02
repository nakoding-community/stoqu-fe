/* eslint-disable no-plusplus */
import React, { useState } from 'react';
import { useConfirm } from 'material-ui-confirm';

import { Stack, Alert, Box, DialogTitle } from '@mui/material';

import ModalV2 from '../ModaV2';
import DownloadProductCodePDF from '../../PDF/DownloadProductCodePDF';

const ModalSuccessCreateTransaction = ({
  open,
  onClose,
  createdTrxData,
  type = 'transaction',
  productData,
  quantity,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const confirm = useConfirm();

  const confrimHandler = () => {
    confirm({ title: 'Perhatian!', description: 'Mohon tunggu hingga proses pengambilan data selesai' });
  };

  return (
    <ModalV2 open={open} onClose={() => (isDownloading ? confrimHandler() : onClose())}>
      <Header
        createdTrxData={createdTrxData}
        setIsDownloading={setIsDownloading}
        onClose={onClose}
        productData={productData}
        quantity={quantity}
      />
      <Content createdTrxData={createdTrxData} quantity={quantity} type={type} />
    </ModalV2>
  );
};

const Header = ({ createdTrxData, setIsDownloading, onClose, productData, quantity }) => {
  const [valueStrings, setValueStrings] = useState([]);
  const [loading, setLoading] = useState(false);

  const { products } = createdTrxData || {};

  const downloadPDFData = async () => {
    setIsDownloading(true);
    setLoading(true);

    const codeProduct = products?.length > 0 && products[0].lookupCodes?.length > 0 && products[0].lookupCodes[0] || '';
    const tempValueStrings = [];
    for (let i = 0; i < quantity; i++) {
      tempValueStrings.push(codeProduct);
    }

    setValueStrings(tempValueStrings);
    setLoading(false);
  };

  return (
    <ModalV2.Header>
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Box>Kode Produk</Box>
          <DownloadProductCodePDF
            onClick={downloadPDFData}
            valueStrings={valueStrings}
            isLoading={loading}
            onClose={onClose}
            setIsDownloading={setIsDownloading}
          />
        </DialogTitle>
      </Box>
    </ModalV2.Header>
  );
};

const Content = ({ createdTrxData, quantity }) => {
  const { products } = createdTrxData || {};

  return (
    <ModalV2.Content>
      <Stack>
        <Stack spacing={3} sx={{ p: 3 }}>
          {products?.map((product, index) => (
            <React.Fragment key={index}>
              {product?.lookupCodes?.map((lookup, index) => (
                <Alert key={index}>{lookup} (Total: {quantity})</Alert>
              ))}
            </React.Fragment>
          ))}
        </Stack>
      </Stack>
    </ModalV2.Content>
  );
};

export default ModalSuccessCreateTransaction;

import React, { useState } from 'react';
import { useConfirm } from 'material-ui-confirm';

import { Stack, Typography, Alert, Box, DialogTitle } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import ModalV2 from '../ModaV2';
import DownloadProductCodePDF from '../../PDF/DownloadProductCodePDF';

const ModalSuccessCreateTransaction = ({ open, onClose, createdTrxData, type = 'transaction' }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const confirm = useConfirm();

  const confrimHandler = (e) => {
    confirm({ title: 'Perhatian!', description: 'Mohon tunggu hingga proses pengambilan data selesai' });
  };

  return (
    <ModalV2 open={open} onClose={() => (isDownloading ? confrimHandler() : onClose())}>
      <Header createdTrxData={createdTrxData} setIsDownloading={setIsDownloading} onClose={onClose} />
      <Content createdTrxData={createdTrxData} type={type} />
    </ModalV2>
  );
};

const Header = ({ createdTrxData, setIsDownloading, onClose }) => {
  const [valueStrings, setValueStrings] = useState([]);
  const [loading, setLoading] = useState(false);

  const { products } = createdTrxData || {};

  const downloadPDFData = async () => {
    setIsDownloading(true);
    setLoading(true);
    const codeProducts = products?.map((product) => {
      return product?.lookups?.map((lookup) => {
        return lookup?.code;
      });
    });

    setValueStrings(codeProducts[0]);
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

const Content = ({ createdTrxData, type }) => {
  const theme = useTheme();

  const { products } = createdTrxData || {};

  return (
    <ModalV2.Content>
      <Stack>
        <Stack spacing={3} sx={{ p: 3 }}>
          {products?.map((product, index) => (
            <React.Fragment key={index}>
              {type === 'transaction' && (
                <Typography
                  variant="body1"
                  sx={{
                    marginRight: '8px',
                    borderLeft: `5px solid ${theme.palette.success.main}`,
                    borderRadius: '4px',
                    paddingLeft: '16px',
                  }}
                >
                  {`${index + 1}. ${product?.product?.name || product?.item?.stockTrxId}`}
                </Typography>
              )}
              {product?.lookups?.map((lookup, index) => (
                <Alert key={index}>{`${index + 1}. ${lookup?.code}`}</Alert>
              ))}
            </React.Fragment>
          ))}
        </Stack>
      </Stack>
    </ModalV2.Content>
  );
};

export default ModalSuccessCreateTransaction;

import { useState } from 'react';
// @mui
import { Button, Container, Stack } from '@mui/material';

// hooks
import useSettings from '../hooks/useSettings';

// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import StockList from '../components/stock/StockList';
import StockHistory from '../components/stock/StockHistory';

export default function StockApp() {
  const { themeStretch } = useSettings();
  const [showConversionStockModal, setShowConversionStockModal] = useState(false);
  const [showTransactionStockModal, setShowTransactionStockModal] = useState(false);

  const [totalStock, setTotalStock] = useState(0);

  const showConversionStockModalHandler = () => {
    setShowConversionStockModal(true);
  };
  const closeConversionStockModalHandler = () => {
    setShowConversionStockModal(false);
  };

  const showTransactionStockModalHandler = () => {
    setShowTransactionStockModal(true);
  };
  const closeTransactionStockModalHandler = () => {
    setShowTransactionStockModal(false);
  };

  return (
    <Page title="Stok">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Stok"
          useBadge
          action={
            <>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={showTransactionStockModalHandler}
                sx={{ marginRight: '20px' }}
              >
                Transaksi
              </Button>
              <Button
                color="warning"
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={showConversionStockModalHandler}
                sx={{ marginRight: '20px' }}
              >
                Konversi
              </Button>
              <Button
                color="info"
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                // onClick={showConversionStockModalHandler}
              >
                Movement
              </Button>
            </>
          }
          badgeCount={totalStock}
        />
        <StockList
          showConversionStockModal={showConversionStockModal}
          showConversionStockModalHandler={showConversionStockModalHandler}
          closeConversionStockModalHandler={closeConversionStockModalHandler}
          showTransactionStockModal={showTransactionStockModal}
          closeTransactionStockModalHandler={closeTransactionStockModalHandler}
          setTotalStock={setTotalStock}
        />

        <Stack sx={{ marginTop: '30px' }} />

        <StockHistory />
      </Container>
    </Page>
  );
}

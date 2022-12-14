import { useEffect, useState } from 'react';
import { Container, Grid, Typography } from '@mui/material';

import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import DashboardOrderSummary from '../components/dashboard/DashboardOrderSummary';
import DashboardRecentOrders from '../components/dashboard/DashboardRecentOrders';
import DashboardOrderPerDays from '../components/dashboard/DashboardOrderPerDays';
import useDashboardCount from '../hooks/useDashboardCount';

export default function GeneralApp() {
  const { themeStretch } = useSettings();

  const { totalBrand, totalType, totalStock, totalProduct } = useDashboardCount();

  return (
    <Page title="Dasbor">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" gutterBottom sx={{ marginBottom: '18px' }}>
          Dasbor
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <DashboardOrderSummary title="Total Brand" total={totalBrand} icon={'ant-design:crown-filled'} />
          </Grid>

          <Grid item xs={12} md={3}>
            <DashboardOrderSummary
              title="Total Tipe"
              total={totalType}
              color="info"
              icon={'mdi:format-list-bulleted'}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <DashboardOrderSummary title="Total Produk" total={totalProduct} color="warning" icon={'mdi:shopping'} />
          </Grid>

          <Grid item xs={12} md={3}>
            <DashboardOrderSummary title="Total Stok" total={totalStock} color="error" icon={'mdi:basket'} />
          </Grid>

          <Grid item xs={12} lg={7}>
            <DashboardRecentOrders />
          </Grid>

          <Grid item xs={12} lg={5}>
            <DashboardOrderPerDays />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

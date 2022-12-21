import { Container, Grid, Typography } from '@mui/material';

import useSettings from '../hooks/useSettings';

import Page from '../components/Page';
import DashboardOrderSummary from '../components/dashboard/DashboardOrderSummary';
import DashboardRecentOrders from '../components/dashboard/DashboardRecentOrders';
import DashboardOrderPerDays from '../components/dashboard/DashboardOrderPerDays';
import { useGetDashboardCount } from '../hooks/api/useDashboard';

export default function GeneralApp() {
  const { themeStretch } = useSettings();

  // ** Fetch data on mount
  const { data } = useGetDashboardCount();

  const { totalBrand, totalPacket, totalStock, totalProduct } = data?.data || {};

  return (
    <Page title="Dasbor">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" gutterBottom sx={{ marginBottom: '18px' }}>
          Dasbor
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <DashboardOrderSummary title="Total Brand" total={totalBrand || 0} icon={'ant-design:crown-filled'} />
          </Grid>

          <Grid item xs={12} md={3}>
            <DashboardOrderSummary
              title="Total Paket"
              total={totalPacket || 0}
              color="info"
              icon={'mdi:format-list-bulleted'}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <DashboardOrderSummary
              title="Total Produk"
              total={totalProduct || 0}
              color="warning"
              icon={'mdi:shopping'}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <DashboardOrderSummary title="Total Stok" total={totalStock || 0} color="error" icon={'mdi:basket'} />
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

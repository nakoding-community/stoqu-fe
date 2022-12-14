import parseInt from 'lodash/parseInt';
import { useEffect, useState } from 'react';
// @mui
import { Card, Button, Container, Stack, TextField, Tabs, Tab, Divider, Grid, Typography } from '@mui/material';

import { toast } from 'react-toastify';
import useSettings from '../hooks/useSettings';
import useTabs from '../hooks/useTabs';

// components
import Page from '../components/Page';

import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { getCurrencies, editCurrencies } from '../client/currenciesClient';

export default function SettingsDollarConversionPage() {
  const { themeStretch } = useSettings();
  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs('auto');

  const [currencyData, setCurrencyData] = useState(null);
  const [valueIdr, setValueIdr] = useState('');

  const editCurrenciesHandler = async () => {
    const body = {
      isAuto: filterStatus === 'auto',
      valueIdr: filterStatus === 'auto' ? 0 : parseInt(valueIdr),
    };

    const { isSuccess } = await editCurrencies(currencyData?.id, body);
    if (isSuccess) {
      toast.success('Berhasil mengubah data');
      getCurrenciesHandler();
    }
  };

  const getCurrenciesHandler = async () => {
    const { data, meta } = await getCurrencies();
    if (data) {
      setCurrencyData(data);
    }
  };

  const TABS = [
    { value: 'auto', label: 'Auto', color: 'info' },
    { value: 'manual', label: 'Manual', color: 'success' },
  ];

  useEffect(() => {
    getCurrenciesHandler();
  }, []);

  useEffect(() => {
    setValueIdr(currencyData?.valueIdr);
  }, [currencyData?.valueIdr]);

  return (
    <Page title="Konversi Dollar">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs heading="Konversi Dollar" />

        <Grid container>
          <Grid item xs={12} md={8}>
            <Card>
              <Tabs
                allowScrollButtonsMobile
                variant="scrollable"
                scrollButtons="auto"
                value={filterStatus}
                onChange={onFilterStatus}
                sx={{ px: 2, bgcolor: 'background.neutral' }}
              >
                {TABS.map((tab) => (
                  <Tab
                    disableRipple
                    key={tab.value}
                    value={tab.value}
                    label={
                      <Stack spacing={1} direction="row" alignItems="center">
                        <div>{tab.label}</div>
                      </Stack>
                    }
                  />
                ))}
              </Tabs>
              <Divider />
              <Stack sx={{ py: 2.5, px: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography sx={{ marginRight: '8px' }}>1$ USD = Rp</Typography>
                  <TextField
                    disabled={filterStatus === 'auto'}
                    value={valueIdr}
                    onChange={(e) => setValueIdr(e.target.value)}
                    placeholder="Price"
                    sx={{ width: '85%' }}
                  />
                </Stack>
                <Button variant="contained" sx={{ marginTop: '20px' }} onClick={editCurrenciesHandler}>
                  Save
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

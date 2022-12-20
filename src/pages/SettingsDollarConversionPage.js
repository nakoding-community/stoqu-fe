import parseInt from 'lodash/parseInt';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
// @mui
import { Card, Button, Container, Stack, TextField, Tabs, Tab, Divider, Grid, Typography } from '@mui/material';

import { toast } from 'react-toastify';
import useSettings from '../hooks/useSettings';
import useTabs from '../hooks/useTabs';

// components
import Page from '../components/Page';

import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { useEditCurrency, useGetCurrencies } from '../hooks/api/useCurrency';

export default function SettingsDollarConversionPage() {
  const { themeStretch } = useSettings();
  const queryClient = useQueryClient();
  const { currentTab: filterStatus, onChangeTab: onFilterStatus, setCurrentTab } = useTabs('auto');

  const [currencyData, setCurrencyData] = useState(null);
  console.log('currencyData', currencyData);
  const [valueIdr, setValueIdr] = useState('');

  const { mutate: editCurrency } = useEditCurrency(currencyData?.id);

  const editCurrenciesHandler = async () => {
    const body = {
      id: currencyData?.id,
      isAuto: filterStatus === 'auto',
      name: currencyData?.name,
      value: filterStatus === 'auto' ? 0 : parseInt(valueIdr),
    };

    editCurrency(body, {
      onSuccess: () => {
        toast.success('Berhasil mengubah data');

        queryClient.invalidateQueries(['currencies', 'list']);
      },
    });
  };

  const TABS = [
    { value: 'auto', label: 'Auto', color: 'info' },
    { value: 'manual', label: 'Manual', color: 'success' },
  ];

  useEffect(() => {
    setValueIdr(currencyData?.value);
  }, [currencyData?.value]);

  useGetCurrencies({
    onSuccess: (data) => {
      if (data?.data) {
        setCurrencyData(data?.data?.[0]);
        setCurrentTab(data?.data?.[0]?.isAuto ? 'auto' : 'manual');
      }
    },
  });

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

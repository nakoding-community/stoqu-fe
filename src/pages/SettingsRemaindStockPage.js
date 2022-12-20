import parseInt from 'lodash/parseInt';
import { useState } from 'react';
import { Card, Button, Container, Stack, TextField, Tabs, Tab, Divider, Grid } from '@mui/material';

import { toast } from 'react-toastify';
import useSettings from '../hooks/useSettings';
import useTabs from '../hooks/useTabs';

import Page from '../components/Page';

import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';

import { useEditReminderStock, useGetReminderStocks } from '../hooks/api/useReminderStock';

export default function SettingsRemaindStockPage() {
  const { themeStretch } = useSettings();
  const { currentTab, onChangeTab } = useTabs('daily');

  const [minStock, setMinStock] = useState('');
  const [id, setId] = useState(null);

  const { mutate: editReminderStock } = useEditReminderStock(id);

  const TABS = [
    { value: 'daily', label: 'Harian' },
    // { value: 'monthly', label: 'Bulanan' },
  ];

  const editReminderStockHandler = async () => {
    const body = { name: currentTab, minStock: parseInt(minStock), id };
    editReminderStock(body, {
      onSuccess: () => {
        toast.success('Berhasil mengubah data');
      },
    });
  };

  useGetReminderStocks({
    onSuccess: (data) => {
      const filteredData = data?.data?.find((d) => d?.name === 'daily');
      setId(filteredData?.id);
      setMinStock(filteredData?.minStock);
      onChangeTab(null, filteredData?.name);
    },
  });

  return (
    <Page title="Pengingat Stok">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs heading="Pengingat Stock" links={[]} useBadge={false} />

        <Grid container>
          <Grid item xs={12} md={8}>
            <Card>
              <Tabs
                allowScrollButtonsMobile
                variant="scrollable"
                scrollButtons="auto"
                value={currentTab}
                onChange={onChangeTab}
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
                <TextField
                  value={minStock}
                  onChange={(e) => setMinStock(e.target.value)}
                  placeholder="Stock"
                  sx={{ width: '100%' }}
                />
                <Button variant="contained" onClick={editReminderStockHandler} sx={{ marginTop: '20px' }}>
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

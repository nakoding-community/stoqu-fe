import parseInt from 'lodash/parseInt';
import { useEffect, useState } from 'react';
import { Card, Button, Container, Stack, TextField, Tabs, Tab, Divider, Grid } from '@mui/material';

import { toast } from 'react-toastify';
import useSettings from '../hooks/useSettings';
import useTabs from '../hooks/useTabs';

import Page from '../components/Page';

import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';

import { getReminderStock, editReminderStock } from '../client/reminderClient';

export default function SettingsRemaindStockPage() {
  const { themeStretch } = useSettings();
  const { currentTab, onChangeTab } = useTabs('daily');

  const [minStock, setMinStock] = useState('');

  const TABS = [
    { value: 'daily', label: 'Harian' },
    { value: 'monthly', label: 'Bulanan' },
  ];

  const getReminderStockHandler = async () => {
    const { data } = await getReminderStock();
    if (data) {
      setMinStock(data?.minStock);
      onChangeTab(null, data?.reminderType);
    }
  };

  const editReminderStockHandler = async () => {
    const { isSuccess } = await editReminderStock({ reminderType: currentTab, minStock: parseInt(minStock) });
    if (isSuccess) {
      toast.success('Berhasil mengubah data');
    }
  };

  useEffect(() => {
    getReminderStockHandler();
  }, []);

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

import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Card, Stack, Grid, Typography, Divider, CircularProgress } from '@mui/material';
import Iconify from '../../../Iconify';
import { useCreateOrder } from '../../../../hooks/useCreateOrderV2';
import { convertToRupiah } from '../../../../utils/helperUtils';

export const Overall = () => {
  const theme = useTheme();

  const { getTotalProductAmount, getTotalProductPrice } = useCreateOrder((state) => ({
    getTotalProductAmount: state.getTotalProductAmount,
    getTotalProductPrice: state.getTotalProductPrice,
  }));

  const totalProductAmount = getTotalProductAmount();
  const totalProductPrice = getTotalProductPrice();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Card sx={{ mb: 5 }}>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
            sx={{ py: 2 }}
          >
            <Stack direction="row" alignItems="center" justifyContent="center" sx={{ width: 1, minWidth: 200 }}>
              <Stack alignItems="center" justifyContent="center" sx={{ position: 'relative' }}>
                <Iconify
                  icon={'ic:round-receipt'}
                  sx={{ color: theme.palette.info.main, width: 24, height: 24, position: 'absolute' }}
                />

                <CircularProgress
                  variant="determinate"
                  value={10}
                  size={56}
                  thickness={4}
                  sx={{ color: theme.palette.info.main, opacity: 0.48 }}
                />

                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={56}
                  thickness={4}
                  sx={{ color: 'grey.50016', position: 'absolute', top: 0, left: 0, opacity: 0.48 }}
                />
              </Stack>

              <Stack spacing={0.5} sx={{ ml: 2 }}>
                <Typography variant="h6">Total Produk</Typography>

                <Typography variant="subtitle2">
                  {totalProductAmount}{' '}
                  <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
                    Produk
                  </Box>
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card sx={{ mb: 5 }}>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
            sx={{ py: 2 }}
          >
            <Stack direction="row" alignItems="center" justifyContent="center" sx={{ width: 1, minWidth: 200 }}>
              <Stack alignItems="center" justifyContent="center" sx={{ position: 'relative' }}>
                <Iconify
                  icon={'mdi:currency-usd'}
                  sx={{ color: theme.palette.success.main, width: 24, height: 24, position: 'absolute' }}
                />

                <CircularProgress
                  variant="determinate"
                  value={10}
                  size={56}
                  thickness={4}
                  sx={{ color: theme.palette.success.main, opacity: 0.48 }}
                />

                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={56}
                  thickness={4}
                  sx={{ color: 'grey.50016', position: 'absolute', top: 0, left: 0, opacity: 0.48 }}
                />
              </Stack>

              <Stack spacing={0.5} sx={{ ml: 2 }}>
                <Typography variant="h6">Total Harga</Typography>

                <Typography variant="subtitle2">{convertToRupiah(totalProductPrice)}</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
};

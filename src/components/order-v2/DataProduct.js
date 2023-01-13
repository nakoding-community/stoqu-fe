import startCase from 'lodash/startCase';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useConfirm } from 'material-ui-confirm';
// @mui
import {
  Box,
  Card,
  Table,
  Button,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
  TableHead,
  Stack,
  IconButton,
  Grid,
  Typography,
  Divider,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import Iconify from '../Iconify';
import Scrollbar from '../Scrollbar';
import HeaderBreadcrumbs from '../HeaderBreadcrumbs';
import Label from '../Label';

// import { ModalCreateOrder } from './ModalCreateOrder';
import { convertToRupiah } from '../../utils/helperUtils';
// import ModalStockLookup from '../modal/stock/ModaStockLookup';

const DataProduct = () => {
  const confirm = useConfirm();
  const theme = useTheme();

  return (
    <>
      <Stack sx={{ marginTop: '30px' }}>
        <HeaderBreadcrumbs
          useBadge={false}
          heading={`Data Produk`}
          links={[]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:edit-fill" />}
              // onClick={showModalHandler}
              // disabled={!isUserAbleToEdit}
            >
              Tambah
            </Button>
          }
        />
      </Stack>

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
                    {/* {totalProductAmount}{' '} */}
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

                  <Typography variant="subtitle2">{/* {convertToRupiah(totalProductPrice)} */}</Typography>
                </Stack>
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ marginTop: '0px' }}>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 720, pt: '12px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Varian</TableCell>
                  <TableCell>Paket</TableCell>
                  <TableCell>Jumlah</TableCell>
                  <TableCell>Jumlah Diproses</TableCell>
                  <TableCell>Total Harga</TableCell>
                  <TableCell>Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[]?.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row?.brand}</TableCell>
                    <TableCell>{row?.variant}</TableCell>
                    <TableCell>
                      <Label variant="ghost" color={row?.stock === 'available' ? 'success' : 'error'}>
                        {startCase(row?.stock)}
                      </Label>
                    </TableCell>
                    <TableCell>{row?.type}</TableCell>
                    <TableCell>{row?.quantity}</TableCell>
                    <TableCell>{convertToRupiah(row?.price)}</TableCell>
                    <TableCell>
                      <Tooltip title="Hapus Produk">
                        <IconButton
                          size="small"
                          color="error"
                          // onClick={() => onDeleteProductHandler(index, row?.id)}
                          // disabled={!isUserAbleToEdit}
                        >
                          <Iconify icon="eva:trash-2-outline" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Lihat Lookup">
                        <IconButton
                          size="small"
                          color="success"
                          // onClick={() => showLookupStockModalHandler(row)}
                          // disabled={!isUserAbleToEdit}
                        >
                          <Iconify icon="eva:search-outline" />
                        </IconButton>
                      </Tooltip>
                      {row?.isOrderSync && (
                        <Tooltip title="Sync Pesanan">
                          <IconButton
                            size="small"
                            color="info"
                            // onClick={() => onClickSyncOrderHandler(row)}
                            // disabled={!isUserAbleToEdit}
                          >
                            <Iconify icon="eva:refresh-outline" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Tambah Lookup">
                        <IconButton
                          size="small"
                          color="warning"
                          // onClick={() => showLookupStockModalHandler(row)}
                          // disabled={!isUserAbleToEdit}
                        >
                          <Iconify icon="eva:plus-fill" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>

      {/* <ModalCreateOrder open={showModal} onClose={closeModalHandler} />
      <ModalStockLookup
        type="product"
        open={showLookupStockModal}
        onClose={closeLookupStockModalHandler}
        detailLookupStockData={detailLookupStockData}
      /> */}
    </>
  );
};

export default DataProduct;

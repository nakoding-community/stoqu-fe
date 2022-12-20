import moment from 'moment';
import startCase from 'lodash/startCase';
import { useState } from 'react';
import DatePicker from '@mui/lab/DatePicker';
import { useTheme } from '@mui/material/styles';

// @mui
import {
  Box,
  Card,
  Table,
  Button,
  TableBody,
  Container,
  TableContainer,
  TablePagination,
  TableRow,
  TableCell,
  TableHead,
  Stack,
  TextField,
  Divider,
  CircularProgress,
  Typography,
  Grid,
  TableSortLabel,
} from '@mui/material';
import axios from 'axios';
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import Scrollbar from '../components/Scrollbar';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import Label from '../components/Label';
import ConditionalWrapper from '../components/ConditionalWrapper';

import { HOST_API } from '../config';
import { convertToRupiah, getStatusColor } from '../utils/helperUtils';
import InfiniteCombobox from '../components/combobox/InfiniteCombobox';
import { useGetReportOrders } from '../hooks/api/useReport';

function isValidDate(d) {
  return d instanceof Date && !Number.isNaN(d);
}

export default function ReportPage() {
  const theme = useTheme();

  const { themeStretch } = useSettings();

  const [orderBy, setOrderBy] = useState('created_at');
  const [order, setOrder] = useState('desc');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowPerPage] = useState(5);

  const [dateFilter, setDateFilter] = useState([moment().subtract(7, 'd'), moment()]);

  const [filterStatus, setFilterStatus] = useState('');

  const downloadXLSFile = async () => {
    const token = localStorage.getItem('accessToken');

    const config = {
      url: `${HOST_API}reports/orders/excel`,
      headers: {
        'Content-Type': 'blob',
        Authorization: token !== null ? `Bearer ${token}` : ``,
      },
      responseType: 'arraybuffer',
      params: {
        start_date: moment(dateFilter[0]).format('YYYY-MM-DD'),
        end_date: moment(dateFilter[1]).format('YYYY-MM-DD'),
      },
    };

    try {
      const response = await axios(config);
      const outputFilename = `${
        // eslint-disable-next-line no-nested-ternary
        isValidDate(dateFilter[0])
          ? moment(dateFilter[0]).format('MMMM Do YYYY')
          : // eslint-disable-next-line prefer-template
          moment().subtract(7, 'd').format('MMMM Do YYYY') + ' - ' + isValidDate(dateFilter[1])
          ? moment(dateFilter[1]).format('MMMM Do YYYY')
          : moment().format('MMMM Do YYYY')
      }.xlsx`;

      // If you want to download file automatically using link attribute.

      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', outputFilename);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      throw Error(error);
    }
  };

  const onChangeDateHandler = (newValue, index) => {
    const newDateFilter = [...dateFilter];
    newDateFilter[index] = newValue;
    setDateFilter(newDateFilter);
    setPage(0);
  };

  const rowsPerPageChangeHandler = (e) => {
    setRowPerPage(e.target.value);
  };

  const pageChangeHandler = (e, newValue) => {
    setPage(newValue);
  };

  const onSortHandler = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const appendSortQuery = () => {
    return {
      [order === 'asc' ? 'ascField' : 'dscField']: orderBy,
    };
  };

  const appeendFilterDateQuery = (key) => {
    return {
      [key]: moment(key === 'startDate' ? dateFilter[0] : dateFilter[1]).format('YYYY-MM-DD'),
    };
  };

  // ** Params to get report orders
  const params = {
    page: page + 1,
    pageSize: rowsPerPage,
    filterStatus,
    ...(order && appendSortQuery()),
    ...(dateFilter?.length === 2 && dateFilter[0] && appeendFilterDateQuery('startDate')),
    ...(dateFilter?.length === 2 && dateFilter[1] && appeendFilterDateQuery('endDate')),
  };

  // ** Get report orders data
  const { data } = useGetReportOrders(params);
  const { orders, totalIncome, totalOrder } = data?.data || {};
  const { meta } = data || {};

  return (
    <Page title="Laporan">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs heading="Laporan" useBadge badgeCount={meta?.info?.count} />

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
                    <Typography variant="h6">Total Pesanan</Typography>

                    <Typography variant="subtitle2">
                      {totalOrder}{' '}
                      <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
                        orders
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
                    <Typography variant="h6">Total Pemasukan</Typography>

                    <Typography variant="subtitle2">{convertToRupiah(totalIncome)}</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <Stack direction="row" alignItems="center" sx={{ py: 2.5, px: 3 }}>
            <DatePicker
              label="Tanggal Mulai"
              value={dateFilter[0]}
              onChange={(newValue) => onChangeDateHandler(newValue, 0)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  sx={{
                    maxWidth: { md: 300 },
                    marginRight: '20px',
                  }}
                />
              )}
            />
            <DatePicker
              label="Tanggal Selesai"
              value={dateFilter[1]}
              onChange={(newValue) => onChangeDateHandler(newValue, 1)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  sx={{
                    maxWidth: { md: 300 },
                    marginRight: '20px',
                  }}
                />
              )}
            />
            <InfiniteCombobox
              label="Status"
              useStaticOption
              staticOptions={[
                { id: 'progress', label: 'Progress' },
                { id: 'pending', label: 'Pending' },
                { id: 'complete', label: 'Complete' },
                { id: 'canceled', label: 'Canceled' },
              ]}
              onChange={(e) => setFilterStatus(e?.id)}
              sx={{ width: '100%', marginRight: '20px' }}
            />
            <Stack width="100%" direction="row" alignItems="center" justifyContent="space-between">
              <Button variant="contained" startIcon={<Iconify icon="mdi:file-document" />} onClick={downloadXLSFile}>
                Export
              </Button>
            </Stack>
          </Stack>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 720 }}>
              <Table>
                <TableHeadComponent orderBy={orderBy} order={order} onSortHandler={onSortHandler} />
                <TableBody>
                  {orders?.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                      <TableCell>{moment(row.date).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                      <TableCell>{row.customerName}</TableCell>
                      <TableCell>{row.customerPhone}</TableCell>
                      <TableCell>
                        <Label variant={'ghost'} color={'success'}>
                          {convertToRupiah(row.price)}
                        </Label>
                      </TableCell>
                      <TableCell>
                        {row?.status && (
                          <Label variant={'ghost'} color={getStatusColor(row?.status)}>
                            {startCase(row?.status)}
                          </Label>
                        )}
                      </TableCell>
                      <TableCell>{row.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={meta?.info?.count || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={pageChangeHandler}
              onRowsPerPageChange={rowsPerPageChangeHandler}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

const TableHeadComponent = ({ orderBy, order, onSortHandler }) => {
  const onClickSortHandler = (property) => {
    onSortHandler(property);
  };

  const headCells = [
    {
      id: 'no',
      label: 'No',
      withSort: false,
    },
    {
      id: 'date',
      label: 'Tanggal',
      withSort: true,
    },
    {
      id: 'customer_name',
      label: 'Customer',
      withSort: true,
    },
    {
      id: 'phone_number',
      label: 'No. Handphone',
      withSort: true,
    },
    {
      id: 'price',
      label: 'Harga',
      withSort: true,
    },
    {
      id: 'status',
      label: 'Status',
      withSort: true,
    },
    {
      id: 'notes',
      label: 'Keterangan',
      withSort: true,
    },
  ];

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id}>
            <ConditionalWrapper
              condition={headCell.withSort}
              wrapper={(children) => (
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={() => onClickSortHandler(headCell.id)}
                >
                  {children}
                </TableSortLabel>
              )}
            >
              {headCell.label}
            </ConditionalWrapper>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

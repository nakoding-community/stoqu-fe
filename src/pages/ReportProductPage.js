import moment from 'moment';
import { useState, useEffect } from 'react';
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
import { useDebounce } from 'use-debounce';
import axios from 'axios';
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import Scrollbar from '../components/Scrollbar';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import ConditionalWrapper from '../components/ConditionalWrapper';

import { getOrdersReportSummary } from '../client/ordersClient';
import { HOST_API } from '../config';
import InfiniteCombobox from '../components/combobox/InfiniteCombobox';

function isValidDate(d) {
  return d instanceof Date && !Number.isNaN(d);
}

const RowBrandTemplate = ({ row, index, page, rowsPerPage }) => {
  return (
    <TableRow>
      <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
      <TableCell>{row?.brandName}</TableCell>
      <TableCell>{row?.typeName}</TableCell>
      <TableCell>{row?.count}</TableCell>
    </TableRow>
  );
};

const RowVariantTemplate = ({ row, index, page, rowsPerPage }) => {
  return (
    <TableRow>
      <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
      <TableCell>{row?.brandName}</TableCell>
      <TableCell>{row?.typeName}</TableCell>
      <TableCell>{row?.variantName}</TableCell>
      <TableCell>{row?.count}</TableCell>
    </TableRow>
  );
};

const RowTypeTemplate = ({ row, index, page, rowsPerPage }) => {
  return (
    <TableRow>
      <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
      <TableCell>{row?.typeName}</TableCell>
      <TableCell>{row?.count}</TableCell>
    </TableRow>
  );
};

export default function ReportPage() {
  const theme = useTheme();

  const { themeStretch } = useSettings();

  const [orderBy, setOrderBy] = useState('created_at');
  const [order, setOrder] = useState('desc');

  const [search, setSearch] = useState('');
  const [searchDebounce] = useDebounce(search, 300);

  const [listReport, setListReport] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowPerPage] = useState(5);

  const [dateFilter, setDateFilter] = useState([moment().subtract(7, 'd'), moment()]);

  const [filterType, setFilterType] = useState('brand');

  const rowTemplate = {
    brand: RowBrandTemplate,
    variant: RowVariantTemplate,
    type: RowTypeTemplate,
  };

  const downloadXLSFile = async () => {
    const token = localStorage.getItem('accessToken');

    const config = {
      url: `${HOST_API}/reports/summary-excel`,
      headers: {
        'Content-Type': 'blob',
        Authorization: token !== null ? `Bearer ${token}` : ``,
      },
      responseType: 'arraybuffer',
      params: {
        start_date: moment(dateFilter[0]).format('YYYY-MM-DD'),
        end_date: moment(dateFilter[1]).format('YYYY-MM-DD'),
        category: filterType,
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

  const getOrdersReportSummaryHandler = async () => {
    const query = {
      page: page + 1,
      pageSize: rowsPerPage,
      category: filterType,
      search,
      ...(order && appendSortQuery()),
      ...(dateFilter?.length === 2 && dateFilter[0] && appeendFilterDateQuery('startDate')),
      ...(dateFilter?.length === 2 && dateFilter[1] && appeendFilterDateQuery('endDate')),
    };

    const { data, meta } = await getOrdersReportSummary(query);

    setListReport(data || []);
    setPaginationMeta(meta?.info);
  };

  useEffect(() => {
    getOrdersReportSummaryHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage, page, searchDebounce, order, dateFilter, filterType]);

  return (
    <Page title="Laporan Produk">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs heading="Laporan Produk" useBadge badgeCount={paginationMeta?.count} />

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
                    <Typography variant="h6">Total Jumlah</Typography>

                    <Typography variant="subtitle2">
                      {paginationMeta?.count}{' '}
                      <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
                        {filterType}
                      </Box>
                    </Typography>
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
              value={filterType}
              label="Tipe"
              useStaticOption
              staticOptions={[
                { id: 'brand', label: 'Brand' },
                { id: 'variant', label: 'Variant' },
                { id: 'type', label: 'Tipe' },
              ]}
              onChange={(e) => setFilterType(e?.id)}
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
                <TableHeadComponent orderBy={orderBy} order={order} onSortHandler={onSortHandler} type={filterType} />
                <TableBody>
                  {listReport?.map((row, index) => {
                    const TableRowComponent = rowTemplate[filterType];
                    return (
                      <TableRowComponent key={index} row={row} index={index} page={page} rowsPerPage={rowsPerPage} />
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={paginationMeta?.count || 0}
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

const TableHeadComponent = ({ orderBy, order, onSortHandler, type }) => {
  const onClickSortHandler = (property) => {
    onSortHandler(property);
  };

  const headCellV2 = {
    brand: [
      {
        id: 'no',
        label: 'No',
        withSort: false,
      },
      {
        id: 'brand_name',
        label: 'Nama Brand',
        withSort: false,
      },
      {
        id: 'type_name',
        label: 'Tipe',
        withSort: false,
      },
      {
        id: 'count',
        label: 'Jumlah',
        withSort: false,
      },
    ],
    variant: [
      {
        id: 'no',
        label: 'No',
        withSort: false,
      },
      {
        id: 'brand_name',
        label: 'Nama Brand',
        withSort: false,
      },
      {
        id: 'type_name',
        label: 'Tipe',
        withSort: false,
      },
      {
        id: 'variant_name',
        label: 'Nama Varian',
        withSort: false,
      },
      {
        id: 'count',
        label: 'Jumlah',
        withSort: false,
      },
    ],
    type: [
      {
        id: 'no',
        label: 'No',
        withSort: false,
      },
      {
        id: 'type_name',
        label: 'Tipe',
        withSort: false,
      },
      {
        id: 'count',
        label: 'Jumlah',
        withSort: false,
      },
    ],
  };

  return (
    <TableHead>
      <TableRow>
        {headCellV2[type].map((headCell) => (
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

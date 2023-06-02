import React, { useState } from 'react';
import moment from 'moment';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  TableRow,
  TableCell,
  TableHead,
  Stack,
  TextField,
  InputAdornment,
  TableSortLabel,
  IconButton,
  Tooltip,
} from '@mui/material';

import { useDebounce } from 'use-debounce';

import HeaderBreadcrumbs from '../HeaderBreadcrumbs';
import Iconify from '../Iconify';
import Scrollbar from '../Scrollbar';
import ConditionalWrapper from '../ConditionalWrapper';
import Label from '../Label';

import ModalItems from '../modal/stock-history/ModalItems';
import TableRowSkeleton from '../skeleton/TableRowSkeleton';
import { appendSortQuery } from '../../utils/helperUtils';
import { useGetStockHistories } from '../../hooks/api/useStockHistory';

const StockHistory = () => {
  const [orderBy, setOrderBy] = useState('created_at');
  const [order, setOrder] = useState('desc');

  const [search, setSearch] = useState('');
  const [searchDebounce] = useDebounce(search, 300);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowPerPage] = useState(5);

  const rowsPerPageChangeHandler = (e) => {
    setRowPerPage(e.target.value);
  };

  const onChangeSearchHandler = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const pageChangeHandler = (e, newValue) => {
    setPage(newValue);
  };

  const onSortHandler = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const queryParams = {
    page: page + 1,
    pageSize: rowsPerPage,
    search: searchDebounce,
    ...(order && appendSortQuery(order, orderBy)),
  };

  const { data, isFetching } = useGetStockHistories(queryParams);

  const stocks = data?.data || [];
  const paginationMeta = data?.meta?.info;

  return (
    <>
      <HeaderBreadcrumbs heading="Stok Histori" links={[]} />
      <Card>
        <Stack direction="row" alignItems="center" sx={{ py: 2.5, px: 3 }}>
          <TextField
            value={search}
            onChange={onChangeSearchHandler}
            placeholder="Cari stok..."
            sx={{ width: '100%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 720 }}>
            <Table>
              <TableHeadComponent orderBy={orderBy} order={order} onSortHandler={onSortHandler} />
              <TableBody>
                {isFetching ? (
                  <TableRowSkeleton countCell={6} />
                ) : (
                  stocks?.map((row, index) => (
                    <TableRowComponent key={row?.id} row={row} index={index} page={page} rowsPerPage={rowsPerPage} />
                  ))
                )}
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
    </>
  );
};

const TableRowComponent = React.memo(({ row, index, page, rowsPerPage }) => {
  const [showModal, setShowModal] = useState(false);
  const [stockData, setStockData] = useState(null);

  const showModalHandler = (data) => {
    setShowModal(true);
    setStockData(data);
  };

  const closeModalHandler = () => {
    setShowModal(false);
    setStockData(null);
  };

  return (
    <>
      <TableRow>
        <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
        <TableCell>{moment(row?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
        <TableCell>{row?.code}</TableCell>
        <TableCell>
          <Label variant={'ghost'} color={row?.trxType === 'in' ? 'success' : 'error'}>
            {row?.trxType}
          </Label>
        </TableCell>
        <TableCell>{row?.orderTrx?.code}</TableCell>
        <TableCell>
          <Tooltip title="Detail History">
            <IconButton size="small" color="warning" onClick={() => showModalHandler(row)}>
              <Iconify icon="eva:edit-fill" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <ModalItems open={showModal} onClose={closeModalHandler} stockData={stockData} />
    </>
  );
});

const TableHeadComponent = React.memo(({ orderBy, order, onSortHandler }) => {
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
      id: 'created_at',
      label: 'Tanggal',
      withSort: true,
    },
    {
      id: 'code',
      label: 'Kode',
      withSort: false,
    },
    {
      id: 'trx_type',
      label: 'Jenis Transaksi',
      withSort: false,
    },
    {
      id: 'order_code',
      label: 'Kode Order',
      withSort: true,
    },
    {
      id: 'action',
      label: 'Aksi',
      withSort: false,
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
});

export default StockHistory;

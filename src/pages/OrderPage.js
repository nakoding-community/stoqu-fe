import { useEffect, useRef, useState } from 'react';
import startCase from 'lodash/startCase';
import moment from 'moment';
import { useDebounce } from 'use-debounce';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, getDocs, getDoc, limit, doc, onSnapshot } from 'firebase/firestore';
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
  InputAdornment,
  IconButton,
  TableSortLabel,
  Tooltip,
} from '@mui/material';
import { firebaseApp } from '../utils/firebase';

import useSettings from '../hooks/useSettings';

import Page from '../components/Page';
import Iconify from '../components/Iconify';
import Scrollbar from '../components/Scrollbar';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import Label from '../components/Label';
import InfiniteCombobox from '../components/combobox/InfiniteCombobox';
import ConditionalWrapper from '../components/ConditionalWrapper';

import { getOrders, readOrder } from '../client/ordersClient';
import { convertToRupiah, getStatusColor } from '../utils/helperUtils';
import { useGetDashboardCount } from '../hooks/api/useDashboard';

import '../styles/animation.css';

export default function OrderPage() {
  const unsubscribe = useRef(null);

  const [orderBy, setOrderBy] = useState('created_at');
  const [order, setOrder] = useState('desc');

  const theme = useTheme();
  const navigate = useNavigate();
  const { themeStretch } = useSettings();

  const { data } = useGetDashboardCount();
  const { totalOrder } = data?.data;

  const [search, setSearch] = useState('');
  const [searchDebounce] = useDebounce(search, 300);

  const [orders, setOrders] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowPerPage] = useState(10);

  const [filterStatus, setFilterStatus] = useState('');

  const [listenToFirebase, setListenToFirebase] = useState(false);

  const rowsPerPageChangeHandler = (e) => {
    setRowPerPage(e.target.value);
  };

  const onChangeSearchHandler = (e) => {
    setListenToFirebase(false);
    setSearch(e.target.value);
    setPage(0);
  };

  const pageChangeHandler = (e, newValue) => {
    setListenToFirebase(false);
    setPage(newValue);
  };

  const onSortHandler = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setListenToFirebase(false);
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const navigateToDetailPageHandler = (id, isRead) => {
    navigate(`/dashboard/order/${id}`);
    // eslint-disable-next-line no-unused-expressions
    // !isRead && readOrder(id);
  };

  const getDataFirebase = async () => {
    const db = getFirestore(firebaseApp);
    const q = query(collection(db, 'dashboard-order'), limit(rowsPerPage));
    const r = doc(db, 'total-order', 'total-order');
    const querySnapshot2 = await getDoc(r);
    const unsubscribeFirebase = onSnapshot(q, (querySnapshot) => {
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push(doc.data());
      });
      setOrders(orders);
    });

    setPaginationMeta({
      count: querySnapshot2.data().TotalOrder,
    });

    unsubscribe.current = unsubscribeFirebase;
  };

  const appendSortQuery = (order, orderBy) => {
    return {
      sortBy: order === 'asc' ? orderBy : `-${orderBy}`,
    };
  };

  const getOrdersHandler = async () => {
    if (listenToFirebase) {
      getDataFirebase();
    } else {
      const query = {
        page: page + 1,
        pageSize: rowsPerPage,
        search,
        filterStatus,
        ...(order && appendSortQuery(order, orderBy)),
      };

      const { data, meta } = await getOrders(query);
      setOrders(data || []);
      setPaginationMeta(meta?.info);
    }
  };

  const onChangeStatusHandler = (e) => {
    setListenToFirebase(false);
    setFilterStatus(e?.id);
    setPage(0);
  };

  const checkShowNotifUnReadIndicator = (isRead) => {
    return !isRead;
  };

  useEffect(() => {
    getOrdersHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage, page, searchDebounce, filterStatus, order]);

  useEffect(() => {
    if (!listenToFirebase) {
      // eslint-disable-next-line no-unused-expressions
      unsubscribe?.current && unsubscribe?.current();
    }

    return () => {
      // eslint-disable-next-line no-unused-expressions
      unsubscribe?.current && unsubscribe?.current();
    };
  }, [listenToFirebase, unsubscribe]);

  return (
    <Page title="Pesanan">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Pesanan"
          links={[]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={`/dashboard/order/new`}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Tambah
            </Button>
          }
          useBadge
          badgeCount={totalOrder}
        />

        <Card>
          <Stack direction="row" alignItems="center" sx={{ py: 2.5, px: 3 }}>
            <InfiniteCombobox
              label="Status"
              useStaticOption
              staticOptions={[
                { id: 'progress', label: 'Progress' },
                { id: 'pending', label: 'Pending' },
                { id: 'complete', label: 'Complete' },
                { id: 'canceled', label: 'Canceled' },
              ]}
              onChange={onChangeStatusHandler}
              sx={{ width: 300, marginRight: '20px' }}
            />
            <TextField
              value={search}
              onChange={onChangeSearchHandler}
              placeholder="Cari pesanan..."
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
                  {orders.map((row, index) => (
                    <TableRow key={row?.ID || row.id}>
                      <TableCell>
                        {checkShowNotifUnReadIndicator(row?.IsRead !== undefined ? row?.IsRead : row?.isRead) && (
                          <Tooltip title="Belum dibaca">
                            <div className="unread-circle" style={{ backgroundColor: theme.palette.error.main }} />
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                      <TableCell>{moment(row?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                      <TableCell>
                        {(row?.TrxType || row?.trxType) && (
                          <Label
                            variant={'ghost'}
                            color={(row?.TrxType || row?.trxType) === 'in' ? 'info' : 'success'}
                          >
                            {row?.TrxType || row?.trxType === 'in' ? 'MASUK' : 'KELUAR'}
                          </Label>
                        )}
                      </TableCell>
                      <TableCell>{row?.Code || row?.code}</TableCell>
                      <TableCell>{row?.CustomerName || row.customerName}</TableCell>
                      <TableCell>{row?.PhoneNumber || row.phoneNumber}</TableCell>
                      <TableCell>
                        <Label variant={'ghost'} color="success">
                          {convertToRupiah(row?.FinalPrice || row.finalPrice || 0)}
                        </Label>
                      </TableCell>
                      <TableCell>
                        {(row?.Status || row?.status) && (
                          <Label variant={'ghost'} color={getStatusColor(row?.Status || row?.status)}>
                            {startCase(row?.Status || row?.status)}
                          </Label>
                        )}
                      </TableCell>
                      {
                        // <TableCell>
                        //   {(row?.StockStatus || row?.stockStatus) && (
                        //     <Label
                        //       variant={'ghost'}
                        //       color={(row?.StockStatus || row?.stockStatus) !== 'NORMAL' ? 'default' : 'success'}
                        //     >
                        //       {startCase(row?.StockStatus || row?.stockStatus)}
                        //     </Label>
                        //   )}
                        // </TableCell>
                      }
                      <TableCell>
                        <Tooltip title="Edit Pesanan">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => navigateToDetailPageHandler(row?.ID || row?.id, row?.isRead)}
                          >
                            <Iconify icon="eva:edit-fill" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
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

const TableHeadComponent = ({ orderBy, order, onSortHandler }) => {
  const onClickSortHandler = (property) => {
    onSortHandler(property);
  };

  const headCells = [
    {
      id: '',
      label: '',
      withSort: false,
    },
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
      id: 'trx_type',
      label: 'Tipe Transaksi',
      withSort: true,
    },
    {
      id: 'code',
      label: 'Kode',
      withSort: true,
    },
    {
      id: 'customer_name',
      label: 'Customer',
      withSort: true,
    },
    {
      id: 'phone_number',
      label: 'No. HP',
      withSort: true,
    },
    {
      id: 'final_price',
      label: 'Harga',
      withSort: true,
    },
    {
      id: 'status',
      label: 'Status',
      withSort: true,
    },
    // {
    //   id: 'stock_status',
    //   label: 'Stok Status',
    //   withSort: true,
    // },
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
};

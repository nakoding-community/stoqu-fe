import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Card,
  Table,
  Button,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  TableRow,
  TableCell,
  TableHead,
  Stack,
  TextField,
  InputAdornment,
  TableSortLabel,
  Tooltip,
} from '@mui/material';

import { useDebounce } from 'use-debounce';
import { useConfirm } from 'material-ui-confirm';
import { toast } from 'react-toastify';
import useSettings from '../hooks/useSettings';

import Page from '../components/Page';
import Iconify from '../components/Iconify';
import Scrollbar from '../components/Scrollbar';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import InfiniteCombobox from '../components/combobox/InfiniteCombobox';
import ConditionalWrapper from '../components/ConditionalWrapper';
import Label from '../components/Label';

import { ModalCreateEditProduct } from '../components/modal/product/ModalCreateEditProduct';

import { deleteProduct } from '../client/productsClient';
import { appendSortQuery, convertToRupiah } from '../utils/helperUtils';

import KEY from '../constant/queryKey';
import { useProductDetail, useProducts } from '../api/useProductsClient';
import TableRowSkeleton from '../components/skeleton/TableRowSkeleton';

export default function ProductApp() {
  const queryClient = useQueryClient();
  const { themeStretch } = useSettings();

  const [orderBy, setOrderBy] = useState('created_at');
  const [order, setOrder] = useState('desc');

  const [search, setSearch] = useState('');
  const [searchDebounce] = useDebounce(search, 300);

  const [editData, setEditData] = useState(null);
  const [editId, setEditId] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);

  const [filterBrand, setFilterBrand] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const showModalHandler = () => {
    setShowModal(true);
  };

  const closeModalHandler = () => {
    setShowModal(false);
    setEditData(null);
    setEditId(null);
  };

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

  const onChangeFilterBrandHandler = (e) => {
    setFilterBrand(e?.label);
    setPage(0);
  };

  const onChangeFilterValueHandler = (e) => {
    setFilterValue(e?.label);
    setPage(0);
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
    brandName: filterBrand,
    packetValue: parseFloat(filterValue),
    ...(order && appendSortQuery(order, orderBy)),
  };

  const { data, isFetching } = useProducts(queryParams);

  const products = data?.data || [];
  const paginationMeta = data?.meta?.info;

  useEffect(() => {
    return () => {
      queryClient.cancelQueries([KEY.products.all]);
    };
  }, []);

  return (
    <Page title="Produk">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Produk"
          useBadge
          badgeCount={paginationMeta?.count || 0}
          action={
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={showModalHandler}>
              Tambah
            </Button>
          }
        />

        <Card>
          <Stack direction="row" alignItems="center" sx={{ py: 2.5, px: 3 }}>
            <InfiniteCombobox
              label="Cari Brand"
              type="brands"
              sx={{ width: '300px', marginRight: '20px' }}
              onChange={onChangeFilterBrandHandler}
              labelText={filterBrand}
            />
            <InfiniteCombobox
              label="Cari Tipe"
              type="types"
              sx={{ width: '300px', marginRight: '20px' }}
              onChange={onChangeFilterValueHandler}
              labelText={filterValue}
            />

            <TextField
              value={search}
              onChange={onChangeSearchHandler}
              placeholder="Cari..."
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
                    <TableRowSkeleton countCell={9} />
                  ) : (
                    products?.map((row, index) => (
                      <TableRowComponent
                        key={row.id}
                        row={row}
                        number={index + 1 + page * rowsPerPage}
                        setEditData={setEditData}
                        setEditId={setEditId}
                        showModalHandler={showModalHandler}
                      />
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
      </Container>
      <ModalCreateEditProduct open={showModal} onClose={closeModalHandler} editData={editData} editId={editId} />
    </Page>
  );
}

const TableRowComponent = ({ row, number, setEditData, setEditId, showModalHandler }) => {
  const queryClient = useQueryClient();

  const confirm = useConfirm();

  const { data } = useProductDetail(row?.id, {
    initialData: row,
  });

  const productDetail = data?.data ? data?.data : data;

  const onClickEditHandler = (data) => {
    setEditData({
      ...data,
      priceUsd: data?.priceUsd,
      priceIdr: data?.priceFinal,
      labelText: {
        brand: data?.brandName,
        variant: data?.variantName,
        type: `${data?.packetValue} ${data?.unitName}`,
      },
    });
    setEditId(data?.id);
    showModalHandler();
  };

  const onClickDeleteHandler = (id) => {
    confirm().then(async () => {
      const { isSuccess } = await deleteProduct(id);
      if (isSuccess) {
        toast.success('Berhasil menghapus produk');
        queryClient.invalidateQueries([KEY.products.all]);
      }
    });
  };

  return (
    <TableRow>
      <TableCell>{number}</TableCell>
      <TableCell>{productDetail?.code}</TableCell>
      <TableCell>{productDetail?.brandName}</TableCell>
      <TableCell>{productDetail?.variantName}</TableCell>
      <TableCell>{`${productDetail?.packetValue} ${productDetail?.unitName}`}</TableCell>
      <TableCell>{productDetail?.supplierName}</TableCell>
      <TableCell>-</TableCell>
      <TableCell>
        <Label variant={'ghost'} color={'success'}>
          {convertToRupiah(productDetail?.priceFinal)}
        </Label>
      </TableCell>
      <TableCell>
        <Tooltip title="Edit Produk">
          <IconButton size="small" color="warning" onClick={() => onClickEditHandler(productDetail)}>
            <Iconify icon="eva:edit-fill" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Produk">
          <IconButton size="small" color="error" onClick={() => onClickDeleteHandler(productDetail?.id)}>
            <Iconify icon="eva:trash-2-outline" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

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
      id: 'code',
      label: 'Kode',
      withSort: true,
    },
    {
      id: 'brand',
      label: 'Brand',
      withSort: true,
    },
    {
      id: 'variant',
      label: 'Varian',
      withSort: true,
    },
    {
      id: 'type',
      label: 'Tipe',
      withSort: true,
    },
    {
      id: 'supplier_name',
      label: 'Nama Supplier',
      withSort: false,
    },
    {
      id: 'code_unique',
      label: 'Kode Unik',
      withSort: false,
    },
    {
      id: 'price_idr',
      label: 'Harga',
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
};

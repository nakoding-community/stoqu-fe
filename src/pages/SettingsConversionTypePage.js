import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Card,
  Table,
  Button,
  Tooltip,
  TableBody,
  IconButton,
  TableContainer,
  TablePagination,
  TableRow,
  TableCell,
  TableHead,
  Stack,
  TextField,
  InputAdornment,
  Container,
  TableSortLabel,
} from '@mui/material';

import { useConfirm } from 'material-ui-confirm';
import { useDebounce } from 'use-debounce';

import { toast } from 'react-toastify';
import Iconify from '../components/Iconify';
import Scrollbar from '../components/Scrollbar';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';

import Page from '../components/Page';
import useSettings from '../hooks/useSettings';

import ConditionalWrapper from '../components/ConditionalWrapper';
import { ModalCreateEditConvertion } from '../components/modal/settings-convertion/ModalCreateEditConvertion';
import { useDeleteConvertionUnit, useGetConvertionUnits } from '../hooks/api/useConvertionUnit';
import { appendSortQuery } from '../utils/helperUtils';

function SettingsConversionTypePage() {
  const queryClient = useQueryClient();
  const { themeStretch } = useSettings();

  const confirm = useConfirm();

  const [orderBy, setOrderBy] = useState('created_at');
  const [order, setOrder] = useState('desc');

  const [search, setSearch] = useState('');
  const [searchDebounce] = useDebounce(search, 300);

  const [editData, setEditData] = useState(null);
  const [editId, setEditId] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);

  const { mutate: deleteConvertionUnit } = useDeleteConvertionUnit();

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

  const onSortHandler = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const onClickEditHandler = (data) => {
    setEditData({
      origin: data?.origin,
      destination: data?.destination,
      total: data?.total,
      labelText: {
        origin: data?.origin,
        destination: data?.destination,
      },
    });
    setEditId(data?.id);
    showModalHandler();
  };

  const onClickDeleteHandler = (id) => {
    confirm().then(async () => {
      deleteConvertionUnit(id, {
        onSuccess: () => {
          toast.success('Berhasil menghapus tipe konversi');

          queryClient.invalidateQueries(['convertion-units', 'list']);
        },
      });
    });
  };

  const params = {
    page: page + 1,
    pageSize: rowsPerPage,
    search: searchDebounce,
    ...(order && appendSortQuery(order, orderBy)),
  };

  const { data } = useGetConvertionUnits(params);
  const convertions = data?.data;
  const { meta } = data || {};

  return (
    <Page title="Tipe Konversi">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Tipe Konversi"
          action={
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={showModalHandler}>
              Tambah
            </Button>
          }
          badgeCount={meta?.info?.count || 0}
          useBadge
        />

        <Card>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2.5, px: 3 }}>
            <TextField
              value={search}
              onChange={onChangeSearchHandler}
              placeholder="Cari..."
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
                  {convertions?.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row?.origin}</TableCell>
                      <TableCell>{row?.destination}</TableCell>
                      <TableCell>{row?.total}</TableCell>
                      <TableCell>
                        <Tooltip title="Edit Tipe">
                          <IconButton size="small" color="warning" onClick={() => onClickEditHandler(row)}>
                            <Iconify icon="eva:edit-fill" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Tipe">
                          <IconButton size="small" color="error" onClick={() => onClickDeleteHandler(row?.id)}>
                            <Iconify icon="eva:trash-2-outline" />
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
              count={meta?.info?.count || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={pageChangeHandler}
              onRowsPerPageChange={rowsPerPageChangeHandler}
            />
          </Box>
        </Card>
      </Container>
      <ModalCreateEditConvertion open={showModal} onClose={closeModalHandler} editData={editData} editId={editId} />
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
      id: 'origin',
      label: 'Tipe Awal',
      withSort: false,
    },
    {
      id: 'destination',
      label: 'Tipe Akhir',
      withSort: false,
    },
    {
      id: 'total',
      label: 'Total Konversi',
      withSort: false,
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

export default SettingsConversionTypePage;

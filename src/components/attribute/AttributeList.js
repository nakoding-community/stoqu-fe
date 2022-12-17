import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import {
  Box,
  Card,
  Table,
  Button,
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
  TableSortLabel,
  Tooltip,
} from '@mui/material';

import { useConfirm } from 'material-ui-confirm';
import { useDebounce } from 'use-debounce';
import { toast } from 'react-toastify';

import KEY from '../../constant/queryKey';
import { useDeletePacket, useGetPacket, useGetPackets } from '../../hooks/api/usePacket';
import Iconify from '../Iconify';
import Scrollbar from '../Scrollbar';
import HeaderBreadcrumbs from '../HeaderBreadcrumbs';
import ConditionalWrapper from '../ConditionalWrapper';
import { ModalCreateEditAttribute } from '../modal/attribute/ModalCreateEditAttribute';

import TableRowSkeleton from '../skeleton/TableRowSkeleton';
import { appendSortQuery } from '../../utils/helperUtils';

const AttributeList = () => {
  const queryClient = useQueryClient();

  const [orderBy, setOrderBy] = useState('created_at');
  const [order, setOrder] = useState('desc');

  const [search, setSearch] = useState('');
  const [searchDebounce] = useDebounce(search, 300);

  const [editData, setEditData] = useState(null);
  const [editId, setEditId] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);

  const queryParams = {
    page: page + 1,
    pageSize: rowsPerPage,
    search: searchDebounce,
    ...(order && appendSortQuery(order, orderBy)),
  };

  // ** Fetch packets on component mount
  const { data, isFetching } = useGetPackets(queryParams);

  const types = data?.data || [];
  const paginationMeta = data?.meta?.info;

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

  const resetEditState = () => {
    setEditData(null);
    setEditId(null);
  };

  useEffect(() => {
    return () => {
      queryClient.cancelQueries([KEY.attribute.types.all]);
    };
  }, []);

  return (
    <>
      <HeaderBreadcrumbs
        heading="Tipe"
        useBadge
        badgeCount={paginationMeta?.count || 0}
        action={
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={showModalHandler}>
            Tambah
          </Button>
        }
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
                {isFetching ? (
                  <TableRowSkeleton countCell={5} />
                ) : (
                  types.map((row, index) => (
                    <TableRowComponent
                      key={row.id}
                      number={index + 1 + page * rowsPerPage}
                      row={row}
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
            rowsPerPageOptions={[3, 5, 10, 25]}
            component="div"
            count={paginationMeta?.count || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={pageChangeHandler}
            onRowsPerPageChange={rowsPerPageChangeHandler}
          />
        </Box>
      </Card>

      <ModalCreateEditAttribute
        open={showModal}
        onClose={closeModalHandler}
        editData={editData}
        editId={editId}
        resetEditState={resetEditState}
      />
    </>
  );
};

const TableRowComponent = ({ number, row, setEditData, setEditId, showModalHandler }) => {
  const confirm = useConfirm();
  const queryClient = useQueryClient();

  const { data } = useGetPacket(row.id, {
    initialData: row,
  });

  const typeDetail = data?.data ? data?.data : data;

  // ** Hook to delete packet
  const { mutate: deletePacket } = useDeletePacket(typeDetail?.id);

  const onClickEditHandler = (data) => {
    setEditData({
      id: data?.id,
      unitId: data?.unitId,
      value: data?.value,
    });
    setEditId(data?.id);
    showModalHandler();
  };

  const onClickDeleteHandler = () => {
    confirm().then(async () => {
      const body = {};
      deletePacket(body, {
        onSuccess: () => {
          toast.success('Berhasil menghapus tipe');
          queryClient.invalidateQueries(['packets', 'list']);
        },
      });
    });
  };

  return (
    <TableRow>
      <TableCell>{number}</TableCell>
      <TableCell>{typeDetail?.code}</TableCell>
      <TableCell>{typeDetail?.unit?.unit}</TableCell>
      <TableCell>{typeDetail?.value}</TableCell>
      <TableCell>
        <Tooltip title="Edit Tipe">
          <IconButton size="small" color="warning" onClick={() => onClickEditHandler(typeDetail)}>
            <Iconify icon="eva:edit-fill" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Tipe">
          <IconButton size="small" color="error" onClick={() => onClickDeleteHandler(typeDetail?.id)}>
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
      id: 'unit',
      label: 'Unit',
      withSort: true,
    },
    {
      id: 'value',
      label: 'Value',
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

export default AttributeList;

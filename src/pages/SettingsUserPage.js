import { useEffect, useState } from 'react';
import { useConfirm } from 'material-ui-confirm';

import { useDebounce } from 'use-debounce';
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
import { toast } from 'react-toastify';
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import Scrollbar from '../components/Scrollbar';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import ConditionalWrapper from '../components/ConditionalWrapper';

// sections
import { getUsers, deleteUser } from '../client/usersClient';
import { ModalCreateEditUser } from '../components/modal/settings-user/ModalCreateEditUser';
import InfiniteCombobox from '../components/combobox/InfiniteCombobox';

export default function SettingsUserPage() {
  const confirm = useConfirm();

  const [orderBy, setOrderBy] = useState('created_at');
  const [order, setOrder] = useState('desc');

  const [search, setSearch] = useState('');
  const [searchDebounce] = useDebounce(search, 300);

  const { themeStretch } = useSettings();
  const [users, setUsers] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowPerPage] = useState(5);

  const [showModal, setShowModal] = useState(false);

  const [editData, setEditData] = useState(null);
  const [editId, setEditId] = useState(null);

  const [roleId, setRoleId] = useState(null);
  const [roleLabel, setRoleLabel] = useState(null);

  const showModalHandler = () => {
    setShowModal(true);
  };

  const closeModalHandler = () => {
    setShowModal(false);
    setEditData(null);
    setEditId(null);
  };

  const onClickEditHandler = (data) => {
    setEditData({
      email: data?.email,
      name: data?.name,
      password: data?.password,
      phoneNumber: data?.userProfile?.phone,
      roleId: data?.role?.id,
      labelText: {
        role: data?.role?.role,
      },
    });
    setEditId(data?.id);
    showModalHandler();
  };

  const onSortHandler = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const appendSortQuery = (order, orderBy) => {
    return {
      sortBy: order === 'asc' ? orderBy : `-${orderBy}`,
    };
  };

  const getUsersHandler = async () => {
    const query = {
      page: page + 1,
      pageSize: rowsPerPage,
      search,
      filterRole: roleLabel,
      ...(order && appendSortQuery(order, orderBy)),
    };

    const { data, meta } = await getUsers(query);
    setUsers(data || []);
    setPaginationMeta(meta?.info || {});
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

  const onClickDeleteHandler = (id) => {
    confirm().then(async () => {
      const { isSuccess } = await deleteUser(id);
      if (isSuccess) {
        toast.success('Berhasil menghapus user');
        getUsersHandler();
      }
    });
  };

  useEffect(() => {
    getUsersHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage, page, searchDebounce, order, roleLabel]);

  return (
    <Page title="Pengaturan Pengguna">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Pengaturan Pengguna"
          action={
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={showModalHandler}>
              Tambah
            </Button>
          }
          badgeCount={paginationMeta?.count || 0}
          useBadge
        />

        <Card>
          <Stack direction="row" alignItems="center" sx={{ py: 2.5, px: 3 }}>
            <TextField
              value={search}
              onChange={onChangeSearchHandler}
              placeholder="Search user..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            <InfiniteCombobox
              value={roleId}
              label="Role (*)"
              type="roles"
              onChange={(e) => {
                setRoleId(e?.id);
                setRoleLabel(e?.label);
              }}
              labelText={roleLabel}
              sx={{ width: '20%', marginLeft: '16px' }}
            />
          </Stack>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 720 }}>
              <Table>
                <TableHeadComponent orderBy={orderBy} order={order} onSortHandler={onSortHandler} />
                <TableBody>
                  {users?.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                      <TableCell>{row?.name}</TableCell>
                      <TableCell>{row?.email}</TableCell>
                      <TableCell>{row?.userProfile?.phone}</TableCell>
                      <TableCell>
                        <Tooltip title="Edit Pengguna">
                          <IconButton size="small" color="warning" onClick={() => onClickEditHandler(row)}>
                            <Iconify icon="eva:edit-fill" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Pengguna">
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
              count={paginationMeta?.count || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={pageChangeHandler}
              onRowsPerPageChange={rowsPerPageChangeHandler}
            />
          </Box>
        </Card>
      </Container>

      <ModalCreateEditUser
        open={showModal}
        onClose={closeModalHandler}
        getUsersHandler={getUsersHandler}
        editData={editData}
        editId={editId}
      />
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
      id: 'name',
      label: 'Nama',
      withSort: true,
    },
    {
      id: 'email',
      label: 'Email',
      withSort: true,
    },
    {
      id: 'phone',
      label: 'No. HP',
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

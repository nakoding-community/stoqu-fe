import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useConfirm } from 'material-ui-confirm';
import { toast } from 'react-toastify';
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

import Iconify from '../Iconify';
import Scrollbar from '../Scrollbar';
import HeaderBreadcrumbs from '../HeaderBreadcrumbs';
import ConditionalWrapper from '../ConditionalWrapper';

import { ModalCreateEditBrand } from '../modal/brand/ModalCreateEditBrand';
import { deleteVariant } from '../../client/variantsClient';
import { ModalCreateEditVariant } from '../modal/variant/ModalCreateEditVariant';
import { useAttributeBrands } from '../../api/useAttributeBrandClient';

import KEY from '../../constant/queryKey';
import TableRowSkeleton from '../skeleton/TableRowSkeleton';
import { appendSortQuery } from '../../utils/helperUtils';

const AttributeBrand = () => {
  const queryClient = useQueryClient();

  const [orderBy, setOrderBy] = useState('created_at');
  const [order, setOrder] = useState('desc');

  const [search, setSearch] = useState('');
  const [searchDebounce] = useDebounce(search, 300);

  const [editBrandData, setEditBrandData] = useState(null);
  const [brandId, setBrandId] = useState(null);

  const [editVariantData, setEditVariantData] = useState(null);
  const [editVariantId, setEditVariantId] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowPerPage] = useState(5);

  const [showModalBrand, setShowModalBrand] = useState(false);
  const [showModalVariant, setShowModalVariant] = useState(false);

  const resetState = () => {
    setEditBrandData(null);
    setBrandId(null);

    setEditVariantData(null);
    setEditVariantId(null);
  };

  const showModalBrandHandler = () => {
    setShowModalBrand(true);
  };

  const closeModalBrandHandler = () => {
    setShowModalBrand(false);
    resetState();
  };

  const closeModalVariantHandler = () => {
    setShowModalVariant(false);
    resetState();
  };

  const onSortHandler = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const rowsPerPageChangeHandler = (e) => {
    setRowPerPage(e.target.value);
  };

  const onChangeSearchHandler = (e) => {
    setSearch(e.target.value);
  };

  const pageChangeHandler = (e, newValue) => {
    setPage(newValue);
  };

  const getRestructuredBrands = (data = []) => {
    const restructuredData = [];

    if (data?.length > 0) {
      data?.forEach((brand, brandIndex) => {
        const variants = brand.variants?.length > 0 ? brand.variants : [1];
        return variants?.map((variant, variantIndex) =>
          restructuredData.push({
            no: variantIndex === 0 ? variantIndex + brandIndex + 1 : null,
            brandCodeName: variantIndex === 0 ? brand.code : null,
            brandName: variantIndex === 0 ? brand.name : null,
            codeVariant: variant?.code,
            variantName: variant?.name,
            variantItl: variant?.itl,
            brandId: variantIndex === 0 ? brand.id : null,
            variantId: variant?.id,
            supplierName: variantIndex === 0 ? brand?.supplier?.name : null,
            supplierId: brand?.supplierId,
            uniqueCode: variant?.uniqueCode,
          })
        );
      });
    }

    return restructuredData;
  };

  const queryParams = {
    page: page + 1,
    pageSize: rowsPerPage,
    search: searchDebounce,
    ...(order && appendSortQuery(order, orderBy)),
  };

  const { data, isFetching } = useAttributeBrands(queryParams);

  const brands = getRestructuredBrands(data?.data);
  const paginationMeta = data?.meta?.info;

  useEffect(() => {
    return () => {
      queryClient.cancelQueries([KEY.attribute.brands.all]);
    };
  }, []);

  return (
    <>
      <HeaderBreadcrumbs
        heading="Brand"
        useBadge
        badgeCount={paginationMeta?.count || 0}
        action={
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={showModalBrandHandler}>
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
                  <TableRowSkeleton countCell={10} />
                ) : (
                  brands?.map((row) => (
                    <TableRowComponent
                      key={row.id}
                      number={row?.no && row?.no + page * rowsPerPage}
                      row={row}
                      setEditVariantData={setEditVariantData}
                      setEditVariantId={setEditVariantId}
                      setEditBrandData={setEditBrandData}
                      setBrandId={setBrandId}
                      showModalBrandHandler={showModalBrandHandler}
                      setShowModalVariant={setShowModalVariant}
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
      <ModalCreateEditBrand
        open={showModalBrand}
        onClose={closeModalBrandHandler}
        editData={editBrandData}
        editId={brandId}
      />
      <ModalCreateEditVariant
        open={showModalVariant}
        onClose={closeModalVariantHandler}
        brandId={brandId}
        editVariantData={editVariantData}
        editVariantId={editVariantId}
        // getBrandsHandler={getBrandsHandler}
      />
    </>
  );
};

const TableRowComponent = ({
  number,
  row,
  setEditVariantData,
  setEditVariantId,
  setEditBrandData,
  setBrandId,
  showModalBrandHandler,
  setShowModalVariant,
}) => {
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const onClickEditVariantHandler = (row) => {
    showModalVariantHandler();
    setEditVariantData({
      code: row?.codeVariant,
      name: row?.variantName,
      itl: row?.variantItl,
      uniqueCode: row?.uniqueCode,
    });
    setEditVariantId(row?.variantId);
  };

  const onClickDeleteVariantHandler = (id) => {
    confirm().then(async () => {
      const { isSuccess } = await deleteVariant(id);
      if (isSuccess) {
        toast.success('Berhasil menghapus variant');
        queryClient.invalidateQueries(['brands']);
      }
    });
  };

  const onClickEditBrandHandler = (data) => {
    setEditBrandData(data);
    setBrandId(data?.brandId);
    showModalBrandHandler();
  };

  const showModalVariantHandler = (row) => {
    setShowModalVariant(true);
    setBrandId(row?.brandId);
  };

  return (
    <TableRow>
      <TableCell>{number}</TableCell>
      <TableCell>{row?.brandCodeName}</TableCell>
      <TableCell>{row?.brandName}</TableCell>
      <TableCell>{row?.supplierName}</TableCell>
      <TableCell>{row?.codeVariant}</TableCell>
      <TableCell>{row?.variantName}</TableCell>
      <TableCell>{row?.variantItl}</TableCell>
      <TableCell>{row?.uniqueCode}</TableCell>
      <TableCell>
        {row?.codeVariant && row?.variantName && (
          <>
            <Tooltip title="Edit Varian">
              <IconButton size="small" color="warning" onClick={() => onClickEditVariantHandler(row)}>
                <Iconify icon="eva:edit-fill" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Varian">
              <IconButton size="small" color="error" onClick={() => onClickDeleteVariantHandler(row?.variantId)}>
                <Iconify icon="eva:trash-2-outline" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </TableCell>
      <TableCell>
        {row?.no && (
          <>
            <Tooltip title="Edit Brand">
              <IconButton size="small" color="warning" onClick={() => onClickEditBrandHandler(row)}>
                <Iconify icon="eva:edit-fill" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Tambah Variant">
              <IconButton size="small" color="primary" onClick={() => showModalVariantHandler(row)}>
                <Iconify icon="eva:plus-outline" />
              </IconButton>
            </Tooltip>
          </>
        )}
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
      id: 'supplier_name',
      label: 'Nama Supplier',
      withSort: false,
    },
    {
      id: 'variant_code',
      label: 'Kode Varian',
      withSort: false,
    },
    {
      id: 'variant',
      label: 'Varian',
      withSort: false,
    },
    {
      id: 'itl',
      label: 'ITL',
      withSort: false,
    },
    {
      id: 'code_unique',
      label: 'Kode Unik',
      withSort: false,
    },
    {
      id: 'variant_action',
      label: 'Aksi Varian',
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

export default AttributeBrand;

import { useState, useEffect } from 'react';
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
  IconButton,
  TableSortLabel,
  Tooltip,
} from '@mui/material';
import { useDebounce } from 'use-debounce';
import { getStocks } from '../../client/stocksClient';
import { ModalDetailStock } from '../modal/stock/ModalDetailStock';

import Iconify from '../Iconify';
import Scrollbar from '../Scrollbar';
import ModalStockConversion from '../modal/stock/ModalStockConversion';
import ModalStockTransaction from '../modal/stock/ModalStockTransaction';
import ModalStockLookup from '../modal/stock/ModaStockLookup';
import ModalSuccessCreateTransaction from '../modal/stock/ModalSuccessCreateTransaction';
import ConditionalWrapper from '../ConditionalWrapper';
import InfiniteCombobox from '../combobox/InfiniteCombobox';
import Label from '../Label';
import { appendSortQuery } from '../../utils/helperUtils';
import ModalStockRack from '../modal/stock/ModalStockRack';
import ModalStockMovement from '../modal/stock/ModalStockMovement';

const LIMIT = 5;

const StockList = ({
  showConversionStockModal,
  closeConversionStockModalHandler,
  showTransactionStockModal,
  closeTransactionStockModalHandler,
  showConversionStockModalHandler,
  showStockMovementModal,
  setShowStockMovementModal,
}) => {
  const [brandId, setBrandId] = useState('');
  const [filterBrandLabel, setFilterBrandLabel] = useState('');

  const [orderBy, setOrderBy] = useState('created_at');
  const [order, setOrder] = useState('desc');

  const [search, setSearch] = useState('');
  const [searchDebounce] = useDebounce(search, 300);

  const [stocks, setStocks] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowPerPage] = useState(LIMIT);

  const [showModalDetailStock, setShowModalDetailStock] = useState(false);
  const [detailStockData, setDetailStockData] = useState(null);

  const [showLookupStockModal, setShowLookupStockModal] = useState(false);
  const [detailLookupStockData, setDetailLookupStockData] = useState(null);

  const [showModalCreatedTrx, setShowModalCreatedTrx] = useState(false);
  const [modalCreatedTrxType, setModalCreatedTrxType] = useState(null);
  const [createdTrxData, setCreatedTrxData] = useState(null);

  const [showStockRackModal, setShowStockRackModal] = useState(false);
  const [rackData, setRackData] = useState(null);

  const [editConversionStockData, setEditConversionStockData] = useState(null);

  const onCloseConversionStockModalHandler = () => {
    setEditConversionStockData(null);
    closeConversionStockModalHandler();
  };

  const onClickEditConversionStockData = (data) => {
    setEditConversionStockData(data);
    showConversionStockModalHandler();
  };

  const showModalSuccessCreateTrxHandler = (data, type) => {
    setShowModalCreatedTrx(true);
    setCreatedTrxData(data);
    setModalCreatedTrxType(type);
  };

  const closeModalSuccessCreateTrxHandler = () => {
    setShowModalCreatedTrx(false);
    setCreatedTrxData(null);
    setModalCreatedTrxType(null);
  };

  const showModalDetailStockHandler = (data) => {
    setShowModalDetailStock(true);
    setDetailStockData(data);
  };

  const closeModalDetailStockHandler = () => {
    setShowModalDetailStock(false);
    setDetailStockData(null);
  };

  const showStockRackModalHandler = (data) => {
    setShowStockRackModal(true);
    setRackData(data);
  };

  const closeStockRackModalHandler = () => {
    setShowStockRackModal(false);
    setRackData(null);
  };

  const closeStockMovementModalHandler = () => {
    setShowStockMovementModal(false);
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

  const appendFilterBrandId = () => {
    return {
      brandId,
    };
  };

  const getStocksHandler = async () => {
    const query = {
      page: page + 1,
      pageSize: rowsPerPage,
      search,
      ...(order && appendSortQuery(order, orderBy)),
      ...(brandId && appendFilterBrandId()),
    };

    const { data, meta } = await getStocks(query);
    setStocks(data || []);
    setPaginationMeta(meta?.info);
  };

  useEffect(() => {
    getStocksHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage, page, searchDebounce, order, brandId]);

  return (
    <>
      <Card>
        <Stack direction="row" alignItems="center" sx={{ py: 2.5, px: 3 }}>
          <InfiniteCombobox
            value={brandId}
            label="Cari Brand"
            type="brands"
            onChange={(e) => {
              setFilterBrandLabel(e?.label);
              setBrandId(e?.id);
              setPage(0);
            }}
            sx={{ width: 300, marginRight: '20px' }}
            labelText={filterBrandLabel}
          />

          <TextField
            value={search}
            onChange={onChangeSearchHandler}
            placeholder="Cari stock..."
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
                {stocks.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                    <TableCell>{row?.productName}</TableCell>
                    <TableCell>{row?.productCode}</TableCell>
                    <TableCell>{row?.brandName}</TableCell>
                    <TableCell>{row?.variantName}</TableCell>
                    <TableCell>{`${row?.packetValue} ${row?.unitName}`}</TableCell>
                    <TableCell>
                      <Label variant={'ghost'} color="info">
                        {row?.totalSeal}
                      </Label>
                    </TableCell>
                    <TableCell>
                      <Label variant={'ghost'} color="error">
                        {row?.totalNotSeal}
                      </Label>
                    </TableCell>
                    <TableCell>
                      <Label variant={'ghost'} color="success">
                        {row?.totalSeal + row?.totalNotSeal}
                      </Label>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Detail Stok">
                        <IconButton size="small" color="warning" onClick={() => showModalDetailStockHandler(row)}>
                          <Iconify icon="eva:edit-fill" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Rak">
                        <IconButton size="small" color="info" onClick={() => showStockRackModalHandler(row)}>
                          <Iconify icon="eva:bar-chart-outline" />
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
      <ModalStockConversion
        open={showConversionStockModal}
        onClose={onCloseConversionStockModalHandler}
        editConversionStockData={editConversionStockData}
        showModalSuccessCreateTrxHandler={showModalSuccessCreateTrxHandler}
        getStocksHandler={getStocksHandler}
      />
      <ModalStockTransaction
        open={showTransactionStockModal}
        onClose={closeTransactionStockModalHandler}
        getStocksHandler={getStocksHandler}
        showModalSuccessCreateTrxHandler={showModalSuccessCreateTrxHandler}
      />
      <ModalDetailStock
        open={showModalDetailStock}
        onClose={closeModalDetailStockHandler}
        detailStockData={detailStockData}
        getStocksHandler={getStocksHandler}
      />
      <ModalSuccessCreateTransaction
        open={showModalCreatedTrx}
        onClose={closeModalSuccessCreateTrxHandler}
        createdTrxData={createdTrxData}
        type={modalCreatedTrxType}
      />
      <ModalStockRack
        open={showStockRackModal}
        onClose={closeStockRackModalHandler}
        data={rackData}
        getStocksHandler={getStocksHandler}
      />

      <ModalStockMovement
        open={showStockMovementModal}
        onClose={closeStockMovementModalHandler}
        getStocksHandler={getStocksHandler}
      />
    </>
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
      id: 'productName',
      label: 'Nama Produk',
      withSort: false,
    },
    {
      id: 'productCode',
      label: 'Kode',
      withSort: true,
    },
    {
      id: 'brandName',
      label: 'Brand',
      withSort: true,
    },
    {
      id: 'variantName',
      label: 'Varian',
      withSort: true,
    },
    {
      id: 'type',
      label: 'Tipe',
      withSort: true,
    },
    {
      id: 'total_seal',
      label: 'Segel',
      withSort: true,
    },
    {
      id: 'total_not_seal',
      label: 'Tidak Segel',
      withSort: true,
    },
    {
      id: 'total',
      label: 'Total',
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

export default StockList;

import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useConfirm } from 'material-ui-confirm';
import parseInt from 'lodash/parseInt';
import { Box, Stack, Typography, TextField, DialogTitle, IconButton, Tooltip } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import ModalV2 from '../ModaV2';
import Iconify from '../../Iconify';
import Scrollbar from '../../Scrollbar';
import DownloadProductCodePDF from '../../PDF/DownloadProductCodePDF';
import { getLookupStocksProduct } from '../../../client/lookupStocksClient';
import { loadMoreValidator } from '../../../utils/helperUtils';

import { getStockLookups, updateStockLookup } from '../../../clientv2/stockLookup';
import Label from '../../Label';

const ModalStockLookup = ({
  open,
  onClose,
  detailLookupStockData,
  type = 'stock',
  stockRackId,
  data,
  getStocksHandler,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const confirm = useConfirm();

  const confrimHandler = (e) => {
    confirm({ title: 'Perhatian!', description: 'Mohon tunggu hingga proses pengambilan data selesai' });
  };

  return (
    <ModalV2 open={open} onClose={() => (isDownloading ? confrimHandler() : onClose())}>
      <Header
        detailLookupStockData={detailLookupStockData}
        onClose={onClose}
        setIsDownloading={setIsDownloading}
        stockRackId={stockRackId}
        data={data}
      />
      <Content
        detailLookupStockData={detailLookupStockData}
        type={type}
        stockRackId={stockRackId}
        data={data}
        getStocksHandler={getStocksHandler}
      />
    </ModalV2>
  );
};

const Header = ({ onClose, setIsDownloading, stockRackId, data }) => {
  const [valueStrings, setValueStrings] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async (allData = [], currentPage = 1) => {
    const { data, meta } = await getStockLookups({
      stockRackId,
      page: currentPage,
    });
    allData = allData.concat(data);

    return currentPage < meta?.info?.totalPage ? getData(allData, currentPage + 1) : allData;
  };

  const downloadPDFData = async () => {
    setIsDownloading(true);
    setLoading(true);
    const lookups = await getData();
    if (lookups) {
      const codeProducts = lookups?.map((lookup) => {
        return lookup?.code;
      });

      setValueStrings(codeProducts);
    }
    setLoading(false);
  };

  return (
    <ModalV2.Header>
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Box>Lookup Stok</Box>
          {/* <DownloadProductCodePDF
            onClick={downloadPDFData}
            valueStrings={valueStrings}
            isLoading={loading}
            onClose={onClose}
            setIsDownloading={setIsDownloading}
          /> */}
        </DialogTitle>
      </Box>
    </ModalV2.Header>
  );
};

const Content = ({ type, stockRackId, data, getStocksHandler }) => {
  const [search, setSearch] = useState('');
  const [searchDebounce] = useDebounce(search, 300);

  const [listProducts, setListProducts] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [onLoadMore, setOnLoadMore] = useState(false);

  const onChangeSearchHandler = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  let queryFn = () => {};
  switch (type) {
    case 'stock':
      queryFn = getStockLookups;
      break;
    case 'product':
      queryFn = getLookupStocksProduct;
      break;
    default:
      break;
  }

  const getLookupStocksHandler = async () => {
    const query = { stockRackId, page: currentPage, search };
    const { data, meta } = await queryFn(query);
    setListProducts(data || []);
    setTotalPage(meta?.info?.totalPage);
  };

  const loadMoreLookupStocksHandler = async (page) => {
    const query = {
      stockRackId,
      page,
      search,
      pageSize: 5,
    };
    const { data, meta } = await getStockLookups(query);
    if (data) {
      setListProducts((prev) => [...prev, ...data]);
      setTotalPage(meta?.info?.totalPage);
    }
  };

  const onScrollHandler = (e) => {
    const target = e.currentTarget;

    if (currentPage < totalPage && !onLoadMore) {
      loadMoreValidator(target, 30, async () => {
        setOnLoadMore(true);
        await loadMoreLookupStocksHandler(currentPage + 1);
        setCurrentPage(currentPage + 1);
        setOnLoadMore(false);
      });
    }
  };

  useEffect(() => {
    getLookupStocksHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDebounce]);

  const ContentProduct = () => {
    if (listProducts?.length > 0) {
      return listProducts?.map((product) => (
        <SelectedData
          product={product}
          title={product?.code}
          key={product?.id}
          sx={{ marginBottom: '12px' }}
          withBadge
          withEdit
          withDownloadIcon
          getStocksHandler={getStocksHandler}
        />
      ));
    }

    return search ? 'Data tidak ditemukan' : 'Tidak ada data';
  };

  return (
    <ModalV2.Content>
      <Stack spacing={3} sx={{ p: 3 }}>
        <SelectedData
          title={`${data?.brandName} - ${data?.variantName} - ${data?.packetValue}${data?.unitName}`}
          showTitle={false}
        />

        <TextField label="Cari Produk" value={search} onChange={onChangeSearchHandler} />
        <Scrollbar sx={{ height: { sm: '300px' } }} onScroll={onScrollHandler}>
          <ContentProduct />
        </Scrollbar>
      </Stack>
    </ModalV2.Content>
  );
};

const SelectedData = ({
  title,
  sx = {},
  withBadge,
  withEdit,
  product,
  showTitle = true,
  getStocksHandler,
  withDownloadIcon,
}) => {
  const theme = useTheme();
  const [value, setValue] = useState(product?.remainingValue);
  const [isEditing, setIsEditing] = useState(false);
  const [valueStrings, setValueStrings] = useState(null);

  const onSaveValue = async () => {
    setIsEditing(false);

    const body = {
      id: product?.id,
      isSeal: value === product?.value,
      remainingValue: parseInt(value),
      remainingValueBefore: product?.remainingValue,
      value: product?.value,
    };

    const { isSuccess } = await updateStockLookup(product?.id, body);
    if (isSuccess) {
      getStocksHandler();
    }
  };

  const onChangeValue = (e) => {
    if (e.target.value > product?.value) return;

    setValue(e.target.value);
  };

  const onClickDownload = () => {
    setValueStrings([title]);

    setTimeout(() => {
      setValueStrings([]);
    }, 250);
  };

  return (
    <>
      <Stack direction="row" alignItems={'center'} sx={sx}>
        <Box
          sx={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '16px',
            color: theme.palette.warning.dark,
            backgroundColor: alpha(theme.palette.warning.main, 0.16),
          }}
        >
          <Iconify icon="mdi:cart" sx={{ width: '20px', height: '20px' }} />
        </Box>
        <Stack width="100%" direction="row" alignItems={'center'} justifyContent="space-between">
          <Box>
            <Typography variant="body1">{title}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isEditing ? (
                <TextField
                  size="small"
                  autoFocus
                  value={value}
                  onBlur={onSaveValue}
                  onChange={onChangeValue}
                  type="number"
                />
              ) : (
                <>
                  {showTitle && (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {`Sisa: ${value}`}
                    </Typography>
                  )}
                  {withEdit && (
                    <Tooltip title="Edit Value">
                      <IconButton size="small" color="warning" onClick={() => setIsEditing(true)}>
                        <Iconify icon="eva:edit-fill" />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              )}
            </Box>
          </Box>
          <Box>
            {withBadge && (
              <Label variant="ghost" color={product?.isSeal ? 'error' : 'success'} sx={{ marginRight: '8px' }}>
                {product?.isSeal ? 'Segel' : 'Tidak Segel'}
              </Label>
            )}
            {withDownloadIcon && (
              <Tooltip title="Download QR Code">
                <IconButton size="small" color="success" onClick={() => onClickDownload()}>
                  <Iconify icon="ion:qr-code" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Stack>

        <DownloadProductCodePDF useButton={false} valueStrings={valueStrings} />
      </Stack>
    </>
  );
};

export default ModalStockLookup;

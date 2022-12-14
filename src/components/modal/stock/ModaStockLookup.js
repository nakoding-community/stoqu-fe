import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useConfirm } from 'material-ui-confirm';
import { Box, Stack, Typography, IconButton, TextField, DialogTitle } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import ModalV2 from '../ModaV2';
import Iconify from '../../Iconify';
import Scrollbar from '../../Scrollbar';
import DownloadProductCodePDF from '../../PDF/DownloadProductCodePDF';
import { getLookupStocks, getLookupStocksProduct } from '../../../client/lookupStocksClient';
import { loadMoreValidator } from '../../../utils/helperUtils';

const ModalStockLookup = ({ open, onClose, detailLookupStockData, type = 'stock' }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const confirm = useConfirm();

  const confrimHandler = (e) => {
    confirm({ title: 'Perhatian!', description: 'Mohon tunggu hingga proses pengambilan data selesai' });
  };

  return (
    <ModalV2 open={open} onClose={() => (isDownloading ? confrimHandler() : onClose())}>
      <Header detailLookupStockData={detailLookupStockData} onClose={onClose} setIsDownloading={setIsDownloading} />
      <Content detailLookupStockData={detailLookupStockData} type={type} />
    </ModalV2>
  );
};

const Header = ({ detailLookupStockData, onClose, setIsDownloading }) => {
  const [valueStrings, setValueStrings] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async (allData = [], currentPage = 1) => {
    const { data, meta } = await getLookupStocks({
      filterProductId: detailLookupStockData?.productId,
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
          <DownloadProductCodePDF
            onClick={downloadPDFData}
            valueStrings={valueStrings}
            isLoading={loading}
            onClose={onClose}
            setIsDownloading={setIsDownloading}
          />
        </DialogTitle>
      </Box>
    </ModalV2.Header>
  );
};

const Content = ({ detailLookupStockData, type }) => {
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
      queryFn = getLookupStocks;
      break;
    case 'product':
      queryFn = getLookupStocksProduct;
      break;
    default:
      break;
  }

  const getLookupStocksHandler = async () => {
    const query = { filterProductId: detailLookupStockData?.productId, page: currentPage, search };
    const { data, meta } = await queryFn(query);
    setListProducts(data || []);
    setTotalPage(meta?.info?.totalPage);
  };

  const loadMoreLookupStocksHandler = async (page) => {
    const query = {
      filterProductId: detailLookupStockData?.productId || detailLookupStockData?.id,
      page,
      search,
      pageSize: 5,
    };
    const { data, meta } = await getLookupStocks(query);
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
          title={product?.code}
          subTitle={`Sisa: ${product?.name}`}
          key={product?.id}
          sx={{ marginBottom: '12px' }}
          withDelete={false}
        />
      ));
    }

    return search ? 'Data tidak ditemukan' : 'Tidak ada data';
  };

  const getTitle = () => {
    if (type === 'stock') {
      return `${detailLookupStockData?.brand?.brand} - ${detailLookupStockData?.variant?.variant} ${detailLookupStockData?.type?.value} ${detailLookupStockData?.type?.unit?.unit}`;
    }

    return `${detailLookupStockData?.brand} - ${detailLookupStockData?.variant} ${detailLookupStockData?.type}`;
  };

  return (
    <ModalV2.Content>
      <Stack spacing={3} sx={{ p: 3 }}>
        <SelectedData title={getTitle()} withDelete={false} />

        <TextField label="Cari Produk" value={search} onChange={onChangeSearchHandler} />
        <Scrollbar sx={{ height: { sm: '300px' } }} onScroll={onScrollHandler}>
          <ContentProduct />
        </Scrollbar>
      </Stack>
    </ModalV2.Content>
  );
};

const SelectedData = ({ title, subTitle, withDelete = true, sx = {} }) => {
  const theme = useTheme();
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
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {subTitle}
            </Typography>
          </Box>
          {withDelete && (
            <IconButton size="small" color="error">
              <Iconify icon="eva:trash-2-outline" />
            </IconButton>
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default ModalStockLookup;

import React, { useState } from 'react';
import { useConfirm } from 'material-ui-confirm';
import {
  Stack,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  InputAdornment,
  TextField,
  Box,
  DialogTitle,
} from '@mui/material';
import Iconify from '../../Iconify';
import ModalV2 from '../ModaV2';
import Scrollbar from '../../Scrollbar';
import DownloadProductCodePDF from '../../PDF/DownloadProductCodePDF';

// eslint-disable-next-line react/prop-types
const ModalLookups = ({ open, onClose, lookupData }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const confirm = useConfirm();

  const confrimHandler = (e) => {
    confirm({ title: 'Perhatian!', description: 'Mohon tunggu hingga proses pengambilan data selesai' });
  };

  const lookups = lookupData?.stockTrxItemLookups || [];

  return (
    <ModalV2 open={open} onClose={() => (isDownloading ? confrimHandler() : onClose())}>
      <Header lookups={lookups} setIsDownloading={setIsDownloading} onClose={onClose} />
      <Content lookups={lookups} />
    </ModalV2>
  );
};

const Header = ({ lookups, setIsDownloading }) => {
  const [valueStrings, setValueStrings] = useState([]);
  const [loading, setLoading] = useState(false);

  const downloadPDFData = async () => {
    setIsDownloading(true);
    setLoading(true);
    const codeProducts = lookups?.map((lookup) => {
      return lookup?.code;
    });

    setValueStrings(codeProducts);
    setLoading(false);
  };

  return (
    <ModalV2.Header>
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Box>Lookups</Box>
          <DownloadProductCodePDF
            onClick={downloadPDFData}
            valueStrings={valueStrings}
            isLoading={loading}
            setIsDownloading={setIsDownloading}
          />
        </DialogTitle>
      </Box>
    </ModalV2.Header>
  );
};

const Content = ({ lookups }) => {
  const [listLookups, setListLookups] = useState(lookups);

  const onChangeSearchHandler = (e) => {
    const newLookups = lookups?.filter((lookup) => {
      const inputValue = e.target.value?.toLowerCase();
      return lookup?.code?.toLowerCase()?.includes(inputValue);
    });

    setListLookups(newLookups);
  };

  return (
    <ModalV2.Content>
      <Stack spacing={3} sx={{ p: 3 }}>
        <TextField
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
        <Scrollbar sx={{ maxHeight: '350px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Kode</TableCell>
                <TableCell>Value Sebelum</TableCell>
                <TableCell>Value Sesudah</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listLookups?.length > 0 ? (
                listLookups?.map((row) => (
                  <TableRow key={row?.id}>
                    <TableCell>{row?.code}</TableCell>
                    <TableCell>{`${row?.remainingValueBefore}`}</TableCell>
                    <TableCell>{`${row?.remainingValue}`}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2}>Tidak ada data</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Scrollbar>
      </Stack>
    </ModalV2.Content>
  );
};

export default ModalLookups;

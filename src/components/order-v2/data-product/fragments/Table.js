import React from 'react';
import { Table, TableBody, TableContainer, TableRow, TableCell, TableHead, IconButton, Tooltip } from '@mui/material';
import startCase from 'lodash/startCase';
import Iconify from '../../../Iconify';
import Label from '../../../Label';
import { convertToRupiah } from '../../../../utils/helperUtils';

const TableComponent = () => {
  return (
    <TableContainer sx={{ minWidth: 720, pt: '12px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>Brand</TableCell>
            <TableCell>Varian</TableCell>
            <TableCell>Paket</TableCell>
            <TableCell>Jumlah</TableCell>
            <TableCell>Jumlah Diproses</TableCell>
            <TableCell>Total Harga</TableCell>
            <TableCell>Aksi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[]?.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row?.brand}</TableCell>
              <TableCell>{row?.variant}</TableCell>
              <TableCell>
                <Label variant="ghost" color={row?.stock === 'available' ? 'success' : 'error'}>
                  {startCase(row?.stock)}
                </Label>
              </TableCell>
              <TableCell>{row?.type}</TableCell>
              <TableCell>{row?.quantity}</TableCell>
              <TableCell>{convertToRupiah(row?.price)}</TableCell>
              <TableCell>
                <Tooltip title="Hapus Produk">
                  <IconButton
                    size="small"
                    color="error"
                    // onClick={() => onDeleteProductHandler(index, row?.id)}
                    // disabled={!isUserAbleToEdit}
                  >
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Lihat Lookup">
                  <IconButton
                    size="small"
                    color="success"
                    // onClick={() => showLookupStockModalHandler(row)}
                    // disabled={!isUserAbleToEdit}
                  >
                    <Iconify icon="eva:search-outline" />
                  </IconButton>
                </Tooltip>
                {row?.isOrderSync && (
                  <Tooltip title="Sync Pesanan">
                    <IconButton
                      size="small"
                      color="info"
                      // onClick={() => onClickSyncOrderHandler(row)}
                      // disabled={!isUserAbleToEdit}
                    >
                      <Iconify icon="eva:refresh-outline" />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Tambah Lookup">
                  <IconButton
                    size="small"
                    color="warning"
                    // onClick={() => showLookupStockModalHandler(row)}
                    // disabled={!isUserAbleToEdit}
                  >
                    <Iconify icon="eva:plus-fill" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;

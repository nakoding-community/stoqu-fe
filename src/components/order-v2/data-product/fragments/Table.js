import React from 'react';
import { shallow } from 'zustand/shallow';
import { useConfirm } from 'material-ui-confirm';
import { useLocation } from 'react-router';
import { Table, TableBody, TableContainer, TableRow, TableCell, TableHead, IconButton, Tooltip } from '@mui/material';
import Iconify from '../../../Iconify';
import { convertToRupiah } from '../../../../utils/helperUtils';
import { useCreateOrder } from '../../../../hooks/useCreateOrderV2';

const TableComponent = ({ setShowModalCreateProduct, setProductDetail }) => {
  const location = useLocation();
  const isCreatePage = location.pathname.includes('new');

  const confirm = useConfirm();

  const { items, immerSetState } = useCreateOrder(
    (state) => ({ items: state.payloadBody.items, immerSetState: state.immerSetState }),
    shallow
  );

  const deleteProduct = (uuid) => {
    confirm().then(() => {
      const newItems = [...items];

      const deleteItemIndex = newItems?.findIndex((item) => item.uuid === uuid);
      const deleteItem = newItems[deleteItemIndex];

      if (deleteItem?.action === 'insert' || deleteItem?.id === '') {
        newItems.splice(deleteItemIndex, 1);
        immerSetState((draft) => {
          draft.payloadBody.items = newItems;
        });
      }
    });
  };

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
          {items
            ?.filter((item) => item?.action !== 'delete')
            ?.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row?.product?.brandName || row?.product?.brand?.name}</TableCell>
                <TableCell>{row?.product?.variantName || row?.product?.variant?.name}</TableCell>
                <TableCell>
                  {isCreatePage ? `${row?.product?.packetValue} ${row?.product?.unitName}` : row?.product?.packet?.name}
                </TableCell>
                <TableCell>{row?.total}</TableCell>
                <TableCell>{isCreatePage ? '-' : row?.totalPacked}</TableCell>
                <TableCell>{convertToRupiah(row?.price)}</TableCell>
                <TableCell>
                  <Tooltip title="Edit Produk">
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() => {
                        setShowModalCreateProduct(true);
                        setProductDetail(row);
                      }}
                    >
                      <Iconify icon="eva:edit-fill" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Hapus Produk">
                    <IconButton size="small" color="error" onClick={() => deleteProduct(row?.uuid)}>
                      <Iconify icon="eva:trash-2-outline" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Lookup">
                    <IconButton
                      size="small"
                      color="success"
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

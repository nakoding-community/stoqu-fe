import moment from 'moment';
import startCase from 'lodash/startCase';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getFirestore, collection, query, limit, onSnapshot } from 'firebase/firestore';

// @mui
import {
  Card,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  CardHeader,
  IconButton,
  TableContainer,
  Tooltip,
} from '@mui/material';

// components
import Iconify from '../Iconify';
import Scrollbar from '../Scrollbar';
import Label from '../Label';

import { convertToRupiah, getStatusColor } from '../../utils/helperUtils';
import { firebaseApp } from '../../utils/firebase';

export default function DashboardRecentOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const db = getFirestore(firebaseApp);
    const q = query(collection(db, 'dashboard-order'), limit(5));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push(doc.data());
      });
      setOrders(orders);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Card>
      <CardHeader title="Pesanan Terbaru" sx={{ mb: 3 }} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Tanggal</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Harga</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{moment(row?.Date).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                  <TableCell>{row?.CustomerName}</TableCell>
                  <TableCell>
                    <Label variant={'ghost'} color={'success'}>
                      {convertToRupiah(row?.Price)}
                    </Label>
                  </TableCell>
                  <TableCell>
                    {row?.Status && (
                      <Label variant={'ghost'} color={getStatusColor(row?.Status)}>
                        {startCase(row?.Status)}
                      </Label>
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit Pesanan">
                      <IconButton
                        size="small"
                        color="warning"
                        component={RouterLink}
                        to={`/dashboard/order/${row?.ID || row.id}`}
                      >
                        <Iconify icon="eva:edit-fill" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
      <Divider />
    </Card>
  );
}

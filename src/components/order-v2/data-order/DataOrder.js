import startCase from 'lodash/startCase';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useConfirm } from 'material-ui-confirm';

// @mui
import { Box, Card, Stack, TextField, IconButton, Grid, Typography, Link } from '@mui/material';
import Iconify from '../../Iconify';

import Label from '../../Label';

import InfiniteCombobox from '../../combobox/InfiniteCombobox';
import { getStatusColor } from '../../../utils/helperUtils';
import { useCreateOrder } from '../../../hooks/useCreateOrderV2';
import TrasanctionType from './field/TrasanctionType';
import Customer from './field/Customer';
import Supplier from './field/Supplier';
import Pic from './field/Pic';
import ShipmentType from './field/ShipmentType';
import ShipmentNumber from './field/ShipmentNumber';
import ShipmentPrice from './field/ShipmentPrice';
import PaymentStatus from './field/PaymentStatus';
import FinalPrice from './field/FinalPrice';
import Receipts from './field/Receipts';
import StockStatus from './field/StockStatus';
import Status from './field/Status';
import { Notes } from './field/Notes';

const DataOrder = () => {
  const confirm = useConfirm();

  const trxType = 'out';

  return (
    <>
      <Card>
        <Stack sx={{ py: 2.5, px: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <TrasanctionType />
              <Customer />
              <Supplier />
              <Pic />
            </Grid>
            <Grid item xs={12} md={3}>
              <ShipmentType />
              <ShipmentNumber />
              <ShipmentPrice />
            </Grid>
            <Grid item xs={12} md={3}>
              <PaymentStatus />
              <FinalPrice />
              <Receipts />
            </Grid>
            <Grid item xs={12} md={3}>
              <StockStatus />
              <Status />
              <Notes />
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </>
  );
};

export default DataOrder;

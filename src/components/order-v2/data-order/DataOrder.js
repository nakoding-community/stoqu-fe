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
import TrasanctionType from './fragments/TrasanctionType';
import Customer from './fragments/Customer';
import Supplier from './fragments/Supplier';
import Pic from './fragments/Pic';
import ShipmentType from './fragments/ShipmentType';
import ShipmentNumber from './fragments/ShipmentNumber';
import ShipmentPrice from './fragments/ShipmentPrice';
import PaymentStatus from './fragments/PaymentStatus';
import FinalPrice from './fragments/FinalPrice';
import Receipts from './fragments/Receipts';
import StockStatus from './fragments/StockStatus';
import Status from './fragments/Status';
import { Notes } from './fragments/Notes';

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

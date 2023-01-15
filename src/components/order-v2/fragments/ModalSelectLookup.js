import React, { useEffect, useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';

import {
  Stack,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Checkbox,
  FormLabel,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import Modal from '../../modal/Modal';
import Iconify from '../../Iconify';
import { useGetStockLookups } from '../../../hooks/api/useStockLookup';
import Scrollbar from '../../Scrollbar';
import { loadMoreValidator } from '../../../utils/helperUtils';

export const ModalSelectLookup = ({ open, onClose, productDetail }) => {
  return (
    <Modal title={'Pilih Lookup'} open={open} onClose={onClose}>
      <DialogForm onClose={onClose} productDetail={productDetail} />
    </Modal>
  );
};

const DialogForm = ({ onClose }) => {
  const [lookups, setLookups] = useState([]);
  console.log('lookups', lookups);

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = useGetStockLookups(
    { pageSize: 10, page: 1 },
    {
      onSuccess: (data) => {
        if (data) {
          const hash = {};

          lookups?.forEach((lookup) => {
            hash[lookup.id] = lookup;
          });

          const newLookups = data?.pages?.flatMap((d) => d?.data?.map((d) => (hash[d?.id] ? hash[d?.id] : d)));

          setLookups(newLookups);
        }
      },
    }
  );

  const onScroll = (e) => {
    const target = e.currentTarget;

    if (hasNextPage && !isFetchingNextPage) {
      loadMoreValidator(target, 30, async () => {
        fetchNextPage();
      });
    }
  };

  const onClickItem = (item) => {
    const clickIndex = lookups?.findIndex((lookup) => lookup.id === item.id);
    const newLookups = cloneDeep(lookups);

    console.log('item', item);

    if (item.isChecked) {
      newLookups[clickIndex].isChecked = false;
    } else {
      console.log('masuk sini dong');
      newLookups[clickIndex].isChecked = true;
    }

    setLookups(newLookups);
  };

  return (
    <Stack component="form">
      <Stack spacing={3}>
        <TextField
          sx={{ px: 3, mt: '16px' }}
          placeholder="Cari..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            ),
          }}
        />

        <Scrollbar sx={{ maxHeight: { sm: '320px' } }} onScroll={onScroll}>
          {lookups?.map((lookup) => (
            <FormLabel
              sx={{
                marginTop: '0 !important',
                px: 3,
                py: 1,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor: lookup?.isChecked ? '#eceff1' : '',
                '&:hover': {
                  backgroundColor: '#eceff1',
                },
              }}
              htmlFor={`checkbox-${lookup?.id}`}
              key={lookup?.id}
            >
              <Checkbox
                id={`checkbox-${lookup?.id}`}
                checked={lookup?.isChecked}
                onChange={() => onClickItem(lookup)}
              />
              <Box sx={{ marginLeft: '12px' }}>
                <Typography variant="body1">{lookup?.code}</Typography>
              </Box>
            </FormLabel>
          ))}
        </Scrollbar>
      </Stack>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Close
        </Button>
        <LoadingButton type="submit" variant="contained" disabled={false}>
          Save
        </LoadingButton>
      </DialogActions>
    </Stack>
  );
};

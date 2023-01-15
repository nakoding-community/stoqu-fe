import React, { useState, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { useDebounce } from 'use-debounce';

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

export const ModalSelectLookup = ({ open, onClose, saveCallback, selectedLookups }) => {
  return (
    <Modal title={'Pilih Lookup'} open={open} onClose={onClose}>
      <DialogForm onClose={onClose} saveCallback={saveCallback} selectedLookups={selectedLookups} />
    </Modal>
  );
};

const DialogForm = ({ onClose, saveCallback, selectedLookups }) => {
  const [lookups, setLookups] = useState([]);
  const [search, setSearch] = useState('');
  const [searchDebounce] = useDebounce(search, 250);

  const params = {
    pageSize: 10,
    page: 1,
    ...(searchDebounce && { search: searchDebounce }),
  };

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = useGetStockLookups(params, {
    onSuccess: (data) => {
      if (data) {
        const hash = {};
        const selectedLookupsHash = {};

        lookups?.forEach((lookup) => {
          hash[lookup.id] = lookup;
        });

        selectedLookups?.forEach((lookup) => {
          selectedLookupsHash[lookup.id] = lookup;
        });

        const newLookups = data?.pages?.flatMap((d) =>
          // eslint-disable-next-line no-nested-ternary
          d?.data?.map((d) => (hash[d?.id] ? hash[d?.id] : selectedLookupsHash[d?.id] ? selectedLookupsHash[d?.id] : d))
        );

        setLookups(newLookups);
      }
    },
  });

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

    if (item.isChecked) {
      newLookups[clickIndex].isChecked = false;
    } else {
      newLookups[clickIndex].isChecked = true;
    }

    setLookups(newLookups);
  };

  const onClickSave = (e) => {
    e.preventDefault();
    const selectedLookups = lookups?.filter((lookup) => lookup.isChecked);

    // eslint-disable-next-line no-unused-expressions
    saveCallback && saveCallback(selectedLookups);
    onClose();
  };

  return (
    <Stack component="form">
      <Stack spacing={3}>
        <TextField
          sx={{ px: 3, mt: '16px' }}
          placeholder="Cari..."
          onChange={(e) => setSearch(e.target.value)}
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
                backgroundColor: lookup?.isChecked ? '#fafafa !important' : '',
                '&:hover': {
                  backgroundColor: '#fafafa !important',
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
          Tutup
        </Button>
        <LoadingButton type="submit" variant="contained" disabled={false} onClick={onClickSave}>
          Simpan
        </LoadingButton>
      </DialogActions>
    </Stack>
  );
};

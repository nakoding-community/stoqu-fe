import React from 'react';
import { Button } from '@mui/material';
import HeaderBreadcrumbs from '../../../HeaderBreadcrumbs';
import Iconify from '../../../Iconify';

const Header = () => {
  return (
    <HeaderBreadcrumbs
      useBadge={false}
      heading={`Data Produk`}
      links={[]}
      action={
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:edit-fill" />}
          // onClick={showModalHandler}
          // disabled={!isUserAbleToEdit}
        >
          Tambah
        </Button>
      }
    />
  );
};

export default Header;

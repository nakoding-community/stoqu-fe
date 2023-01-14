import React from 'react';
import { Button } from '@mui/material';
import HeaderBreadcrumbs from '../../../HeaderBreadcrumbs';
import Iconify from '../../../Iconify';

const Header = ({ setShowModalCreateProduct, setProductDetail }) => {
  return (
    <>
      <HeaderBreadcrumbs
        useBadge={false}
        heading={`Data Produk`}
        links={[]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:edit-fill" />}
            onClick={() => {
              setShowModalCreateProduct(true);
              setProductDetail(null);
            }}
          >
            Tambah
          </Button>
        }
      />
    </>
  );
};

export default Header;

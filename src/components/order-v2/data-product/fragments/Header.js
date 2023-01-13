import React, { useState } from 'react';
import { Button } from '@mui/material';
import HeaderBreadcrumbs from '../../../HeaderBreadcrumbs';
import Iconify from '../../../Iconify';
import { ModalCreateOrder } from '../../fragments/ModalCreateOrder';

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <HeaderBreadcrumbs
        useBadge={false}
        heading={`Data Produk`}
        links={[]}
        action={
          <Button variant="contained" startIcon={<Iconify icon="eva:edit-fill" />} onClick={() => setShowModal(true)}>
            Tambah
          </Button>
        }
      />
      <ModalCreateOrder open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default Header;

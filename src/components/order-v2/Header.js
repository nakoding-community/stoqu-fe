import { useParams } from 'react-router';
import { Container, Button } from '@mui/material';
import HeaderBreadcrumbs from '../HeaderBreadcrumbs';

import Iconify from '../Iconify';

const Header = ({ isCreatePage }) => {
  const { id } = useParams();

  // const { detailOrderState, processOrderHandler, isUserAbleToEdit, isAbleToSubmit } = useCreateOrder();

  return (
    <HeaderBreadcrumbs
      useBadge={false}
      heading={`Data Pesanan`}
      links={[]}
      action={
        !isCreatePage && (
          <Button
            color="warning"
            variant="contained"
            startIcon={<Iconify icon="eva:edit-fill" />}
            // onClick={() => processOrderHandler(id)}
            // disabled={!isUserAbleToEdit || !isAbleToSubmit}
          >
            Ubah
          </Button>
        )
      }
    />
  );
};

export default Header;

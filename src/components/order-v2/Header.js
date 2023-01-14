import { useLocation, useParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import HeaderBreadcrumbs from '../HeaderBreadcrumbs';

const Header = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const location = useLocation();
  const isCreatePage = location.pathname.includes('new');

  const queryData = queryClient.getQueryData(['order-detail', id]);

  return (
    <HeaderBreadcrumbs
      useBadge={false}
      heading={`Data Pesanan ${isCreatePage ? '' : `#${queryData?.data?.code}`}`}
      links={[]}
    />
  );
};

export default Header;

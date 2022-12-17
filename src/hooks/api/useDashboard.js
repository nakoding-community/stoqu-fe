import { useQuery } from '@tanstack/react-query';
import { getDashboardCount } from '../../clientv2/dashboardClient';

export const useGetDashboardCount = (queryParams) => {
  const fetchData = () => {
    return getDashboardCount(queryParams);
  };

  return useQuery(['dashboard', queryParams], fetchData, {
    staleTime: 3600, // 1minutes
  });
};

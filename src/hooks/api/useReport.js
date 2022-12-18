import { useQuery } from '@tanstack/react-query';
import { getReportOrders } from '../../clientv2/reportClient';

export const useGetReportOrders = (queryParams) => {
  const fetchData = () => {
    return getReportOrders(queryParams);
  };

  return useQuery(['report-orders', 'list', queryParams], fetchData);
};

import { useQuery } from '@tanstack/react-query';
import { getReportOrderProducts, getReportOrders } from '../../clientv2/reportClient';

export const useGetReportOrders = (queryParams) => {
  const fetchData = () => {
    return getReportOrders(queryParams);
  };

  return useQuery(['report-orders', 'list', queryParams], fetchData);
};

export const useGetReportProducts = (queryParams) => {
  const fetchData = () => {
    return getReportOrderProducts(queryParams);
  };

  return useQuery(['report-products', 'list', queryParams], fetchData);
};

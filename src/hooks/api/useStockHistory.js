import { useQuery } from '@tanstack/react-query';
import { getStockHistory } from '../../clientv2/stockHistory';

export const useGetStockHistories = (queryParams, options) => {
  const fetchData = () => {
    return getStockHistory(queryParams);
  };

  return useQuery(['stock-histories', 'list', queryParams], fetchData, options);
};

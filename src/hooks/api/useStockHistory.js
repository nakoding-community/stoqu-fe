import { useQuery } from '@tanstack/react-query';
import { getStockHistory } from '../../clientv2/stockHistory';

export const useGetStockHistories = (queryParams) => {
  const fetchData = () => {
    return getStockHistory(queryParams);
  };

  return useQuery(['dashboard', queryParams], fetchData);
};

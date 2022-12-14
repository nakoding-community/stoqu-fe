import { useQuery } from '@tanstack/react-query';
import { getStocksHistory } from '../client/stocksClient';

import KEY from '../constant/queryKey';

const useStockHistories = (queryParams) => {
  const fetchStockHistories = ({ signal }) => {
    return getStocksHistory(queryParams, signal);
  };

  return useQuery([KEY.stocks.histories.all, queryParams], fetchStockHistories, {
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export { useStockHistories };

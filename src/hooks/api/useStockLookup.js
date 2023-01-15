import { useInfiniteQuery } from '@tanstack/react-query';
import { getStockLookups } from '../../clientv2/stockLookup';

export const useGetStockLookups = (queryParams, options) => {
  const fetchData = (nextPage) => {
    const params = {
      ...queryParams,
      ...(nextPage && { page: nextPage }),
    };

    return getStockLookups(params);
  };

  return useInfiniteQuery(
    ['stock-lookups', 'list', 'modal-selection', queryParams],
    ({ pageParam }) => fetchData(pageParam),
    {
      getNextPageParam: (lastPage) => {
        return lastPage?.meta?.info?.page < lastPage?.meta?.info?.totalPage ? lastPage?.meta?.info?.page + 1 : null;
      },
      ...options,
    }
  );
};

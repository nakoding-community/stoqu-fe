import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import {
  getCountUnreadReminderStockHistory,
  getReminderStockHistories,
  updateBulkReadReminderStockHistories,
} from '../../clientv2/reminderStockHistory';

export const useGetReminderStockHistories = (queryParams, options) => {
  const fetchData = (nextPage) => {
    const params = {
      ...queryParams,
      ...(nextPage && { page: nextPage }),
    };

    return getReminderStockHistories(params);
  };

  return useInfiniteQuery(['reminder-stock-histories', queryParams], ({ pageParam }) => fetchData(pageParam), {
    getNextPageParam: (lastPage) => {
      console.log('lastPage', lastPage);
      return lastPage?.meta?.info?.page < lastPage?.meta?.info?.totalPage ? lastPage?.meta?.info?.page + 1 : null;
    },
    ...options,
  });
};

export const useGetUnreadCountStockHistories = (queryParams, options) => {
  const fetchData = () => {
    return getCountUnreadReminderStockHistory(queryParams);
  };

  return useQuery(['reminder-stock-histories', 'unread', 'count'], fetchData, options);
};

export const useBulkReadReminderStockHistories = () => {
  return useMutation((body) => updateBulkReadReminderStockHistories(body));
};

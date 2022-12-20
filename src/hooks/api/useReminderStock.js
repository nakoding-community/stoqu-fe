import { useMutation, useQuery } from '@tanstack/react-query';
import { getReminderStocks, updateReminderStock } from '../../clientv2/reminderStock';

export const useGetReminderStocks = (options) => {
  const fetchData = () => {
    return getReminderStocks();
  };

  return useQuery(['reminder-stocks', 'list'], fetchData, options);
};

export const useEditReminderStock = (id) => {
  return useMutation(async (body) => {
    const response = await updateReminderStock(id, body);

    if (response?.isSuccess) {
      return response;
    }

    throw response;
  });
};

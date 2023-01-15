import { useMutation, useQuery } from '@tanstack/react-query';
import { getOrderById, upsertOrder } from '../clientv2/orderClient';

export const useUpsertOrder = () => {
  return useMutation(async (body) => {
    const response = await upsertOrder(body);

    if (response?.isSuccess) {
      return response;
    }

    throw response;
  });
};

export const useGetOrderById = (id, options) => {
  const fetchData = ({ signal }) => {
    return getOrderById(id, signal);
  };

  return useQuery(['order-detail', id], fetchData, options);
};

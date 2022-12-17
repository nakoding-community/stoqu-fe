import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { deletePacket, getPackets } from '../../clientv2/packetClient';

export const useGetPackets = (queryParams, options) => {
  const fetchData = () => {
    return getPackets(queryParams);
  };

  return useQuery(['packets', 'list', queryParams], fetchData, options);
};

export const useDeletePacket = (id) => {
  return useMutation(async () => {
    const response = await deletePacket(id);

    if (response?.isSuccess) {
      return response;
    }

    throw response;
  });
};

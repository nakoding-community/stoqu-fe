import { useMutation, useQuery } from '@tanstack/react-query';
import { deletePacket, getPacketById, getPackets } from '../../clientv2/packetClient';

export const useGetPackets = (queryParams, options) => {
  const fetchData = () => {
    return getPackets(queryParams);
  };

  return useQuery(['packets', 'list', queryParams], fetchData, options);
};

export const useGetPacket = (id, options = {}) => {
  const fetchTypeDetail = () => {
    return getPacketById(id);
  };

  return useQuery(['packets', 'detail', id], fetchTypeDetail, {
    staleTime: Infinity,
    ...options,
  });
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

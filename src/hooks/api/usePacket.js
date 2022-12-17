import { useMutation, useQuery } from '@tanstack/react-query';
import { createPacket, deletePacket, getPacketById, getPackets, updatePacket } from '../../clientv2/packetClient';

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

export const useCreatePacket = () => {
  return useMutation(async (body) => {
    const response = await createPacket(body);

    if (response?.isSuccess) {
      return response;
    }

    throw response;
  });
};

export const useEditPacket = (id) => {
  return useMutation(async (body) => {
    const response = await updatePacket(id, body);

    if (response?.isSuccess) {
      return response;
    }

    throw response;
  });
};

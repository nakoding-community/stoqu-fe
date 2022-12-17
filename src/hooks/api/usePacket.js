import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { getPackets } from '../../clientv2/packetClient';

export const useGetPackets = (queryParams, options) => {
  const fetchData = () => {
    return getPackets(queryParams);
  };

  return useQuery(['packets', 'list', queryParams], fetchData, options);
};

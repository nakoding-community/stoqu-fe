import { useQuery } from '@tanstack/react-query';
import { getTypeDetail, getTypes } from '../client/typesClient';

import KEY from '../constant/queryKey';

const useTypes = (queryParams) => {
  const fetchTypes = ({ signal }) => {
    return getTypes(queryParams, signal);
  };

  return useQuery([KEY.attribute.types.all, queryParams], fetchTypes, {
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

const useTypeDetail = (typeId, queryConfig = {}) => {
  const fetchTypeDetail = () => {
    return getTypeDetail(typeId);
  };

  return useQuery([KEY.attribute.types.detail, typeId], fetchTypeDetail, {
    staleTime: Infinity,
    ...queryConfig,
  });
};

export { useTypes, useTypeDetail };

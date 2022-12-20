import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getConvertionUnits,
  createConvertionUnit,
  updateConvertionUnit,
  deleteConvertionUnit,
} from '../../clientv2/convertionUnitClient';

export const useGetConvertionUnits = (queryParams, options) => {
  const fetchData = () => {
    return getConvertionUnits(queryParams);
  };

  return useQuery(['convertion-units', 'list', queryParams], fetchData, options);
};

export const useCreateConvertionUnit = (options) => {
  return useMutation(async (body) => {
    const response = await createConvertionUnit(body);

    if (response?.isSuccess) {
      return response;
    }

    throw response;
  }, options);
};

export const useEditConvertionUnit = (id, options) => {
  return useMutation(async (body) => {
    const response = await updateConvertionUnit(id, body);

    if (response?.isSuccess) {
      return response;
    }

    throw response;
  }, options);
};

export const useDeleteConvertionUnit = () => {
  return useMutation(async (id) => {
    const response = await deleteConvertionUnit(id);

    if (response?.isSuccess) {
      return response;
    }

    throw response;
  });
};

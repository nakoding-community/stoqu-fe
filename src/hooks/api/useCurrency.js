import { useMutation, useQuery } from '@tanstack/react-query';
import { editCurrency, getCurrencies } from '../../clientv2/currencyClient';

export const useGetCurrencies = (options) => {
  const fetchData = () => {
    return getCurrencies();
  };

  return useQuery(['currencies', 'list'], fetchData, options);
};

export const useEditCurrency = (id) => {
  return useMutation(async (body) => {
    const response = await editCurrency(id, body);

    if (response?.isSuccess) {
      return response;
    }

    throw response;
  });
};

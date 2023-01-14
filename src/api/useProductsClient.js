import { useQuery } from '@tanstack/react-query';
import { getProducts, getProductDetail } from '../client/productsClient';

import KEY from '../constant/queryKey';

const useProducts = (queryParams) => {
  const fetchProducts = ({ signal }) => {
    return getProducts(queryParams, signal);
  };

  return useQuery([KEY.products.all, queryParams], fetchProducts);
};

const useProductDetail = (productId, queryConfig = {}) => {
  const fetchProductDetail = () => {
    return getProductDetail(productId);
  };

  return useQuery([KEY.products.detail, productId], fetchProductDetail, {
    staleTime: Infinity,
    ...queryConfig,
  });
};

export { useProducts, useProductDetail };

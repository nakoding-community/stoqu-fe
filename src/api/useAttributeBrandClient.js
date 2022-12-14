import { useQuery } from '@tanstack/react-query';
import { getBrandDetail, getBrands } from '../client/brandsClient';

import KEY from '../constant/queryKey';

const useAttributeBrands = (queryParams) => {
  const fetchBrands = ({ signal }) => {
    return getBrands(queryParams, signal);
  };

  return useQuery([KEY.attribute.brands.all, queryParams], fetchBrands, {
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

const useAttributeBrandDetail = (brandId, queryConfig = {}) => {
  const fetchBrandDetail = () => {
    return getBrandDetail(brandId);
  };

  return useQuery([KEY.attribute.brands.detail, brandId], fetchBrandDetail, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...queryConfig,
  });
};

export { useAttributeBrands, useAttributeBrandDetail };

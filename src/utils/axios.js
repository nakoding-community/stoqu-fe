import axios from 'axios';
import capitalize from 'lodash/capitalize';
import { camelizeKeys, decamelizeKeys } from 'humps';
import { toast } from 'react-toastify';
// config
import { HOST_API } from '../config';

const axiosInstance = axios.create({
  baseURL: HOST_API,
});

axiosInstance.interceptors.request.use((config) => {
  const newConfig = { ...config };

  const token = localStorage.getItem('accessToken');
  if (token) {
    newConfig.headers.Authorization = `Bearer ${token}`;
  }

  if (config.params) {
    const newParams = { ...config.params };
    // eslint-disable-next-line array-callback-return
    Object.keys(newParams).map((key) => {
      // eslint-disable-next-line no-unused-expressions
      !newParams[key] && delete newParams[key];
    });
    newConfig.params = decamelizeKeys(newParams);
  }

  if (config.data) {
    newConfig.data = decamelizeKeys(config.data);
  }

  return newConfig;
});

const onSuccess = (response) => {
  return {
    data: camelizeKeys(response.data.data),
    meta: camelizeKeys(response.data.meta),
    statusCode: response.status,
    isSuccess: true,
  };
};

const onError = (error) => {
  if (error?.code !== 'ERR_CANCELED') {
    toast.error(capitalize(error?.response?.data?.meta?.message || 'Something went wrong'));
  }

  Promise.reject((error?.response && error?.response?.data) || 'Something went wrong');
  return {
    data: null,
    meta: null,
    statusCode: error?.response?.status,
    isSuccess: false,
    error: camelizeKeys(error?.response?.data),
  };
};

axiosInstance.interceptors.response.use(onSuccess, onError);

export default axiosInstance;

import axios from '../utils/axios';

export const getStockHistory = (params, signal) => {
  return axios.get('stocks/history', { params, signal });
};

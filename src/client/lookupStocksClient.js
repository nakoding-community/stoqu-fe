import axios from '../utils/axios';

export const getLookupStocks = (params) => {
  return axios.get('lookups/stock', { params });
};

export const getLookupStocksProduct = (params) => {
  return axios.get('lookups/order-trx', { params });
};

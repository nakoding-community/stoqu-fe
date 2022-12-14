import axios from '../utils/axios';

export const createStockTransaction = (body) => {
  return axios.post('stocks/transaction', body);
};

export const getStocks = (params) => {
  return axios.get('stocks', { params });
};

export const getStocksHistory = (params, signal) => {
  return axios.get('stock-histories', { params, signal });
};

export const editStock = (id, body) => {
  return axios.put(`stocks/${id}`, body);
};

export const deleteStock = (id) => {
  return axios.delete(`stocks/${id}`);
};

export const stockConvertion = (body) => {
  return axios.post('stocks/convertion', body);
};

export const checkStockStatus = (body) => {
  return axios.post('stocks/check/status', body);
};

export const getOrderSync = (body) => {
  return axios.post('stocks/check/order-sync', body);
};

import axios from '../utils/axios';

export const getStocks = (params, signal) => {
  return axios.get('stocks', { params, signal });
};

export const stockConvertion = (body) => {
  return axios.put(`stocks/convertion`, body);
};

export const stockMovement = (body) => {
  return axios.put(`stocks/movement`, body);
};

export const stockTransaction = (body) => {
  return axios.put(`stocks/transaction`, body);
};

export const getStockById = (id, params) => {
  return axios.get(`stocks/${id}`, { params });
};

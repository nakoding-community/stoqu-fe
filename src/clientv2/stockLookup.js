import axios from '../utils/axios';

export const getStockLookups = (params, signal) => {
  return axios.get('stock-lookups', { params, signal });
};

export const createStockLookup = (body) => {
  return axios.post('stock-lookups', body);
};

export const getStockLookupById = (id, params) => {
  return axios.get(`stock-lookups/${id}`, { params });
};

export const updateStockLookup = (id, body) => {
  return axios.put(`stock-lookups/${id}`, body);
};

export const deleteStockLookup = (id) => {
  return axios.delete(`stock-lookups/${id}`);
};

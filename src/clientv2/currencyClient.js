import axios from '../utils/axios';

export const getCurrencies = (params, signal) => {
  return axios.get('currencies', { params, signal });
};

export const createCurrency = (body) => {
  return axios.post('currencies', body);
};

export const convertCurrency = (body) => {
  return axios.post(`currencies/convert`, body);
};

export const getCurrencyById = (id) => {
  return axios.get(`currencies/${id}`);
};

export const editCurrency = (id, body) => {
  return axios.put(`currencies/${id}`, body);
};

export const deleteCurrency = (id) => {
  return axios.delete(`currencies/${id}`);
};

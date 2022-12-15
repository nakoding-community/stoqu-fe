import axios from '../utils/axios';

export const getProducts = (params, signal) => {
  return axios.get('products', { params, signal });
};

export const createProduct = (body) => {
  return axios.post('products', body);
};

export const getProductById = (id, params) => {
  return axios.get(`products/${id}`, { params });
};

export const updateProduct = (id, body) => {
  return axios.put(`products/${id}`, body);
};

export const deleteProduct = (id) => {
  return axios.delete(`products/${id}`);
};

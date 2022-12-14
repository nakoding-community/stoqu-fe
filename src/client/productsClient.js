import axios from '../utils/axios';

export const createProducts = (body) => {
  return axios.post('products', body);
};

export const getProducts = (params, signal) => {
  return axios.get('products', { params, signal });
};

export const getProductDetail = (id, params) => {
  return axios.get(`products/${id}`, { params });
};

export const editProduct = (id, body) => {
  return axios.put(`products/${id}`, body);
};

export const deleteProduct = (id) => {
  return axios.delete(`products/${id}`);
};

export const searchProductType = (params) => {
  return axios.get('products/search/type', { params });
};

export const getProductCountEstimation = (orderCode, productCode) => {
  return axios.get(`orders/summaries-total/${orderCode}/${productCode}`);
};

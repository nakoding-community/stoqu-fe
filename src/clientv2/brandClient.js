import axios from '../utils/axios';

export const getBrands = (params, signal) => {
  return axios.get('brands', { params, signal });
};

export const createBrand = (body) => {
  return axios.post('brands', body);
};

export const getBrandById = (id, params) => {
  return axios.get(`brands/${id}`, { params });
};

export const updateBrand = (id, body) => {
  return axios.put(`brands/${id}`, body);
};

export const deleteBrand = (id) => {
  return axios.delete(`brands/${id}`);
};

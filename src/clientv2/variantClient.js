import axios from '../utils/axios';

export const getVariants = (params, signal) => {
  return axios.get('variants', { params, signal });
};

export const createVariant = (body) => {
  return axios.post('variants', body);
};

export const getVariantById = (id, params) => {
  return axios.get(`variants/${id}`, { params });
};

export const updateVariant = (id, body) => {
  return axios.put(`variants/${id}`, body);
};

export const deleteVariant = (id) => {
  return axios.delete(`variants/${id}`);
};

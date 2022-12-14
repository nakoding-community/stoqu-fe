import axios from '../utils/axios';

export const getVariants = (params) => {
  return axios.get('variants', { params });
};

export const createVariant = (body) => {
  return axios.post('variants', body);
};

export const editVariant = (id, body) => {
  return axios.put(`variants/${id}`, body);
};

export const deleteVariant = (id) => {
  return axios.delete(`variants/${id}`);
};

import axios from '../utils/axios';

export const createType = (body) => {
  return axios.post('types', body);
};

export const getTypes = (params, signal) => {
  return axios.get('types', { params, signal });
};

export const getTypeDetail = (id, params) => {
  return axios.get(`types/${id}`, { params });
};

export const editType = (id, body) => {
  return axios.put(`types/${id}`, body);
};

export const deleteType = (id) => {
  return axios.delete(`types/${id}`);
};

import axios from '../utils/axios';

export const getUnits = (params, signal) => {
  return axios.get('units', { params, signal });
};

export const createUnit = (body) => {
  return axios.post('units', body);
};

export const getUnitById = (id, params) => {
  return axios.get(`units/${id}`, { params });
};

export const updateUnit = (id, body) => {
  return axios.put(`units/${id}`, body);
};

export const deleteUnit = (id) => {
  return axios.delete(`units/${id}`);
};

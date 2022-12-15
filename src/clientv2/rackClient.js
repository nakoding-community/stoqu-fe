import axios from '../utils/axios';

export const getRacks = (params, signal) => {
  return axios.get('racks', { params, signal });
};

export const createRack = (body) => {
  return axios.post('racks', body);
};

export const getRackById = (id, params) => {
  return axios.get(`racks/${id}`, { params });
};

export const updateRack = (id, body) => {
  return axios.put(`racks/${id}`, body);
};

export const deleteRack = (id) => {
  return axios.delete(`racks/${id}`);
};

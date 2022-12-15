import axios from '../utils/axios';

export const getRoles = (params, signal) => {
  return axios.get('roles', { params, signal });
};

export const createRoles = (body) => {
  return axios.post('roles', body);
};

export const getRoleById = (id, params) => {
  return axios.get(`roles/${id}`, { params });
};

export const updateRole = (id, body) => {
  return axios.put(`roles/${id}`, body);
};

export const deleteRole = (id) => {
  return axios.delete(`roles/${id}`);
};

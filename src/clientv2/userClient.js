import axios from '../utils/axios';

export const getUsers = (params, signal) => {
  return axios.get('users', { params, signal });
};

export const createUser = (body) => {
  return axios.post('users', body);
};

export const getUserById = (id, params) => {
  return axios.get(`users/${id}`, { params });
};

export const updateUser = (id, body) => {
  return axios.put(`users/${id}`, body);
};

export const deleteUser = (id) => {
  return axios.delete(`users/${id}`);
};

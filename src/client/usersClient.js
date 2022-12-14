import axios from '../utils/axios';

export const createUser = (body) => {
  return axios.post('users', body);
};

export const getUsers = (params) => {
  return axios.get('users', { params });
};

export const editUser = (id, body) => {
  return axios.put(`users/${id}`, body);
};

export const deleteUser = (id) => {
  return axios.delete(`users/${id}`);
};

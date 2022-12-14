import axios from '../utils/axios';

export const getRoles = (params) => {
  return axios.get('roles', { params });
};

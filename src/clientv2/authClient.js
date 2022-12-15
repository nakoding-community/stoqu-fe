import axios from '../utils/axios';

export const loginUser = (body) => {
  return axios.post('auth/login', body);
};

export const registerUser = (body) => {
  return axios.post('auth/register', body);
};

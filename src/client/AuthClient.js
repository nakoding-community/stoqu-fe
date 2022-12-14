import axios from '../utils/axios';

export const loginUser = (body) => {
  return axios.post('auth/login', body);
};

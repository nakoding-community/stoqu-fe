import axios from '../utils/axios';

export const creteConvertion = (body) => {
  return axios.post('convertions', body);
};

export const getConvertions = (params) => {
  return axios.get('convertions', { params });
};

export const editConvertion = (id, body) => {
  return axios.put(`convertions/${id}`, body);
};

export const deleteConvertion = (id) => {
  return axios.delete(`convertions/${id}`);
};

import axios from '../utils/axios';

export const getConvertionUnits = (params, signal) => {
  return axios.get('convertion-units', { params, signal });
};

export const createConvertionUnit = (body) => {
  return axios.post('convertion-units', body);
};

export const getConvertionUnitById = (id, params) => {
  return axios.get(`convertion-units/${id}`, { params });
};

export const updateConvertionUnit = (id, body) => {
  return axios.put(`convertion-units/${id}`, body);
};

export const deleteConvertionUnit = (id) => {
  return axios.delete(`convertion-units/${id}`);
};

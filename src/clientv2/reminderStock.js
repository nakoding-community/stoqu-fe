import axios from '../utils/axios';

export const getReminderStocks = (params, signal) => {
  return axios.get('reminder-stocks', { params, signal });
};

export const createReminderStock = (body) => {
  return axios.post('reminder-stocks', body);
};

export const getReminderStockById = (id, params) => {
  return axios.get(`reminder-stocks/${id}`, { params });
};

export const updateReminderStock = (id, body) => {
  return axios.put(`reminder-stocks/${id}`, body);
};

export const deleteReminderStock = (id) => {
  return axios.delete(`reminder-stocks/${id}`);
};

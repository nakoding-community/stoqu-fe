import axios from '../utils/axios';

export const getReminderStockHistories = (params, signal) => {
  return axios.get('reminder-stock-histories', { params, signal });
};

export const updateBulkReadReminderStockHistories = (body) => {
  return axios.put('reminder-stock-histories/bulk-read', body);
};

export const getCountUnreadReminderStockHistory = (params, signal) => {
  return axios.get('reminder-stock-histories/count-read', { params, signal });
};

export const getReminderStockHistoryById = (id, params) => {
  return axios.get(`reminder-stock-histories/${id}`, { params });
};

export const updateReminderStockHistory = (id, body) => {
  return axios.put(`reminder-stock-histories/${id}`, body);
};

export const deleteReminderStockHistory = (id) => {
  return axios.delete(`reminder-stock-histories/${id}`);
};

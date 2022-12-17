import axios from '../utils/axios';

export const getReminderStockHistories = (params) => {
  return axios.get('reminder-stock-histories', { params });
};

export const updateBulkReadReminderStockHistories = (body) => {
  return axios.put('reminder-stock-histories/bulk-read', body);
};

export const getCountUnreadReminderStockHistory = (params) => {
  return axios.get('reminder-stock-histories/count-unread', { params });
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

import axios from '../utils/axios';

export const getReminderStock = (params) => {
  return axios.get('reminder/stock', { params });
};

export const editReminderStock = (body) => {
  return axios.put('reminder/stock', body);
};

export const getReminderNotification = (params) => {
  return axios.get('reminder/stock/history', { params });
};

export const getUnreadCountNotification = () => {
  return axios.get('reminder/stock/history/count/unread');
};

export const readNotification = (body) => {
  return axios.put('reminder/stock/history/read', body);
};

import axios from '../utils/axios';

export const getOrders = (params) => {
  return axios.get('orders', { params });
};

export const upsertOrder = (body) => {
  return axios.put('orders', body);
};

export const getOrderById = (id, params) => {
  return axios.get(`orders/${id}`, { params });
};

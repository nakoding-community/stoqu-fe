import axios from '../utils/axios';

export const getOrders = (params) => {
  return axios.get('orders', { params });
};

export const getOrderDetail = (id, params) => {
  return axios.get(`orders/${id}`, { params });
};

export const getOrdersReport = (params) => {
  return axios.get('orders/report', { params });
};

export const getOrdersReportSummary = (params) => {
  return axios.get('reports/summary', { params });
};

export const downloadOrderXls = (config) => {
  return axios.get('orders/report/excel', config);
};

export const createOrder = (body) => {
  return axios.post('orders', body);
};

export const updateOrder = (id, body) => {
  return axios.put(`orders/${id}`, body);
};

export const createOrderProduct = (body) => {
  return axios.post('orders/item', body);
};

export const deleteOrderProduct = (id) => {
  return axios.delete(`orders/item/${id}`);
};

export const syncProductOrder = (orderId, orderTrxItemId) => {
  return axios.put(`orders/${orderId}/item-stock-sync/${orderTrxItemId}`);
};

export const readOrder = (id) => {
  return axios.put(`orders/${id}/read`);
};

export const cancelOrder = (id) => {
  return axios.put(`orders/${id}/cancel`);
};

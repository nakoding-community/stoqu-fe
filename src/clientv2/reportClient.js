import axios from '../utils/axios';

export const getReportOrderProducts = (params, signal) => {
  return axios.get('reports/order-products', { params, signal });
};

export const getReportOrderProductsExcel = (params, signal) => {
  return axios.get('reports/order-products/excel', { params, signal });
};

export const getReportOrders = (params, signal) => {
  return axios.get('reports/orders', { params, signal });
};

export const getReportOrdersExcel = (params, signal) => {
  return axios.get('reports/orders/excel', { params, signal });
};

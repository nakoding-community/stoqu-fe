import axios from '../utils/axios';

export const getDashboardCommon = () => {
  return axios.get('dashboards/common');
};

export const getDashboardOrderLastWeek = () => {
  return axios.get('dashboards/order-last-week');
};

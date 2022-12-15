import axios from '../utils/axios';

export const getDashboardCount = (params) => {
  return axios.get('dashboards/count', { params });
};

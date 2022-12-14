import axios from '../utils/axios';

export const getUnits = () => {
  return axios.get('units');
};

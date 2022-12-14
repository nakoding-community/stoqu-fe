import axios from '../utils/axios';

export const getDollarToIdrPrice = (body) => {
  return axios.post('currencies/convert', body);
};

export const getCurrencies = () => {
  return axios.get('currencies');
};

export const editCurrencies = (id, body) => {
  return axios.put(`currencies/${id}`, body);
};

import axios from '../utils/axios';

export const getPackets = (params, signal) => {
  return axios.get('packets', { params, signal });
};

export const createPacket = (body) => {
  return axios.post('packets', body);
};

export const getPacketById = (id, params) => {
  return axios.get(`packets/${id}`, { params });
};

export const updatePacket = (id, body) => {
  return axios.put(`packets/${id}`, body);
};

export const deletePacket = (id) => {
  return axios.delete(`packets/${id}`);
};

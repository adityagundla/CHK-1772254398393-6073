import axios from 'axios';

const API_BASE = 'http://127.0.0.1:5000';

export const registerData = async (name, description) => {
  const res = await axios.post(`${API_BASE}/register`, { name, description });
  return res.data;
};

export const grantAccess = async (dataId, user) => {
  const res = await axios.post(`${API_BASE}/grant-access`, { dataId, user });
  return res.data;
};

export const revokeAccess = async (dataId, user) => {
  const res = await axios.post(`${API_BASE}/revoke-access`, { dataId, user });
  return res.data;
};

export const checkAccess = async (dataId, user) => {
  const res = await axios.get(`${API_BASE}/check-access`, { params: { dataId, user } });
  return res.data;
};

export const fetchOriginalData = async (dataId) => {
  const res = await axios.get(`${API_BASE}/data/${dataId}`);
  return res.data;
};

export const getRequestCount = async (dataId) => {
  const res = await axios.get(`${API_BASE}/request-count`, { params: { dataId } });
  return res.data;
};

export const fetchAllData = async () => {
  const res = await axios.get(`${API_BASE}/all-data`);
  return res.data;
};
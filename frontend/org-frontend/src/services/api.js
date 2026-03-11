import axios from 'axios';

const API_BASE = 'http://127.0.0.1:5000';

export const requestAccess = async (requestData) => {
  const res = await axios.post(`${API_BASE}/request-access`, requestData);
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

export const fetchAllData = async (userId) => {
  const res = await axios.get(`${API_BASE}/all-data`, { params: { userId } });
  return res.data;
};

export const getAccessRequests = async (params) => {
  const res = await axios.get(`${API_BASE}/get-access-requests`, { params });
  return res.data;
};

export const searchUsers = async (term) => {
  const res = await axios.get(`${API_BASE}/users/search`, { params: { term } });
  return res.data;
};

export const getUser = async (userId) => {
  const res = await axios.get(`${API_BASE}/users/${userId}`);
  return res.data;
};
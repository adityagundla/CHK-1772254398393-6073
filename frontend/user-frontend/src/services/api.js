import axios from 'axios';

const API_BASE = 'http://127.0.0.1:5000';

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await axios.post(`${API_BASE}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

export const registerData = async (name, description, dataHash, userId, type, size) => {
  const res = await axios.post(`${API_BASE}/register`, { name, description, dataHash, userId, type, size });
  return res.data;
};

export const grantAccess = async (dataId, user, requestId) => {
  const res = await axios.post(`${API_BASE}/grant-access`, { dataId, user, requestId });
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

export const fetchAllData = async (userId) => {
  const res = await axios.get(`${API_BASE}/all-data`, { params: { userId } });
  return res.data;
};

export const getAccessRequests = async (params) => {
  const res = await axios.get(`${API_BASE}/get-access-requests`, { params });
  return res.data;
};

export const logAccess = async (logData) => {
  const res = await axios.post(`${API_BASE}/log-access`, logData);
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await axios.post(`${API_BASE}/users/register`, userData);
  return res.data;
};
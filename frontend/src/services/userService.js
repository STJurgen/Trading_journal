import api from './api';

export const getProfile = async () => {
  const { data } = await api.get('/users/me');
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.put('/users/me', payload);
  return data;
};

export const getStats = async () => {
  const { data } = await api.get('/users/stats');
  return data;
};

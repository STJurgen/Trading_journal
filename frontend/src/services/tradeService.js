import api from './api';

export const getTrades = async () => {
  const { data } = await api.get('/trades');
  return data;
};

export const getTrade = async (id) => {
  const { data } = await api.get(`/trades/${id}`);
  return data;
};

export const createTrade = async (payload) => {
  const { data } = await api.post('/trades', payload);
  return data;
};

export const updateTrade = async (id, payload) => {
  const { data } = await api.put(`/trades/${id}`, payload);
  return data;
};

export const deleteTrade = async (id) => {
  await api.delete(`/trades/${id}`);
};

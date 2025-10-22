import api from './api';

export const getStrategies = async () => {
  const { data } = await api.get('/strategies');
  return data;
};

export const createStrategy = async (payload) => {
  const { data } = await api.post('/strategies', payload);
  return data;
};

export const updateStrategy = async (id, payload) => {
  const { data } = await api.put(`/strategies/${id}`, payload);
  return data;
};

export const deleteStrategy = async (id) => {
  await api.delete(`/strategies/${id}`);
};

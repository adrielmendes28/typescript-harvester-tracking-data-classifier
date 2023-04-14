import api from './api';

export const fetchTalhoes = async () => {
  try {
    const response = await api.get('/talhoes');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar talhões:', error);
    return [];
  }
};

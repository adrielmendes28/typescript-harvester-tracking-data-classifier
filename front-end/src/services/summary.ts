import api from './api';

export const fetchSummary = async () => {
  try {
    const response = await api.get('/equipment-summary');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar resultado dos status:', error);
    return [];
  }
};

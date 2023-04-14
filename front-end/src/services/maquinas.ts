import api from './api';

export const fetchMaquinas = async (frota?: string, frente?: string, startDate?: string, endDate?: string) => {
  try {
    const response = await api.get(`/last-point`, {
      params: {
        frota,
        frente,
        startDate,
        endDate,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar máquinas:', error);
    return [];
  }
};

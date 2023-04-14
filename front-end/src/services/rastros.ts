import api from "./api";

export const fetchRastros = async (frota?: string, frente?: string, startDate?: string, endDate?: string) => {
  try {
    const response = await api.get("/trails", {
      params: {
        frota,
        frente,
        startDate,
        endDate,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar rastros:", error);
    return [];
  }
};

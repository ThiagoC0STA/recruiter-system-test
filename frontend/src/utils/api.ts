import axios from "axios";

export const api = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Funções para buscar dados
export const getJobs = async () => {
  try {
    const response = await api.get("/api/jobs");
    return response.data.jobs || [];
  } catch (error) {
    console.error("Erro ao buscar vagas:", error);
    return [];
  }
};

export const getApplications = async () => {
  try {
    const response = await api.get("/api/applications");
    return response.data.applications || [];
  } catch (error) {
    console.error("Erro ao buscar candidaturas:", error);
    return [];
  }
};

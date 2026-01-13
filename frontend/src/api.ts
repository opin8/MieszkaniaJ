import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Obsługa błędów autoryzacji (401 i 403)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/";

      localStorage.setItem("auth_message", "Sesja wygasła. Zaloguj się ponownie.");
    }

    return Promise.reject(error);
  }
);

export const login = async (credentials: { username: string; password: string }) => {
  try {
    const response = await api.post("/users/auth/login", credentials);

    const { token } = response.data;

    if (token) {
      localStorage.setItem("token", token);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.setItem("auth_message", "Zostałeś wylogowany.");
  window.location.href = "/";
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

export default api;
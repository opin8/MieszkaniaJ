import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Automatycznie dodaje token JWT do każdego żądania
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Przy błędzie 401 (unauthorized) – wylogowuje użytkownika
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/"; // przekierowanie na stronę logowania
    }
    return Promise.reject(error);
  }
);

// Funkcje pomocnicze
export const login = async (credentials: { username: string; password: string }) => {
  const res = await api.post("/users/auth/login", credentials);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};

export default api;
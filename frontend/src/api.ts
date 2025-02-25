// src/api.ts
import axios, { AxiosError } from "axios";

interface LoginResponse {
    success: boolean;
    message: string;
    token?: string;
}

const instance = axios.create({
    baseURL: "http://localhost:8080/api", // Upewnij się, że port i ścieżka są poprawne
});

// Debugowanie żądań
instance.interceptors.request.use((config) => {
    console.log("Wysyłane żądanie:", config.url, config.headers);
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    console.error("Błąd w żądaniu:", error);
    return Promise.reject(error);
});

// Debugowanie odpowiedzi
instance.interceptors.response.use(
    (response) => {
        console.log("Odpowiedź z serwera:", response.data);
        return response;
    },
    (error: AxiosError) => {
        console.error("Błąd odpowiedzi:", error);
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export const login = async (credentials: { username: string; password: string }) => {
    const response = await fetch("/api/users/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        throw new Error("Błąd logowania");
    }

    const data: LoginResponse = await response.json();
    if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        return data;
    } else {
        throw new Error(data.message || "Niepowodzenie logowania");
    }
};

export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem("token");
};

export const logout = () => {
    localStorage.removeItem("token");
};

export default instance;
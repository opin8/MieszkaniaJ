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
    console.log("Próba logowania:", credentials); // ← widać co wysyłasz

    try {
        const response = await instance.post("/users/auth/login", credentials);
        
        console.log("Odpowiedź z backendu:", response.data); // ← widać dokładnie co przysło

        const data = response.data as LoginResponse;

        if (data.success && data.token) {
            localStorage.setItem("token", data.token);
            console.log("Zalogowano! Token zapisany.");
            return data;
        } else {
            console.error("Logowanie nieudane – brak tokena lub success=false");
            throw new Error(data.message || "Niepowodzenie logowania");
        }
    } catch (error: any) {
        // Tu zawsze zobaczysz dokładny błąd
        if (error.response) {
            console.error("Błąd z serwera:", error.response.status, error.response.data);
        } else if (error.request) {
            console.error("Brak odpowiedzi od serwera – czy backend działa na 8080?");
        } else {
            console.error("Inny błąd:", error.message);
        }
        throw error;
    }
};

export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem("token");
};

export const logout = () => {
    localStorage.removeItem("token");
};

export default instance;
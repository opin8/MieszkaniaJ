interface LoginResponse {
    success: boolean;
    message: string;
    token?: string;
}

export const login = async (credentials: { username: string; password: string }) => {
    const response = await fetch("/api/users/login", {
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
    if (data.success) {
        localStorage.setItem("token", data.token || "");
        return data;
    } else {
        throw new Error(data.message);
    }
};
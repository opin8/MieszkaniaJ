import { useState } from "react";
import { login } from "./api";
import { useNavigate } from "react-router-dom";

function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Tutaj `login` zwraca token JWT, który zapisujemy w localStorage
            await login({ username, password });
            navigate("/dashboard");
        } catch (err) {
            setError("Niepoprawne dane logowania");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nazwa użytkownika"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Hasło"
            />
            <button type="submit">Zaloguj</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
}

export default LoginForm;
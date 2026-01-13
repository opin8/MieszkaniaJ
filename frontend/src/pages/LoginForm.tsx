import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api"; // lub odpowiednia ścieżka
import "./LoginForm.css";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Pokazujemy komunikat po przekierowaniu z powodu wygaśnięcia sesji
  useEffect(() => {
    const message = localStorage.getItem("auth_message");
    if (message) {
      setError(message);
      localStorage.removeItem("auth_message");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ username, password });
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.status === 401
          ? "Nieprawidłowa nazwa użytkownika lub hasło"
          : "Błąd połączenia z serwerem. Spróbuj ponownie.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>MieszkaniaJ</h1>
        <p className="subtitle">Zaloguj się do systemu</p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Nazwa użytkownika"
            value={username}
            onChange={(e) => setUsername(e.target.value.trim())}
            required
            disabled={loading}
            autoFocus
          />
          <input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logowanie..." : "Zaloguj się"}
          </button>

          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
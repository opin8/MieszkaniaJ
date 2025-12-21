import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "./api";
import "./LoginForm.css";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ username, password });
      navigate("/dashboard");
    } catch (err) {
      setError("Niepoprawne dane logowania");
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
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
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

        <div className="demo-credentials">
          <p>Dane testowe:</p>
          <p><strong>admin</strong> / admin123</p>
          <p><strong>user1</strong> / haslo123</p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
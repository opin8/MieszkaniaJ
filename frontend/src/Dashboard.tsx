import { useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "./api";

function Dashboard() {
    const navigate = useNavigate();

    if (!isAuthenticated()) {
        navigate("/"); // Jeśli nie ma tokena, wracamy do logowania
    }

    return (
        <div>
            <h1>Witaj w aplikacji MieszkaniaJ!</h1>
            <button
                onClick={() => {
                    logout();
                    navigate("/");
                }}
            >
                Wyloguj
            </button>
        </div>
    );
}

export default Dashboard;

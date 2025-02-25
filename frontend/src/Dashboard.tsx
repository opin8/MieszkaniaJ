// src/Dashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "./api";
import axios from "./api"; // Użyj skonfigurowanego axios
import './Dashboard.css';

// Zdefiniuj typ Apartment na podstawie modelu Java
interface Apartment {
    id: number;
    city: string;
    postalCode: string;
    street: string;
    houseNumber: number;
    apartmentNumber: number;
    area: number;
    numberOfRooms: number;
    storageUnit: boolean;
    parkingSpotNumber: number | null; // Może być null lub undefined, jeśli API różni się
}

function Dashboard() {
    const navigate = useNavigate();
    const [apartments, setApartments] = useState<Apartment[]>([]);
    const [loading, setLoading] = useState(true); // Dodaj stan ładowania
    const [error, setError] = useState<string | null>(null); // Dodaj stan błędu

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/");
            return;
        }

        const fetchApartments = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get<Apartment[]>("/apartments");
                console.log("Odpowiedź z API (surowe dane):", response.data);
                if (Array.isArray(response.data)) {
                    setApartments(response.data);
                } else {
                    console.warn("Otrzymano nieoczekiwany format danych:", response.data);
                    setApartments([]);
                }
            } catch (error: any) { // Użyj 'any' lub 'AxiosError' po imporcie
                console.error("Error fetching apartments:", error);
                if (error.response) {
                    console.error("Status:", error.response.status);
                    console.error("Data:", error.response.data);
                    setError(`Błąd pobierania danych: Status ${error.response.status}`);
                } else {
                    setError("Błąd połączenia z serwerem");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchApartments();
    }, [navigate]);

    const handleApartmentClick = (id: number) => {
        navigate(`/apartment/${id}`);
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="dashboard">
            <h1>Witaj w aplikacji MieszkaniaJ!</h1>
            <button onClick={handleLogout}>Wyloguj</button>

            <div className="apartments-list">
                {loading ? (
                    <p>Ładowanie mieszkań...</p>
                ) : error ? (
                    <p style={{ color: "red" }}>{error}</p>
                ) : apartments.length > 0 ? (
                    apartments.map((apartment) => (
                        <button
                            key={apartment.id}
                            className="apartment-button"
                            onClick={() => handleApartmentClick(apartment.id)}
                        >
                            <p>Miasto: {apartment.city}</p>
                            <p>Kod pocztowy: {apartment.postalCode}</p>
                            <p>Ulica: {apartment.street} {apartment.houseNumber}/{apartment.apartmentNumber}</p>
                            <p>Powierzchnia: {apartment.area} m²</p>
                            <p>Pokoje: {apartment.numberOfRooms}</p>
                            <p>Przechowalnia: {apartment.storageUnit ? "Tak" : "Nie"}</p>
                            {apartment.parkingSpotNumber !== null && apartment.parkingSpotNumber !== undefined && (
                                <p>Miejsce parkingowe: {apartment.parkingSpotNumber}</p>
                            )}
                        </button>
                    ))
                ) : (
                    <p>Brak dostępnych mieszkań.</p>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
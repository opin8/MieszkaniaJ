import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";  // TYLKO TEN JEDEN
import "./Dashboard.css";

// Dodaj tę funkcję – bo jej nie było w nowym api.ts
const logout = () => {
  localStorage.removeItem("token");
};

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
  parkingSpotNumber: number | null;
}

function Dashboard() {
  const navigate = useNavigate();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Apartment[]>("/apartments")
      .then(res => {
        setApartments(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();           // teraz działa!
    navigate("/");
  };

  if (loading) return <div className="loading">Ładowanie mieszkań...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>MieszkaniaJ – Twoje mieszkania</h1>
        <button onClick={() => navigate("/add")} className="add-btn">
         + Dodaj mieszkanie
        </button>
        <button onClick={handleLogout} className="logout-btn">Wyloguj się</button>
      </header>

      <div className="apartments-grid">
        {apartments.map((apt) => (
          <div
            key={apt.id}
            className="apartment-card"
            onClick={() => navigate(`/apartment/${apt.id}`)}
          >
            <div className="card-city">{apt.city}</div>
            <div className="card-address">
              {apt.street} {apt.houseNumber}/{apt.apartmentNumber}
            </div>
            <div className="card-details">
              <span>{apt.area} m²</span>
              <span>•</span>
              <span>{apt.numberOfRooms} pokoje</span>
            </div>
            <div className="card-features">
              {apt.storageUnit && <span>Przechowalnia</span>}
              {apt.parkingSpotNumber && <span>Miejsce parkingowe #{apt.parkingSpotNumber}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
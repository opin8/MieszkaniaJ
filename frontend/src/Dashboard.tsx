import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import "./Dashboard.css";

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
  parkingSpotNumber?: number | null;
  balconyTerraceArea?: number | null;
  garageNumber?: string | null;
}

function Dashboard() {
  const navigate = useNavigate();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Apartment[]>("/apartments")
      .then(res => {
        setApartments(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
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
        <button onClick={handleLogout} className="logout-btn">
          Wyloguj się
        </button>
      </header>

      <div className="apartments-list">
        {apartments.map((apt) => (
          <div
            key={apt.id}
            className="apartment-item"  // Nowa klasa dla listy
            onClick={() => navigate(`/apartment/${apt.id}`)}
          >
            <div className="item-city">{apt.city}</div>
            <div className="item-address">
              {apt.street} {apt.houseNumber}/{apt.apartmentNumber}
            </div>
            <div className="item-details">
              <span>{apt.area} m²</span>
              <span>•</span>
              <span>{apt.numberOfRooms} pokoje</span>
            </div>
            <div className="item-features">
              {apt.storageUnit && <span>Przechowalnia</span>}
              {apt.parkingSpotNumber && <span>Miejsce parkingowe #{apt.parkingSpotNumber}</span>}
              {apt.balconyTerraceArea && <span>Balkon/taras: {apt.balconyTerraceArea} m²</span>}
              {apt.garageNumber && <span>Garaż: {apt.garageNumber}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
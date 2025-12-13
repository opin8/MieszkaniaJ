import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import "./AddApartment.css";

function AddApartment() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    city: "", postalCode: "", street: "", houseNumber: "", apartmentNumber: "",
    area: "", numberOfRooms: "", storageUnit: false, parkingSpotNumber: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/apartments", {
  city: form.city,
  postalCode: form.postalCode,
  street: form.street,
  houseNumber: Number(form.houseNumber),
  apartmentNumber: Number(form.apartmentNumber),
  area: Number(form.area),
  numberOfRooms: Number(form.numberOfRooms),
  storageUnit: form.storageUnit,
  parkingSpotNumber: form.parkingSpotNumber ? Number(form.parkingSpotNumber) : null
});
      navigate("/dashboard");
    } catch (err) {
      alert("Błąd dodawania mieszkania");
    }
  };

  return (
    <div className="add-container">
      <button onClick={() => navigate("/dashboard")} className="back-btn">← Powrót</button>
      <div className="add-card">
        <h1>Dodaj nowe mieszkanie</h1>
        <form onSubmit={handleSubmit}>
          <input placeholder="Miasto" required value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
          <input placeholder="Kod pocztowy" required value={form.postalCode} onChange={e => setForm({...form, postalCode: e.target.value})} />
          <input placeholder="Ulica" required value={form.street} onChange={e => setForm({...form, street: e.target.value})} />
          <input placeholder="Numer domu" type="number" required value={form.houseNumber} onChange={e => setForm({...form, houseNumber: e.target.value})} />
          <input placeholder="Numer mieszkania" type="number" required value={form.apartmentNumber} onChange={e => setForm({...form, apartmentNumber: e.target.value})} />
          <input placeholder="Powierzchnia (m²)" type="number" step="0.1" required value={form.area} onChange={e => setForm({...form, area: e.target.value})} />
          <input placeholder="Liczba pokoi" type="number" required value={form.numberOfRooms} onChange={e => setForm({...form, numberOfRooms: e.target.value})} />
          <label>
            <input type="checkbox" checked={form.storageUnit} onChange={e => setForm({...form, storageUnit: e.target.checked})} />
            Przechowalnia
          </label>
          <input placeholder="Numer miejsca parkingowego (opcjonalne)" type="number" value={form.parkingSpotNumber} onChange={e => setForm({...form, parkingSpotNumber: e.target.value})} />
          <button type="submit" className="submit-btn">Dodaj mieszkanie</button>
        </form>
      </div>
    </div>
  );
}

export default AddApartment;
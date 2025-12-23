import { useState, useEffect } from "react";
import api from "../../api";
import "./ApartmentsTab.css";

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

function ApartmentsTab() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [editForm, setEditForm] = useState<Apartment | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [newApartment, setNewApartment] = useState<Partial<Apartment>>({
    city: "",
    postalCode: "",
    street: "",
    houseNumber: undefined,
    apartmentNumber: undefined,
    area: undefined,
    numberOfRooms: undefined,
    storageUnit: false,
    parkingSpotNumber: null,
    balconyTerraceArea: null,
    garageNumber: null,
  });

  useEffect(() => {
    api
      .get<Apartment[]>("/apartments")
      .then(res => {
        setApartments(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleRowClick = (apt: Apartment) => {
    setSelectedApartment(apt);
    setEditForm({ ...apt });
    setAddMode(false);
  };

  const handleSave = async () => {
    if (!editForm || !editForm.id) return;
    try {
      await api.put(`/apartments/${editForm.id}`, editForm);
      setApartments(apartments.map(a => (a.id === editForm.id ? editForm : a)));
      setSelectedApartment(null);
      setEditForm(null);
    } catch (err) {
      alert("Błąd zapisu");
    }
  };

  const handleAdd = async () => {
    try {
      const response = await api.post<Apartment>("/apartments", newApartment);
      setApartments([...apartments, response.data]);
      setAddMode(false);
      setNewApartment({
        city: "",
        postalCode: "",
        street: "",
        houseNumber: undefined,
        apartmentNumber: undefined,
        area: undefined,
        numberOfRooms: undefined,
        storageUnit: false,
        parkingSpotNumber: null,
        balconyTerraceArea: null,
        garageNumber: null,
      });
    } catch (err) {
      alert("Błąd dodawania mieszkania");
    }
  };

  const handleDelete = async () => {
    if (!selectedApartment) return;
    if (!confirm("Czy na pewno usunąć to mieszkanie?")) return;
    try {
      await api.delete(`/apartments/${selectedApartment.id}`);
      setApartments(apartments.filter(a => a.id !== selectedApartment.id));
      setSelectedApartment(null);
      setEditForm(null);
    } catch (err) {
      alert("Błąd usuwania");
    }
  };

  const handleClear = () => {
    if (addMode) {
      setNewApartment({
        city: "",
        postalCode: "",
        street: "",
        houseNumber: undefined,
        apartmentNumber: undefined,
        area: undefined,
        numberOfRooms: undefined,
        storageUnit: false,
        parkingSpotNumber: null,
        balconyTerraceArea: null,
        garageNumber: null,
      });
    } else {
      setEditForm(selectedApartment ? { ...selectedApartment } : null);
    }
  };

  if (loading) return <p className="loading">Ładowanie mieszkań...</p>;

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Baza mieszkań</h2>
        <button onClick={() => setAddMode(true)} className="add-btn">
          + Dodaj nowe mieszkanie
        </button>
      </div>

      {/* Tabela mieszkań */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Miejscowość</th>
            <th>Kod pocztowy</th>
            <th>Ulica</th>
            <th>Numer ulicy</th>
            <th>Numer mieszkania</th>
            <th>Metraż [m²]</th>
            <th>Liczba pokoi</th>
            <th>Komórka lokatorska</th>
            <th>Numer miejsca postojowych</th>
            <th>Metraż balkonu/tarasu</th>
            <th>Numer garażu</th>
            <th>ID mieszkania</th>
          </tr>
        </thead>
        <tbody>
          {apartments.map(apt => (
            <tr key={apt.id} onClick={() => handleRowClick(apt)} className="table-row">
              <td>{apt.city}</td>
              <td>{apt.postalCode}</td>
              <td>{apt.street}</td>
              <td>{apt.houseNumber}</td>
              <td>{apt.apartmentNumber}</td>
              <td>{apt.area}</td>
              <td>{apt.numberOfRooms}</td>
              <td>{apt.storageUnit ? "Tak" : "Nie"}</td>
              <td>{apt.parkingSpotNumber || "—"}</td>
              <td>{apt.balconyTerraceArea || "—"}</td>
              <td>{apt.garageNumber || "—"}</td>
              <td>{apt.id}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formularz edycji lub dodawania */}
      {(selectedApartment || addMode) && (
        <div className="edit-panel">
          <h3>{addMode ? "Dodawanie nowego mieszkania" : "Panel edycji"}</h3>
          <div className="edit-form">
            <label>
              Miejscowość
              <input
                value={(addMode ? newApartment.city : editForm?.city) || ""}
                onChange={e => addMode
                  ? setNewApartment({ ...newApartment, city: e.target.value })
                  : setEditForm(editForm ? { ...editForm, city: e.target.value } : null)
                }
              />
            </label>
            <label>
              Kod pocztowy
              <input
                value={(addMode ? newApartment.postalCode : editForm?.postalCode) || ""}
                onChange={e => addMode
                  ? setNewApartment({ ...newApartment, postalCode: e.target.value })
                  : setEditForm(editForm ? { ...editForm, postalCode: e.target.value } : null)
                }
              />
            </label>
            <label>
              Ulica
              <input
                value={(addMode ? newApartment.street : editForm?.street) || ""}
                onChange={e => addMode
                  ? setNewApartment({ ...newApartment, street: e.target.value })
                  : setEditForm(editForm ? { ...editForm, street: e.target.value } : null)
                }
              />
            </label>
            <label>
              Numer ulicy
              <input
                type="number"
                value={(addMode ? newApartment.houseNumber : editForm?.houseNumber) || ""}
                onChange={e => addMode
                  ? setNewApartment({ ...newApartment, houseNumber: Number(e.target.value) })
                  : setEditForm(editForm ? { ...editForm, houseNumber: Number(e.target.value) } : null)
                }
              />
            </label>
            <label>
              Numer mieszkania
              <input
                type="number"
                value={(addMode ? newApartment.apartmentNumber : editForm?.apartmentNumber) || ""}
                onChange={e => addMode
                  ? setNewApartment({ ...newApartment, apartmentNumber: Number(e.target.value) })
                  : setEditForm(editForm ? { ...editForm, apartmentNumber: Number(e.target.value) } : null)
                }
              />
            </label>
            <label>
              Metraż [m²]
              <input
                type="number"
                step="0.1"
                value={(addMode ? newApartment.area : editForm?.area) || ""}
                onChange={e => addMode
                  ? setNewApartment({ ...newApartment, area: Number(e.target.value) })
                  : setEditForm(editForm ? { ...editForm, area: Number(e.target.value) } : null)
                }
              />
            </label>
            <label>
              Liczba pokoi
              <input
                type="number"
                value={(addMode ? newApartment.numberOfRooms : editForm?.numberOfRooms) || ""}
                onChange={e => addMode
                  ? setNewApartment({ ...newApartment, numberOfRooms: Number(e.target.value) })
                  : setEditForm(editForm ? { ...editForm, numberOfRooms: Number(e.target.value) } : null)
                }
              />
            </label>
            <label>
              Komórka lokatorska
              <input
                type="checkbox"
                checked={(addMode ? newApartment.storageUnit : editForm?.storageUnit) || false}
                onChange={e => addMode
                  ? setNewApartment({ ...newApartment, storageUnit: e.target.checked })
                  : setEditForm(editForm ? { ...editForm, storageUnit: e.target.checked } : null)
                }
              />
            </label>
            <label>
              Numer miejsca postojowych
              <input
                value={(addMode ? newApartment.parkingSpotNumber : editForm?.parkingSpotNumber) || ""}
                onChange={e => addMode
                  ? setNewApartment({ ...newApartment, parkingSpotNumber: e.target.value ? Number(e.target.value) : null })
                  : setEditForm(editForm ? { ...editForm, parkingSpotNumber: e.target.value ? Number(e.target.value) : null } : null)
                }
              />
            </label>
            <label>
              Metraż balkonu/tarasu
              <input
                type="number"
                step="0.1"
                value={(addMode ? newApartment.balconyTerraceArea : editForm?.balconyTerraceArea) || ""}
                onChange={e => addMode
                  ? setNewApartment({ ...newApartment, balconyTerraceArea: e.target.value ? Number(e.target.value) : null })
                  : setEditForm(editForm ? { ...editForm, balconyTerraceArea: e.target.value ? Number(e.target.value) : null } : null)
                }
              />
            </label>
            <label>
              Numer garażu
              <input
                value={(addMode ? newApartment.garageNumber : editForm?.garageNumber) || ""}
                onChange={e => addMode
                  ? setNewApartment({ ...newApartment, garageNumber: e.target.value || null })
                  : setEditForm(editForm ? { ...editForm, garageNumber: e.target.value || null } : null)
                }
              />
            </label>

            <div className="edit-buttons">
              <button onClick={addMode ? handleAdd : handleSave} className="save-btn">
                {addMode ? "Dodaj mieszkanie" : "Zapisz edycję"}
              </button>
              <button onClick={handleDelete} className="delete-btn">Usuń rekord</button>
              <button onClick={handleClear} className="clear-btn">Wyczyść pola</button>
              {addMode && <button onClick={() => setAddMode(false)} className="cancel-btn">Anuluj</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApartmentsTab;
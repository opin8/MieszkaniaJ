import { useState, useEffect } from "react";
import api from "../../api";
import { formatDate } from "../../utils/dateUtils";
import "./AgreementsTab.css";

interface Agreement {
  id: number;
  contractor: { id: number; name: string };
  apartment: { id: number; street: string; houseNumber: number };
  category: string;
  dateFrom: string;
  dateTo?: string | null;
  monthlyNetValue: number;
  vatRate: number;
  description?: string | null;
  taxOperation: boolean;
}

interface Contractor {
  id: number;
  name: string;
}

interface Apartment {
  id: number;
  street: string;
  houseNumber: number;
}

function AgreementsTab() {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);
  const [editForm, setEditForm] = useState<Agreement | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [newAgreement, setNewAgreement] = useState<Partial<Agreement>>({
    contractor: { id: 0, name: "" },
    apartment: { id: 0, street: "", houseNumber: 0 },
    category: "",
    dateFrom: "",
    dateTo: null,
    monthlyNetValue: 0,
    vatRate: 0,
    description: null,
    taxOperation: false,
  });

  // Filtry
  const [contractorFilter, setContractorFilter] = useState<number | null>(null);
  const [apartmentFilter, setApartmentFilter] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Listy do filtrów
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agreementsRes, contractorsRes, apartmentsRes] = await Promise.all([
          api.get<Agreement[]>("/agreements"),
          api.get<Contractor[]>("/contractors"),
          api.get<Apartment[]>("/apartments")
        ]);
        setAgreements(agreementsRes.data);
        setContractors(contractorsRes.data);
        setApartments(apartmentsRes.data);
      } catch (err) {
        console.error("Błąd ładowania danych", err);
        setError("Nie udało się załadować danych umów. Sprawdź konsolę.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredAgreements = agreements.filter(a => {
    let match = true;
    if (contractorFilter) match = match && a.contractor.id === contractorFilter;
    if (apartmentFilter) match = match && a.apartment.id === apartmentFilter;
    if (categoryFilter) match = match && a.category === categoryFilter;
    return match;
  });

  const handleRowClick = (agreement: Agreement) => {
    setSelectedAgreement(agreement);
    setEditForm({ ...agreement });
    setAddMode(false);
  };

  const handleSave = async () => {
    if (!editForm || !editForm.id) return;
    try {
      const updated = await api.put<Agreement>(`/agreements/${editForm.id}`, editForm);
      setAgreements(agreements.map(a => (a.id === editForm.id ? updated.data : a)));
      setSelectedAgreement(null);
      setEditForm(null);
    } catch (err) {
      alert("Błąd zapisu umowy");
    }
  };

  const handleAdd = async () => {
    try {
      const response = await api.post<Agreement>("/agreements", newAgreement);
      setAgreements([...agreements, response.data]);
      setAddMode(false);
      setNewAgreement({
        contractor: { id: 0, name: "" },
        apartment: { id: 0, street: "", houseNumber: 0 },
        category: "",
        dateFrom: "",
        dateTo: null,
        monthlyNetValue: 0,
        vatRate: 0,
        description: null,
        taxOperation: false,
      });
    } catch (err) {
      alert("Błąd dodawania umowy");
    }
  };

  const handleDelete = async () => {
    if (!selectedAgreement) return;
    if (!confirm("Czy na pewno usunąć tę umowę?")) return;
    try {
      await api.delete(`/agreements/${selectedAgreement.id}`);
      setAgreements(agreements.filter(a => a.id !== selectedAgreement.id));
      setSelectedAgreement(null);
      setEditForm(null);
    } catch (err) {
      alert("Błąd usuwania umowy");
    }
  };

  const handleClear = () => {
    if (addMode) {
      setNewAgreement({
        contractor: { id: 0, name: "" },
        apartment: { id: 0, street: "", houseNumber: 0 },
        category: "",
        dateFrom: "",
        dateTo: null,
        monthlyNetValue: 0,
        vatRate: 0,
        description: null,
        taxOperation: false,
      });
    } else {
      setEditForm(selectedAgreement ? { ...selectedAgreement } : null);
    }
  };

  if (loading) return <p className="loading">Ładowanie umów...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Baza umów</h2>
        <button onClick={() => setAddMode(true)} className="add-btn">
          + Dodaj nową umowę
        </button>
      </div>

      {/* Filtry */}
      <div className="filters">
        <label>
          Kontrahent:
          <select value={contractorFilter || ""} onChange={e => setContractorFilter(e.target.value ? Number(e.target.value) : null)}>
            <option value="">Wszyscy</option>
            {contractors.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Nieruchomość:
          <select value={apartmentFilter || ""} onChange={e => setApartmentFilter(e.target.value ? Number(e.target.value) : null)}>
            <option value="">Wszystkie</option>
            {apartments.map(n => (
              <option key={n.id} value={n.id}>
                {n.street} {n.houseNumber}
              </option>
            ))}
          </select>
        </label>
        <label>
          Kategoria:
          <select value={categoryFilter || ""} onChange={e => setCategoryFilter(e.target.value || null)}>
            <option value="">Wszystkie</option>
            <option>Czynsz najmu</option>
            <option>Czynsz administracyjny</option>
            <option>Opłaty eksploatacyjne</option>
            <option>Remont/naprawa</option>
            <option>Prąd</option>
            <option>Opłaty bankowe</option>
            <option>Podatek</option>
            <option>Kaucja</option>
            <option>Inne</option>
          </select>
        </label>
      </div>

      {/* Tabela umów */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Kontrahent</th>
            <th>Nieruchomość</th>
            <th>Kategoria umowy</th>
            <th>Data od</th>
            <th>Data do</th>
            <th>Kwota miesięczna</th>
            <th>Stawka VAT</th>
            <th>Opis</th>
            <th>Operacja podatkowa</th>
          </tr>
        </thead>
        <tbody>
          {filteredAgreements.map(u => (
            <tr key={u.id} onClick={() => handleRowClick(u)} className="table-row">
              <td>{u.contractor.name}</td>
              <td>{u.apartment.street} {u.apartment.houseNumber}</td>
              <td>{u.category}</td>
              <td>{formatDate(u.dateFrom)}</td>
              <td>{u.dateTo ? formatDate(u.dateTo) : "—"}</td>
              <td>{u.monthlyNetValue.toFixed(2)} zł</td>
              <td>{u.vatRate.toFixed(2)}%</td>
              <td>{u.description || "—"}</td>
              <td>{u.taxOperation ? "Tak" : "Nie"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formularz edycji lub dodawania */}
      {(selectedAgreement || addMode) && (
        <div className="edit-panel">
          <h3>{addMode ? "Dodawanie nowej umowy" : "Panel edycji"}</h3>
          <div className="edit-form">
            <label>
              Kontrahent
              <select
                value={(addMode ? newAgreement.contractor?.id : editForm?.contractor.id) || ""}
                onChange={e => {
                  const selectedId = Number(e.target.value);
                  const selectedContractor = contractors.find(c => c.id === selectedId);
                  if (addMode) {
                    setNewAgreement({ ...newAgreement, contractor: { id: selectedId, name: selectedContractor?.name || "" } });
                  } else if (editForm) {
                    setEditForm({ ...editForm, contractor: { id: selectedId, name: selectedContractor?.name || "" } });
                  }
                }}
              >
                <option value="">Wybierz kontrahenta</option>
                {contractors.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Nieruchomość
              <select
                value={(addMode ? newAgreement.apartment?.id : editForm?.apartment.id) || ""}
                onChange={e => {
                  const selectedId = Number(e.target.value);
                  const selectedApartment = apartments.find(n => n.id === selectedId);
                  if (addMode) {
                    setNewAgreement({ ...newAgreement, apartment: { id: selectedId, street: selectedApartment?.street || "", houseNumber: selectedApartment?.houseNumber || 0 } });
                  } else if (editForm) {
                    setEditForm({ ...editForm, apartment: { id: selectedId, street: selectedApartment?.street || "", houseNumber: selectedApartment?.houseNumber || 0 } });
                  }
                }}
              >
                <option value="">Wybierz nieruchomość</option>
                {apartments.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.street} {n.houseNumber}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Kategoria umowy
              <select
                value={(addMode ? newAgreement.category : editForm?.category) || ""}
                onChange={e => {
                  if (addMode) {
                    setNewAgreement({ ...newAgreement, category: e.target.value });
                  } else if (editForm) {
                    setEditForm({ ...editForm, category: e.target.value });
                  }
                }}
              >
                <option value="">Wybierz kategorię</option>
                <option>Czynsz najmu</option>
                <option>Czynsz administracyjny</option>
                <option>Opłaty eksploatacyjne</option>
                <option>Remont/naprawa</option>
                <option>Prąd</option>
                <option>Opłaty bankowe</option>
                <option>Podatek</option>
                <option>Kaucja</option>
                <option>Inne</option>
              </select>
            </label>
            <label>
              Data od
              <input
                type="date"
                value={(addMode ? newAgreement.dateFrom : editForm?.dateFrom) || ""}
                onChange={e => {
                  if (addMode) {
                    setNewAgreement({ ...newAgreement, dateFrom: e.target.value });
                  } else if (editForm) {
                    setEditForm({ ...editForm, dateFrom: e.target.value });
                  }
                }}
              />
            </label>
            <label>
              Data do
              <input
                type="date"
                value={(addMode ? newAgreement.dateTo : editForm?.dateTo) || ""}
                onChange={e => {
                  if (addMode) {
                    setNewAgreement({ ...newAgreement, dateTo: e.target.value || null });
                  } else if (editForm) {
                    setEditForm({ ...editForm, dateTo: e.target.value || null });
                  }
                }}
              />
            </label>
            <label>
              Kwota miesięczna
              <input
                type="number"
                step="0.01"
                value={(addMode ? newAgreement.monthlyNetValue : editForm?.monthlyNetValue) || ""}
                onChange={e => {
                  const value = Number(e.target.value);
                  if (addMode) {
                    setNewAgreement({ ...newAgreement, monthlyNetValue: value });
                  } else if (editForm) {
                    setEditForm({ ...editForm, monthlyNetValue: value });
                  }
                }}
              />
            </label>
            <label>
              Stawka VAT
              <input
                type="number"
                step="0.01"
                value={(addMode ? newAgreement.vatRate : editForm?.vatRate) || ""}
                onChange={e => {
                  const value = Number(e.target.value);
                  if (addMode) {
                    setNewAgreement({ ...newAgreement, vatRate: value });
                  } else if (editForm) {
                    setEditForm({ ...editForm, vatRate: value });
                  }
                }}
              />
            </label>
            <label>
              Opis
              <input
                value={(addMode ? newAgreement.description : editForm?.description) || ""}
                onChange={e => {
                  if (addMode) {
                    setNewAgreement({ ...newAgreement, description: e.target.value || null });
                  } else if (editForm) {
                    setEditForm({ ...editForm, description: e.target.value || null });
                  }
                }}
              />
            </label>
            <label>
              Operacja podatkowa
              <input
                type="checkbox"
                checked={(addMode ? newAgreement.taxOperation : editForm?.taxOperation) || false}
                onChange={e => {
                  if (addMode) {
                    setNewAgreement({ ...newAgreement, taxOperation: e.target.checked });
                  } else if (editForm) {
                    setEditForm({ ...editForm, taxOperation: e.target.checked });
                  }
                }}
              />
            </label>

            <div className="edit-buttons">
              <button onClick={addMode ? handleAdd : handleSave} className="save-btn">
                {addMode ? "Dodaj umowę" : "Zapisz edycję"}
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

export default AgreementsTab;
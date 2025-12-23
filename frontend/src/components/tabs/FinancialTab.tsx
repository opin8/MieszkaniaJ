import { useState, useEffect } from "react";
import api from "../../api";
import "./FinancialTab.css";

interface FinancialEntry {
  id: number;
  apartment: { id: number; street: string; houseNumber: number } | null;
  category: string;
  date: string;
  netAmount: number;
  vatRate: number;
  description?: string | null;
  taxOperation: boolean;
  paid: boolean;
}

interface Apartment {
  id: number;
  street: string;
  houseNumber: number;
}

const categories = [
  "Czynsz administracyjny",
  "Prąd",
  "Remont/naprawa",
  "Podatek",
  "Ubezpieczenie",
  "Inne",
];

function FinancialTab() {
  const [entries, setEntries] = useState<FinancialEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<FinancialEntry | null>(null);
  const [editForm, setEditForm] = useState<FinancialEntry | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<FinancialEntry>>({
    apartment: null,
    category: "",
    date: "",
    netAmount: 0,
    vatRate: 0,
    description: null,
    taxOperation: false,
    paid: false,
  });

  // Filtry
  const [apartmentFilter, setApartmentFilter] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [paidFilter, setPaidFilter] = useState<boolean | null>(null);

  // Lista mieszkań do filtru
  const [apartments, setApartments] = useState<Apartment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [entriesRes, apartmentsRes] = await Promise.all([
          api.get<FinancialEntry[]>("/financial-entries"),
          api.get<Apartment[]>("/apartments")
        ]);
        setEntries(entriesRes.data);
        setApartments(apartmentsRes.data);
      } catch (err) {
        console.error("Błąd ładowania danych", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredEntries = entries.filter(e => {
    let match = true;
    if (apartmentFilter) match = match && e.apartment?.id === apartmentFilter;
    if (categoryFilter) match = match && e.category === categoryFilter;
    if (dateFrom) match = match && e.date >= dateFrom;
    if (dateTo) match = match && e.date <= dateTo;
    if (paidFilter !== null) match = match && e.paid === paidFilter;
    return match;
  });

  const handleRowClick = (entry: FinancialEntry) => {
    setSelectedEntry(entry);
    setEditForm({ ...entry });
    setAddMode(false);
  };

  const handleSave = async () => {
    if (!editForm || !editForm.id) return;
    try {
      const updated = await api.put<FinancialEntry>(`/financial-entries/${editForm.id}`, editForm);
      setEntries(entries.map(e => (e.id === editForm.id ? updated.data : e)));
      setSelectedEntry(null);
      setEditForm(null);
    } catch (err) {
      alert("Błąd zapisu wydatku");
    }
  };

  const handleAdd = async () => {
    try {
      const response = await api.post<FinancialEntry>("/financial-entries", newEntry);
      setEntries([...entries, response.data]);
      setAddMode(false);
      setNewEntry({
        apartment: null,
        category: "",
        date: "",
        netAmount: 0,
        vatRate: 0,
        description: null,
        taxOperation: false,
        paid: false,
      });
    } catch (err) {
      alert("Błąd dodawania wydatku");
    }
  };

  const handleDelete = async () => {
    if (!selectedEntry) return;
    if (!confirm("Czy na pewno usunąć ten wydatek?")) return;
    try {
      await api.delete(`/financial-entries/${selectedEntry.id}`);
      setEntries(entries.filter(e => e.id !== selectedEntry.id));
      setSelectedEntry(null);
      setEditForm(null);
    } catch (err) {
      alert("Błąd usuwania wydatku");
    }
  };

  const handleClear = () => {
    if (addMode) {
      setNewEntry({
        apartment: null,
        category: "",
        date: "",
        netAmount: 0,
        vatRate: 0,
        description: null,
        taxOperation: false,
        paid: false,
      });
    } else {
      setEditForm(selectedEntry ? { ...selectedEntry } : null);
    }
  };

  if (loading) return <p className="loading">Ładowanie bazy finansowej...</p>;

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Baza finansowa</h2>
        <button onClick={() => setAddMode(true)} className="add-btn">
          + Dodaj nowy wydatek
        </button>
      </div>

      {/* Filtry */}
      <div className="filters">
        <label>
          Mieszkanie:
          <select
            value={apartmentFilter || ""}
            onChange={e => setApartmentFilter(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Wszystkie</option>
            {apartments.map(a => (
              <option key={a.id} value={a.id}>
                {a.street} {a.houseNumber}
              </option>
            ))}
          </select>
        </label>
        <label>
          Kategoria:
          <select
            value={categoryFilter || ""}
            onChange={e => setCategoryFilter(e.target.value || null)}
          >
            <option value="">Wszystkie</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
        <label>
          Data od:
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
          />
        </label>
        <label>
          Data do:
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
          />
        </label>
        <label className="paid-toggle">
          Opłacone:
          <input
            type="checkbox"
            checked={paidFilter === true}
            onChange={e => setPaidFilter(e.target.checked ? true : null)}
          />
          <span className={`toggle-switch ${paidFilter === true ? "active" : ""}`}></span>
        </label>
      </div>

      {/* Tabela wydatków */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Powiązane mieszkanie</th>
            <th>Kategoria wydatku</th>
            <th>Data</th>
            <th>Kwota netto</th>
            <th>VAT</th>
            <th>Opis</th>
            <th>Operacja podatkowa</th>
            <th>Opłacono</th>
          </tr>
        </thead>
        <tbody>
          {filteredEntries.map(e => (
            <tr key={e.id} onClick={() => handleRowClick(e)} className="table-row">
              <td>{e.apartment ? `${e.apartment.street} ${e.apartment.houseNumber}` : "—"}</td>
              <td>{e.category}</td>
              <td>{e.date}</td>
              <td>{e.netAmount.toFixed(2)} zł</td>
              <td>{e.vatRate.toFixed(2)}%</td>
              <td>{e.description || "—"}</td>
              <td>{e.taxOperation ? "Tak" : "Nie"}</td>
              <td className={e.paid ? "paid-yes" : "paid-no"}>
                {e.paid ? "Tak" : "Nie"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formularz edycji lub dodawania */}
      {(selectedEntry || addMode) && (
        <div className="edit-panel">
          <h3>{addMode ? "Dodawanie nowego wydatku" : "Panel edycji"}</h3>
          <div className="edit-form">
            <label>
              Powiązane mieszkanie
              <select
                value={(addMode ? newEntry.apartment?.id : editForm?.apartment?.id) || ""}
                onChange={e => {
                  const selectedId = Number(e.target.value);
                  const selectedApartment = apartments.find(a => a.id === selectedId);
                  if (addMode) {
                    setNewEntry({ ...newEntry, apartment: selectedApartment ? { id: selectedId, street: selectedApartment.street, houseNumber: selectedApartment.houseNumber } : null });
                  } else if (editForm) {
                    setEditForm({ ...editForm, apartment: selectedApartment ? { id: selectedId, street: selectedApartment.street, houseNumber: selectedApartment.houseNumber } : null });
                  }
                }}
              >
                <option value="">Brak (ogólny wydatek)</option>
                {apartments.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.street} {a.houseNumber}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Kategoria wydatku
              <select
                value={(addMode ? newEntry.category : editForm?.category) || ""}
                onChange={e => {
                  if (addMode) {
                    setNewEntry({ ...newEntry, category: e.target.value });
                  } else if (editForm) {
                    setEditForm({ ...editForm, category: e.target.value });
                  }
                }}
              >
                <option value="">Wybierz kategorię</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Data
              <input
                type="date"
                value={(addMode ? newEntry.date : editForm?.date) || ""}
                onChange={e => {
                  if (addMode) {
                    setNewEntry({ ...newEntry, date: e.target.value });
                  } else if (editForm) {
                    setEditForm({ ...editForm, date: e.target.value });
                  }
                }}
              />
            </label>
            <label>
              Kwota netto
              <input
                type="number"
                step="0.01"
                value={(addMode ? newEntry.netAmount : editForm?.netAmount) || ""}
                onChange={e => {
                  const value = Number(e.target.value);
                  if (addMode) {
                    setNewEntry({ ...newEntry, netAmount: value });
                  } else if (editForm) {
                    setEditForm({ ...editForm, netAmount: value });
                  }
                }}
              />
            </label>
            <label>
              VAT
              <input
                type="number"
                step="0.01"
                value={(addMode ? newEntry.vatRate : editForm?.vatRate) || ""}
                onChange={e => {
                  const value = Number(e.target.value);
                  if (addMode) {
                    setNewEntry({ ...newEntry, vatRate: value });
                  } else if (editForm) {
                    setEditForm({ ...editForm, vatRate: value });
                  }
                }}
              />
            </label>
            <label>
              Opis
              <input
                value={(addMode ? newEntry.description : editForm?.description) || ""}
                onChange={e => {
                  if (addMode) {
                    setNewEntry({ ...newEntry, description: e.target.value || null });
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
                checked={(addMode ? newEntry.taxOperation : editForm?.taxOperation) || false}
                onChange={e => {
                  if (addMode) {
                    setNewEntry({ ...newEntry, taxOperation: e.target.checked });
                  } else if (editForm) {
                    setEditForm({ ...editForm, taxOperation: e.target.checked });
                  }
                }}
              />
            </label>
            <label>
              Opłacono
              <input
                type="checkbox"
                checked={(addMode ? newEntry.paid : editForm?.paid) || false}
                onChange={e => {
                  if (addMode) {
                    setNewEntry({ ...newEntry, paid: e.target.checked });
                  } else if (editForm) {
                    setEditForm({ ...editForm, paid: e.target.checked });
                  }
                }}
              />
            </label>

            <div className="edit-buttons">
              <button onClick={addMode ? handleAdd : handleSave} className="save-btn">
                {addMode ? "Dodaj wydatek" : "Zapisz edycję"}
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

export default FinancialTab;
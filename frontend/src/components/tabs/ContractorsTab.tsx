import { useState, useEffect } from "react";
import api from "../../api";
import "./ContractorsTab.css";

interface Contractor {
  id: number;
  name: string;
  peselOrNip: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  additionalInfo: string | null;
  contractorType: string;
}

function ContractorsTab() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [editForm, setEditForm] = useState<Contractor | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [newContractor, setNewContractor] = useState<Partial<Contractor>>({
    name: "",
    peselOrNip: null,
    email: null,
    phone: null,
    address: null,
    additionalInfo: null,
    contractorType: "Najemca",
  });

  useEffect(() => {
    api
      .get<Contractor[]>("/contractors")
      .then(res => {
        setContractors(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleRowClick = (contractor: Contractor) => {
    setSelectedContractor(contractor);
    setEditForm({ ...contractor });
    setAddMode(false);
  };

  const handleSave = async () => {
    if (!editForm || !editForm.id) return;
    try {
      await api.put(`/contractors/${editForm.id}`, editForm);
      setContractors(contractors.map(c => (c.id === editForm.id ? editForm : c)));
      setSelectedContractor(null);
      setEditForm(null);
    } catch (err) {
      alert("Błąd zapisu kontrahenta");
    }
  };

  const handleAdd = async () => {
    try {
      const response = await api.post<Contractor>("/contractors", newContractor);
      setContractors([...contractors, response.data]);
      setAddMode(false);
      setNewContractor({
        name: "",
        peselOrNip: null,
        email: null,
        phone: null,
        address: null,
        additionalInfo: null,
        contractorType: "Najemca",
      });
    } catch (err) {
      alert("Błąd dodawania kontrahenta");
    }
  };

  const handleDelete = async () => {
    if (!selectedContractor) return;
    if (!confirm("Czy na pewno usunąć tego kontrahenta?")) return;
    try {
      await api.delete(`/contractors/${selectedContractor.id}`);
      setContractors(contractors.filter(c => c.id !== selectedContractor.id));
      setSelectedContractor(null);
      setEditForm(null);
    } catch (err) {
      alert("Błąd usuwania kontrahenta");
    }
  };

  const handleClear = () => {
    if (addMode) {
      setNewContractor({
        name: "",
        peselOrNip: null,
        email: null,
        phone: null,
        address: null,
        additionalInfo: null,
        contractorType: "Najemca",
      });
    } else {
      setEditForm(selectedContractor ? { ...selectedContractor } : null);
    }
  };

  if (loading) return <p className="loading">Ładowanie kontrahentów...</p>;

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Baza kontrahentów</h2>
        <button onClick={() => setAddMode(true)} className="add-btn">
          + Dodaj nowego kontrahenta
        </button>
      </div>

      {/* Tabela kontrahentów */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Imię i nazwisko / Nazwa</th>
            <th>PESEL lub NIP</th>
            <th>E-mail</th>
            <th>Telefon</th>
            <th>Adres</th>
            <th>Dodatkowe informacje</th>
            <th>Rodzaj kontrahenta</th>
            <th>ID strony</th>
          </tr>
        </thead>
        <tbody>
          {contractors.map(c => (
            <tr key={c.id} onClick={() => handleRowClick(c)} className="table-row">
              <td>{c.name}</td>
              <td>{c.peselOrNip || "—"}</td>
              <td>{c.email || "—"}</td>
              <td>{c.phone || "—"}</td>
              <td>{c.address || "—"}</td>
              <td>{c.additionalInfo || "—"}</td>
              <td>{c.contractorType}</td>
              <td>{c.id}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formularz edycji lub dodawania */}
      {(selectedContractor || addMode) && (
        <div className="edit-panel">
          <h3>{addMode ? "Dodawanie nowego kontrahenta" : "Panel edycji"}</h3>
          <div className="edit-form">
            <label>
              Imię i nazwisko / Nazwa
              <input
                value={(addMode ? newContractor.name : editForm?.name) || ""}
                onChange={e => addMode
                  ? setNewContractor({ ...newContractor, name: e.target.value })
                  : setEditForm(editForm ? { ...editForm, name: e.target.value } : null)
                }
              />
            </label>
            <label>
              PESEL lub NIP
              <input
                value={(addMode ? newContractor.peselOrNip : editForm?.peselOrNip) || ""}
                onChange={e => addMode
                  ? setNewContractor({ ...newContractor, peselOrNip: e.target.value || null })
                  : setEditForm(editForm ? { ...editForm, peselOrNip: e.target.value || null } : null)
                }
              />
            </label>
            <label>
              E-mail
              <input
                value={(addMode ? newContractor.email : editForm?.email) || ""}
                onChange={e => addMode
                  ? setNewContractor({ ...newContractor, email: e.target.value || null })
                  : setEditForm(editForm ? { ...editForm, email: e.target.value || null } : null)
                }
              />
            </label>
            <label>
              Telefon
              <input
                value={(addMode ? newContractor.phone : editForm?.phone) || ""}
                onChange={e => addMode
                  ? setNewContractor({ ...newContractor, phone: e.target.value || null })
                  : setEditForm(editForm ? { ...editForm, phone: e.target.value || null } : null)
                }
              />
            </label>
            <label>
              Adres
              <input
                value={(addMode ? newContractor.address : editForm?.address) || ""}
                onChange={e => addMode
                  ? setNewContractor({ ...newContractor, address: e.target.value || null })
                  : setEditForm(editForm ? { ...editForm, address: e.target.value || null } : null)
                }
              />
            </label>
            <label>
              Dodatkowe informacje
              <input
                value={(addMode ? newContractor.additionalInfo : editForm?.additionalInfo) || ""}
                onChange={e => addMode
                  ? setNewContractor({ ...newContractor, additionalInfo: e.target.value || null })
                  : setEditForm(editForm ? { ...editForm, additionalInfo: e.target.value || null } : null)
                }
              />
            </label>
            <label>
              Rodzaj kontrahenta
              <input
                value={(addMode ? newContractor.contractorType : editForm?.contractorType) || "Najemca"}
                onChange={e => addMode
                  ? setNewContractor({ ...newContractor, contractorType: e.target.value })
                  : setEditForm(editForm ? { ...editForm, contractorType: e.target.value } : null)
                }
              />
            </label>

            <div className="edit-buttons">
              <button onClick={addMode ? handleAdd : handleSave} className="save-btn">
                {addMode ? "Dodaj kontrahenta" : "Zapisz edycję"}
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

export default ContractorsTab;
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./api";
import "./ApartmentDetail.css";

interface RentPayment {
  validFrom: string;
  validTo?: string;
  amount: number;
}

interface MeterReading {
  dateFrom: string;
  dateTo?: string;
  reading: number;
  cost: number;
}

interface Expense {
  date: string;
  category: string;
  description?: string;
  amount: number;
}

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
  rentPayments: RentPayment[];
  meterReadings: MeterReading[];
  expenses: Expense[];
}

function ApartmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Apartment | null>(null);

  useEffect(() => {
    api.get<Apartment>(`/apartments/${id}`).then(res => {
      setApartment(res.data);
      setForm(res.data);
    }).catch(() => {
      alert("Nie znaleziono mieszkania");
      navigate("/dashboard");
    });
  }, [id, navigate]);

  const save = async () => {
    if (!form) return;
    await api.put(`/apartments/${id}`, form);
    setApartment(form);
    setEditMode(false);
  };

  const cancel = () => {
    setForm(apartment);
    setEditMode(false);
  };

  if (!apartment || !form) return <div className="loading">Ładowanie...</div>;

  return (
    <div className="detail-container">
      <div className="detail-header">
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          ← Powrót
        </button>
        {!editMode ? (
          <button onClick={() => setEditMode(true)} className="edit-btn">
            Edytuj mieszkanie
          </button>
        ) : (
          <div className="edit-actions">
            <button onClick={save} className="save-btn">Zapisz</button>
            <button onClick={cancel} className="cancel-btn">Anuluj</button>
          </div>
        )}
      </div>

      <div className="detail-card">
        <h1>
          {editMode ? (
            <input
              value={form.city}
              onChange={e => setForm({ ...form, city: e.target.value })}
            />
          ) : (
            apartment.city
          )}
        </h1>

        <div className="detail-grid">
          <div>
            <strong>Ulica:</strong>{" "}
            {editMode ? (
              <input
                value={form.street}
                onChange={e => setForm({ ...form, street: e.target.value })}
              />
            ) : (
              apartment.street
            )}{" "}
            {form.houseNumber}/{form.apartmentNumber}
          </div>
          <div>
            <strong>Kod pocztowy:</strong>{" "}
            {editMode ? (
              <input
                value={form.postalCode}
                onChange={e => setForm({ ...form, postalCode: e.target.value })}
              />
            ) : (
              apartment.postalCode
            )}
          </div>
          <div>
            <strong>Powierzchnia:</strong>{" "}
            {editMode ? (
              <input
                type="number"
                step="0.1"
                value={form.area}
                onChange={e => setForm({ ...form, area: Number(e.target.value) })}
              />
            ) : (
              apartment.area
            )}{" "}
            m²
          </div>
          <div>
            <strong>Pokoje:</strong>{" "}
            {editMode ? (
              <input
                type="number"
                value={form.numberOfRooms}
                onChange={e => setForm({ ...form, numberOfRooms: Number(e.target.value) })}
              />
            ) : (
              apartment.numberOfRooms
            )}
          </div>
          <div>
            <strong>Przechowalnia:</strong>{" "}
            {editMode ? (
              <input
                type="checkbox"
                checked={form.storageUnit}
                onChange={e => setForm({ ...form, storageUnit: e.target.checked })}
              />
            ) : apartment.storageUnit ? (
              "Tak"
            ) : (
              "Nie"
            )}
          </div>
          <div>
            <strong>Metraż balkonu/tarasu:</strong>{" "}
            {editMode ? (
              <input
                type="number"
                step="0.1"
                value={form.balconyTerraceArea ?? ""}
                onChange={e =>
                  setForm({
                    ...form,
                    balconyTerraceArea: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
            ) : apartment.balconyTerraceArea ? (
              `${apartment.balconyTerraceArea} m²`
            ) : (
              "—"
            )}
          </div>
          <div>
            <strong>Numer garażu:</strong>{" "}
            {editMode ? (
              <input
                value={form.garageNumber ?? ""}
                onChange={e => setForm({ ...form, garageNumber: e.target.value || null })}
              />
            ) : apartment.garageNumber || "—"}
          </div>
          {form.parkingSpotNumber != null && (
            <div>
              <strong>Miejsce parkingowe:</strong> #{form.parkingSpotNumber}
            </div>
          )}
        </div>

        {/* CZYNSZ */}
        <section className="section">
          <h2>Opłaty czynszowe</h2>
          {editMode && (
            <button
              onClick={() =>
                setForm({
                  ...form,
                  rentPayments: [...form.rentPayments, { validFrom: "", amount: 0 }],
                })
              }
              className="add-small-btn"
            >
              + Dodaj
            </button>
          )}
          {form.rentPayments.length === 0 && <p>Brak wpisów</p>}
          {form.rentPayments.map((r, i) => (
            <div key={i} className="list-item">
              {editMode ? (
                <>
                  <input
                    type="date"
                    value={r.validFrom}
                    onChange={e => {
                      const updated = [...form.rentPayments];
                      updated[i].validFrom = e.target.value;
                      setForm({ ...form, rentPayments: updated });
                    }}
                  />
                  <input
                    type="number"
                    value={r.amount}
                    onChange={e => {
                      const updated = [...form.rentPayments];
                      updated[i].amount = Number(e.target.value);
                      setForm({ ...form, rentPayments: updated });
                    }}
                  />{" "}
                  zł
                  <button
                    onClick={() =>
                      setForm({
                        ...form,
                        rentPayments: form.rentPayments.filter((_, idx) => idx !== i),
                      })
                    }
                    className="delete-btn"
                  >
                    Usuń
                  </button>
                </>
              ) : (
                <>Od {r.validFrom} → {r.amount} zł{r.validTo ? ` – do ${r.validTo}` : " (aktualne)"}</>
              )}
            </div>
          ))}
        </section>

        {/* LICZNIKI */}
        <section className="section">
          <h2>Stan licznika</h2>
          {editMode && (
            <button
              onClick={() =>
                setForm({
                  ...form,
                  meterReadings: [...form.meterReadings, { dateFrom: "", reading: 0, cost: 0 }],
                })
              }
              className="add-small-btn"
            >
              + Dodaj
            </button>
          )}
          {form.meterReadings.length === 0 && <p>Brak wpisów</p>}
          {form.meterReadings.map((m, i) => (
            <div key={i} className="list-item">
              {editMode ? (
                <>
                  <input
                    type="date"
                    value={m.dateFrom}
                    onChange={e => {
                      const updated = [...form.meterReadings];
                      updated[i].dateFrom = e.target.value;
                      setForm({ ...form, meterReadings: updated });
                    }}
                  />
                  <input
                    type="number"
                    step="0.001"
                    value={m.reading}
                    onChange={e => {
                      const updated = [...form.meterReadings];
                      updated[i].reading = Number(e.target.value);
                      setForm({ ...form, meterReadings: updated });
                    }}
                  />
                  <input
                    type="number"
                    value={m.cost}
                    onChange={e => {
                      const updated = [...form.meterReadings];
                      updated[i].cost = Number(e.target.value);
                      setForm({ ...form, meterReadings: updated });
                    }}
                  />{" "}
                  zł
                  <button
                    onClick={() =>
                      setForm({
                        ...form,
                        meterReadings: form.meterReadings.filter((_, idx) => idx !== i),
                      })
                    }
                    className="delete-btn"
                  >
                    Usuń
                  </button>
                </>
              ) : (
                <>{m.dateFrom} → {m.reading} (koszt: {m.cost} zł)</>
              )}
            </div>
          ))}
        </section>

        {/* WYDATKI */}
        <section className="section">
          <h2>Wydatki</h2>
          {editMode && (
            <button
              onClick={() =>
                setForm({
                  ...form,
                  expenses: [...form.expenses, { date: "", category: "Inne", amount: 0 }],
                })
              }
              className="add-small-btn"
            >
              + Dodaj
            </button>
          )}
          {form.expenses.length === 0 && <p>Brak wpisów</p>}
          {form.expenses.map((e, i) => (
            <div key={i} className="list-item">
              {editMode ? (
                <>
                  <input
                    type="date"
                    value={e.date}
                    onChange={e => {
                      const updated = [...form.expenses];
                      updated[i].date = e.target.value;
                      setForm({ ...form, expenses: updated });
                    }}
                  />
                  <select
                    value={e.category}
                    onChange={e => {
                      const updated = [...form.expenses];
                      updated[i].category = e.target.value;
                      setForm({ ...form, expenses: updated });
                    }}
                  >
                    <option>Podatek</option>
                    <option>Naprawa</option>
                    <option>Ubezpieczenie</option>
                    <option>Inne</option>
                  </select>
                  {e.category === "Inne" && (
                    <input
                      placeholder="Opis"
                      value={e.description || ""}
                      onChange={e => {
                        const updated = [...form.expenses];
                        updated[i].description = e.target.value;
                        setForm({ ...form, expenses: updated });
                      }}
                    />
                  )}
                  <input
                    type="number"
                    value={e.amount}
                    onChange={e => {
                      const updated = [...form.expenses];
                      updated[i].amount = Number(e.target.value);
                      setForm({ ...form, expenses: updated });
                    }}
                  />{" "}
                  zł
                  <button
                    onClick={() =>
                      setForm({
                        ...form,
                        expenses: form.expenses.filter((_, idx) => idx !== i),
                      })
                    }
                    className="delete-btn"
                  >
                    Usuń
                  </button>
                </>
              ) : (
                <>
                  <strong>{e.category}</strong>: {e.amount} zł ({e.date})
                  {e.description && ` – ${e.description}`}
                </>
              )}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default ApartmentDetail;
import { useState, useEffect } from "react";
import api from "../../api";
import { formatDate } from "../../utils/dateUtils";
import "./AnalyticsTab.css";

interface AnalyticsSummary {
  totalExpensesNet: number;
  totalIncomeNet: number;
  netProfitNet: number;
  allEntries: FinancialEntry[];
}

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

function AnalyticsTab() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(false);

  // Filtry
  const [apartmentIds, setApartmentIds] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [onlyPaid, setOnlyPaid] = useState<boolean | null>(null);

  const [apartments, setApartments] = useState<Apartment[]>([]);

  const expenseCategories = [
    "Czynsz administracyjny",
    "Prąd",
    "Remont/naprawa",
    "Podatek",
    "Ubezpieczenie",
    "Inne",
  ];

  useEffect(() => {
    api.get<Apartment[]>("/apartments").then(res => setApartments(res.data));
  }, []);

  const handleLoadData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (apartmentIds.length > 0) apartmentIds.forEach(id => params.append("apartmentIds", id.toString()));
      if (categories.length > 0) categories.forEach(cat => params.append("categories", cat));
      if (dateFrom) params.append("dateFrom", dateFrom);
      if (dateTo) params.append("dateTo", dateTo);
      if (onlyPaid !== null) params.append("onlyPaid", onlyPaid.toString());

      const res = await api.get<AnalyticsSummary>("/analytics?" + params.toString());
      setSummary(res.data);
    } catch (err) {
      console.error("Błąd ładowania analityki", err);
      alert("Błąd ładowania analityki");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAllApartments = () => {
    if (apartmentIds.length === apartments.length) {
      setApartmentIds([]);
    } else {
      setApartmentIds(apartments.map(a => a.id));
    }
  };

  const toggleSelectAllCategories = () => {
    if (categories.length === expenseCategories.length) {
      setCategories([]);
    } else {
      setCategories(expenseCategories);
    }
  };

  if (loading) return <p className="loading">Ładowanie analityki...</p>;

  return (
    <div className="tab-content">
      <h2>Analityka</h2>

      <div className="analytics-filters">
        <div className="filter-group">
          <label>
            Wybierz mieszkania do analizy:
            <button
              type="button"
              onClick={toggleSelectAllApartments}
              className={`toggle-btn ${apartmentIds.length === apartments.length ? "active" : ""}`}
            >
              Zaznacz wszystkie
            </button>
          </label>
          <div className="multi-select">
            {apartments.map(a => (
              <label key={a.id} className={apartmentIds.includes(a.id) ? "selected" : ""}>
                <input
                  type="checkbox"
                  checked={apartmentIds.includes(a.id)}
                  onChange={e => {
                    if (e.target.checked) {
                      setApartmentIds([...apartmentIds, a.id]);
                    } else {
                      setApartmentIds(apartmentIds.filter(id => id !== a.id));
                    }
                  }}
                />
                <span>{a.street} {a.houseNumber}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>
            Wybierz kategorię do analizy:
            <button
              type="button"
              onClick={toggleSelectAllCategories}
              className={`toggle-btn ${categories.length === expenseCategories.length ? "active" : ""}`}
            >
              Zaznacz wszystkie
            </button>
          </label>
          <div className="multi-select">
            {expenseCategories.map(cat => (
              <label key={cat} className={categories.includes(cat) ? "selected" : ""}>
                <input
                  type="checkbox"
                  checked={categories.includes(cat)}
                  onChange={e => {
                    if (e.target.checked) {
                      setCategories([...categories, cat]);
                    } else {
                      setCategories(categories.filter(c => c !== cat));
                    }
                  }}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>
            Data od:
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          </label>
          <label>
            Data do:
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </label>
        </div>

        <div className="filter-group">
          <label className="paid-toggle">
            Tylko opłacone:
            <input
              type="checkbox"
              checked={onlyPaid === true}
              onChange={e => setOnlyPaid(e.target.checked ? true : null)}
            />
            <span className={`toggle-switch ${onlyPaid === true ? "active" : ""}`}></span>
          </label>
        </div>

        <button onClick={handleLoadData} className="load-btn" disabled={loading}>
          {loading ? "Wczytywanie..." : "Potwierdź wybór, wczytaj dane"}
        </button>
      </div>

      {summary && (
        <div className="analytics-results">
          <h3>Podsumowanie (netto po odliczeniu VAT)</h3>
          <div className="summary-cards">
            <div className="card">
              <h4>Wydatki netto</h4>
              <p>{Math.abs(summary.totalExpensesNet).toFixed(2)} zł</p>
            </div>
            <div className="card">
              <h4>Przychody netto</h4>
              <p>{summary.totalIncomeNet.toFixed(2)} zł</p>
            </div>
            <div className={`card profit ${summary.netProfitNet >= 0 ? "positive" : "negative"}`}>
              <h4>Zysk netto</h4>
              <p>{summary.netProfitNet.toFixed(2)} zł</p>
            </div>
          </div>

          <h3>Rekordy finansowe (brutto)</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Mieszkanie</th>
                <th>Kategoria</th>
                <th>Data</th>
                <th>Kwota brutto</th>
                <th>VAT</th>
                <th>Opis</th>
                <th>Podatek</th>
                <th>Opłacono</th>
              </tr>
            </thead>
            <tbody>
              {summary.allEntries.map(e => (
                <tr key={e.id}>
                  <td>{e.apartment ? `${e.apartment.street} ${e.apartment.houseNumber}` : "—"}</td>
                  <td>{e.category}</td>
                  <td>{formatDate(e.date)}</td>
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
        </div>
      )}
    </div>
  );
}

export default AnalyticsTab;
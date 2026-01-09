import { useState, useEffect } from "react";
import api from "../../api";
import "./AnalyticsTab.css";

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

type ViewType = 1 | 2 | 3 | 4;

function AnalyticsTab() {
  const [summary, setSummary] = useState<{
    totalExpensesNet: number;
    totalIncomeNet: number;
    netProfitNet: number;
    allEntries: FinancialEntry[];
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState<ViewType>(1);

  const [apartmentIds, setApartmentIds] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [onlyPaid, setOnlyPaid] = useState<boolean | null>(null);

  const [apartments, setApartments] = useState<Apartment[]>([]);

  const expenseCategories = [
    "Czynsz",
    "Woda i CO",
    "Kaucja",
    "Internet",
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

      const res = await api.get<{
        totalExpensesNet: number;
        totalIncomeNet: number;
        netProfitNet: number;
        allEntries: FinancialEntry[];
      }>("/analytics?" + params.toString());
      setSummary(res.data);
    } catch (err) {
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

  const getNetAmount = (entry: FinancialEntry) => entry.netAmount / (1 + entry.vatRate / 100);

  const getMonthsInRange = () => {
    if (!dateFrom || !dateTo) return [];
    const start = new Date(dateFrom);
    const end = new Date(dateTo);
    const months = [];
    let current = new Date(start.getFullYear(), start.getMonth(), 1);
    while (current <= end) {
      const monthStr = `${String(current.getMonth() + 1).padStart(2, "0")}.${current.getFullYear()}`;
      months.push(monthStr);
      current.setMonth(current.getMonth() + 1);
    }
    return months;
  };

  const months = getMonthsInRange();

  const getPivotData = () => {
    if (!summary || months.length === 0) return null;

    const entries = summary.allEntries;
    const data: Record<string, Record<string, number>> = {};

    entries.forEach(e => {
      const date = new Date(e.date);
      const monthStr = `${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;

      if (!months.includes(monthStr)) return;

      const aptName = e.apartment ? `${e.apartment.street} ${e.apartment.houseNumber}` : "Ogólne";
      const net = getNetAmount(e);

      let key = '';

      if (viewType === 1) {
        key = `${aptName} - ${e.category}`;
      } else if (viewType === 2) {
        key = `${aptName} - suma wybranych kategorii`;
      } else if (viewType === 3) {
        key = `${e.category} - suma dla wybranych mieszkań`;
      } else if (viewType === 4) {
        key = `${aptName} - zsumowane wydatki mieszkania`;
      }

      if (!data[key]) {
        data[key] = {};
        months.forEach(m => data[key][m] = 0);
      }

      data[key][monthStr] += net;
    });

    // Remove rows with all zeros
    Object.keys(data).forEach(key => {
      if (Object.values(data[key]).every(value => value === 0)) {
        delete data[key];
      }
    });

    return { data };
  };

  const pivotData = getPivotData();

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

          <div className="view-selector">
            <h4>Wybierz widok tabeli:</h4>
            <label>
              <input type="radio" name="viewType" value={1} checked={viewType === 1} onChange={() => setViewType(1)} />
              Pokaż wyniki każdego mieszkania, dzieląc je po kategoriach
            </label>
            <label>
              <input type="radio" name="viewType" value={2} checked={viewType === 2} onChange={() => setViewType(2)} />
              Pokaż wynik każdego mieszkania (sumując wybrane kategorie)
            </label>
            <label>
              <input type="radio" name="viewType" value={3} checked={viewType === 3} onChange={() => setViewType(3)} />
              Podsumuj wyniki wybranych kategorii (sumując je po mieszkaniach)
            </label>
            <label>
              <input type="radio" name="viewType" value={4} checked={viewType === 4} onChange={() => setViewType(4)} />
              Pokaż sumę wszystkich mieszkań i kategorii
            </label>
          </div>

          {pivotData && months.length > 0 && (
            <div className="monthly-pivot-container">
              <table className="data-table monthly-pivot">
                <thead>
                  <tr>
                    <th>
                      {viewType === 1 ? "Adres mieszkania - Kategoria wydatku" :
                       viewType === 2 ? "Adres mieszkania - suma wybranych kategorii" :
                       viewType === 3 ? "Kategoria płatności - suma dla wybranych mieszkań" :
                       "Adres mieszkania - zsumowane wydatki mieszkania"}
                    </th>
                    {months.map(month => (
                      <th key={month}>{month}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(pivotData.data).map(([key, monthValues]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      {months.map(month => (
                        <td key={month} style={{ textAlign: "right", color: (monthValues[month] || 0) < 0 ? "red" : "inherit" }}>
                          {(monthValues[month] || 0).toFixed(2)} zł
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {months.length === 0 && summary && (
            <p style={{ color: "orange" }}>Wybierz zakres dat (od-do), aby zobaczyć tabelę miesięczną.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default AnalyticsTab;
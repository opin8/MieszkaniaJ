import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApartmentsTab from "../components/tabs/ApartmentsTab";
import ContractorsTab from "../components/tabs/ContractorsTab";
import "./Dashboard.css";
import AgreementsTab from "../components/tabs/AgreementsTab";
import FinancialTab from "../components/tabs/FinancialTab";
import AnalyticsTab from "../components/tabs/AnalyticsTab";

const logout = () => {
  localStorage.removeItem("token");
};

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("mieszkania");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderTab = () => {
    switch (activeTab) {
      case "mieszkania":
        return <ApartmentsTab />;
      case "kontrahenci":
        return <ContractorsTab />;
      case "umowy":
        return <AgreementsTab />;
      case "finansowa":
        return <FinancialTab />;
      case "analityka":
        return <AnalyticsTab />;
      case "wydarzenia":
        return <div className="tab-content"><h2>Baza wydarzeń</h2><p>Tu będzie tabela wydarzeń</p></div>;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <nav className="tabs-nav">
          <button
            className={activeTab === "mieszkania" ? "tab-active" : "tab"}
            onClick={() => setActiveTab("mieszkania")}
          >
            Baza mieszkań
          </button>
          <button
            className={activeTab === "kontrahenci" ? "tab-active" : "tab"}
            onClick={() => setActiveTab("kontrahenci")}
          >
            Baza kontrahentów
          </button>
          <button
            className={activeTab === "umowy" ? "tab-active" : "tab"}
            onClick={() => setActiveTab("umowy")}
          >
            Baza umów
          </button>
          <button
            className={activeTab === "finansowa" ? "tab-active" : "tab"}
            onClick={() => setActiveTab("finansowa")}
          >
            Baza finansowa
          </button>
          <button
            className={activeTab === "analityka" ? "tab-active" : "tab"}
            onClick={() => setActiveTab("analityka")}
          >
            Analityka
          </button>
          <button
            className={activeTab === "wydarzenia" ? "tab-active" : "tab"}
            onClick={() => setActiveTab("wydarzenia")}
          >
            Baza wydarzeń
          </button>
        </nav>

        <button onClick={handleLogout} className="logout-btn">
          Wyloguj się
        </button>
      </header>

      <main className="dashboard-main">
        {renderTab()}
      </main>
    </div>
  );
}

export default Dashboard;
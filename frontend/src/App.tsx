import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";
import ApartmentDetail from "./ApartmentDetail";     
import AddApartment from "./AddApartment";           
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/apartment/:id" element={<ApartmentDetail />} />
          <Route path="/add" element={<AddApartment />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import StudentPage from "./pages/StudentPage";
import AdminPage from "./pages/AdminPage";
// Component để bảo vệ route dashboard
const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem("authToken");
  return token ? element : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/student/:action" element={<StudentPage />} />
        <Route path="/admin/:action" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;

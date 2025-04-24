import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import StudentPage from "./pages/StudentPage";
import AdminPage from "./pages/AdminPage";
import SeatList from "./pages/SeatList.jsx";
import BookingForm from "./pages/BookingForm.jsx";

// Component để bảo vệ route
const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem("authToken");
  return token ? element : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/student/:action" element={<StudentPage />} />
          <Route path="/admin/:action" element={<AdminPage />} />
          <Route path="/dat-cho-hoc" element={<PrivateRoute element={<SeatList />} />} />
          <Route path="/booking" element={<PrivateRoute element={<BookingForm />} />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
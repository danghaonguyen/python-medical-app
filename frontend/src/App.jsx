
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import HomePage from "./components/pages/home/HomePage";
import PatientForm from "./components/pages/prediction/PatientForm";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import History from "./components/pages/history/History";
import ScrollToTop from "./ScrollToTop";
import { getCurrentUser } from "./services/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import MainLayout from "./components/pages/layout/MainLayout.jsx";

function ProtectedRoute({ status }) {
  if (status === "checking") return null;

  return status === "authenticated"
    ? <Outlet />
    : <Navigate to="/login" replace />;
}

function GuestRoute({ status }) {
  if (status === "checking") return null;

  return status === "authenticated"
    ? <Navigate to="/" replace />
    : <Outlet />;
}

function AppRoutes() {
  const [status, setStatus] = useState("checking");
  const location = useLocation();

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      try {
        const user = await getCurrentUser();

        if (active) {
          setStatus(
            user?.authenticated ? "authenticated" : "guest"
          );
        }
      } catch {
        if (active) setStatus("guest");
      }
    };

    setStatus("checking");
    checkSession();

    return () => {
      active = false;
    };
  }, [location.key]);

  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />

          <Route element={<ProtectedRoute status={status} />}>
            <Route path="/prediction" element={<PatientForm />} />
            <Route path="/history" element={<History />} />
          </Route>
        </Route>

        <Route element={<GuestRoute status={status} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;

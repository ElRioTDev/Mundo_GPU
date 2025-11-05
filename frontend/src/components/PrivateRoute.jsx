import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Mientras verificamos la sesión, no redirigir (evita flicker y redirecciones indeseadas en reload)
  if (loading) {
    return null; // o un spinner: <div>Loading...</div>
  }

  if (!isAuthenticated) {
    // Redirige al login si no hay sesión
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;

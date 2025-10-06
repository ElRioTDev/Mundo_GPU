import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirige al login si no hay sesión
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;

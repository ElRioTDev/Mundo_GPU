import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Permitir acceso siempre a /login y /registro
  if (isAuthenticated && !["/login", "/registro"].includes(location.pathname)) {
    return <Navigate to="/user" replace />;
  }

  return children;
};

export default PublicRoute;

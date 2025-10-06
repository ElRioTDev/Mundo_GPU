import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // Si ya está logueado, no debe poder acceder a login/registro
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;

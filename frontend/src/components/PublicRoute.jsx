import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Si el usuario está autenticado y accede a una ruta pública, redirigirle al dashboard (/user)
  const path = location.pathname || "";
  const isPublicPath = path.startsWith("/login") || path.startsWith("/registro");
  if (isAuthenticated && isPublicPath) {
    return <Navigate to="/gpu" replace />;
  }

  return children;
};

export default PublicRoute;

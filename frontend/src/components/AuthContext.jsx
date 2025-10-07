import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, getToken, logout, validateSession } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("EMPLEADO"); // Rol por defecto
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      const currentUser = getCurrentUser();

      if (token && currentUser) {
        const valid = await validateSession();
        setIsAuthenticated(valid);

        if (valid) {
          setUser(currentUser);
          setUserRole(currentUser.rol || currentUser.role || "EMPLEADO");
        } else {
          // Solo asignamos valores por defecto, no redirigimos ni cerramos sesión automáticamente
          setUser(null);
          setUserRole("EMPLEADO");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setUserRole("EMPLEADO");
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setUserRole("EMPLEADO");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, userRole, isAuthenticated, setUser, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, getToken, logout, validateSession } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("EMPLEADO"); // Rol por defecto
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // nuevo: indica que estamos verificando el token

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      const currentUser = getCurrentUser();

      setLoading(true);
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
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setUserRole("EMPLEADO");
    setIsAuthenticated(false);
  };

  // Metodo para establecer el usuario tras un login exitoso (actualiza estado y localStorage)
  const handleLogin = (userObj) => {
    if (!userObj) return;
    setUser(userObj);
    setUserRole(userObj.rol || userObj.role || "EMPLEADO");
    setIsAuthenticated(true);
    setLoading(false); // asegurar que loading se desactive tras login manual
    try {
      localStorage.setItem("user", JSON.stringify(userObj));
    } catch { /* ignore */ }
  };

  return (
    <AuthContext.Provider value={{ user, userRole, isAuthenticated, loading, setUser, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

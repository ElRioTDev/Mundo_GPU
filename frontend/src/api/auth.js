import axios from "axios";

// URL base del backend ASP.NET MVC
const API_URL = "http://localhost:5157/api/loginapi"; // <-- usar HTTP en desarrollo local

// -------------------- LOGIN --------------------
export const login = async (username, password) => {
  try {
    console.log(`[auth.js] Intentando login para usuario: ${username}`);
    const response = await axios.post(`${API_URL}/login`, { username, password });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      console.log("[auth.js] Login exitoso. Token y usuario guardados en localStorage.");
    } else {
      console.warn("[auth.js] Login sin token recibido.");
    }

    return response.data;
  } catch (error) {
    console.error("[auth.js] Error en login:", error.response?.data || error.message);
    throw error.response?.data || { message: "Error al iniciar sesión" };
  }
};

// -------------------- LOGOUT --------------------
export const logout = () => {
  console.log("[auth.js] Cerrando sesión. Eliminando token y usuario de localStorage.");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// -------------------- OBTENER USUARIO --------------------
export const getUser = () => {
  const user = localStorage.getItem("user");
  if (user) {
    console.log("[auth.js] Usuario obtenido de localStorage.");
    return JSON.parse(user);
  } else {
    console.warn("[auth.js] No hay usuario en localStorage.");
    return null;
  }
};

// -------------------- OBTENER TOKEN --------------------
export const getToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    console.log("[auth.js] Token obtenido de localStorage.");
  } else {
    console.warn("[auth.js] No hay token en localStorage.");
  }
  return token;
};



// -------------------- VALIDAR SESIÓN --------------------
export const validateSession = async () => {
  try {
    const token = getToken();
    if (!token) {
      console.warn("[auth.js] No se puede validar sesión: no hay token.");
      return false;
    }

    console.log("[auth.js] Validando sesión con token...");
    const response = await axios.get(`${API_URL}/validate`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("[auth.js] Sesión válida.");
    return response.status === 200;
  } catch (error) {
    console.warn("[auth.js] Sesión inválida:", error.response?.data || error.message);
    return false;
  }
};

// -------------------- OBTENER USUARIO ACTUAL --------------------
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  if (user) {
    console.log("[auth.js] Usuario actual obtenido de localStorage.");
    return JSON.parse(user);
  } else {
    console.warn("[auth.js] No hay usuario actual en localStorage.");
    return null;
  }
};

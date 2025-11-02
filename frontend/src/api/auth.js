// ...existing code...
import axios from "axios";

// URL base del backend ASP.NET MVC
const API_URL = "http://localhost:5157/api/loginapi"; // <-- usar HTTP en desarrollo local

// -------------------- util JWT / axios --------------------
function base64UrlDecode(input) {
  if (!input) return null;
  input = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = input.length % 4;
  if (pad === 2) input += "==";
  else if (pad === 3) input += "=";
  else if (pad !== 0) return null;
  try {
    const decoded = atob(input);
    try {
      return decodeURIComponent(
        decoded
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    } catch {
      return decoded;
    }
  } catch {
    return null;
  }
}

function parseJwt(token) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const payload = base64UrlDecode(parts[1]);
  if (!payload) return null;
  try {
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function extractRolesFromPayload(payload) {
  if (!payload) return [];
  const candidates = [
    "rol",
    "role",
    "roles",
    "roles", // duplicate harmless
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role",
    "role"
  ];

  for (const key of candidates) {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      const val = payload[key];
      if (!val && val !== 0) continue;
      if (Array.isArray(val)) return val.map(String);
      if (typeof val === "string") {
        return val.includes(",") ? val.split(",").map((s) => s.trim()) : [val.trim()];
      }
      // other types (number etc.)
      return [String(val)];
    }
  }
  return [];
}

function setAxiosAuth(token) {
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axios.defaults.headers.common["Authorization"];
}

// Inicializar axios si ya hay token en localStorage
const _existingToken = localStorage.getItem("token");
if (_existingToken) setAxiosAuth(_existingToken);

// -------------------- LOGIN --------------------
export const login = async (username, password) => {
  try {
    console.log(`[auth.js] Intentando login para usuario: ${username}`);
    const response = await axios.post(`${API_URL}/login`, { username, password });

    if (response?.data?.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user ?? null));
      setAxiosAuth(response.data.token);
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
  setAxiosAuth(null);
};

// -------------------- OBTENER USUARIO / TOKEN --------------------
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getCurrentUser = getUser;

export const getToken = () => localStorage.getItem("token") || null;

// -------------------- ROLES / AUTORIZACIÓN --------------------
export const getRoles = () => {
  const token = getToken();
  const payload = parseJwt(token);
  return extractRolesFromPayload(payload);
};

export const isAuthenticated = () => !!getToken();

export const hasRole = (role) => {
  if (!role) return false;
  const roles = getRoles().map((r) => String(r).toUpperCase());
  return roles.includes(String(role).toUpperCase());
};

export const hasAnyRole = (rolesToCheck = []) => {
  if (!Array.isArray(rolesToCheck) || rolesToCheck.length === 0) return false;
  const roles = getRoles().map((r) => String(r).toUpperCase());
  return rolesToCheck.some((r) => roles.includes(String(r).toUpperCase()));
};

// -------------------- VALIDAR SESIÓN --------------------
export const validateSession = async () => {
  try {
    const token = getToken();
    if (!token) {
      console.warn("[auth.js] No se puede validar sesión: no hay token.");
      return false;
    }

    setAxiosAuth(token);
    console.log("[auth.js] Validando sesión con token...");
    const response = await axios.get(`${API_URL}/validate`);
    console.log("[auth.js] Sesión válida.");
    return response.status === 200;
  } catch (error) {
    console.warn("[auth.js] Sesión inválida:", error.response?.data || error.message);
    return false;
  }
};

// -------------------- HEADERS PARA fetch u otras libs --------------------
export const getAuthHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
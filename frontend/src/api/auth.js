// src/api/auth.js
import axios from "axios";

// URL base del backend ASP.NET MVC
const API_URL = "http://localhost:5157"; // ⚠️ Ajusta según tu backend

// -------------------- LOGIN --------------------
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });

    // Guardar token y usuario en localStorage
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    console.error("Error en login:", error);
    throw error.response?.data || { message: "Error al iniciar sesión" };
  }
};

// -------------------- LOGOUT --------------------
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// -------------------- OBTENER USUARIO --------------------
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// -------------------- OBTENER TOKEN --------------------
export const getToken = () => localStorage.getItem("token");

// -------------------- REGISTRO --------------------
export const register = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
  } catch (error) {
    console.error("Error en registro:", error);
    throw error.response?.data || { message: "Error al registrar usuario" };
  }
};

// -------------------- VALIDAR SESIÓN --------------------
export const validateSession = async () => {
  try {
    const token = getToken();
    if (!token) return false;

    const response = await axios.get(`${API_URL}/validate`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.status === 200;
  } catch (error) {
    console.warn("Sesión inválida:", error);
    return false;
  }
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};


import axios from "axios";
import { getToken } from "./auth";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5157";
const API_URL = `${API_BASE}/api/usuarios`; // ajustable según backend

function getAuthHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getAllUsers() {
  try {
    const res = await axios.get(API_URL, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    console.error("getAllUsers:", err.response?.data || err.message);
    throw err.response?.data || new Error("Error al obtener usuarios");
  }
}

export async function getUserById(id) {
  try {
    const res = await axios.get(`${API_URL}/${encodeURIComponent(id)}`, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    console.error("getUserById:", err.response?.data || err.message);
    throw err.response?.data || new Error("Usuario no encontrado");
  }
}

export async function createUser(userData) {
  try {
    const res = await axios.post(API_URL, userData, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    console.error("createUser:", err.response?.data || err.message);
    throw err.response?.data || new Error("Error al crear usuario");
  }
}

export async function updateUser(id, userData) {
  try {
    const res = await axios.put(`${API_URL}/${encodeURIComponent(id)}`, userData, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    console.error("updateUser:", err.response?.data || err.message);
    throw err.response?.data || new Error("Error al actualizar usuario");
  }
}

export async function deleteUser(id) {
  try {
    const res = await axios.delete(`${API_URL}/${encodeURIComponent(id)}`, { headers: getAuthHeaders() });
    return res.status === 200 ? res.data ?? true : true;
  } catch (err) {
    console.error("deleteUser:", err.response?.data || err.message);
    throw err.response?.data || new Error("Error al eliminar usuario");
  }
}

// Buscar usuarios; backend debe exponer /api/usuarios/search?searchTerm=...
export async function searchUsers(term) {
  try {
    const url = `${API_URL}/search`;
    const res = await axios.get(url, { params: { searchTerm: term }, headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    console.error("searchUsers:", err.response?.data || err.message);
    throw err.response?.data || new Error("Error al buscar usuario");
  }
}
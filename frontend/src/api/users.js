import { getToken } from "./auth";

const API_URL = "http://localhost:5157/api/user"; // Ajusta al endpoint real de tu backend .NET

function getAuthHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Obtener todos los usuarios
export async function getAllUsers() {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Error al obtener usuarios");
  return await response.json();
}

// Obtener un usuario por ID
export async function getUserById(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Usuario no encontrado");
  return await response.json();
}

// Crear un nuevo usuario
export async function createUser(userData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error("Error al crear usuario");
  return await response.json();
}

// Editar usuario existente
export async function updateUser(id, userData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error("Error al actualizar usuario");
  return await response.json();
}

// Eliminar usuario
export async function deleteUser(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Error al eliminar usuario");
  return true;
}

// Buscar usuario por término (nombre, apellido, username o id)
export async function searchUser(term) {
  const response = await fetch(`${API_URL}/search?searchTerm=${encodeURIComponent(term)}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Error al buscar usuario");
  return await response.json();
}
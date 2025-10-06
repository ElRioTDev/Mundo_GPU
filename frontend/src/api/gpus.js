// src/api/gpus.js
import { getToken } from "./auth";

const API_URL = "http://localhost:5157/api/gpu";

function getAuthHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getGPUs() { // 🔹 renombrado
  const response = await fetch(API_URL, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error("Error al obtener las GPUs");
  return await response.json();
}

export async function getGPUById(id) {
  const response = await fetch(`${API_URL}/${id}`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error("GPU no encontrada");
  return await response.json();
}

export async function createGPU(gpuData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(gpuData),
  });
  if (!response.ok) throw new Error("Error al crear GPU");
  return await response.json();
}

export async function updateGPU(id, gpuData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(gpuData),
  });
  if (!response.ok) throw new Error("Error al actualizar GPU");
  return await response.json();
}

export async function deleteGPU(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: "DELETE", headers: getAuthHeaders() });
  if (!response.ok) throw new Error("Error al eliminar GPU");
  return true;
}

export async function searchGPU(term) {
  const response = await fetch(`${API_URL}/search?searchTerm=${encodeURIComponent(term)}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Error en la búsqueda de GPU");
  return await response.json();
}

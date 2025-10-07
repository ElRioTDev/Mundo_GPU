// frontend/src/api/gpu.js
import { getToken } from "./auth";

const API_URL = "http://localhost:5157/api/gpuapi";

// Devuelve headers con JWT si existe
function getAuthHeaders() {
  const token = getToken();
  console.log("[gpu.js] Token obtenido:", token);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// --- OBTENER TODAS LAS GPUs ---
export async function getGPUs() {
  console.log("[gpu.js] Llamando a GET GPUs...");
  try {
    const response = await fetch(API_URL, { headers: getAuthHeaders() });
    console.log("[gpu.js] Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[gpu.js] Error al obtener GPUs:", errorText);
      throw new Error("Error al obtener las GPUs");
    }

    const data = await response.json();
    console.log("[gpu.js] Datos recibidos de GPUs:", data);

    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("[gpu.js] Excepción en getGPUs:", err);
    throw err;
  }
}

// --- OBTENER GPU POR ID ---
export async function getGPU(id) {
  if (!id) throw new Error("ID de GPU requerido");
  const idNum = Number(id); // aseguramos que sea número
  console.log("[gpu.js] Llamando a getGPU con id:", idNum);

  try {
    const response = await fetch(`${API_URL}/${idNum}`, { headers: getAuthHeaders() });
    console.log("[gpu.js] Response status getGPU:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[gpu.js] Error al obtener GPU por ID:", errorText);
      throw new Error("GPU no encontrada");
    }

    const data = await response.json();
    console.log("[gpu.js] Datos recibidos getGPU:", data);
    return data;
  } catch (err) {
    console.error("[gpu.js] Excepción en getGPU:", err);
    throw err;
  }
}

// --- BUSCAR GPU POR TÉRMINO ---
export async function searchGPU(searchTerm) {
  if (!searchTerm || searchTerm.trim() === "") return [];
  console.log("[gpu.js] Llamando a searchGPU con término:", searchTerm);

  try {
    const response = await fetch(`${API_URL}/search?searchTerm=${encodeURIComponent(searchTerm)}`, {
      headers: getAuthHeaders(),
    });

    console.log("[gpu.js] Response status search:", response.status);

    if (!response.ok) {
      if (response.status === 404) {
        console.warn("[gpu.js] No se encontraron GPUs con el término:", searchTerm);
        return [];
      }
      const errorText = await response.text();
      console.error("[gpu.js] Error en searchGPU:", errorText);
      throw new Error("Error en la búsqueda de GPU");
    }

    const data = await response.json();
    console.log("[gpu.js] Resultados searchGPU:", data);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("[gpu.js] Excepción en searchGPU:", err);
    throw err;
  }
}

// --- CREAR GPU ---
export async function createGPU(gpu = {}, proveedor = null) {
  console.log("[gpu.js] Llamando a createGPU con datos:", { gpu, proveedor });

  try {
    const body = JSON.stringify({ Gpu: gpu, Proveedor: proveedor });
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body,
    });

    console.log("[gpu.js] Response status createGPU:", response.status);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("[gpu.js] Error createGPU:", errData);
      throw new Error(errData.error || "Error al crear GPU");
    }

    const data = await response.json();
    console.log("[gpu.js] GPU creada:", data);
    return data;
  } catch (err) {
    console.error("[gpu.js] Excepción en createGPU:", err);
    throw err;
  }
}

// --- ACTUALIZAR GPU ---
export async function updateGPU(id, gpu = {}, proveedor = null) {
  if (!id) throw new Error("ID de GPU requerido");
  const idNum = Number(id);
  console.log("[gpu.js] Llamando a updateGPU con id:", idNum, "datos:", { gpu, proveedor });

  try {
    const body = JSON.stringify({ Gpu: gpu, Proveedor: proveedor });
    const response = await fetch(`${API_URL}/${idNum}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body,
    });

    console.log("[gpu.js] Response status updateGPU:", response.status);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("[gpu.js] Error updateGPU:", errData);
      throw new Error(errData.error || "Error al actualizar GPU");
    }

    const data = await response.json();
    console.log("[gpu.js] GPU actualizada:", data);
    return data;
  } catch (err) {
    console.error("[gpu.js] Excepción en updateGPU:", err);
    throw err;
  }
}

// --- ELIMINAR GPU ---
export async function deleteGPU(id) {
  if (!id) throw new Error("ID de GPU requerido");
  const idNum = Number(id);
  console.log("[gpu.js] Llamando a deleteGPU con id:", idNum);

  try {
    const response = await fetch(`${API_URL}/${idNum}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    console.log("[gpu.js] Response status deleteGPU:", response.status);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("[gpu.js] Error deleteGPU:", errData);
      throw new Error(errData.error || "Error al eliminar GPU");
    }

    console.log("[gpu.js] GPU eliminada exitosamente");
    return true;
  } catch (err) {
    console.error("[gpu.js] Excepción en deleteGPU:", err);
    throw err;
  }
}

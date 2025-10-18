import { getToken } from "./auth";

const API_URL = "http://localhost:5157/api/gpu";
// raíz de la API (sin el segmento 'gpu')
const API_ROOT = API_URL.replace(/\/gpu$/, "");

// Devuelve headers con JWT si existe
function getAuthHeaders() {
  const token = getToken();
  // no loguear tokens en producción; útil en dev
  console.log("[gpu.js] Token obtenido:", !!token);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(response) {
  const status = response.status;
  const text = await response.text().catch(() => "");
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  console.log(`[gpu.js] Response status: ${status}`, data);

  if (!response.ok) {
    if (status === 401) {
      const err = new Error("Unauthorized");
      err.status = 401;
      err.body = data;
      throw err;
    }
    const message = (data && (data.error || data.message)) || text || `HTTP ${status}`;
    const err = new Error(message);
    err.status = status;
    err.body = data;
    throw err;
  }

  return data;
}

// --- OBTENER TODAS LAS GPUs ---
export async function getGPUs() {
  console.log("[gpu.js] Llamando a GET GPUs...");
  try {
    const response = await fetch(API_URL, { headers: getAuthHeaders() });
    const data = await handleResponse(response);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("[gpu.js] Excepción en getGPUs:", err);
    throw err;
  }
}

// --- OBTENER PROVEEDORES ---
// Si no existe endpoint /proveedores, extrae proveedores embebidos en las GPUs
export async function getProveedores() {
  console.log("[gpu.js] Extrayendo proveedores desde getGPUs...");
  try {
    const gpus = await getGPUs();
    if (!Array.isArray(gpus) || gpus.length === 0) {
      console.log("[gpu.js] No hay GPUs para extraer proveedores.");
      return [];
    }

    const map = new Map();
    gpus.forEach((gpu) => {
      // posibles formas de venir el proveedor desde backend
      const p = gpu?.proveedor || gpu?.Proveedor || gpu?.ProveedorDTO || gpu?.provider || null;
      if (!p) return;

      // normalizar keys mínimas (crear objeto con nombres amigables)
      const proveedor = {
        IdProveedor: p.IdProveedor ?? p.idProveedor ?? p.Id ?? p.id ?? null,
        Nombre: p.Nombre ?? p.nombre ?? p.name ?? "",
        Direccion: p.Direccion ?? p.direccion ?? p.address ?? "",
        Telefono: p.Telefono ?? p.telefono ?? p.phone ?? "",
        Email: p.Email ?? p.email ?? "",
        raw: p,
      };

      // key única: preferir id, fallback email, fallback nombre
      const key = proveedor.IdProveedor ?? proveedor.Email ?? proveedor.Nombre ?? JSON.stringify(proveedor.raw);
      if (!map.has(key)) map.set(key, proveedor);
    });

    const proveedores = Array.from(map.values()).map(p => ({
      id: p.IdProveedor,
      nombre: p.Nombre,
      direccion: p.Direccion,
      telefono: p.Telefono,
      email: p.Email,
      _raw: p.raw,
    }));

    console.log("[gpu.js] Proveedores extraídos:", proveedores);
    return proveedores;
  } catch (err) {
    console.error("[gpu.js] Excepción en getProveedores (extracción):", err);
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
    const data = await handleResponse(response);
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
    const data = await handleResponse(response);
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
    const data = await handleResponse(response);
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
    const data = await handleResponse(response);
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
    await handleResponse(response);
    console.log("[gpu.js] GPU eliminada exitosamente");
    return true;
  } catch (err) {
    console.error("[gpu.js] Excepción en deleteGPU:", err);
    throw err;
  }
}
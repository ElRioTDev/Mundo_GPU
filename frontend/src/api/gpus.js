// ...existing code...
import axios from "axios";

// URL base del backend ASP.NET
const API_URL = "http://localhost:5157/api/gpu";

// helper para normalizar errores de axios
function formatAxiosError(err) {
  const e = new Error(err.message || "Network error");
  if (err.response) {
    e.status = err.response.status;
    e.body = err.response.data;
    e.message = (err.response.data && (err.response.data.error || err.response.data.message)) || err.message;
  } else if (err.request) {
    e.status = 0;
    e.body = null;
  }
  return e;
}

// --- OBTENER TODAS LAS GPUs ---
export async function getGPUs() {
  try {
    console.log("[gpu.js] Llamando a GET GPUs...");
    const resp = await axios.get(API_URL);
    return Array.isArray(resp.data) ? resp.data : [];
  } catch (err) {
    console.error("[gpu.js] Error en getGPUs:", err);
    throw formatAxiosError(err);
  }
}

// --- OBTENER PROVEEDORES --- (extrae proveedores embebidos)
export async function getProveedores() {
  try {
    console.log("[gpu.js] Extrayendo proveedores desde getGPUs...");
    const gpus = await getGPUs();
    if (!Array.isArray(gpus) || gpus.length === 0) return [];

    const map = new Map();
    gpus.forEach((gpu) => {
      const p = gpu?.proveedor || gpu?.Proveedor || gpu?.ProveedorDTO || gpu?.provider || null;
      if (!p) return;
      const proveedor = {
        IdProveedor: p.IdProveedor ?? p.idProveedor ?? p.Id ?? p.id ?? null,
        Nombre: p.Nombre ?? p.nombre ?? p.name ?? "",
        Direccion: p.Direccion ?? p.direccion ?? p.address ?? "",
        Telefono: p.Telefono ?? p.telefono ?? p.phone ?? "",
        Email: p.Email ?? p.email ?? "",
        raw: p,
      };
      const key = proveedor.IdProveedor ?? proveedor.Email ?? proveedor.Nombre ?? JSON.stringify(proveedor.raw);
      if (!map.has(key)) map.set(key, proveedor);
    });

    // devolver con claves compatibles: IdProveedor/Nombre y también id/nombre
    return Array.from(map.values()).map(p => ({
      IdProveedor: p.IdProveedor,
      Nombre: p.Nombre,
      Direccion: p.Direccion,
      Telefono: p.Telefono,
      Email: p.Email,
      id: p.IdProveedor,
      nombre: p.Nombre,
      _raw: p.raw,
    }));
  } catch (err) {
    console.error("[gpu.js] Error en getProveedores:", err);
    throw err;
  }
}

// --- OBTENER GPU POR ID ---
export async function getGPU(id) {
  if (!id) throw new Error("ID de GPU requerido");
  const idNum = Number(id);
  try {
    console.log("[gpu.js] Llamando a getGPU:", idNum);
    const resp = await axios.get(`${API_URL}/${idNum}`);
    return resp.data;
  } catch (err) {
    console.error("[gpu.js] Error en getGPU:", err);
    throw formatAxiosError(err);
  }
}

// --- BUSCAR GPU POR TÉRMINO ---
export async function searchGPU(searchTerm) {
  if (!searchTerm || searchTerm.trim() === "") return [];
  try {
    console.log("[gpu.js] Llamando a searchGPU:", searchTerm);
    const resp = await axios.get(`${API_URL}/search`, { params: { searchTerm } });
    return Array.isArray(resp.data) ? resp.data : [];
  } catch (err) {
    console.error("[gpu.js] Error en searchGPU:", err);
    throw formatAxiosError(err);
  }
}

// --- CREAR GPU ---
export async function createGPU(gpu = {}, proveedor = null) {
  try {
    console.log("[gpu.js] Llamando a createGPU:", { gpu, proveedor });
    const resp = await axios.post(API_URL, { Gpu: gpu, Proveedor: proveedor });
    return resp.data;
  } catch (err) {
    console.error("[gpu.js] Error en createGPU:", err);
    throw formatAxiosError(err);
  }
}

// --- ACTUALIZAR GPU ---
export async function updateGPU(id, gpu = {}, proveedor = null) {
  if (!id) throw new Error("ID de GPU requerido");
  const idNum = Number(id);
  try {
    console.log("[gpu.js] Llamando a updateGPU:", idNum, { gpu, proveedor });
    const resp = await axios.put(`${API_URL}/${idNum}`, { Gpu: gpu, Proveedor: proveedor });
    return resp.data;
  } catch (err) {
    console.error("[gpu.js] Error en updateGPU:", err);
    throw formatAxiosError(err);
  }
}

// --- ELIMINAR GPU ---
export async function deleteGPU(id) {
  if (!id) throw new Error("ID de GPU requerido");
  const idNum = Number(id);
  try {
    console.log("[gpu.js] Llamando a deleteGPU:", idNum);
    await axios.delete(`${API_URL}/${idNum}`);
    return true;
  } catch (err) {
    console.error("[gpu.js] Error en deleteGPU:", err);
    throw formatAxiosError(err);
  }
}
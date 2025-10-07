import axios from "axios";

// ============================
// URL base del backend ASP.NET MVC
// ============================
const API_URL = "http://localhost:5157/api/usuario";

// ============================
// Función: Registrar usuario
// ============================
export const register = async (data) => {
  try {
    console.log("[register.js] Intentando registrar usuario:", data.usuario || data.username);

    const response = await axios.post(`${API_URL}/register`, data, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("[register.js] Registro exitoso:", response.data);
    return response.data;

  } catch (error) {
    const errMsg = error.response?.data?.message || error.message || "Error al registrar usuario";
    console.error("[register.js] Error en registro:", errMsg);
    throw new Error(errMsg);
  }
};

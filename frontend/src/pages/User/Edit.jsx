import React, { useState } from "react";
import "./Edit.css";

const Edit = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    Nombre: user?.Nombre || "",
    Apellido: user?.Apellido || "",
    Sexo: user?.Sexo || "",
    Username: user?.Username || "",
    Password: user?.Password || "",
    Rol: user?.Rol || "",
    NivelAcademico: user?.NivelAcademico || "",
    Institucion: user?.Institucion || "",
  });

  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData, setErrors);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white text-center">
              <h3>Editar Usuario</h3>
            </div>
            <div className="card-body">
              {errors.length > 0 &&
                errors.map((err, idx) => (
                  <div key={idx} className="alert alert-danger">
                    {err}
                  </div>
                ))}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    name="Nombre"
                    className="form-control"
                    value={formData.Nombre}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Apellido</label>
                  <input
                    type="text"
                    name="Apellido"
                    className="form-control"
                    value={formData.Apellido}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Sexo</label>
                  <select
                    name="Sexo"
                    className="form-select"
                    value={formData.Sexo}
                    onChange={handleChange}
                  >
                    <option value="">-- Seleccione --</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    name="Username"
                    className="form-control"
                    value={formData.Username}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="Password"
                    className="form-control"
                    value={formData.Password}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Rol</label>
                  <select
                    name="Rol"
                    className="form-select"
                    value={formData.Rol}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione rol...</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="EMPLEADO">EMPLEADO</option>
                    <option value="ENCARGADO">ENCARGADO</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Nivel Académico</label>
                  <select
                    name="NivelAcademico"
                    className="form-select"
                    value={formData.NivelAcademico}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione nivel...</option>
                    <option value="Primaria">Primaria</option>
                    <option value="Secundaria">Secundaria</option>
                    <option value="Universidad">Universidad</option>
                    <option value="Postgrado">Postgrado</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Institución</label>
                  <input
                    type="text"
                    name="Institucion"
                    className="form-control"
                    value={formData.Institucion}
                    onChange={handleChange}
                  />
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-success">
                    Guardar Cambios
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onCancel}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;

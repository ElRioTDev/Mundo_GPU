import React, { useState, useEffect } from "react";
import "./Index.css";

const Index = ({ usuarios = [], onSearch, onDelete, onEdit, onDetails, successMsg, errorMsg, onCreate }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // DEBUG: loguear los datos que llegan a la vista para inspección
  useEffect(() => {
    console.log("[User/Index] usuarios prop:", usuarios);
    try {
      console.log("[User/Index] usuarios JSON:", JSON.stringify(usuarios, null, 2));
    } catch {
      // en caso de circular refs u otros problemas, evitar crash
      console.log("[User/Index] usuarios (no convertible a JSON)");
    }
  }, [usuarios]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
  };

  return (
    <div className="container mt-4">
      <h2>Usuarios</h2>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <p>
        <button className="btn btn-primary" onClick={onCreate}>Crear Nuevo Usuario</button>
      </p>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Rol</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Sexo</th>
            <th>Nivel Académico</th>
            <th>Institución</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((user) => (
              <tr key={user.Id}>
                <td>{user.Id}</td>
                <td>{user.Username}</td>
                <td>{user.Rol}</td>
                <td>{user.Nombre}</td>
                <td>{user.Apellido}</td>
                <td>{user.Sexo === "M" ? "Masculino" : user.Sexo === "F" ? "Femenino" : "Desconocido"}</td>
                <td>{user.NivelAcademico}</td>
                <td>{user.Institucion}</td>
                <td className="d-flex gap-1 flex-wrap">
                  <button className="btn btn-info btn-sm" onClick={() => onDetails(user.Id)}>Detalles</button>
                  <button className="btn btn-warning btn-sm" onClick={() => onEdit(user.Id)}>Editar</button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      if (window.confirm("¿Seguro que quieres eliminar este usuario?")) {
                        onDelete(user.Id);
                      }
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">No se encontraron usuarios.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Index;

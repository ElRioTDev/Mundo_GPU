import React from "react";
import "./Main.css";

const Main = ({ onGoToList, onCreateUser }) => {
  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Menú Principal</h2>
        </div>
        <div className="card-body">
          <p className="lead">
            Desde aquí puedes acceder a todas las acciones del CRUD de usuarios:
          </p>

          <div className="row row-cols-1 row-cols-md-2 g-3">
            <div className="col">
              <button
                className="btn btn-outline-primary w-100"
                onClick={onGoToList}
              >
                <i className="bi bi-list-ul me-2"></i> Lista de Usuarios
              </button>
            </div>
            <div className="col">
              <button
                className="btn btn-outline-success w-100"
                onClick={onCreateUser}
              >
                <i className="bi bi-person-plus me-2"></i> Crear Nuevo Usuario
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;

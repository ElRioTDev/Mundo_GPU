import React from 'react';
import { Link } from 'react-router-dom';
import './Index.css'; 

export default function HomeIndex() {
    return (
        <div className="container text-center mt-5">
            <h1 className="mb-5">Bienvenido</h1>

            <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to="/login" className="btn btn-primary btn-lg">
                    Iniciar Sesión
                </Link>
                <Link to="/registro" className="btn btn-secondary btn-lg">
                    Registrarse
                </Link>
            </div>
        </div>
    );
}

import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import "./Index.css";

export default function HomeIndex() {
    const { isAuthenticated, loading } = useAuth();

    // Si aún estamos validando la sesión, no forzamos redirección
    if (loading) {
        return null; // o un splash/loader
    }

    // Si ya está autenticado, redirigir al dashboard /gpu
    if (isAuthenticated) {
        return <Navigate to="/gpu" replace />;
    }

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

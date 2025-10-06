import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import './Index.css';

export default function LoginIndex() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Llamada a tu API de login
            const data = await login(username, password);

            // Guardar info de sesión localmente (puedes usar context o localStorage)
            localStorage.setItem('rol', data.rol);
            localStorage.setItem('username', data.username);

            // Redirigir a página de GPUs
            navigate('/gpu');
        } catch (err) {
            setError(err.error || 'Error desconocido');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5 col-lg-4">
                    <div className="card shadow-lg">
                        <div className="card-header bg-primary text-white text-center">
                            <h3>Iniciar Sesión</h3>
                        </div>
                        <div className="card-body p-4">
                            {error && <div className="alert alert-danger text-center">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Usuario</label>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        className="form-control"
                                        required
                                        placeholder="Ingresa tu usuario"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="form-control"
                                        required
                                        placeholder="Ingresa tu contraseña"
                                    />
                                </div>

                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary flex-fill">Ingresar</button>
                                    <Link to="/registro" className="btn btn-secondary flex-fill">Registrarse</Link>
                                </div>

                                <div className="text-center mt-3">
                                    <small>¿Olvidaste tu contraseña?</small>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';
import './Index.css';

export default function RegistroIndex() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        sexo: '',
        nivelAcademico: '',
        institucion: '',
        usuario: '',
        password: '',
        confirmarPassword: ''
    });

    const [errors, setErrors] = useState([]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        if (form.password !== form.confirmarPassword) {
            setErrors(['Las contraseñas no coinciden']);
            return;
        }

        try {
            await register(form); // Llama a tu API de registro
            navigate('/login'); // Redirige al login al registrarse
        } catch (err) {
            setErrors(err.errors || [err.message || 'Error desconocido']);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white text-center">
                            <h3>Registrarse</h3>
                        </div>
                        <div className="card-body">
                            {errors.length > 0 && (
                                <div className="alert alert-danger">
                                    {errors.map((err, idx) => <div key={idx}>{err}</div>)}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="nombre" className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        className="form-control"
                                        value={form.nombre}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="apellido" className="form-label">Apellido</label>
                                    <input
                                        type="text"
                                        id="apellido"
                                        name="apellido"
                                        className="form-control"
                                        value={form.apellido}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="sexo" className="form-label">Sexo</label>
                                    <select
                                        id="sexo"
                                        name="sexo"
                                        className="form-select"
                                        value={form.sexo}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">-- Seleccione --</option>
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="nivelAcademico" className="form-label">Nivel Académico</label>
                                    <select
                                        id="nivelAcademico"
                                        name="nivelAcademico"
                                        className="form-select"
                                        value={form.nivelAcademico}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">-- Seleccione --</option>
                                        <option value="Primaria">Primaria</option>
                                        <option value="Secundaria">Secundaria</option>
                                        <option value="Técnico">Técnico</option>
                                        <option value="Preuniversitario">Preuniversitario</option>
                                        <option value="Universitario">Universitario</option>
                                        <option value="Postgrado">Postgrado</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="institucion" className="form-label">Institución</label>
                                    <input
                                        type="text"
                                        id="institucion"
                                        name="institucion"
                                        className="form-control"
                                        placeholder="Ingrese el nombre de la institución"
                                        value={form.institucion}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="usuario" className="form-label">Nombre de Usuario</label>
                                    <input
                                        type="text"
                                        id="usuario"
                                        name="usuario"
                                        className="form-control"
                                        maxLength="16"
                                        value={form.usuario}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="form-control"
                                        maxLength="32"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="confirmarPassword" className="form-label">Confirmar Contraseña</label>
                                    <input
                                        type="password"
                                        id="confirmarPassword"
                                        name="confirmarPassword"
                                        className="form-control"
                                        maxLength="32"
                                        value={form.confirmarPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary">Registrarse</button>
                                    <Link to="/login" className="btn btn-secondary">Cancelar</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

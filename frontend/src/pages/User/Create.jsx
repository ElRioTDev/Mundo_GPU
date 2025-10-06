import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../api/users';
import './Create.css';

export default function CreateUser() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        Nombre: '',
        Apellido: '',
        Sexo: '',
        Username: '',
        Password: '',
        Rol: '',
        NivelAcademico: '',
        Institucion: ''
    });

    const [errors, setErrors] = useState([]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        try {
            const result = await createUser(form);
            if (result.success) {
                navigate('/user'); // Redirigir al index de usuarios
            } else {
                setErrors(result.errors || ['Error al crear usuario']);
            }
        } catch (err) {
            console.error(err);
            setErrors(['Error de servidor']);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white text-center">
                            <h3>Crear Usuario</h3>
                        </div>
                        <div className="card-body">

                            {/* Errores */}
                            {errors.length > 0 && (
                                <div className="alert alert-danger">
                                    {errors.map((err, idx) => <div key={idx}>{err}</div>)}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        name="Nombre"
                                        value={form.Nombre}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Apellido</label>
                                    <input
                                        type="text"
                                        name="Apellido"
                                        value={form.Apellido}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Sexo</label>
                                    <select
                                        name="Sexo"
                                        value={form.Sexo}
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">-- Seleccione --</option>
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Nombre de Usuario</label>
                                    <input
                                        type="text"
                                        name="Username"
                                        value={form.Username}
                                        onChange={handleChange}
                                        className="form-control"
                                        maxLength="16"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        name="Password"
                                        value={form.Password}
                                        onChange={handleChange}
                                        className="form-control"
                                        maxLength="32"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Rol</label>
                                    <select
                                        name="Rol"
                                        value={form.Rol}
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">-- Seleccione rol --</option>
                                        <option value="ADMIN">ADMIN</option>
                                        <option value="EMPLEADO">EMPLEADO</option>
                                        <option value="ENCARGADO">ENCARGADO</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Nivel Académico</label>
                                    <select
                                        name="NivelAcademico"
                                        value={form.NivelAcademico}
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">-- Seleccione nivel --</option>
                                        <option value="Primaria">Primaria</option>
                                        <option value="Secundaria">Secundaria</option>
                                        <option value="Preuniversitario">Preuniversitario</option>
                                        <option value="Universitario">Universitario</option>
                                        <option value="Postgrado">Postgrado</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Institución</label>
                                    <input
                                        type="text"
                                        name="Institucion"
                                        value={form.Institucion}
                                        onChange={handleChange}
                                        className="form-control"
                                        maxLength="100"
                                        placeholder="Nombre de la institución"
                                    />
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary">Crear Usuario</button>
                                    <button type="button" onClick={() => navigate('/user')} className="btn btn-secondary">Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

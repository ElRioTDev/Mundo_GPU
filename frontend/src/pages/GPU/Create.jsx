import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProveedores } from '../../api/gpus';
import { createGPU } from '../../api/gpus';
import './Create.css';

export default function CreateGPU() {
    const navigate = useNavigate();

    const [proveedores, setProveedores] = useState([]);
    const [form, setForm] = useState({
        Marca: '',
        Modelo: '',
        VRAM: '',
        NucleosCuda: '',
        RayTracing: false,
        Imagen: '',
        Precio: '',
        ProveedoresIdProveedor: 0,
        nuevoProveedorNombre: '',
        nuevoProveedorDireccion: '',
        nuevoProveedorTelefono: '',
        nuevoProveedorEmail: ''
    });

    const [errors, setErrors] = useState([]);

    useEffect(() => {
        async function fetchProveedores() {
            const data = await getProveedores();
            setProveedores(data || []);
        }
        fetchProveedores();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        try {
            await createGPU(form); // Llama a tu API de GPUs
            navigate('/gpu'); // Redirige al listado
        } catch (err) {
            setErrors(err.errors || [err.message || 'Error desconocido']);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Añadir GPU</h2>

            {errors.length > 0 && (
                <div className="alert alert-danger">
                    {errors.map((err, idx) => <div key={idx}>{err}</div>)}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="row g-3">

                    <div className="col-md-6">
                        <label className="form-label">Marca</label>
                        <input type="text" name="Marca" className="form-control" value={form.Marca} onChange={handleChange} required />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Modelo</label>
                        <input type="text" name="Modelo" className="form-control" value={form.Modelo} onChange={handleChange} required />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">VRAM</label>
                        <input type="text" name="VRAM" className="form-control" value={form.VRAM} onChange={handleChange} required />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Núcleos CUDA</label>
                        <input type="number" name="NucleosCuda" className="form-control" value={form.NucleosCuda} onChange={handleChange} required />
                    </div>

                    <div className="col-md-4 d-flex align-items-center">
                        <div className="form-check mt-4">
                            <input type="checkbox" name="RayTracing" className="form-check-input" checked={form.RayTracing} onChange={handleChange} />
                            <label className="form-check-label">Ray Tracing</label>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">URL Imagen</label>
                        <input type="text" name="Imagen" className="form-control" value={form.Imagen} onChange={handleChange} />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Precio</label>
                        <input type="number" step="0.01" name="Precio" className="form-control" value={form.Precio} onChange={handleChange} required />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Proveedor existente (opcional)</label>
                        <select name="ProveedoresIdProveedor" className="form-select" value={form.ProveedoresIdProveedor} onChange={handleChange}>
                            <option value={0}>-- Seleccionar proveedor existente --</option>
                            {proveedores.map(p => (
                                <option key={p.IdProveedor} value={p.IdProveedor}>{p.Nombre}</option>
                            ))}
                        </select>
                        <small className="text-muted">Opcional: selecciona un proveedor existente O crea uno nuevo abajo</small>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Crear nuevo proveedor (opcional)</label>
                        <input type="text" name="nuevoProveedorNombre" placeholder="Nombre *" className="form-control mb-1" value={form.nuevoProveedorNombre} onChange={handleChange} />
                        <input type="text" name="nuevoProveedorDireccion" placeholder="Dirección" className="form-control mb-1" value={form.nuevoProveedorDireccion} onChange={handleChange} />
                        <input type="text" name="nuevoProveedorTelefono" placeholder="Teléfono" className="form-control mb-1" value={form.nuevoProveedorTelefono} onChange={handleChange} />
                        <input type="email" name="nuevoProveedorEmail" placeholder="Email" className="form-control" value={form.nuevoProveedorEmail} onChange={handleChange} />
                        <small className="text-muted">Si completas el nombre, se creará un proveedor nuevo</small>
                    </div>

                    <div className="col-12 mt-3">
                        <button type="submit" className="btn btn-success w-100">Añadir GPU</button>
                    </div>

                    <div className="col-12 mt-2">
                        <button type="button" className="btn btn-secondary w-100" onClick={() => navigate('/gpu')}>Cancelar</button>
                    </div>

                </div>
            </form>
        </div>
    );
}

// ...existing code...
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProveedores, createGPU } from '../../api/gpus';
import './Create.css';

export default function CreateGPU() {
    const navigate = useNavigate();

    const [proveedores, setProveedores] = useState([]);
    const [form, setForm] = useState({
        Marca: '',
        Modelo: '',
        VRAM: '',
        NucleosCuda: '',           // mantener como string para el input number
        RayTracing: false,
        Imagen: '',
        Precio: '',                // mantener como string para el input number
        ProveedoresIdProveedor: 0, // select devuelve string, normalizar en submit
        nuevoProveedorNombre: '',
        nuevoProveedorDireccion: '',
        nuevoProveedorTelefono: '',
        nuevoProveedorEmail: ''
    });

    const [errors, setErrors] = useState([]);

    useEffect(() => {
        async function fetchProveedores() {
            try {
                const data = await getProveedores();
                setProveedores(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error al cargar proveedores:", err);
                setProveedores([]);
            }
        }
        fetchProveedores();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm(prev => {
            if (type === 'checkbox') {
                return { ...prev, [name]: checked };
            }

            // mantener número como string en el estado para evitar uncontrolled -> controlled
            if (name === 'NucleosCuda' || name === 'Precio' || name === 'ProveedoresIdProveedor') {
                return { ...prev, [name]: value };
            }

            return { ...prev, [name]: value };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        try {
            // validar campos mínimos
            if (!form.Marca.trim() || !form.Modelo.trim() || !form.VRAM.trim()) {
                setErrors(["Marca, Modelo y VRAM son obligatorios."]);
                return;
            }

            const gpuPayload = {
                Marca: form.Marca.trim(),
                Modelo: form.Modelo.trim(),
                VRAM: form.VRAM.trim(),
                NucleosCuda: Number(form.NucleosCuda) || 0,
                RayTracing: !!form.RayTracing,
                Imagen: form.Imagen ? form.Imagen.trim() : "",
                Precio: parseFloat(form.Precio) || 0,
                ProveedoresIdProveedor: Number(form.ProveedoresIdProveedor) || 0
            };

            const proveedorPayload =
                form.nuevoProveedorNombre && form.nuevoProveedorNombre.trim() !== ""
                    ? {
                        Nombre: form.nuevoProveedorNombre.trim(),
                        Direccion: form.nuevoProveedorDireccion?.trim() || "",
                        Telefono: form.nuevoProveedorTelefono?.trim() || "",
                        Email: form.nuevoProveedorEmail?.trim() || ""
                    }
                    : null;

            await createGPU(gpuPayload, proveedorPayload);
            navigate('/gpu');
        } catch (err) {
            console.error("Error createGPU:", err);
            // intentar obtener mensaje del formato de error que usamos en gpus.js
            const msg = (err.body && (err.body.error || err.body.message)) || err.message || "Error desconocido";
            setErrors(Array.isArray(msg) ? msg : [msg]);
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
                            <input type="checkbox" name="RayTracing" className="form-check-input" checked={!!form.RayTracing} onChange={handleChange} />
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
                                <option key={p.IdProveedor ?? p.id} value={p.IdProveedor ?? p.id}>{p.Nombre ?? p.nombre}</option>
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
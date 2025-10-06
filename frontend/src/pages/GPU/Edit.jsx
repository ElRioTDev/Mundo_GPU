import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGPU, updateGPU, getProveedores } from '../../api/gpus';
import './Edit.css';

export default function EditGPU() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [gpu, setGpu] = useState(null);
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        async function fetchData() {
            try {
                const [gpuData, proveedoresData] = await Promise.all([
                    getGPU(id),
                    getProveedores()
                ]);
                setGpu(gpuData);
                setProveedores(proveedoresData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setGpu(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setErrors({});
            await updateGPU(id, gpu);
            navigate(`/gpu/details/${id}`);
        } catch (err) {
            console.error(err);
            setErrors({ form: 'Error al guardar los cambios' });
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (!gpu) return <div>GPU no encontrada</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Editar GPU: {gpu.Modelo}</h2>

            {errors.form && <div className="alert alert-danger">{errors.form}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Marca</label>
                    <input
                        type="text"
                        name="Marca"
                        value={gpu.Marca}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Modelo</label>
                    <input
                        type="text"
                        name="Modelo"
                        value={gpu.Modelo}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">VRAM</label>
                    <input
                        type="text"
                        name="VRAM"
                        value={gpu.VRAM}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Núcleos CUDA</label>
                    <input
                        type="number"
                        name="NucleosCuda"
                        value={gpu.NucleosCuda}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        name="RayTracing"
                        checked={gpu.RayTracing}
                        onChange={handleChange}
                        className="form-check-input"
                    />
                    <label className="form-check-label">Ray Tracing</label>
                </div>

                <div className="mb-3">
                    <label className="form-label">Precio</label>
                    <input
                        type="number"
                        name="Precio"
                        value={gpu.Precio}
                        step="0.01"
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Proveedor</label>
                    <select
                        name="ProveedoresIdProveedor"
                        value={gpu.ProveedoresIdProveedor || ''}
                        onChange={handleChange}
                        className="form-select"
                    >
                        <option value="">-- Seleccione un proveedor --</option>
                        {proveedores.map(p => (
                            <option key={p.IdProveedor} value={p.IdProveedor}>{p.Nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">URL Imagen</label>
                    <input
                        type="text"
                        name="Imagen"
                        value={gpu.Imagen}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <button type="submit" className="btn btn-warning">Guardar cambios</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate(`/gpu/details/${gpu.IdGPU}`)}>Cancelar</button>
            </form>
        </div>
    );
}

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGPU, updateGPU, getProveedores } from '../../api/gpus';
import './Edit.css';

export default function EditGPU() {
    const { id } = useParams();
    const navigate = useNavigate();

    // 1) Estado inicial con todos los campos para inputs controlados
    const [gpu, setGpu] = useState({
        IdGPU: id ? Number(id) : 0,
        Marca: '',
        Modelo: '',
        VRAM: '',
        NucleosCuda: '', // string para el input number controlado
        RayTracing: false,
        Imagen: '',
        Precio: '', // string para control
        ProveedoresIdProveedor: '' // '' = sin selección
    });

    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const [gpuData, proveedoresData] = await Promise.all([
                    getGPU(id),
                    getProveedores()
                ]);

                // 2) Mapeo tolerante: aceptar camelCase o PascalCase desde la API
                const get = (obj, ...keys) => {
                    for (const k of keys) {
                        if (!obj) continue;
                        if (Object.prototype.hasOwnProperty.call(obj, k)) return obj[k];
                    }
                    return undefined;
                };

                const mapped = {
                    IdGPU: get(gpuData, 'IdGPU', 'idGPU', 'id') ?? Number(id),
                    Marca: get(gpuData, 'Marca', 'marca') ?? '',
                    Modelo: get(gpuData, 'Modelo', 'modelo') ?? '',
                    VRAM: get(gpuData, 'VRAM', 'vram') ?? '',
                    NucleosCuda:
                        get(gpuData, 'NucleosCuda', 'nucleosCuda', 'nucleos_cuda') != null
                            ? String(get(gpuData, 'NucleosCuda', 'nucleosCuda', 'nucleos_cuda'))
                            : '',
                    RayTracing: Boolean(get(gpuData, 'RayTracing', 'rayTracing', 'ray_tracing')),
                    Imagen: get(gpuData, 'Imagen', 'imagen') ?? '',
                    Precio:
                        get(gpuData, 'Precio', 'precio') != null
                            ? String(get(gpuData, 'Precio', 'precio'))
                            : '',
                    ProveedoresIdProveedor:
                        get(gpuData?.Proveedor, 'IdProveedor', 'id') ??
                        get(gpuData, 'ProveedoresIdProveedor', 'proveedoresIdProveedor', 'ProveedoresIdProveedor') ??
                        ''
                };

                setGpu(prev => ({ ...prev, ...mapped }));
                setProveedores(Array.isArray(proveedoresData) ? proveedoresData : []);
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

            // Validaciones cliente
            const errores = [];
            if (!gpu.Marca || !gpu.Marca.trim()) errores.push('Marca es obligatoria.');
            if (!gpu.Modelo || !gpu.Modelo.trim()) errores.push('Modelo es obligatorio.');
            if (!gpu.VRAM || !gpu.VRAM.trim()) errores.push('VRAM es obligatoria.');

            const nucleos = Number(gpu.NucleosCuda);
            const precio = parseFloat(gpu.Precio);
            if (!Number.isFinite(nucleos) || nucleos <= 0) errores.push('Núcleos CUDA debe ser un número mayor que 0.');
            if (!Number.isFinite(precio) || precio <= 0) errores.push('Precio debe ser un número mayor que 0.');

            if (errores.length > 0) {
                setErrors({ form: errores.join(' ') });
                return;
            }

            // Construir objeto para enviar al backend (tipos correctos)
            const gpuToSend = {
                IdGPU: Number(gpu.IdGPU),
                Marca: gpu.Marca.trim(),
                Modelo: gpu.Modelo.trim(),
                VRAM: gpu.VRAM.trim(),
                NucleosCuda: nucleos,
                RayTracing: !!gpu.RayTracing,
                Imagen: gpu.Imagen ? gpu.Imagen.trim() : '',
                Precio: precio,
                ProveedoresIdProveedor: gpu.ProveedoresIdProveedor ? Number(gpu.ProveedoresIdProveedor) : 0
            };

            await updateGPU(id, gpuToSend, null);
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
                        value={gpu.Marca ?? ''}
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
                        value={gpu.Modelo ?? ''}
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
                        value={gpu.VRAM ?? ''}
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
                        value={gpu.NucleosCuda ?? ''}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        name="RayTracing"
                        checked={!!gpu.RayTracing}
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
                        value={gpu.Precio ?? ''}
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
                        value={String(gpu.ProveedoresIdProveedor ?? '')}
                        onChange={handleChange}
                        className="form-select"
                    >
                        <option value="">-- Seleccione un proveedor --</option>
                        {proveedores.map(p => (
                            <option key={p.IdProveedor ?? p.id} value={p.IdProveedor ?? p.id}>{p.Nombre ?? p.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">URL Imagen</label>
                    <input
                        type="text"
                        name="Imagen"
                        value={gpu.Imagen ?? ''}
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
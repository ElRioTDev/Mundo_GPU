import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGPU } from '../../api/gpus';
import { useUserRole } from '../../hooks/useUserRole'; // hook para obtener rol del usuario
import './Details.css';

export default function DetailsGPU() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [gpu, setGpu] = useState(null);
    const [loading, setLoading] = useState(true);
    const rolUsuario = useUserRole(); // devuelve "ADMIN", "ENCARGADO", "EMPLEADO", etc.

    useEffect(() => {
        async function fetchGPU() {
            try {
                const data = await getGPU(id);
                setGpu(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchGPU();
    }, [id]);

    if (loading) return <div>Cargando...</div>;
    if (!gpu) return <div>GPU no encontrada</div>;

    return (
        <div className="container mt-5">
            <div className="row">
                {/* Imagen */}
                <div className="col-md-6 text-center mb-4">
                    <img 
                        src={gpu.Imagen} 
                        alt={gpu.Modelo} 
                        className="img-fluid rounded shadow" 
                        style={{ maxHeight: '350px', objectFit: 'cover' }} 
                    />
                </div>

                {/* Detalles */}
                <div className="col-md-6">
                    <h2 className="mb-3">{gpu.Modelo}</h2>
                    <ul className="list-group mb-3">
                        <li className="list-group-item"><strong>Marca:</strong> {gpu.Marca}</li>
                        <li className="list-group-item"><strong>VRAM:</strong> {gpu.VRAM}</li>
                        <li className="list-group-item"><strong>Núcleos CUDA:</strong> {gpu.NucleosCuda}</li>
                        <li className="list-group-item"><strong>Ray Tracing:</strong> {gpu.RayTracing ? 'Sí' : 'No'}</li>
                        <li className="list-group-item"><strong>Precio:</strong> {gpu.Precio.toLocaleString('es-NI', { style: 'currency', currency: 'NIO' })}</li>

                        {gpu.Proveedor && (
                            <>
                                <li className="list-group-item"><strong>Proveedor:</strong> {gpu.Proveedor.Nombre}</li>
                                <li className="list-group-item"><strong>Dirección:</strong> {gpu.Proveedor.Direccion}</li>
                                <li className="list-group-item"><strong>Teléfono:</strong> {gpu.Proveedor.Telefono}</li>
                                <li className="list-group-item"><strong>Email:</strong> {gpu.Proveedor.Email}</li>
                            </>
                        )}
                    </ul>

                    <button className="btn btn-secondary mb-2" onClick={() => navigate('/gpu')}>Volver a la lista</button>

                    <div className="d-flex gap-2">
                        {(rolUsuario === 'ADMIN' || rolUsuario === 'ENCARGADO') && (
                            <button className="btn btn-warning flex-grow-1" onClick={() => navigate(`/gpu/edit/${gpu.IdGPU}`)}>Editar</button>
                        )}
                        {rolUsuario === 'ADMIN' && (
                            <button className="btn btn-danger flex-grow-1" onClick={() => navigate(`/gpu/delete/${gpu.IdGPU}`)}>Borrar</button>
                        )}
                    </div>

                    {(rolUsuario === 'ADMIN' || rolUsuario === 'ENCARGADO') && (
                        <button 
                            className="btn btn-success flex-grow-1 mt-2"
                            onClick={() => window.open(`/api/export/gpu/${gpu.IdGPU}/excel`, '_blank')}
                        >
                            Exportar a Excel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

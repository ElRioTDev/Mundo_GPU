// ...existing code...
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// CORRECCIÓN: importar desde 'gpus' (plural)
import { getGPU } from '../../api/gpus';
// Usar userRole directamente desde el contexto (coincide con otros componentes)
import { useAuth } from '../../components/AuthContext';
import './Details.css';

export default function DetailsGPU() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userRole } = useAuth(); // <-- cambio aquí
    const role = (userRole || 'EMPLEADO').toUpperCase();

    const [gpu, setGpu] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGPU() {
            try {
                const data = await getGPU(id);
                setGpu(data);
            } catch (err) {
                console.error('[DetailsGPU] Error cargando GPU:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchGPU();
    }, [id]);

    if (loading) return <div>Cargando...</div>;
    if (!gpu) return <div>GPU no encontrada</div>;

    const canEdit = role === 'ADMIN' || role === 'ENCARGADO';
    const canDelete = role === 'ADMIN';

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 text-center mb-4">
                    <img 
                        src={gpu.imagen || '/placeholder.png'} 
                        alt={gpu.modelo || 'GPU'} 
                        className="img-fluid rounded shadow" 
                        style={{ maxHeight: '350px', objectFit: 'cover' }} 
                    />
                </div>

                <div className="col-md-6">
                    <h2 className="mb-3">{gpu.modelo || 'Desconocido'}</h2>
                    <ul className="list-group mb-3">
                        <li className="list-group-item"><strong>Marca:</strong> {gpu.marca || 'N/A'}</li>
                        <li className="list-group-item"><strong>VRAM:</strong> {gpu.vram || 'N/A'}</li>
                        <li className="list-group-item"><strong>Núcleos CUDA:</strong> {gpu.nucleosCuda ?? 'N/A'}</li>
                        <li className="list-group-item"><strong>Ray Tracing:</strong> {gpu.rayTracing ? 'Sí' : 'No'}</li>
                        <li className="list-group-item"><strong>Precio:</strong> {gpu.precio != null ? gpu.precio.toLocaleString('es-NI', { style: 'currency', currency: 'NIO' }) : 'N/A'}</li>
                        {gpu.proveedor && (
                            <>
                                <li className="list-group-item"><strong>Proveedor:</strong> {gpu.proveedor.nombre}</li>
                                <li className="list-group-item"><strong>Dirección:</strong> {gpu.proveedor.direccion}</li>
                                <li className="list-group-item"><strong>Teléfono:</strong> {gpu.proveedor.telefono}</li>
                                <li className="list-group-item"><strong>Email:</strong> {gpu.proveedor.email}</li>
                            </>
                        )}
                    </ul>

                    <button className="btn btn-secondary mb-2" onClick={() => navigate('/gpu')}>Volver a la lista</button>

                    <div className="d-flex gap-2">
                        {canEdit && (
                            <button className="btn btn-warning flex-grow-1" onClick={() => navigate(`/gpu/edit/${gpu.idGPU}`)}>Editar</button>
                        )}
                        {canDelete && (
                            <button className="btn btn-danger flex-grow-1" onClick={() => navigate(`/gpu/delete/${gpu.idGPU}`)}>Borrar</button>
                        )}
                    </div>


                </div>
            </div>
        </div>
    );
}
// ...existing code...
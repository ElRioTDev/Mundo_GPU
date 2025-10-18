import React, { useEffect, useState } from 'react';
import { Link, Outlet, useMatch } from 'react-router-dom';
import { getGPUs } from '../../api/gpus'; // <-- ruta corregida
import { useAuth } from '../../components/AuthContext'; // <-- ruta corregida
import './Index.css';

export default function GPUIndex() {
    const { userRole } = useAuth(); // obtenemos el rol desde el contexto
    const isAtIndex = useMatch({ path: '/gpu', end: true });

    const [gpus, setGpus] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                console.log('[GPUIndex] Llamando a getGPUs...');
                const data = await getGPUs();
                console.log('[GPUIndex] Datos recibidos:', data);
                setGpus(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('[GPUIndex] Error cargando GPUs:', err);
                setError('Error cargando GPUs desde el servidor.');
            }
        }
        fetchData();
    }, []);

    const handleSearch = (e) => {
        e?.preventDefault();
        console.log('[GPUIndex] Buscar GPU:', searchTerm);
        // Aquí puedes agregar búsqueda backend: llamar searchGPU(searchTerm) y setGpus(resultado)
    };

    // Definimos permisos según rol
    const canCreate = userRole === 'ADMIN' || userRole === 'ENCARGADO';
    const canEdit = userRole === 'ADMIN' || userRole === 'ENCARGADO';
    const canDelete = userRole === 'ADMIN';

    return (
        <div className="container mt-4">
            {isAtIndex && (
                <>
                    {/* Botones superiores según rol */}
                    <div className="mb-3 d-flex flex-wrap gap-2">
                        {canCreate && (
                            <Link to="/gpu/create" className="btn btn-primary">Añadir GPU</Link>
                        )}
                    </div>

                    {/* Mensaje de error */}
                    {error && <div className="alert alert-warning text-center">{error}</div>}

                    {/* Lista de GPUs */}
                    <div className="row">
                        {gpus.length === 0 && !error && (
                            <div className="col-12 text-center">No hay GPUs disponibles.</div>
                        )}

                        {gpus.map((item, index) => (
                            <div key={item?.idGPU ?? index} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                                <div className="card h-100 shadow-sm">
                                    <img
                                        src={item?.imagen || '/placeholder.png'}
                                        className="card-img-top"
                                        alt={item?.modelo || 'GPU'}
                                        style={{ height: '180px', objectFit: 'cover' }}
                                    />
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{item?.modelo || 'Desconocido'}</h5>
                                        <p className="card-text mb-1">Marca: {item?.marca || 'N/A'}</p>
                                        <p className="card-text mb-2">VRAM: {item?.vram || 'N/A'}</p>
                                        <p className="card-text mb-2">Núcleos CUDA: {item?.nucleosCuda ?? 'N/A'}</p>
                                        <p className="card-text mb-3">RayTracing: {item?.rayTracing ? 'Sí' : 'No'}</p>
                                        <p className="card-text fw-bold mb-3">
                                            Precio: {item?.precio != null && typeof item.precio === 'number' ? 
                                                item.precio.toLocaleString('es-ES', { style: 'currency', currency: 'USD' }) : 
                                                (item?.precio != null ? item.precio : 'N/A')}
                                        </p>

                                        {/* Botones según rol */}
                                        <div className="mt-auto d-flex gap-2">
                                            <Link to={`/gpu/details/${item?.idGPU}`} className="btn btn-primary flex-grow-1">Detalles</Link>

                                            {canEdit && (
                                                <Link to={`/gpu/edit/${item?.idGPU}`} className="btn btn-warning flex-grow-1">Editar</Link>
                                            )}

                                            {canDelete && (
                                                <Link to={`/gpu/delete/${item?.idGPU}`} className="btn btn-danger flex-grow-1">Borrar</Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Aquí se mostrarán las vistas hijas (create, edit, details, delete) */}
            <Outlet />
        </div>
    );
}
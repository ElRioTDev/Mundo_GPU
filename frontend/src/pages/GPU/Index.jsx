import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGPUs } from '../../api/gpus';
import './Index.css';

export default function GPUIndex({ userRole }) {
    const [gpus, setGpus] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getGPUs();
                setGpus(data);
            } catch (err) {
                console.error(err);
                setError('Error cargando GPUs');
            }
        }
        fetchData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        // Si quieres hacer búsqueda en frontend
        // const filtered = gpus.filter(g => g.Modelo.toLowerCase().includes(searchTerm.toLowerCase()));
        // setGpus(filtered);

        // Si la búsqueda es en backend, se haría llamada API aquí
        console.log('Buscar GPU:', searchTerm);
    };

    return (
        <div className="container mt-4">

            {/* Botones superiores */}
            <div className="mb-3 d-flex flex-wrap gap-2">
                {userRole === 'ADMIN' && (
                    <>
                        <Link to="/user/main" className="btn btn-success">Ir al Menú Principal</Link>
                        <Link to="/gpu/create" className="btn btn-primary">Añadir GPU</Link>
                    </>
                )}
                {(userRole === 'ADMIN' || userRole === 'ENCARGADO') && (
                    <a href="/api/export/gpus/excel" className="btn btn-success">Exportar lista completa a Excel</a>
                )}
            </div>

            {/* Formulario de búsqueda */}
            <form className="row g-3 mb-4" onSubmit={handleSearch}>
                <div className="col-auto">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar GPU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        required
                    />
                </div>
                <div className="col-auto">
                    <button type="submit" className="btn btn-primary mb-3">Buscar</button>
                </div>
            </form>

            {/* Mensaje de error */}
            {error && <div className="alert alert-warning text-center">{error}</div>}

            {/* Lista de GPUs */}
            <div className="row">
                {gpus.map(item => (
                    <div key={item.IdGPU} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                        <div className="card h-100 shadow-sm">
                            <img src={item.Imagen} className="card-img-top" alt={item.Modelo} style={{ height: '180px', objectFit: 'cover' }} />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{item.Modelo}</h5>
                                <p className="card-text mb-1">Marca: {item.Marca}</p>
                                <p className="card-text mb-2">VRAM: {item.VRAM}</p>
                                <p className="card-text mb-2">Núcleos CUDA: {item.NucleosCuda}</p>
                                <p className="card-text mb-3">RayTracing: {item.RayTracing ? 'Sí' : 'No'}</p>
                                <p className="card-text fw-bold mb-3">Precio: {item.Precio.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}</p>

                                {/* Botones según rol */}
                                <div className="mt-auto d-flex gap-2">
                                    <Link to={`/gpu/details/${item.IdGPU}`} className="btn btn-primary flex-grow-1">Detalles</Link>

                                    {(userRole === 'ADMIN' || userRole === 'ENCARGADO') && (
                                        <Link to={`/gpu/edit/${item.IdGPU}`} className="btn btn-warning flex-grow-1">Editar</Link>
                                    )}

                                    {userRole === 'ADMIN' && (
                                        <Link to={`/gpu/delete/${item.IdGPU}`} className="btn btn-danger flex-grow-1">Borrar</Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

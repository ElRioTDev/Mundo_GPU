// src/pages/User/Details.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../api/users'; // Ajusta según tu archivo api/users.js
import './Details.css';

const Details = () => {
    const { id } = useParams();
    const [usuario, setUsuario] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await axios.get(`/api/users/${id}`);
                setUsuario(response.data);
            } catch (err) {
                setError('Error al cargar el usuario.');
                console.error(err);
            }
        };

        fetchUsuario();
    }, [id]);

    if (error) return <div className="alert alert-danger text-center">{error}</div>;
    if (!usuario) return <div>Cargando...</div>;

    return (
        <div className="container mt-5">
            <h2>Detalles del Usuario</h2>

            <div className="card shadow-sm">
                <div className="card-body">
                    <dl className="row">
                        <dt className="col-sm-3">ID</dt>
                        <dd className="col-sm-9">{usuario.id}</dd>

                        <dt className="col-sm-3">Username</dt>
                        <dd className="col-sm-9">{usuario.username}</dd>

                        <dt className="col-sm-3">Rol</dt>
                        <dd className="col-sm-9">{usuario.rol}</dd>

                        <dt className="col-sm-3">Nombre</dt>
                        <dd className="col-sm-9">{usuario.nombre}</dd>

                        <dt className="col-sm-3">Apellido</dt>
                        <dd className="col-sm-9">{usuario.apellido}</dd>

                        <dt className="col-sm-3">Sexo</dt>
                        <dd className="col-sm-9">
                            {usuario.sexo === 'M'
                                ? 'Masculino'
                                : usuario.sexo === 'F'
                                ? 'Femenino'
                                : 'Desconocido'}
                        </dd>
                    </dl>

                    <div className="d-flex gap-2 mt-3">
                        <Link to={`/user/edit/${usuario.id}`} className="btn btn-warning flex-fill">
                            Editar
                        </Link>
                        <Link to="/user" className="btn btn-secondary flex-fill">
                            Volver a la lista
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Details;

import React, { useState } from "react";
import { Table, Button, Pagination } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaUsuarios = ({
    usuarios,
    abrirModalEdicion,
    abrirModalEliminacion,
}) => {

    const [paginaActual, setPaginaActual] = useState(1);

const registrosPorPagina = 6;

const indiceUltimo = paginaActual * registrosPorPagina;
const indicePrimero = indiceUltimo - registrosPorPagina;

const usuariosPaginados = usuarios.slice(
    indicePrimero,
    indiceUltimo
);

const totalPaginas = Math.ceil(
    usuarios.length / registrosPorPagina
);

    return (
        <>

            {!usuarios || usuarios.length === 0 ? (

                <div className="text-center">
                    <h5>No hay usuarios registrados</h5>
                </div>

            ) : ( 
                <>

                <Table
                    striped
                    hover
                    responsive
                    className="align-middle"
                >

                    <thead className="table-light">

                        <tr>

                            <th>ID</th>

                            <th>Rol</th>

                            <th>Cédula</th>

                            <th>Nombre Completo</th>

                            <th>Teléfono</th>

                            <th className="d-none d-md-table-cell">
                                Dirección
                            </th>

                            <th>Email</th>

                            <th>Licencia</th>

                            <th className="text-center">
                                Acciones
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {usuariosPaginados.map((usuario) => (

                            <tr key={usuario.id_usuario}>

                                <td>{usuario.id_usuario}</td>

                                {/* ROL */}
                                <td>

                                    <span
                                        className={`badge px-3 py-2 ${
                                            usuario.rol === "admin"
                                                ? "bg-danger"
                                                : "bg-primary"
                                        }`}
                                    >

                                        {usuario.rol}

                                    </span>

                                </td>

                                {/* CEDULA */}
                                <td>{usuario.cedula}</td>

                                {/* NOMBRE COMPLETO */}
                                <td>

                                    {usuario.nombre1}{" "}
                                    {usuario.nombre2}{" "}
                                    {usuario.apellido1}{" "}
                                    {usuario.apellido2}

                                </td>

                                {/* TELEFONO */}
                                <td>{usuario.telefono}</td>

                                {/* DIRECCION */}
                                <td className="d-none d-md-table-cell">
                                    {usuario.direccion}
                                </td>

                                {/* EMAIL */}
                                <td>{usuario.email}</td>

                                {/* LICENCIA */}
                                <td>{usuario.licencia}</td>

                                {/* BOTONES */}
                                <td className="text-center">

                                    <Button
                                        variant="outline-warning"
                                        size="sm"
                                        className="me-1"
                                        onClick={() =>
                                            abrirModalEdicion(usuario)
                                        }
                                    >

                                        <i className="bi bi-pencil"></i>

                                    </Button>

                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() =>
                                            abrirModalEliminacion(usuario)
                                        }
                                    >

                                        <i className="bi bi-trash"></i>

                                    </Button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </Table>

                
                <div className="d-flex justify-content-center mt-3">
    <Pagination>

        <Pagination.Prev
    disabled={paginaActual === 1}
    onClick={() =>
        setPaginaActual(paginaActual - 1)
    }
>
    <i className="bi bi-chevron-left"></i>
    
</Pagination.Prev>

        {[...Array(totalPaginas)].map((_, index) => (
            <Pagination.Item
                key={index + 1}
                active={index + 1 === paginaActual}
                onClick={() =>
                    setPaginaActual(index + 1)
                }
            >
                {index + 1}
            </Pagination.Item>
        ))}

        <Pagination.Next
    disabled={paginaActual === totalPaginas}
    onClick={() =>
        setPaginaActual(paginaActual + 1)
    }
>
    <i className="bi bi-chevron-right"></i>
</Pagination.Next>

    </Pagination>
</div>
</>
            )}

        </>
    );
    
};

export default TablaUsuarios;
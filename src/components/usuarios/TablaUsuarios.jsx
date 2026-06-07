import React from "react";
import { Table, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaUsuarios = ({
    usuarios,
    abrirModalEdicion,
    abrirModalEliminacion,
}) => {

    return (
        <>

            {!usuarios || usuarios.length === 0 ? (

                <div className="text-center">
                    <h5>No hay usuarios registrados</h5>
                </div>

            ) : (

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

                        {usuarios.map((usuario) => (

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

            )}

        </>
    );
};

export default TablaUsuarios;
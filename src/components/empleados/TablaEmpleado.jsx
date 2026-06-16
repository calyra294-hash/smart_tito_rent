import React, { useState } from "react";
import { Table, Button, Pagination } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaEmpleado = ({
    empleados,
    abrirModalEdicion,
    abrirModalEliminacion,
}) => {


    const [paginaActual, setPaginaActual] = useState(1);

const registrosPorPagina = 6;

const indiceUltimo = paginaActual * registrosPorPagina;
const indicePrimero = indiceUltimo - registrosPorPagina;

const empleadosPaginados = (empleados || []).slice(
    indicePrimero,
    indiceUltimo
);

const totalPaginas = Math.ceil(
    (empleados?.length || 0) / registrosPorPagina
);

    return (
        <>
            {!empleados || empleados.length === 0 ? (
                <div className="text-center">
                    <h5>No hay empleados registrados</h5>
                </div>
            ) : (

                <>

            
                <Table striped bordered hover responsive size="sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Rol</th>
                            <th>Nombre Completo</th>
                            <th>Apellidos</th>
                            <th>Dirección</th>
                            <th>Email</th>
                            <th>Fecha Contratación</th>
                            <th>Cédula</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {empleadosPaginados.map((emp) => (
                            <tr key={emp.id_empleado}>
                                
                                {/* ID */}
                                <td>{emp.id_empleado}</td>

                                {/* Rol con colores */}
                                <td>
                                    <span
                                        className={`badge ${
                                            emp.rol === "Administrador"
                                                ? "bg-primary"
                                                : emp.rol === "Mecánico"
                                                ? "bg-warning text-dark"
                                                : "bg-success"
                                        }`}
                                    >
                                        {emp.rol}
                                    </span>
                                </td>

                                {/* Nombre */}
                                <td>
                                    {emp.primer_nombre} {emp.segundo_nombre}
                                </td>

                                {/* Apellidos */}
                                <td>
                                    {emp.primer_apellido} {emp.segundo_apellido}
                                </td>

                                {/* Dirección */}
                                <td>{emp.direccion}</td>

                                {/* Email */}
                                <td>{emp.email}</td>

                                {/* Fecha */}
                                <td>{emp.fecha_contratacion || "-"}</td>

                                {/* Cédula */}
                                <td>{emp.cedula || "-"}</td>

                                {/* Acciones */}
                                <td className="text-center">
                                    <Button
                                        variant="outline-warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => abrirModalEdicion(emp)}
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </Button>

                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => abrirModalEliminacion(emp)}
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

export default TablaEmpleado;
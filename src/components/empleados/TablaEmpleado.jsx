import React from "react";
import { Table, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaEmpleado = ({
    empleados,
    abrirModalEdicion,
    abrirModalEliminacion,
}) => {

    return (
        <>
            {!empleados || empleados.length === 0 ? (
                <div className="text-center">
                    <h5>No hay empleados registrados</h5>
                </div>
            ) : (
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
                        {empleados.map((emp) => (
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
            )}
        </>
    );
};

export default TablaEmpleado;
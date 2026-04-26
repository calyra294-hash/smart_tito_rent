import React, { useState, useEffect } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaMantenimiento = ({
    mantenimientos,
    abrirModalEdicion,
    abrirModalEliminacion,
}) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false); // 👈 simplificado (ya no hace falta validar length)
    }, [mantenimientos]);

    return (
        <>
            {loading ? (
                <div className="text-center">
                    <h4>Cargando mantenimientos...</h4>
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Table striped bordered hover responsive size="sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Descripción</th>
                            <th>Justificación</th>
                            <th>Fecha Inicio</th>
                            <th>Fecha Fin</th>
                            <th>Costo</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {!mantenimientos || mantenimientos.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    No hay mantenimientos registrados
                                </td>
                            </tr>
                        ) : (
                            mantenimientos.map((m) => (
                                <tr key={m.id_mantenimiento}>
                                    <td>{m.id_mantenimiento}</td>
                                    <td>{m.descripcion}</td>
                                    <td>{m.justificacion}</td>
                                    <td>{m.fecha_inicio}</td>
                                    <td>{m.fecha_fin}</td>
                                    <td>${m.costo}</td>

                                    <td className="text-center">
                                        <Button
                                            variant="outline-warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => abrirModalEdicion(m)}
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </Button>

                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => abrirModalEliminacion(m)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}
        </>
    );
};

export default TablaMantenimiento;
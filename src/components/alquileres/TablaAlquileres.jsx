import React, { useState, useEffect } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaAlquileres = ({
    alquileres,
    abrirModalEdicion,
    abrirModalEliminacion,
}) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (alquileres && alquileres.length > 0) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [alquileres]);

    return (
        <>
            {loading ? (
                <div className="text-center">
                    <h4>Cargando alquileres...</h4>
                    <Spinner animation="border" variant="success" role="status" />
                </div>
            ) : (
                <Table striped borderless hover responsive size="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Fecha Inicio</th>
                            <th className="d-none d-md-table-cell">Fecha Fin</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alquileres.map((alquiler) => (
                            <tr key={alquiler.id_alquiler}>
                                <td>{alquiler.id_alquiler}</td>
                                <td>{alquiler.fecha_inicio}</td>
                                <td className="d-none d-md-table-cell">
                                    {alquiler.fecha_fin}
                                </td>
                                <td className="text-center">
                                    <Button
                                        variant="outline-warning"
                                        size="sm"
                                        className="m-1"
                                        onClick={() => abrirModalEdicion(alquiler)}
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </Button>

                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => abrirModalEliminacion(alquiler)}
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

export default TablaAlquileres;
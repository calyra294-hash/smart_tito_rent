import React, { useState, useEffect } from "react";
import { Table, Spinner, Button, Pagination } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaMantenimiento = ({
    mantenimientos,
    abrirModalEdicion,
    abrirModalEliminacion,
    verDetalleMantenimiento,
}) => {

    const [loading, setLoading] = useState(true);

    const [paginaActual, setPaginaActual] = useState(1);

const registrosPorPagina = 6;

const indiceUltimo = paginaActual * registrosPorPagina;
const indicePrimero = indiceUltimo - registrosPorPagina;

const mantenimientosPaginados = (mantenimientos || []).slice(
    indicePrimero,
    indiceUltimo
);

const totalPaginas = Math.ceil(
    (mantenimientos?.length || 0) / registrosPorPagina
);

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

                <>

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
                            mantenimientosPaginados.map((m) => (
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
                                            className="me-2"
                                            onClick={() => abrirModalEliminacion(m)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </Button>

                                        <Button
                                            variant="outline-info"
                                            size="sm"
                                            onClick={() => verDetalleMantenimiento(m.id_mantenimiento)}
                                        >
                                            <i className="bi bi-eye"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
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

export default TablaMantenimiento;
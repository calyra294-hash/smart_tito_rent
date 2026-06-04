import React, { useState, useEffect } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaMantenimiento = ({
    mantenimientos = [],
    abrirModalEdicion,
    abrirModalEliminacion,
    verDetalleMantenimiento,
}) => {
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (mantenimientos) setCargando(false);
    }, [mantenimientos]);

    if (cargando) {
        return (
            <div className="text-center my-4">
                <Spinner animation="border" variant="danger" />
            </div>
        );
    }

    if (!mantenimientos || mantenimientos.length === 0) {
        return (
            <div className="text-center py-4 bg-white rounded-3 shadow-sm">
                <i className="bi bi-clipboard-x fs-2 text-muted"></i>
                <h6 className="mt-2 text-muted">No hay mantenimientos registrados</h6>
            </div>
        );
    }

    return (
        <div className="lista-tarjetas-movil">
            {mantenimientos.map((m) => (
                <Card
                    key={m.id_mantenimiento}
                    className="mb-3 border-0 rounded-3 shadow-sm tarjeta-mantenimiento-movil"
                >
                    <Card.Body className="p-3">
                        {/* FILA DE INFORMACIÓN */}
                        <Row className="align-items-start gx-2 mb-2">
                            <Col xs={9}>
                                <div className="fw-bold text-dark text-truncate mb-1" style={{ fontSize: "1.1rem" }}>
                                    {m.descripcion}
                                </div>
                                <div className="small text-muted text-truncate mb-2">
                                    {m.justificacion}
                                </div>
                                <div className="small text-secondary">
                                    <i className="bi bi-calendar3 text-danger me-1"></i>
                                    {m.fecha_inicio} al {m.fecha_fin}
                                </div>
                            </Col>
                            <Col xs={3} className="text-end">
                                <div className="fw-bold text-danger" style={{ fontSize: "1.1rem" }}>
                                    ${Number(m.costo).toLocaleString()}
                                </div>
                            </Col>
                        </Row>

                        <hr className="my-2 text-muted opacity-25" />

                        {/* FILA DE BOTONES: Siempre visibles y amplios para pantallas táctiles */}
                        <div className="d-flex justify-content-end gap-2 pt-1">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                className="px-2"
                                onClick={() => verDetalleMantenimiento(m.id_mantenimiento)}
                            >
                                <i className="bi bi-eye"></i> Detalle
                            </Button>
                            <Button
                                variant="outline-warning"
                                size="sm"
                                className="px-2"
                                onClick={() => abrirModalEdicion(m)}
                            >
                                <i className="bi bi-pencil"></i> Editar
                            </Button>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                className="px-2"
                                onClick={() => abrirModalEliminacion(m)}
                            >
                                <i className="bi bi-trash"></i> Eliminar
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export default TarjetaMantenimiento;
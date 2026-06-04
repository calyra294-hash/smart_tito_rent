import React, { useState, useEffect } from "react";
import { Card, Row, Col, Spinner, Button, Badge } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaAlquiler = ({
    alquileres = [],
    abrirModalEdicion,
    abrirModalEliminacion,
    verDetalleAlquiler,
}) => {
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (alquileres) setCargando(false);
    }, [alquileres]);

    // Colores semánticos para el estado del alquiler
    const obtenerColorEstado = (estado) => {
        if (estado === "En curso") return "success";
        if (estado === "Finalizado") return "primary";
        if (estado === "En espera") return "warning";
        return "danger"; // Cancelado
    };

    if (cargando) {
        return (
            <div className="text-center my-4">
                <Spinner animation="border" variant="success" />
                <h5 className="text-muted mt-2">Cargando alquileres...</h5>
            </div>
        );
    }

    if (!alquileres || alquileres.length === 0) {
        return (
            <div className="text-center py-4 bg-white rounded-3 shadow-sm">
                <i className="bi bi-calendar-x text-muted fs-2"></i>
                <h6 className="mt-2 text-muted">No hay alquileres registrados</h6>
            </div>
        );
    }

    return (
        <div className="lista-tarjetas-movil">
            {alquileres.map((alquiler) => (
                <Card
                    key={alquiler.id_alquiler}
                    className="mb-3 border-0 rounded-3 shadow-sm"
                    style={{ borderLeft: "4px solid #b91c1c" }} // Detalle estético consistente
                >
                    <Card.Body className="p-3">
                        {/* FILA DE INFORMACIÓN COMPLETA */}
                        <Row className="align-items-start gx-2 mb-2">
                            {/* ICONO */}
                            <Col xs={2}>
                                <div className="bg-light d-flex align-items-center justify-content-center rounded-circle" style={{ height: "45px", width: "45px", border: "1px solid #e9ecef" }}>
                                    <i className="bi bi-key-fill fs-4 text-secondary"></i>
                                </div>
                            </Col>

                            {/* DETALLES DE LAS FECHAS Y DATOS */}
                            <Col xs={10} className="ps-2">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="fw-bold text-dark" style={{ fontSize: "1.05rem" }}>
                                        Ref: #{alquiler.id_alquiler}
                                    </div>
                                    <Badge bg={obtenerColorEstado(alquiler.estado)}>
                                        {alquiler.estado}
                                    </Badge>
                                </div>

                                {/* Si en tu base de datos traes nombres de clientes/vehículos puedes ponerlos aquí */}
                                {alquiler.cliente && (
                                    <div className="small fw-semibold text-secondary mt-1">
                                        <i className="bi bi-person me-1"></i> {alquiler.cliente}
                                    </div>
                                )}

                                <div className="small text-muted mt-1">
                                    <i className="bi bi-calendar-play me-1 text-success"></i> 
                                    <span className="fw-medium">Inicio:</span> {alquiler.fecha_inicio}
                                </div>
                                <div className="small text-muted">
                                    <i className="bi bi-calendar-stop me-1 text-danger"></i> 
                                    <span className="fw-medium">Fin:</span> {alquiler.fecha_fin}
                                </div>

                                {/* Si manejas un total o costo en la tabla, se renderiza de forma limpia */}
                                {alquiler.total && (
                                    <div className="small fw-bold text-dark mt-1">
                                        <i className="bi bi-cash-stack me-1 text-success"></i>
                                        Total: ${Number(alquiler.total).toLocaleString()}
                                    </div>
                                )}
                            </Col>
                        </Row>

                        <hr className="my-2 text-muted opacity-25" />

                        {/* FILA DE ACCIONES DIRECTAS SIN INTERRUPCIONES */}
                        <div className="d-flex justify-content-end gap-2 pt-1">
                            <Button
                                variant="outline-warning"
                                size="sm"
                                className="px-3 d-flex align-items-center gap-1"
                                onClick={() => abrirModalEdicion(alquiler)}
                            >
                                <i className="bi bi-pencil"></i> Editar
                            </Button>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                className="px-3 d-flex align-items-center gap-1"
                                onClick={() => abrirModalEliminacion(alquiler)}
                            >
                                <i className="bi bi-trash"></i> Eliminar
                            </Button>

                            <Button
                                variant="outline-info"
                                size="sm"
                                className="px-3 d-flex align-items-center gap-1"
                                onClick={() => verDetalleAlquiler(alquiler.id_alquiler)}
                            >
                                <i className="bi bi-eye"></i> Detalle
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export default TarjetaAlquiler;
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Spinner, Button, Badge } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaEmpleado = ({
    empleados = [],
    abrirModalEdicion,
    abrirModalEliminacion,
}) => {
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (empleados) {
            setCargando(false);
        }
    }, [empleados]);

    const obtenerColorRol = (rol) => {
        if (rol === "Administrador") return "primary";
        if (rol === "Mecánico") return "success";
        if (rol === "Agente de Alquiler") return "warning";
        return "secondary";
    };

    if (cargando) {
        return (
            <div className="text-center my-4">
                <Spinner animation="border" variant="danger" />
                <h5 className="text-muted mt-2">Cargando empleados...</h5>
            </div>
        );
    }

    if (!empleados || empleados.length === 0) {
        return (
            <div className="text-center py-4 bg-white rounded-3 shadow-sm">
                <i className="bi bi-person-x fs-2 text-muted"></i>
                <h6 className="mt-2 text-muted">No hay empleados registrados</h6>
            </div>
        );
    }

    return (
        <div className="lista-tarjetas-movil">
            {empleados.map((empleado) => (
                <Card
                    key={empleado.id_empleado}
                    className="mb-3 border-0 rounded-3 shadow-sm"
                    style={{ borderLeft: "4px solid #b91c1c" }} // Mantenemos el toque distintivo de la marca
                >
                    <Card.Body className="p-3">
                        {/* FILA DE INFORMACIÓN */}
                        <Row className="align-items-start gx-2 mb-2">
                            {/* ICONO / AVATAR */}
                            <Col xs={2}>
                                <div className="bg-light d-flex align-items-center justify-content-center rounded-circle" style={{ height: "45px", width: "45px", border: "1px solid #e9ecef" }}>
                                    <i className="bi bi-person fs-4 text-secondary"></i>
                                </div>
                            </Col>

                            {/* INFORMACIÓN PRINCIPAL */}
                            <Col xs={10} className="ps-2">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="fw-bold text-dark text-truncate" style={{ fontSize: "1.05rem" }}>
                                        {empleado.primer_nombre} {empleado.primer_apellido}
                                    </div>
                                    <Badge bg={obtenerColorRol(empleado.rol)} className="ms-1">
                                        {empleado.rol}
                                    </Badge>
                                </div>
                                
                                <div className="small text-muted text-truncate mt-1">
                                    <i className="bi bi-envelope me-1"></i> {empleado.email}
                                </div>

                                <div className="small text-muted text-truncate">
                                    <i className="bi bi-card-text me-1"></i> Cédula: {empleado.cedula}
                                </div>

                                <div className="small text-secondary mt-1" style={{ fontSize: "0.80rem" }}>
                                    <i className="bi bi-calendar-check me-1 text-danger"></i>
                                    Contratación:{" "}
                                    {empleado.fecha_contratacion
                                        ? new Date(empleado.fecha_contratacion).toLocaleDateString("es-NI")
                                        : "N/A"}
                                </div>
                            </Col>
                        </Row>

                        <hr className="my-2 text-muted opacity-25" />

                        {/* FILA DE BOTONES: Siempre visibles para que interactúen directo en el celular */}
                        <div className="d-flex justify-content-end gap-2 pt-1">
                            <Button
                                variant="outline-warning"
                                size="sm"
                                className="px-3 d-flex align-items-center gap-1"
                                onClick={() => abrirModalEdicion(empleado)}
                            >
                                <i className="bi bi-pencil"></i> Editar
                            </Button>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                className="px-3 d-flex align-items-center gap-1"
                                onClick={() => abrirModalEliminacion(empleado)}
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

export default TarjetaEmpleado;
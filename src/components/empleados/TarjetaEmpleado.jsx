import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button, Badge } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaEmpleado = ({
    empleados,
    abrirModalEdicion,
    abrirModalEliminacion,
}) => {
    const [cargando, setCargando] = useState(true);
    const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

    useEffect(() => {
        setCargando(!(empleados && empleados.length > 0));
    }, [empleados]);

    const manejarTeclaEscape = useCallback((evento) => {
        if (evento.key === "Escape") setIdTarjetaActiva(null);
    }, []);

    useEffect(() => {
        window.addEventListener("keydown", manejarTeclaEscape);
        return () => window.removeEventListener("keydown", manejarTeclaEscape);
    }, [manejarTeclaEscape]);

    const alternarTarjetaActiva = (id) => {
        setIdTarjetaActiva((anterior) => (anterior === id ? null : id));
    };


    const obtenerColorRol = (rol) => {
        if (rol === "Administrador") return "primary";
        if (rol === "Mecánico") return "success";
        if (rol === "Agente de Alquiler") return "warning";
        return "secondary";
    };

    return (
        <>
            {cargando ? (
                <div className="text-center my-5">
                    <h5>Cargando empleados...</h5>
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <div>
                    {empleados.map((empleado) => {
                        const activa = idTarjetaActiva === empleado.id_empleado;

                        return (
                            <Card
                                key={empleado.id_empleado}
                                className="mb-3 border-0 rounded-3 shadow-sm w-100"
                                onClick={() => alternarTarjetaActiva(empleado.id_empleado)}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        alternarTarjetaActiva(empleado.id_empleado);
                                    }
                                }}
                            >
                                <Card.Body className="p-2">

                                    <Row className="align-items-center gx-3">

                                        {/* ICONO */}
                                        <Col xs={2}>
                                            <div className="bg-light d-flex align-items-center justify-content-center rounded" style={{ height: "60px" }}>
                                                <i className="bi bi-person-badge fs-3 text-muted"></i>
                                            </div>
                                        </Col>

                                        {/* INFO */}
                                        <Col xs={6}>
                                            <div className="fw-semibold text-truncate">
                                                {empleado.primer_nombre} {empleado.primer_apellido}
                                            </div>

                                            <div className="small text-muted text-truncate">
                                                {empleado.email}
                                            </div>

                                            <div className="small text-muted text-truncate">
                                                Cédula: {empleado.cedula}
                                            </div>

                                            <div className="small text-muted">
                                                Contratación:{" "}
                                                {empleado.fecha_contratacion
                                                    ? new Date(empleado.fecha_contratacion).toLocaleDateString("es-NI")
                                                    : "N/A"}
                                            </div>
                                        </Col>

                                        {/* ROL */}
                                        <Col xs={4} className="text-end">
                                            <Badge bg={obtenerColorRol(empleado.rol)}>
                                                {empleado.rol}
                                            </Badge>
                                        </Col>

                                    </Row>
                                </Card.Body>

                                {/* ACCIONES */}
                                {activa && (
                                    <div className="p-2 d-flex justify-content-end gap-2 border-top">
                                        <Button
                                            variant="outline-warning"
                                            size="sm"
                                            onClick={() => {
                                                abrirModalEdicion(empleado);
                                                setIdTarjetaActiva(null);
                                            }}
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </Button>

                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => {
                                                abrirModalEliminacion(empleado);
                                                setIdTarjetaActiva(null);
                                            }}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}
        </>
    );
};

export default TarjetaEmpleado;
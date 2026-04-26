import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button, Badge } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaAlquiler = ({
    alquileres,
    abrirModalEdicion,
    abrirModalEliminacion,
}) => {
    const [cargando, setCargando] = useState(true);
    const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

    useEffect(() => {
        setCargando(!(alquileres && alquileres.length > 0));
    }, [alquileres]);

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

    // 🔥 colores del estado
    const obtenerColorEstado = (estado) => {
        if (estado === "En curso") return "success";
        if (estado === "Finalizado") return "primary";
        if (estado === "En espera") return "warning";
        return "danger"; // Cancelado
    };

    return (
        <>
            {cargando ? (
                <div className="text-center my-5">
                    <h5>Cargando alquileres...</h5>
                    <Spinner animation="border" variant="success" role="status" />
                </div>
            ) : (
                <div>
                    {alquileres.map((alquiler) => {
                        const tarjetaActiva = idTarjetaActiva === alquiler.id_alquiler;

                        return (
                            <Card
                                key={alquiler.id_alquiler}
                                className="mb-3 border-0 rounded-3 shadow-sm w-100 tarjeta-alquiler-contenedor"
                                onClick={() => alternarTarjetaActiva(alquiler.id_alquiler)}
                                tabIndex={0}
                                onKeyDown={(evento) => {
                                    if (evento.key === "Enter" || evento.key === " ") {
                                        evento.preventDefault();
                                        alternarTarjetaActiva(alquiler.id_alquiler);
                                    }
                                }}
                                aria-label={`Alquiler ${alquiler.id_alquiler}`}
                            >
                                <Card.Body
                                    className={`p-2 tarjeta-alquiler-cuerpo ${
                                        tarjetaActiva
                                            ? "tarjeta-alquiler-cuerpo-activa"
                                            : "tarjeta-alquiler-cuerpo-inactiva"
                                    }`}
                                >
                                    <Row className="align-items-center gx-3">
                                        <Col xs={2} className="px-2">
                                            <div className="bg-light d-flex align-items-center justify-content-center rounded tarjeta-alquiler-placeholder-imagen">
                                                <i className="bi bi-calendar-check text-muted fs-3"></i>
                                            </div>
                                        </Col>

                                        <Col xs={6} className="text-start">
                                            <div className="fw-semibold text-truncate">
                                                Inicio: {alquiler.fecha_inicio}
                                            </div>
                                            <div className="small text-muted text-truncate">
                                                Fin: {alquiler.fecha_fin}
                                            </div>
                                        </Col>

                                        {/* 🔥 ESTADO */}
                                        <Col
                                            xs={4}
                                            className="d-flex flex-column align-items-end justify-content-center text-end"
                                        >
                                            <Badge bg={obtenerColorEstado(alquiler.estado)}>
                                                {alquiler.estado}
                                            </Badge>
                                        </Col>
                                    </Row>
                                </Card.Body>

                                {tarjetaActiva && (
                                    <div
                                        role="dialog"
                                        aria-modal="true"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIdTarjetaActiva(null);
                                        }}
                                        className="tarjeta-alquiler-capa"
                                    >
                                        <div
                                            className="d-flex gap-2 tarjeta-alquiler-botones-capa"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Button
                                                variant="outline-warning"
                                                size="sm"
                                                onClick={() => {
                                                    abrirModalEdicion(alquiler);
                                                    setIdTarjetaActiva(null);
                                                }}
                                                aria-label={`Editar alquiler ${alquiler.id_alquiler}`}
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </Button>

                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => {
                                                    abrirModalEliminacion(alquiler);
                                                    setIdTarjetaActiva(null);
                                                }}
                                                aria-label={`Eliminar alquiler ${alquiler.id_alquiler}`}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        </div>
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

export default TarjetaAlquiler;
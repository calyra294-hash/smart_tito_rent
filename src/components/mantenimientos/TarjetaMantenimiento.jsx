import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaMantenimiento = ({
    mantenimientos,
    abrirModalEdicion,
    abrirModalEliminacion,
}) => {
    const [cargando, setCargando] = useState(true);
    const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

    useEffect(() => {
        setCargando(false); // simplificado
    }, [mantenimientos]);

    const manejarTeclaEscape = useCallback((evento) => {
        if (evento.key === "Escape") setIdTarjetaActiva(null);
    }, []);

    useEffect(() => {
        window.addEventListener("keydown", manejarTeclaEscape);
        return () => window.removeEventListener("keydown", manejarTeclaEscape);
    }, [manejarTeclaEscape]);

    const alternarTarjetaActiva = (id) => {
        setIdTarjetaActiva((prev) => (prev === id ? null : id));
    };

    return (
        <>
            {cargando ? (
                <div className="text-center my-5">
                    <h5>Cargando mantenimientos...</h5>
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <div>
                    {!mantenimientos || mantenimientos.length === 0 ? (
                        <div className="text-center">
                            <h5>No hay mantenimientos registrados</h5>
                        </div>
                    ) : (
                        mantenimientos.map((m) => {
                            const activa = idTarjetaActiva === m.id_mantenimiento;

                            return (
                                <Card
                                    key={m.id_mantenimiento}
                                    className="mb-3 border-0 rounded-3 shadow-sm w-100"
                                    onClick={() => alternarTarjetaActiva(m.id_mantenimiento)}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            alternarTarjetaActiva(m.id_mantenimiento);
                                        }
                                    }}
                                >
                                    <Card.Body className={`p-2 ${activa ? "bg-light" : ""}`}>
                                        <Row className="align-items-center gx-3">

                                            {/* ICONO */}
                                            <Col xs={2}>
                                                <div className="bg-light d-flex align-items-center justify-content-center rounded">
                                                    <i className="bi bi-tools fs-3 text-muted"></i>
                                                </div>
                                            </Col>

                                            {/* INFO */}
                                            <Col xs={7}>
                                                <div className="fw-semibold text-truncate">
                                                    {m.descripcion}
                                                </div>

                                                <div className="small text-muted text-truncate">
                                                    {m.justificacion}
                                                </div>

                                                <div className="small text-muted">
                                                    {m.fecha_inicio} → {m.fecha_fin}
                                                </div>
                                            </Col>

                                            {/* COSTO */}
                                            <Col xs={3} className="text-end">
                                                <div className="fw-bold text-success">
                                                    ${m.costo}
                                                </div>
                                            </Col>

                                        </Row>
                                    </Card.Body>

                                    {/* BOTONES */}
                                    {activa && (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIdTarjetaActiva(null);
                                            }}
                                            className="d-flex justify-content-center gap-2 p-2"
                                        >
                                            <Button
                                                variant="outline-warning"
                                                size="sm"
                                                onClick={() => {
                                                    abrirModalEdicion(m);
                                                    setIdTarjetaActiva(null);
                                                }}
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </Button>

                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => {
                                                    abrirModalEliminacion(m);
                                                    setIdTarjetaActiva(null);
                                                }}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        </div>
                                    )}
                                </Card>
                            );
                        })
                    )}
                </div>
            )}
        </>
    );
};

export default TarjetaMantenimiento;
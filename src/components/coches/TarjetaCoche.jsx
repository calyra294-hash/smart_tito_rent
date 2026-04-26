import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaCoche = ({
    coches,
    abrirModalEdicion,
    abrirModalEliminacion,
}) => {
    const [cargando, setCargando] = useState(true);
    const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

    useEffect(() => {
        setCargando(!(coches && coches.length > 0));
    }, [coches]);

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

    return (
        <>
            {cargando ? (
                <div className="text-center my-5">
                    <h5>Cargando vehículos...</h5>
                    <Spinner animation="border" variant="success" role="status" />
                </div>
            ) : (
                <div>
                    {coches.map((coche) => {
                        const tarjetaActiva = idTarjetaActiva === coche.id_coche;

                        return (
                            <Card
                                key={coche.id_coche}
                                className="mb-3 border-0 rounded-3 shadow-sm w-100 tarjeta-coche-contenedor"
                                onClick={() => alternarTarjetaActiva(coche.id_coche)}
                                tabIndex={0}
                                onKeyDown={(evento) => {
                                    if (evento.key === "Enter" || evento.key === " ") {
                                        evento.preventDefault();
                                        alternarTarjetaActiva(coche.id_coche);
                                    }
                                }}
                                aria-label={`Vehículo ${coche.marca} ${coche.modelo}`}
                            >
                                <Card.Body
                                    className={`p-2 tarjeta-coche-cuerpo ${
                                        tarjetaActiva
                                            ? "tarjeta-coche-cuerpo-activa"
                                            : "tarjeta-coche-cuerpo-inactiva"
                                    }`}
                                >
                                    <Row className="align-items-center gx-3">
                                        <Col xs={2} className="px-2">
                                            <div className="bg-light d-flex align-items-center justify-content-center rounded tarjeta-coche-placeholder-imagen">
                                                <i className="bi bi-car-front text-muted fs-3"></i>
                                            </div>
                                        </Col>

                                        <Col xs={6} className="text-start">
                                            <div className="fw-semibold text-truncate">
                                                {coche.marca} {coche.modelo}
                                            </div>

                                            <div className="small text-muted text-truncate">
                                                Placa: {coche.placa}
                                            </div>

                                            {/* 📌 FECHA LIMPIA (DATE) */}
                                            <div className="small text-muted text-truncate">
                                                Registro:{" "}
                                                {coche.fecha_registro || "N/A"}
                                            </div>
                                        </Col>

                                        {/* 📌 ESTADO */}
                                        <Col
                                            xs={4}
                                            className="d-flex flex-column align-items-end justify-content-center text-end"
                                        >
                                            <span
                                                className={`badge ${
                                                    coche.estado === "Disponible"
                                                        ? "bg-success"
                                                        : coche.estado === "En Alquiler"
                                                        ? "bg-danger"
                                                        : "bg-warning text-dark"
                                                }`}
                                            >
                                                {coche.estado}
                                            </span>
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
                                        className="tarjeta-coche-capa"
                                    >
                                        <div
                                            className="d-flex gap-2 tarjeta-coche-botones-capa"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Button
                                                variant="outline-warning"
                                                size="sm"
                                                onClick={() => {
                                                    abrirModalEdicion(coche);
                                                    setIdTarjetaActiva(null);
                                                }}
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </Button>

                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => {
                                                    abrirModalEliminacion(coche);
                                                    setIdTarjetaActiva(null);
                                                }}
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

export default TarjetaCoche;
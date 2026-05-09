import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaCoche = ({
    coches,
    abrirModalEdicion,
    abrirModalEliminacion,
}) => {

    const [cargando, setCargando] = useState(true);

    const [idTarjetaActiva, setIdTarjetaActiva] =
        useState(null);

    useEffect(() => {

        setCargando(!(coches && coches.length > 0));

    }, [coches]);

    const manejarTeclaEscape = useCallback((evento) => {

        if (evento.key === "Escape") {
            setIdTarjetaActiva(null);
        }

    }, []);

    useEffect(() => {

        window.addEventListener(
            "keydown",
            manejarTeclaEscape
        );

        return () =>
            window.removeEventListener(
                "keydown",
                manejarTeclaEscape
            );

    }, [manejarTeclaEscape]);

    const alternarTarjetaActiva = (id) => {

        setIdTarjetaActiva((anterior) =>
            anterior === id ? null : id
        );
    };

    return (
        <>

            {cargando ? (

                <div className="text-center my-5">

                    <h5>Cargando vehículos...</h5>

                    <Spinner
                        animation="border"
                        variant="primary"
                        role="status"
                    />

                </div>

            ) : (

                <div>

                    {coches.map((coche) => {

                        const tarjetaActiva =
                            idTarjetaActiva === coche.id_coche;

                        return (

                            <Card
                                key={coche.id_coche}
                                className="
                                    mb-3
                                    border-0
                                    rounded-3
                                    shadow-sm
                                    w-100
                                    position-relative
                                "
                                onClick={() =>
                                    alternarTarjetaActiva(
                                        coche.id_coche
                                    )
                                }
                                tabIndex={0}
                            >

                                <Card.Body
                                    className={`
                                        p-2
                                        ${
                                            tarjetaActiva
                                                ? "bg-light"
                                                : ""
                                        }
                                    `}
                                >

                                    <Row className="align-items-center gx-3">

                                        {/* IMAGEN */}
                                        <Col xs={2} className="px-2">

                                            {coche.url_imagen ? (

                                                <img
                                                    src={coche.url_imagen}
                                                    alt={coche.modelo}
                                                    className="rounded w-100"
                                                    style={{
                                                        height: "60px",
                                                        objectFit: "cover",
                                                    }}
                                                />

                                            ) : (

                                                <div
                                                    className="
                                                        bg-light
                                                        d-flex
                                                        align-items-center
                                                        justify-content-center
                                                        rounded
                                                    "
                                                    style={{
                                                        height: "60px",
                                                    }}
                                                >

                                                    <i
                                                        className="
                                                            bi bi-car-front
                                                            text-muted
                                                            fs-3
                                                        "
                                                    ></i>

                                                </div>

                                            )}

                                        </Col>

                                        {/* INFORMACIÓN */}
                                        <Col
                                            xs={7}
                                            className="text-start"
                                        >

                                            <div className="fw-semibold text-truncate">
                                                {coche.marca}{" "}
                                                {coche.modelo}
                                            </div>

                                            <div className="small text-muted text-truncate">
                                                {coche.placa} •{" "}
                                                {coche.color}
                                            </div>

                                            <div className="small text-primary">
                                                ${coche.valor_dia} / día
                                            </div>

                                        </Col>

                                        {/* ESTADO */}
                                        <Col
                                            xs={3}
                                            className="
                                                d-flex
                                                flex-column
                                                align-items-end
                                                justify-content-center
                                                text-end
                                            "
                                        >

                                            <div
                                                className={`
                                                    fw-semibold
                                                    small
                                                    ${
                                                        coche.estado ===
                                                        "Disponible"
                                                            ? "text-success"
                                                            : coche.estado ===
                                                            "En Alquiler"
                                                            ? "text-warning"
                                                            : "text-danger"
                                                    }
                                                `}
                                            >

                                                {coche.estado}

                                            </div>

                                        </Col>

                                    </Row>

                                </Card.Body>

                                {/* BOTONES */}
                                {tarjetaActiva && (

                                    <div
                                        className="
                                            position-absolute
                                            top-50
                                            start-50
                                            translate-middle
                                            bg-white
                                            rounded
                                            shadow
                                            p-2
                                            d-flex
                                            gap-2
                                        "
                                        onClick={(e) =>
                                            e.stopPropagation()
                                        }
                                    >

                                        <Button
                                            variant="outline-warning"
                                            size="sm"
                                            onClick={() => {

                                                abrirModalEdicion(
                                                    coche
                                                );

                                                setIdTarjetaActiva(
                                                    null
                                                );
                                            }}
                                        >

                                            <i className="bi bi-pencil"></i>

                                        </Button>

                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => {

                                                abrirModalEliminacion(
                                                    coche
                                                );

                                                setIdTarjetaActiva(
                                                    null
                                                );
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

export default TarjetaCoche;
import React, { useState } from "react";
import {
    Card,
    Badge,
    Modal,
    Button,
} from "react-bootstrap";

const TarjetaCatalogoCoche = ({ coche }) => {

    const [mostrarModal, setMostrarModal] =
        useState(false);

    return (
        <>

            {/* TARJETA */}
            <Card
                className="
                    h-100
                    border-0
                    shadow-lg
                    overflow-hidden
                    position-relative
                    cursor-pointer
                "
                style={{
                    transition:
                        "transform 0.3s, box-shadow 0.3s",
                }}
                role="button"
                tabIndex="0"
                onClick={() => setMostrarModal(true)}
                onKeyDown={(e) =>
                    e.key === "Enter" &&
                    setMostrarModal(true)
                }
            >

                {/* IMAGEN */}
                <div
                    className="ratio ratio-4x3 bg-light"
                    style={{
                        overflow: "hidden",
                    }}
                >

                    {coche.url_imagen ? (

                        <img
                            src={coche.url_imagen}
                            alt={`${coche.marca} ${coche.modelo}`}
                            className="
                                card-img-top
                                object-fit-cover
                            "
                            loading="lazy"
                            style={{
                                transition:
                                    "transform 0.4s",
                            }}
                            onMouseEnter={(e) =>
                                (
                                    e.currentTarget.style.transform =
                                    "scale(1.1)"
                                )
                            }
                            onMouseLeave={(e) =>
                                (
                                    e.currentTarget.style.transform =
                                    "scale(1)"
                                )
                            }
                        />

                    ) : (

                        <div
                            className="
                                d-flex
                                align-items-center
                                justify-content-center
                                h-100
                                bg-secondary-subtle
                            "
                        >

                            <i
                                className="
                                    bi bi-car-front
                                    text-muted
                                    fs-1
                                "
                            ></i>

                        </div>

                    )}

                </div>

                {/* CONTENIDO */}
                <Card.Body
                    className="
                        d-flex
                        flex-column
                        p-3
                    "
                >

                    <Card.Title
                        className="
                            h5
                            fw-bold
                            text-dark
                            mb-2
                        "
                    >

                        {coche.marca} {coche.modelo}

                    </Card.Title>

                    <Card.Text
                        className="
                            text-muted
                            small
                            flex-grow-1
                        "
                    >

                        <strong>Año:</strong>
                        {" "}
                        {coche.anio}

                        <br />

                        <strong>Color:</strong>
                        {" "}
                        {coche.color}

                        <br />

                        <strong>Placa:</strong>
                        {" "}
                        {coche.placa}

                        <span className="d-block mt-3">

                            <Badge
                                bg={
                                    coche.estado ===
                                    "Disponible"
                                        ? "success"
                                        : coche.estado ===
                                          "En Alquiler"
                                        ? "danger"
                                        : "warning"
                                }
                                pill
                            >

                                {coche.estado}

                            </Badge>

                        </span>

                    </Card.Text>

                    <hr />

                    {/* PRECIO */}
                    <div className="mt-auto pt-2">

                        <h4
                            className="
                                text-primary
                                fw-bold
                                mb-0
                            "
                        >

                            C$
                            {parseFloat(
                                coche.valor_dia
                            ).toFixed(2)}

                            <span className="fs-6">
                                {" "}
                                / día
                            </span>

                        </h4>

                    </div>

                </Card.Body>

            </Card>

            {/* MODAL */}
            <Modal
                show={mostrarModal}
                onHide={() =>
                    setMostrarModal(false)
                }
                size="lg"
                centered
            >

                <Modal.Header
                    closeButton
                    className="border-0 pb-0"
                >

                    <Modal.Title
                        className="fw-bold fs-4"
                    >

                        {coche.marca} {coche.modelo}

                    </Modal.Title>

                </Modal.Header>

                <Modal.Body className="pt-3">

                    <div className="row g-4">

                        {/* IMAGEN */}
                        <div className="col-md-5">

                            {coche.url_imagen ? (

                                <img
                                    src={coche.url_imagen}
                                    alt={`${coche.marca} ${coche.modelo}`}
                                    className="
                                        img-fluid
                                        rounded
                                        shadow-sm
                                    "
                                    style={{
                                        maxHeight:
                                            "400px",
                                        objectFit:
                                            "cover",
                                        width: "100%",
                                    }}
                                />

                            ) : (

                                <div
                                    className="
                                        bg-secondary-subtle
                                        rounded
                                        d-flex
                                        align-items-center
                                        justify-content-center
                                    "
                                    style={{
                                        height:
                                            "400px",
                                    }}
                                >

                                    <i
                                        className="
                                            bi bi-car-front
                                            text-muted
                                            fs-1
                                        "
                                    ></i>

                                </div>

                            )}

                        </div>

                        {/* DETALLES */}
                        <div className="col-md-7">

                            <div
                                className="
                                    d-flex
                                    align-items-center
                                    mb-3
                                "
                            >

                                <Badge
                                    bg={
                                        coche.estado ===
                                        "Disponible"
                                            ? "success"
                                            : coche.estado ===
                                            "En Alquiler"
                                            ? "danger"
                                            : "warning"
                                    }
                                    pill
                                    className="me-2"
                                >

                                    {coche.estado}

                                </Badge>

                            </div>

                            <h3
                                className="
                                    text-primary
                                    fw-bold
                                    mb-4
                                "
                            >

                                C$
                                {parseFloat(
                                    coche.valor_dia
                                ).toFixed(2)}

                                <span className="fs-5">
                                    {" "}
                                    / día
                                </span>

                            </h3>

                            <div className="mb-3">

                                <h5 className="fw-semibold">
                                    Información
                                </h5>

                                <p className="mb-1">
                                    <strong>Marca:</strong>
                                    {" "}
                                    {coche.marca}
                                </p>

                                <p className="mb-1">
                                    <strong>Modelo:</strong>
                                    {" "}
                                    {coche.modelo}
                                </p>

                                <p className="mb-1">
                                    <strong>Año:</strong>
                                    {" "}
                                    {coche.anio}
                                </p>

                                <p className="mb-1">
                                    <strong>Color:</strong>
                                    {" "}
                                    {coche.color}
                                </p>

                                <p className="mb-1">
                                    <strong>Placa:</strong>
                                    {" "}
                                    {coche.placa}
                                </p>

                            </div>

                        </div>

                    </div>

                </Modal.Body>

                <Modal.Footer className="border-0">

                    <Button
                        variant="secondary"
                        onClick={() =>
                            setMostrarModal(false)
                        }
                    >

                        Cerrar

                    </Button>

                </Modal.Footer>

            </Modal>

        </>
    );
};

export default TarjetaCatalogoCoche;
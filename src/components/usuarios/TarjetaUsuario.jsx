import React, { useState, useEffect } from "react";
import { Card, Row, Col, Spinner, Button, Badge } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaUsuarios = ({
    usuarios = [],
    abrirModalEdicion,
    abrirModalEliminacion,
}) => {
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (usuarios) setCargando(false);
    }, [usuarios]);

    const obtenerColorRol = (rol) => {
        if (rol?.toLowerCase() === "admin" || rol?.toLowerCase() === "administrador") return "danger";
        if (rol?.toLowerCase() === "usuario") return "info";
        return "secondary";
    };

    if (cargando) {
        return (
            <div className="text-center my-4">
                <Spinner animation="border" variant="danger" />
                <h5 className="text-muted mt-2">Cargando usuarios...</h5>
            </div>
        );
    }

    if (!usuarios || usuarios.length === 0) {
        return (
            <div className="text-center py-4 bg-white rounded-3 shadow-sm">
                <i className="bi bi-people text-muted fs-2"></i>
                <h6 className="mt-2 text-muted">No se encontraron usuarios</h6>
            </div>
        );
    }

    return (
        <div className="lista-tarjetas-movil">
            {usuarios.map((u) => (
                <Card
                    key={u.id_usuario}
                    className="mb-3 border-0 rounded-3 shadow-sm"
                    style={{ borderLeft: "4px solid #b91c1c" }}
                >
                    <Card.Body className="p-3">
                        {/* FILA DE INFORMACIÓN */}
                        <Row className="align-items-start gx-2 mb-2">
                            {/* AVATAR */}
                            <Col xs={2}>
                                <div className="bg-light d-flex align-items-center justify-content-center rounded-circle" style={{ height: "45px", width: "45px", border: "1px solid #e9ecef" }}>
                                    <i className="bi bi-person-fill-gear fs-4 text-secondary"></i>
                                </div>
                            </Col>

                            {/* DETALLES */}
                            <Col xs={10} className="ps-2">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="fw-bold text-dark text-truncate" style={{ fontSize: "1.05rem" }}>
                                        {u.nombre1} {u.apellido1}
                                    </div>
                                    <Badge bg={obtenerColorRol(u.rol)} className="ms-1 text-capitalize">
                                        {u.rol}
                                    </Badge>
                                </div>

                                <div className="small text-muted text-truncate mt-1">
                                    <i className="bi bi-envelope-at me-1"></i> {u.email}
                                </div>

                                <div className="small text-muted text-truncate">
                                    <i className="bi bi-telephone me-1"></i> Tel: {u.telefono || "N/A"}
                                </div>

                                <div className="small text-muted text-truncate">
                                    <i className="bi bi-card-text me-1"></i> Cédula: {u.cedula}
                                </div>
                                
                                {u.licencia && (
                                    <div className="small text-secondary text-truncate">
                                        <i className="bi bi-card-checklist me-1"></i> Lic: <span className="text-uppercase">{u.licencia}</span>
                                    </div>
                                )}
                            </Col>
                        </Row>

                        <hr className="my-2 text-muted opacity-25" />

                        {/* ACCIONES DIRECTAS */}
                        <div className="d-flex justify-content-end gap-2 pt-1">
                            <Button
                                variant="outline-warning"
                                size="sm"
                                className="px-3 d-flex align-items-center gap-1"
                                onClick={() => abrirModalEdicion(u)}
                            >
                                <i className="bi bi-pencil"></i> Editar
                            </Button>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                className="px-3 d-flex align-items-center gap-1"
                                onClick={() => abrirModalEliminacion(u)}
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

export default TarjetaUsuarios;
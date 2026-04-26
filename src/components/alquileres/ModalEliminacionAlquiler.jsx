import React, { useState } from "react";
import { Modal, Button, Badge } from "react-bootstrap";

const ModalEliminacionAlquiler = ({
    mostrarModalEliminacion,
    setMostrarModalEliminacion,
    alquilerAEliminar,
    eliminarAlquiler,
}) => {
    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleEliminar = async () => {
        if (deshabilitado) return;
        setDeshabilitado(true);
        await eliminarAlquiler();
        setDeshabilitado(false);
    };

    // 🔥 color del estado
    const obtenerColorEstado = (estado) => {
        if (estado === "En curso") return "success";
        if (estado === "Finalizado") return "primary";
        if (estado === "En espera") return "warning";
        return "danger"; // Cancelado
    };

    return (
        <Modal
            show={mostrarModalEliminacion}
            onHide={() => setMostrarModalEliminacion(false)}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Confirmar Eliminación</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>
                    ¿Estás seguro de eliminar el alquiler desde{" "}
                    <strong>{alquilerAEliminar?.fecha_inicio}</strong> hasta{" "}
                    <strong>{alquilerAEliminar?.fecha_fin}</strong>?
                </p>

                {/* 🔥 MOSTRAR ESTADO */}
                <p>
                    Estado:{" "}
                    <Badge bg={obtenerColorEstado(alquilerAEliminar?.estado)}>
                        {alquilerAEliminar?.estado}
                    </Badge>
                </p>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => setMostrarModalEliminacion(false)}
                >
                    Cancelar
                </Button>

                <Button
                    variant="danger"
                    onClick={handleEliminar}
                    disabled={deshabilitado}
                >
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEliminacionAlquiler;
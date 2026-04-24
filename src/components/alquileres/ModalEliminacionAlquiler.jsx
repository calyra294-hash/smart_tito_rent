import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

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
                ¿Estás seguro de eliminar el alquiler desde "
                <strong>{alquilerAEliminar?.fecha_inicio}</strong>" hasta "
                <strong>{alquilerAEliminar?.fecha_fin}</strong>"?
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
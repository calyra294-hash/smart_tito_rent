import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionCoche = ({
    mostrarModalEliminacion,
    setMostrarModalEliminacion,
    cocheAEliminar,
    eliminarCoche,
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleEliminar = async () => {
        if (deshabilitado) return;
        setDeshabilitado(true);
        await eliminarCoche();
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

            <Modal.Header closeButton className="bg-danger text-white">
                <Modal.Title>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Confirmar Eliminación
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="text-center">

                <i
                    className="bi bi-trash3-fill text-danger"
                    style={{ fontSize: "40px" }}
                ></i>

                <p className="mt-3">
                    ¿Seguro que deseas eliminar este vehículo?
                </p>

                <h5 className="text-danger">
                    {cocheAEliminar?.marca} {cocheAEliminar?.modelo}
                </h5>

                <p>
                    Placa: <strong>{cocheAEliminar?.placa}</strong>
                </p>

                <small className="text-muted">
                    Fecha de registro:{" "}
                    <strong>{cocheAEliminar?.fecha_registro}</strong>
                </small>

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
                    <i className="bi bi-trash me-1"></i>
                    Eliminar
                </Button>

            </Modal.Footer>

        </Modal>
    );
};

export default ModalEliminacionCoche;
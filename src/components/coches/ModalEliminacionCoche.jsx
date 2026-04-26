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

    // 📌 Formato SOLO DATE (sin hora)
    const formatearFecha = (fecha) => {
        if (!fecha) return "Sin registro";
        return fecha; // ya viene como YYYY-MM-DD
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
                ¿Estás seguro de eliminar el vehículo "
                <strong>
                    {cocheAEliminar?.marca} {cocheAEliminar?.modelo}
                </strong>
                " con placa "
                <strong>{cocheAEliminar?.placa}</strong>"?

                <br /><br />

                <small className="text-muted">
                    Fecha de registro:{" "}
                    <strong>
                        {formatearFecha(cocheAEliminar?.fecha_registro)}
                    </strong>
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
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEliminacionCoche;
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionMantenimiento = ({
    mostrarModalEliminacion,
    setMostrarModalEliminacion,
    mantenimientoAEliminar,
    eliminarMantenimiento,
}) => {
    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleEliminar = async () => {
        if (deshabilitado) return;
        setDeshabilitado(true);
        await eliminarMantenimiento();
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

            <Modal.Body>
                <p>¿Estás seguro de eliminar el mantenimiento?</p>

                <p>
                    <strong>{mantenimientoAEliminar?.descripcion}</strong>
                </p>

                <p className="text-muted">
                    {mantenimientoAEliminar?.fecha_inicio} → {mantenimientoAEliminar?.fecha_fin}
                </p>

                <p>
                    Costo: <strong>${mantenimientoAEliminar?.costo}</strong>
                </p>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => setMostrarModalEliminacion(false)}
                    disabled={deshabilitado}
                >
                    Cancelar
                </Button>

                {/* CORREGIDO: Ahora ejecuta handleEliminar y tiene el diseño de botón de confirmación */}
                <Button
                    variant="danger"
                    onClick={handleEliminar}
                    disabled={deshabilitado}
                >
                    <i className="bi bi-trash-fill me-1"></i>
                    Confirmar y Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEliminacionMantenimiento;
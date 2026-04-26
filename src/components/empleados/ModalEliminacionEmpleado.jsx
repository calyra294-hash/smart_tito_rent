import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionEmpleado = ({
    mostrarModalEliminacion,
    setMostrarModalEliminacion,
    empleadoAEliminar,
    eliminarEmpleado,
}) => {
    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleEliminar = async () => {
        if (deshabilitado) return;

        setDeshabilitado(true);

        await eliminarEmpleado();

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
                <Modal.Title>Eliminar Empleado</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                ¿Estás seguro que deseas eliminar al empleado?

                <br /><br />

                <strong>
                    {empleadoAEliminar?.primer_nombre}{" "}
                    {empleadoAEliminar?.primer_apellido}
                </strong>

                <br />

                <small className="text-muted">
                    Rol: {empleadoAEliminar?.rol}
                </small>

                <br />

                <small className="text-muted">
                    Cédula: {empleadoAEliminar?.cedula}
                </small>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => setMostrarModalEliminacion(false)}
                    disabled={deshabilitado}
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

export default ModalEliminacionEmpleado;
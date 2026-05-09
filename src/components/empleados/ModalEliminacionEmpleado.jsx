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

            <Modal.Header closeButton className="bg-danger text-white">
                <Modal.Title>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Eliminar Empleado
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="text-center">

                <i
                    className="bi bi-person-x-fill text-danger"
                    style={{ fontSize: "45px" }}
                ></i>

                <p className="mt-3">
                    ¿Seguro que deseas eliminar este empleado?
                </p>

                <h5 className="text-danger">
                    {empleadoAEliminar?.primer_nombre}{" "}
                    {empleadoAEliminar?.primer_apellido}
                </h5>

                <p>
                    Rol: <strong>{empleadoAEliminar?.rol}</strong>
                </p>

                <p>
                    Cédula: <strong>{empleadoAEliminar?.cedula}</strong>
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

                <Button
                    variant="danger"
                    onClick={handleEliminar}
                    disabled={deshabilitado}
                >
                    <i className="bi bi-trash me-2"></i>
                    Eliminar
                </Button>

            </Modal.Footer>

        </Modal>
    );
};

export default ModalEliminacionEmpleado;
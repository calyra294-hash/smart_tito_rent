import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionUsuario = ({
    mostrarModalEliminacion,
    setMostrarModalEliminacion,
    usuarioAEliminar,
    eliminarUsuario,
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleEliminar = async () => {

        if (deshabilitado) return;

        setDeshabilitado(true);
        await eliminarUsuario();
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
                    ¿Seguro que deseas eliminar este usuario?
                </p>

                <h5 className="text-danger">

                    {usuarioAEliminar?.nombre1}{" "}
                    {usuarioAEliminar?.apellido1}

                </h5>

                <p>
                    Cédula:{" "}
                    <strong>
                        {usuarioAEliminar?.cedula}
                    </strong>
                </p>

                <p>
                    Email:{" "}
                    <strong>
                        {usuarioAEliminar?.email}
                    </strong>
                </p>

                <small className="text-muted">
                    Rol:{" "}
                    <strong>
                        {usuarioAEliminar?.rol}
                    </strong>
                </small>

            </Modal.Body>

            <Modal.Footer>

                <Button
                    variant="secondary"
                    onClick={() =>
                        setMostrarModalEliminacion(false)
                    }
                >
                    Cancelar
                </Button>

                <Button
                    variant="outline-danger"
                    size="sm"
                    className="rounded-pill"
                    onClick={() => abrirModalEliminacion(coche)}
                >
                    <i className="bi bi-trash-fill me-1"></i>
                    Eliminar
                </Button>

            </Modal.Footer>

        </Modal>
    );
};

export default ModalEliminacionUsuario;
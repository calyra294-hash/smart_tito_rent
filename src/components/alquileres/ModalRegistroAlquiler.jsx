import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroAlquiler = ({
    mostrarModal,
    setMostrarModal,
    nuevoAlquiler,
    manejoCambioInput,
    agregarAlquiler,
}) => {
    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleRegistrar = async () => {
        if (deshabilitado) return;
        setDeshabilitado(true);
        await agregarAlquiler();
        setDeshabilitado(false);
    };

    return (
        <Modal
            show={mostrarModal}
            onHide={() => setMostrarModal(false)}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Agregar Alquiler</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha Inicio</Form.Label>
                        <Form.Control
                            type="date"
                            name="fecha_inicio"
                            value={nuevoAlquiler.fecha_inicio}
                            onChange={manejoCambioInput}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Fecha Fin</Form.Label>
                        <Form.Control
                            type="date"
                            name="fecha_fin"
                            value={nuevoAlquiler.fecha_fin}
                            onChange={manejoCambioInput}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setMostrarModal(false)}>
                    Cancelar
                </Button>

                <Button
                    variant="primary"
                    onClick={handleRegistrar}
                    disabled={
                        !nuevoAlquiler.fecha_inicio ||
                        !nuevoAlquiler.fecha_fin ||
                        deshabilitado
                    }
                >
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalRegistroAlquiler;
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalEdicionAlquiler = ({
    mostrarModalEdicion,
    setMostrarModalEdicion,
    alquilerEditar,
    manejoCambioInputEdicion,
    actualizarAlquiler,
}) => {
    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleActualizar = async () => {
        if (deshabilitado) return;
        setDeshabilitado(true);
        await actualizarAlquiler();
        setDeshabilitado(false);
    };

    return (
        <Modal
            show={mostrarModalEdicion}
            onHide={() => setMostrarModalEdicion(false)}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Editar Alquiler</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha Inicio</Form.Label>
                        <Form.Control
                            type="date"
                            name="fecha_inicio"
                            value={alquilerEditar.fecha_inicio}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Fecha Fin</Form.Label>
                        <Form.Control
                            type="date"
                            name="fecha_fin"
                            value={alquilerEditar.fecha_fin}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => setMostrarModalEdicion(false)}
                    disabled={deshabilitado}
                >
                    Cancelar
                </Button>

                <Button
                    variant="primary"
                    onClick={handleActualizar}
                    disabled={
                        deshabilitado ||
                        !alquilerEditar.fecha_inicio ||
                        !alquilerEditar.fecha_fin
                    }
                >
                    Actualizar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEdicionAlquiler;
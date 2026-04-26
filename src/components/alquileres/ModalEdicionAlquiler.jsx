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


                    <Form.Group className="mb-3">
                        <Form.Label>Estado</Form.Label>
                        <Form.Select
                            name="estado"
                            value={alquilerEditar.estado}
                            onChange={manejoCambioInputEdicion}
                        >
                            <option value="">Seleccione estado</option>
                            <option value="En espera">En espera</option>
                            <option value="En curso">En curso</option>
                            <option value="Finalizado">Finalizado</option>
                            <option value="Cancelado">Cancelado</option>
                        </Form.Select>
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
                        !alquilerEditar.fecha_fin ||
                        !alquilerEditar.estado 
                    }
                >
                    Actualizar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEdicionAlquiler;
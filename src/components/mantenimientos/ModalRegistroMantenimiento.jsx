import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroMantenimiento = ({
    mostrarModal,
    setMostrarModal,
    nuevoMantenimiento,
    manejoCambioInput,
    agregarMantenimiento,
}) => {
    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleRegistrar = async () => {
        if (deshabilitado) return;
        setDeshabilitado(true);
        await agregarMantenimiento();
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
                <Modal.Title>Agregar Mantenimiento</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>

                    {/* DESCRIPCIÓN */}
                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="descripcion"
                            value={nuevoMantenimiento.descripcion}
                            onChange={manejoCambioInput}
                        />
                    </Form.Group>

                    {/* JUSTIFICACIÓN */}
                    <Form.Group className="mb-3">
                        <Form.Label>Justificación</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="justificacion"
                            value={nuevoMantenimiento.justificacion}
                            onChange={manejoCambioInput}
                        />
                    </Form.Group>

                    {/* FECHA INICIO */}
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha Inicio</Form.Label>
                        <Form.Control
                            type="date"
                            name="fecha_inicio"
                            value={nuevoMantenimiento.fecha_inicio}
                            onChange={manejoCambioInput}
                        />
                    </Form.Group>

                    {/* FECHA FIN */}
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha Fin</Form.Label>
                        <Form.Control
                            type="date"
                            name="fecha_fin"
                            value={nuevoMantenimiento.fecha_fin}
                            onChange={manejoCambioInput}
                        />
                    </Form.Group>

                    {/* COSTO */}
                    <Form.Group className="mb-3">
                        <Form.Label>Costo</Form.Label>
                        <Form.Control
                            type="number"
                            name="costo"
                            value={nuevoMantenimiento.costo}
                            onChange={manejoCambioInput}
                        />
                    </Form.Group>

                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => setMostrarModal(false)}
                    disabled={deshabilitado}
                >
                    Cancelar
                </Button>

                <Button
                    variant="primary"
                    onClick={handleRegistrar}
                    disabled={
                        deshabilitado ||
                        !nuevoMantenimiento.descripcion ||
                        !nuevoMantenimiento.justificacion ||
                        !nuevoMantenimiento.fecha_inicio ||
                        !nuevoMantenimiento.fecha_fin ||
                        !nuevoMantenimiento.costo
                    }
                >
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalRegistroMantenimiento;
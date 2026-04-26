import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalEdicionMantenimiento = ({
    mostrarModalEdicion,
    setMostrarModalEdicion,
    mantenimientoEditar,
    manejoCambioInputEdicion,
    actualizarMantenimiento,
}) => {
    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleActualizar = async () => {
        if (deshabilitado) return;
        setDeshabilitado(true);
        await actualizarMantenimiento();
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
                <Modal.Title>Editar Mantenimiento</Modal.Title>
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
                            value={mantenimientoEditar.descripcion}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>

                    {/* JUSTIFICACIÓN */}
                    <Form.Group className="mb-3">
                        <Form.Label>Justificación</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="justificacion"
                            value={mantenimientoEditar.justificacion}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>

                    {/* FECHA INICIO */}
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha Inicio</Form.Label>
                        <Form.Control
                            type="date"
                            name="fecha_inicio"
                            value={mantenimientoEditar.fecha_inicio}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>

                    {/* FECHA FIN */}
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha Fin</Form.Label>
                        <Form.Control
                            type="date"
                            name="fecha_fin"
                            value={mantenimientoEditar.fecha_fin}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>

                    {/* COSTO */}
                    <Form.Group className="mb-3">
                        <Form.Label>Costo</Form.Label>
                        <Form.Control
                            type="number"
                            name="costo"
                            value={mantenimientoEditar.costo}
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
                        !mantenimientoEditar.descripcion ||
                        !mantenimientoEditar.justificacion ||
                        !mantenimientoEditar.fecha_inicio ||
                        !mantenimientoEditar.fecha_fin ||
                        !mantenimientoEditar.costo
                    }
                >
                    Actualizar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEdicionMantenimiento;
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalEdicionCoche = ({
    mostrarModalEdicion,
    setMostrarModalEdicion,
    cocheEditar,
    manejoCambioInputEdicion,
    actualizarCoche,
}) => {
    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleActualizar = async () => {
        if (deshabilitado) return;
        setDeshabilitado(true);
        await actualizarCoche();
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
                <Modal.Title>Editar Vehículo</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>

                    <Form.Group className="mb-2">
                        <Form.Label>Marca</Form.Label>
                        <Form.Control
                            type="text"
                            name="marca"
                            value={cocheEditar.marca || ""}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Modelo</Form.Label>
                        <Form.Control
                            type="text"
                            name="modelo"
                            value={cocheEditar.modelo || ""}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Año</Form.Label>
                        <Form.Control
                            type="number"
                            name="anio"
                            value={cocheEditar.anio || ""}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Placa</Form.Label>
                        <Form.Control
                            type="text"
                            name="placa"
                            value={cocheEditar.placa || ""}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Color</Form.Label>
                        <Form.Control
                            type="text"
                            name="color"
                            value={cocheEditar.color || ""}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Valor por Día</Form.Label>
                        <Form.Control
                            type="number"
                            name="valor_dia"
                            value={cocheEditar.valor_dia || ""}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Estado</Form.Label>
                        <Form.Select
                            name="estado"
                            value={cocheEditar.estado || ""}
                            onChange={manejoCambioInputEdicion}
                        >
                            <option value="">Seleccione estado</option>
                            <option value="Disponible">Disponible</option>
                            <option value="En Alquiler">En Alquiler</option>
                            <option value="Mantenimiento">Mantenimiento</option>
                        </Form.Select>
                    </Form.Group>

                    {/* 📌 FECHA CORREGIDA (DATE LIMPIO) */}
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha de Registro</Form.Label>
                        <Form.Control
                            type="date"
                            name="fecha_registro"
                            value={cocheEditar.fecha_registro || ""}
                            disabled
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
                        !cocheEditar.marca ||
                        !cocheEditar.modelo ||
                        !cocheEditar.estado
                    }
                >
                    Actualizar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEdicionCoche;
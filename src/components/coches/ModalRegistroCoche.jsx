import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalRegistroCoche = ({
    mostrarModal,
    setMostrarModal,
    nuevoCoche,
    manejoCambioInput,
    manejoCambioArchivo,
    agregarCoche,
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleRegistrar = async () => {
        if (deshabilitado) return;

        setDeshabilitado(true);
        await agregarCoche();
        setDeshabilitado(false);
    };

    return (
        <Modal
            show={mostrarModal}
            onHide={() => setMostrarModal(false)}
            backdrop="static"
            keyboard={false}
            centered
            size="lg"
        >

            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="bi bi-car-front me-2"></i>
                    Registrar Vehículo
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <Form>

                    {/* FILA 1 */}
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Marca</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="marca"
                                    value={nuevoCoche?.marca || ""}
                                    onChange={manejoCambioInput}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Modelo</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="modelo"
                                    value={nuevoCoche?.modelo || ""}
                                    onChange={manejoCambioInput}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* FILA 2 */}
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Año</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="anio"
                                    value={nuevoCoche?.anio || ""}
                                    onChange={manejoCambioInput}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Placa</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="placa"
                                    value={nuevoCoche?.placa || ""}
                                    onChange={manejoCambioInput}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* FILA 3 */}
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Color</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="color"
                                    value={nuevoCoche?.color || ""}
                                    onChange={manejoCambioInput}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Valor por Día</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="valor_dia"
                                    value={nuevoCoche?.valor_dia || ""}
                                    onChange={manejoCambioInput}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* ESTADO */}
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Estado</Form.Label>
                                <Form.Select
                                    name="estado"
                                    value={nuevoCoche?.estado || "Disponible"}
                                    onChange={manejoCambioInput}
                                >
                                    <option value="Disponible">Disponible</option>
                                    <option value="En Alquiler">En Alquiler</option>
                                    <option value="Mantenimiento">Mantenimiento</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* IMAGEN */}
                    <Form.Group className="mb-3">
                        <Form.Label>Imagen del Vehículo</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={manejoCambioArchivo}
                        />
                    </Form.Group>

                </Form>

            </Modal.Body>

            <Modal.Footer>

                <Button
                    variant="secondary"
                    onClick={() => setMostrarModal(false)}
                >
                    Cancelar
                </Button>

                <Button
                    variant="primary"
                    onClick={handleRegistrar}
                    disabled={
                        !nuevoCoche?.marca ||
                        !nuevoCoche?.modelo ||
                        !nuevoCoche?.placa ||
                        !nuevoCoche?.valor_dia ||
                        deshabilitado
                    }
                >
                    <i className="bi bi-save me-2"></i>
                    Guardar
                </Button>

            </Modal.Footer>

        </Modal>
    );
};

export default ModalRegistroCoche;
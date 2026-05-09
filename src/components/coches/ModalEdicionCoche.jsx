import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

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
            size="lg"
        >

            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="bi bi-pencil-square me-2"></i>
                    Editar Vehículo
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
                                    value={cocheEditar?.marca || ""}
                                    onChange={manejoCambioInputEdicion}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Modelo</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="modelo"
                                    value={cocheEditar?.modelo || ""}
                                    onChange={manejoCambioInputEdicion}
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
                                    value={cocheEditar?.anio || ""}
                                    onChange={manejoCambioInputEdicion}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Placa</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="placa"
                                    value={cocheEditar?.placa || ""}
                                    onChange={manejoCambioInputEdicion}
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
                                    value={cocheEditar?.color || ""}
                                    onChange={manejoCambioInputEdicion}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Valor por Día</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="valor_dia"
                                    value={cocheEditar?.valor_dia || ""}
                                    onChange={manejoCambioInputEdicion}
                                />
                            </Form.Group>
                        </Col>

                    </Row>

                    {/* FILA 4 */}
                    <Row>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Estado</Form.Label>
                                <Form.Select
                                    name="estado"
                                    value={cocheEditar?.estado || ""}
                                    onChange={manejoCambioInputEdicion}
                                >
                                    <option value="">Seleccione estado</option>
                                    <option value="Disponible">Disponible</option>
                                    <option value="En Alquiler">En Alquiler</option>
                                    <option value="Mantenimiento">Mantenimiento</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Fecha Registro</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={cocheEditar?.fecha_registro || ""}
                                    readOnly
                                />
                            </Form.Group>
                        </Col>

                    </Row>

                </Form>

            </Modal.Body>

            <Modal.Footer>

                <Button
                    variant="secondary"
                    onClick={() => setMostrarModalEdicion(false)}
                >
                    Cancelar
                </Button>

                <Button
                    variant="primary"
                    onClick={handleActualizar}
                    disabled={deshabilitado}
                >
                    Actualizar
                </Button>

            </Modal.Footer>

        </Modal>
    );
};

export default ModalEdicionCoche;
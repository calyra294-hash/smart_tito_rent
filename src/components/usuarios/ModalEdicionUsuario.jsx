import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const ModalEdicionUsuario = ({
    mostrarModalEdicion,
    setMostrarModalEdicion,
    usuarioEditar,
    manejoCambioInputEdicion,
    actualizarUsuario,
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleActualizar = async () => {

        if (deshabilitado) return;

        setDeshabilitado(true);
        await actualizarUsuario();
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
                    Editar Usuario
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <Form>

                    {/* FILA 1 */}
                    <Row>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Primer Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre1"
                                    value={usuarioEditar?.nombre1 || ""}
                                    onChange={manejoCambioInputEdicion}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Segundo Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre2"
                                    value={usuarioEditar?.nombre2 || ""}
                                    onChange={manejoCambioInputEdicion}
                                />
                            </Form.Group>
                        </Col>

                    </Row>

                    {/* FILA 2 */}
                    <Row>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Primer Apellido</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="apellido1"
                                    value={usuarioEditar?.apellido1 || ""}
                                    onChange={manejoCambioInputEdicion}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Segundo Apellido</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="apellido2"
                                    value={usuarioEditar?.apellido2 || ""}
                                    onChange={manejoCambioInputEdicion}
                                />
                            </Form.Group>
                        </Col>

                    </Row>

                    {/* FILA 3 */}
                    <Row>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Cédula</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="cedula"
                                    value={usuarioEditar?.cedula || ""}
                                    onChange={manejoCambioInputEdicion}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="telefono"
                                    value={usuarioEditar?.telefono || ""}
                                    onChange={manejoCambioInputEdicion}
                                />
                            </Form.Group>
                        </Col>

                    </Row>

                    {/* FILA 4 */}
                    <Row>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={usuarioEditar?.email || ""}
                                    onChange={manejoCambioInputEdicion}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Licencia</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="licencia"
                                    value={usuarioEditar?.licencia || ""}
                                    onChange={manejoCambioInputEdicion}
                                />
                            </Form.Group>
                        </Col>

                    </Row>

                    {/* FILA 5 */}
                    <Row>

                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Dirección</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name="direccion"
                                    value={usuarioEditar?.direccion || ""}
                                    onChange={manejoCambioInputEdicion}
                                />
                            </Form.Group>
                        </Col>

                    </Row>

                    {/* FILA 6 */}
                    <Row>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Rol</Form.Label>
                                <Form.Select
                                    name="rol"
                                    value={usuarioEditar?.rol || ""}
                                    onChange={manejoCambioInputEdicion}
                                >
                                    <option value="">Seleccione rol</option>
                                    <option value="usuario">Usuario</option>
                                    <option value="admin">Administrador</option>
                                </Form.Select>
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
                    variant="danger"
                    onClick={handleActualizar}
                    disabled={deshabilitado}
                >
                    <i className="bi bi-pencil-square me-2"></i>
                    Actualizar
                </Button>

            </Modal.Footer>

        </Modal>
    );
};

export default ModalEdicionUsuario;
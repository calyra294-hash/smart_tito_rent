import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalRegistroUsuario = ({
    mostrarModal,
    setMostrarModal,
    nuevoUsuario,
    manejoCambioInput,
    agregarUsuario,
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleRegistrar = async () => {

        if (deshabilitado) return;

        setDeshabilitado(true);
        await agregarUsuario();
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
                    <i className="bi bi-person-plus-fill me-2"></i>
                    Registrar Usuario
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
                                    value={nuevoUsuario?.nombre1 || ""}
                                    onChange={manejoCambioInput}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Segundo Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre2"
                                    value={nuevoUsuario?.nombre2 || ""}
                                    onChange={manejoCambioInput}
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
                                    value={nuevoUsuario?.apellido1 || ""}
                                    onChange={manejoCambioInput}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Segundo Apellido</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="apellido2"
                                    value={nuevoUsuario?.apellido2 || ""}
                                    onChange={manejoCambioInput}
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
                                    value={nuevoUsuario?.cedula || ""}
                                    onChange={manejoCambioInput}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="telefono"
                                    value={nuevoUsuario?.telefono || ""}
                                    onChange={manejoCambioInput}
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
                                    value={nuevoUsuario?.email || ""}
                                    onChange={manejoCambioInput}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Licencia</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="licencia"
                                    value={nuevoUsuario?.licencia || ""}
                                    onChange={manejoCambioInput}
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
                                    value={nuevoUsuario?.direccion || ""}
                                    onChange={manejoCambioInput}
                                />
                            </Form.Group>
                        </Col>

                    </Row>

                    {/* FILA 6 */}
                    <Row>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="contrasena"
                                    value={nuevoUsuario?.contrasena || ""}
                                    onChange={manejoCambioInput}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Rol</Form.Label>
                                <Form.Select
                                    name="rol"
                                    value={nuevoUsuario?.rol || "usuario"}
                                    onChange={manejoCambioInput}
                                >
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
                    onClick={() => setMostrarModal(false)}
                >
                    Cancelar
                </Button>

                <Button
                    variant="danger"
                    onClick={handleRegistrar}
                    disabled={
                        !nuevoUsuario?.nombre1 ||
                        !nuevoUsuario?.apellido1 ||
                        !nuevoUsuario?.cedula ||
                        !nuevoUsuario?.telefono ||
                        !nuevoUsuario?.direccion ||
                        !nuevoUsuario?.licencia ||
                        !nuevoUsuario?.contrasena ||
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

export default ModalRegistroUsuario;
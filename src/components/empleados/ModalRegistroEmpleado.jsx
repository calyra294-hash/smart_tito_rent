import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalRegistroEmpleado = ({
    mostrarModal,
    setMostrarModal,
    nuevoEmpleado,
    manejoCambioInput,
    agregarEmpleado,
}) => {
    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleRegistrar = async () => {
        if (deshabilitado) return;

        setDeshabilitado(true);
        await agregarEmpleado();
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
                <Modal.Title>
                    Registrar Empleado</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>

                    {/* ROL */}
                    <Form.Group className="mb-3">
                        <Form.Label>Rol</Form.Label>
                        <Form.Select
                            name="rol"
                            value={nuevoEmpleado.rol}
                            onChange={manejoCambioInput}
                        >
                            <option value="">Seleccione rol</option>
                            <option value="Administrador">Administrador</option>
                            <option value="Mecánico">Mecánico</option>
                            <option value="Agente de Alquiler">Agente de Alquiler</option>
                        </Form.Select>
                    </Form.Group>

                    {/* NOMBRES */}
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Primer Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="primer_nombre"
                                    value={nuevoEmpleado.primer_nombre}
                                    onChange={manejoCambioInput}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Segundo Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="segundo_nombre"
                                    value={nuevoEmpleado.segundo_nombre}
                                    onChange={manejoCambioInput}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* APELLIDOS */}
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Primer Apellido</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="primer_apellido"
                                    value={nuevoEmpleado.primer_apellido}
                                    onChange={manejoCambioInput}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Segundo Apellido</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="segundo_apellido"
                                    value={nuevoEmpleado.segundo_apellido}
                                    onChange={manejoCambioInput}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* CONTACTO */}
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="email"
                                    value={nuevoEmpleado.email}
                                    onChange={manejoCambioInput}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Cédula</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="cedula"
                                    value={nuevoEmpleado.cedula}
                                    onChange={manejoCambioInput}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* DIRECCION */}
                    <Form.Group className="mb-3">
                        <Form.Label>Dirección</Form.Label>
                        <Form.Control
                            type="text"
                            name="direccion"
                            value={nuevoEmpleado.direccion}
                            onChange={manejoCambioInput}
                        />
                    </Form.Group>

                    {/* PASSWORD Y FECHA */}
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="contrasena"
                                    value={nuevoEmpleado.contrasena}
                                    onChange={manejoCambioInput}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Fecha de Contratación</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="fecha_contratacion"
                                    value={nuevoEmpleado.fecha_contratacion}
                                    onChange={manejoCambioInput}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

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
                        !nuevoEmpleado.rol ||
                        !nuevoEmpleado.primer_nombre ||
                        !nuevoEmpleado.primer_apellido ||
                        !nuevoEmpleado.email ||
                        !nuevoEmpleado.cedula ||
                        !nuevoEmpleado.contrasena ||
                        !nuevoEmpleado.fecha_contratacion
                    }
                >
                    <i className="bi bi-save me-2"></i>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalRegistroEmpleado;
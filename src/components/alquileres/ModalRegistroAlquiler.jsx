import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalRegistroAlquiler = ({
    mostrarModal,
    setMostrarModal,
    nuevoAlquiler,
    manejoCambioInput,
    agregarAlquiler,
    usuarios,
    coches,
}) => {

    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleRegistrar = async () => {

        if (deshabilitado) return;

        setDeshabilitado(true);

        await agregarAlquiler();

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
                    <i className="bi bi-calendar-check me-2"></i>
                    Registrar Alquiler
                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                <Form>

                    <Row>

                        <Col md={6}>
                            <Form.Group className="mb-3">

                                <Form.Label>Fecha Inicio</Form.Label>

                                <Form.Control
                                    type="date"
                                    name="fecha_inicio"
                                    value={nuevoAlquiler.fecha_inicio}
                                    onChange={manejoCambioInput}
                                />

                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">

                                <Form.Label>Fecha Fin</Form.Label>

                                <Form.Control
                                    type="date"
                                    name="fecha_fin"
                                    value={nuevoAlquiler.fecha_fin}
                                    onChange={manejoCambioInput}
                                />

                            </Form.Group>
                        </Col>

                    </Row>

                    {/* USUARIO */}
                    <Form.Group className="mb-3">

                        <Form.Label>Usuario</Form.Label>

                        <Form.Select
                            name="id_usuario"
                            value={nuevoAlquiler.id_usuario || ""}
                            onChange={manejoCambioInput}
                        >

                            <option value="">
                                Seleccione usuario
                            </option>

                            {usuarios.map((u) => (

                                <option
                                    key={u.id_usuario}
                                    value={u.id_usuario}
                                >
                                    {u.nombre1} {u.apellido1}
                                </option>

                            ))}

                        </Form.Select>

                    </Form.Group>

                    {/* COCHE */}
                    <Form.Group className="mb-3">

                        <Form.Label>Vehículo</Form.Label>

                        <Form.Select
                            name="id_coche"
                            value={nuevoAlquiler.id_coche || ""}
                            onChange={manejoCambioInput}
                        >

                            <option value="">
                                Seleccione vehículo
                            </option>

                            {coches.map((c) => (

                                <option
                                    key={c.id_coche}
                                    value={c.id_coche}
                                >
                                    {c.marca} {c.modelo}
                                </option>

                            ))}

                        </Form.Select>

                    </Form.Group>

                    {/* PRECIO */}
                    <Form.Group className="mb-3">

                        <Form.Label>Precio Total</Form.Label>

                        <Form.Control
                            type="number"
                            name="precio_total"
                            value={nuevoAlquiler.precio_total || ""}
                            onChange={manejoCambioInput}
                        />

                    </Form.Group>

                    {/* ESTADO */}
                    <Form.Group className="mb-3">

                        <Form.Label>Estado</Form.Label>

                        <Form.Select
                            name="estado"
                            value={nuevoAlquiler.estado}
                            onChange={manejoCambioInput}
                        >

                            <option value="">
                                Seleccione estado
                            </option>

                            <option value="En espera">
                                En espera
                            </option>

                            <option value="En curso">
                                En curso
                            </option>

                            <option value="Finalizado">
                                Finalizado
                            </option>

                            <option value="Cancelado">
                                Cancelado
                            </option>

                        </Form.Select>

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
                    disabled={deshabilitado}
                >
                    Guardar
                </Button>

            </Modal.Footer>

        </Modal>
    );
};

export default ModalRegistroAlquiler;
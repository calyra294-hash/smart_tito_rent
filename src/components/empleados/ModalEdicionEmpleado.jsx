import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalEdicionEmpleado = ({
    mostrarModalEdicion,
    setMostrarModalEdicion,
    empleadoEditar,
    manejoCambioInputEdicion,
    actualizarEmpleado,
}) => {
    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleActualizar = async () => {
        if (deshabilitado) return;
        setDeshabilitado(true);

        await actualizarEmpleado();

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
                <Modal.Title>Editar Empleado</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>

                    {/* ROL */}
                    <Form.Group className="mb-2">
                        <Form.Label>Rol</Form.Label>
                        <Form.Select
                            name="rol"
                            value={empleadoEditar.rol || ""}
                            onChange={manejoCambioInputEdicion}
                        >
                            <option value="">Seleccione rol</option>
                            <option value="Administrador">Administrador</option>
                            <option value="Mecánico">Mecánico</option>
                            <option value="Agente de Alquiler">Agente de Alquiler</option>
                        </Form.Select>
                    </Form.Group>

                    {/* NOMBRES */}
                    <Form.Group className="mb-2">
                        <Form.Label>Primer Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="primer_nombre"
                            value={empleadoEditar.primer_nombre || ""}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Segundo Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="segundo_nombre"
                            value={empleadoEditar.segundo_nombre || ""}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>

                    {/* APELLIDOS */}
                    <Form.Group className="mb-2">
                        <Form.Label>Primer Apellido</Form.Label>
                        <Form.Control
                            type="text"
                            name="primer_apellido"
                            value={empleadoEditar.primer_apellido || ""}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Segundo Apellido</Form.Label>
                        <Form.Control
                            type="text"
                            name="segundo_apellido"
                            value={empleadoEditar.segundo_apellido || ""}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>

                    {/* DIRECCION */}
                    <Form.Group className="mb-2">
                        <Form.Label>Dirección</Form.Label>
                        <Form.Control
                            type="text"
                            name="direccion"
                            value={empleadoEditar.direccion || ""}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>

                    {/* EMAIL */}
                    <Form.Group className="mb-2">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={empleadoEditar.email || ""}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>

                    {/* CEDULA */}
                    <Form.Group className="mb-2">
                        <Form.Label>Cédula</Form.Label>
                        <Form.Control
                            type="text"
                            name="cedula"
                            value={empleadoEditar.cedula || ""}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>

                    {/* FECHA CONTRATACION (SOLO LECTURA) */}
                    <Form.Group className="mb-2">
                        <Form.Label>Fecha Contratación</Form.Label>
                        <Form.Control
                            type="date"
                            value={empleadoEditar.fecha_contratacion || ""}
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
                    disabled={deshabilitado}
                >
                    Actualizar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEdicionEmpleado;
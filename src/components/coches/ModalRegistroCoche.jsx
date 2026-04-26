import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroCoche = ({
    mostrarModal,
    setMostrarModal,
    nuevoCoche,
    manejoCambioInput,
    agregarCoche,
}) => {
    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleRegistrar = async () => {
        if (deshabilitado) return;

        setDeshabilitado(true);

        // 📌 GENERAR FECHA TIPO DATE (YYYY-MM-DD)
        const fechaHoy = new Date().toISOString().split("T")[0];

        await agregarCoche(fechaHoy);

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
                <Modal.Title>Agregar Vehículo</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>

                    <Form.Group className="mb-2">
                        <Form.Label>Marca</Form.Label>
                        <Form.Control
                            type="text"
                            name="marca"
                            value={nuevoCoche.marca}
                            onChange={manejoCambioInput}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Modelo</Form.Label>
                        <Form.Control
                            type="text"
                            name="modelo"
                            value={nuevoCoche.modelo}
                            onChange={manejoCambioInput}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Año</Form.Label>
                        <Form.Control
                            type="number"
                            name="anio"
                            value={nuevoCoche.anio}
                            onChange={manejoCambioInput}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Placa</Form.Label>
                        <Form.Control
                            type="text"
                            name="placa"
                            value={nuevoCoche.placa}
                            onChange={manejoCambioInput}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Color</Form.Label>
                        <Form.Control
                            type="text"
                            name="color"
                            value={nuevoCoche.color}
                            onChange={manejoCambioInput}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Valor por Día</Form.Label>
                        <Form.Control
                            type="number"
                            name="valor_dia"
                            value={nuevoCoche.valor_dia}
                            onChange={manejoCambioInput}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Fecha Registro</Form.Label>
                        <Form.Control
                            type="date"
                            name="fecha_registro"
                            value={nuevoCoche.fecha_registro}
                            onChange={manejoCambioInput}
                        />
                    </Form.Group>


                    <Form.Group className="mb-3">
                        <Form.Label>Estado</Form.Label>
                        <Form.Select
                            name="estado"
                            value={nuevoCoche.estado}
                            onChange={manejoCambioInput}
                        >
                            <option value="">Seleccione estado</option>
                            <option value="Disponible">Disponible</option>
                            <option value="En Alquiler">En Alquiler</option>
                            <option value="Mantenimiento">Mantenimiento</option>
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
                    disabled={
                        !nuevoCoche.marca ||
                        !nuevoCoche.modelo ||
                        !nuevoCoche.placa ||
                        !nuevoCoche.valor_dia ||
                        !nuevoCoche.estado ||
                        deshabilitado
                    }
                >
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalRegistroCoche;
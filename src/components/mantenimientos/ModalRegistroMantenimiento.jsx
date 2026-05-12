import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroMantenimiento = ({
    mostrarModal,
    setMostrarModal,
    nuevoMantenimiento,
    manejoCambioInput,
    agregarMantenimiento,
    coches,
    empleados,
}) => {
    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleRegistrar = async () => {
        if (deshabilitado) return;
        setDeshabilitado(true);
        await agregarMantenimiento();
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
                <Modal.Title>Agregar Mantenimiento</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>

                    {/* 1. COCHE (Reintegrado) */}
        <Form.Group className="mb-3">
            <Form.Label>Coche</Form.Label>
            <Form.Select
                name="id_coche"
                value={nuevoMantenimiento.id_coche}
                onChange={manejoCambioInput}
            >
               {coches.map((coche) => (
    <option key={coche.id_coche} value={coche.id_coche}>
        {/* Usamos marca, modelo y placa como dice la captura */}
        {coche.marca} {coche.modelo} - {coche.placa}
    </option>
))}
            </Form.Select>
        </Form.Group>

       {/* 2. EMPLEADO (Corregido) */}
<Form.Group className="mb-3">
    <Form.Label>Empleado</Form.Label>
    <Form.Select
        name="id_empleado"
        value={nuevoMantenimiento.id_empleado}
        onChange={manejoCambioInput}
    >
        <option value="">Seleccione un empleado</option>
        {empleados.map((empleado) => (
    <option key={empleado.id_empleado} value={empleado.id_empleado}>
        {/* Cambiamos a los nombres de la captura: nombre1 y apellido1 */}
        {empleado.nombre1} {empleado.apellido1}
    </option>
))}
    </Form.Select>
</Form.Group>

        {/* 3. DESCRIPCIÓN (Lo que ya tenías en la captura) */}
        <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
                as="textarea"
                rows={2}
                name="descripcion"
                value={nuevoMantenimiento.descripcion}
                onChange={manejoCambioInput}
            />
        </Form.Group>

                    {/* JUSTIFICACIÓN */}
                    <Form.Group className="mb-3">
                        <Form.Label>Justificación</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="justificacion"
                            value={nuevoMantenimiento.justificacion}
                            onChange={manejoCambioInput}
                        />
                    </Form.Group>

                    {/* FECHA INICIO */}
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha Inicio</Form.Label>
                        <Form.Control
                            type="date"
                            name="fecha_inicio"
                            value={nuevoMantenimiento.fecha_inicio}
                            onChange={manejoCambioInput}
                        />
                    </Form.Group>

                    {/* FECHA FIN */}
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha Fin</Form.Label>
                        <Form.Control
                            type="date"
                            name="fecha_fin"
                            value={nuevoMantenimiento.fecha_fin}
                            onChange={manejoCambioInput}
                        />
                    </Form.Group>

                    {/* COSTO */}
                    <Form.Group className="mb-3">
                        <Form.Label>Costo</Form.Label>
                        <Form.Control
                            type="number"
                            name="costo"
                            value={nuevoMantenimiento.costo}
                            onChange={manejoCambioInput}
                        />
                    </Form.Group>

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
                        !nuevoMantenimiento.id_coche ||
                        !nuevoMantenimiento.id_empleado ||
                        !nuevoMantenimiento.descripcion ||
                        !nuevoMantenimiento.justificacion ||
                        !nuevoMantenimiento.fecha_inicio ||
                        !nuevoMantenimiento.fecha_fin ||
                        !nuevoMantenimiento.costo
                    }
                >
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalRegistroMantenimiento;
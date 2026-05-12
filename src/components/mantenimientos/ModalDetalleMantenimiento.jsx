import React from "react";
import { Modal, Button, Table } from "react-bootstrap";

const ModalDetalleMantenimiento = ({
    mostrarModalDetalle,
    setMostrarModalDetalle,
    detalleMantenimiento,
}) => {
    return (
        <Modal
            show={mostrarModalDetalle}
            onHide={() => setMostrarModalDetalle(false)}
            centered
            size="xl"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="bi bi-tools me-2"></i>
                    Detalle Técnico del Mantenimiento
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
    {/* 1. Verificamos si existe el objeto y si tiene el array de detalles */}
   {!detalleMantenimiento?.detalle_mantenimiento?.length ? (
        <p className="text-center">No hay detalles técnicos registrados...</p>
    ) : (
        <Table striped bordered hover responsive>
            <thead className="table-dark">
                <tr>
                    <th>ID Detalle</th>
                    <th>Empleado Responsable</th>
                    <th>Coche</th>
                    <th>Observaciones</th>
                    <th>Recomendaciones</th>
                    <th>Partes Cambiadas</th>
                </tr>
            </thead>
            <tbody>
                {/* 2. Mapeamos sobre el array interno 'detalle_mantenimiento' */}
                {detalleMantenimiento.detalle_mantenimiento.map((detalle) => (
                    <tr key={detalle.id_detalle_mantenimiento}>
                        <td>{detalle.id_detalle_mantenimiento}</td>
                        <td>
                            {detalle.empleado
                                ? `${detalle.empleado.nombre1} ${detalle.empleado.apellido1}`
                                : "No asignado"}
                        </td>
                        <td>
                            {detalle.coche
                                ? `${detalle.coche.marca} ${detalle.coche.modelo} (${detalle.coche.placa})`
                                : "N/A"}
                        </td>
                        <td>{detalle.observaciones || "Sin observaciones"}</td>
                        <td>{detalle.recomendaciones || "Sin recomendaciones"}</td>
                        <td>{detalle.partes_cambiadas || "Ninguna"}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )}
</Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setMostrarModalDetalle(false)}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalDetalleMantenimiento;
import React from "react";
import { Modal, Button, Table, Badge } from "react-bootstrap";

const ModalDetalleAlquiler = ({
    mostrarModalDetalle,
    setMostrarModalDetalle,
    detalleAlquiler,
}) => {

    return (

        <Modal
            show={mostrarModalDetalle}
            onHide={() => setMostrarModalDetalle(false)}
            centered
            size="lg"
        >

            <Modal.Header closeButton>

                <Modal.Title>
                    <i className="bi bi-receipt me-2 text-danger"></i>
                    Detalle del Alquiler
                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                {detalleAlquiler?.length === 0 ? (

                    <p className="text-center text-muted">
                        No hay detalles registrados.
                    </p>

                ) : (

                    <Table
                        striped
                        hover
                        responsive
                        className="align-middle"
                    >

                        <thead className="table-light">

                            <tr>

                                <th>ID</th>

                                <th>Cliente</th>

                                <th>Vehículo</th>

                                <th>Valor Día</th>

                                <th>Días</th>

                                <th>Total</th>

                            </tr>

                        </thead>

                        <tbody>

                            {detalleAlquiler.map((detalle) => (

                                <tr key={detalle.id_detalle_alquiler}>

                                    <td>
                                        <Badge bg="danger">
                                            #{detalle.id_detalle_alquiler}
                                        </Badge>
                                    </td>

                                    <td>
                                        {detalle.usuario
                                            ? `${detalle.usuario.nombre1} ${detalle.usuario.apellido1}`
                                            : "Sin usuario"}
                                    </td>

                                    <td>
                                        {detalle.coche
                                            ? `${detalle.coche.marca} ${detalle.coche.modelo}`
                                            : "Sin vehículo"}
                                    </td>

                                    <td>
                                        C$ {detalle.valor_dia}
                                    </td>

                                    <td>
                                        {detalle.cantidad_dias}
                                    </td>

                                    <td className="fw-bold text-success">
                                        C$ {detalle.precio_total}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </Table>

                )}

            </Modal.Body>

            <Modal.Footer>

                <Button
                    variant="danger"
                    onClick={() => setMostrarModalDetalle(false)}
                >
                    Cerrar
                </Button>

            </Modal.Footer>

        </Modal>
    );
};

export default ModalDetalleAlquiler;
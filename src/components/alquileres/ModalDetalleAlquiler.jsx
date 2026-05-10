import React from "react";
import { Modal, Button, Table } from "react-bootstrap";

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
                    <i className="bi bi-receipt me-2"></i>
                    Detalle del Alquiler
                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                {detalleAlquiler?.length === 0 ? (

                    <p className="text-center">
                        No hay detalles registrados.
                    </p>

                ) : (

                    <Table striped bordered hover responsive>

                        <thead>

                            <tr>
                                <th>ID Detalle</th>
                                <th>ID Coche</th>
                                <th>ID Usuario</th>
                                <th>Precio Total</th>
                            </tr>

                        </thead>

                        <tbody>

                            {detalleAlquiler.map((detalle) => (

                                <tr key={detalle.id_detalle_alquiler}>

                                    <td>{detalle.id_detalle_alquiler}</td>
                                    <td>{detalle.id_coche}</td>
                                    <td>{detalle.id_usuario}</td>
                                    <td>C$ {detalle.precio_total}</td>

                                </tr>

                            ))}

                        </tbody>

                    </Table>

                )}

            </Modal.Body>

            <Modal.Footer>

                <Button
                    variant="secondary"
                    onClick={() => setMostrarModalDetalle(false)}
                >
                    Cerrar
                </Button>

            </Modal.Footer>

        </Modal>
    );
};

export default ModalDetalleAlquiler;
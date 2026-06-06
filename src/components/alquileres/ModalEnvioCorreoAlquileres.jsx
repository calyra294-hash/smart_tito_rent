import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalEnvioCorreoAlquileres = ({
    mostrarModalCorreo,
    setMostrarModalCorreo,
    emailDestino,
    setEmailDestino,
    enviandoCorreo,
    enviarCorreoAlquileres,
    totalAlquileres
}) => {
    return (
        <Modal
            show={mostrarModalCorreo}
            onHide={() => setMostrarModalCorreo(false)}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Enviar Listado de Alquileres por Correo
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label>Correo Destino</Form.Label>

                    <Form.Control
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={emailDestino}
                        onChange={(e) =>
                            setEmailDestino(e.target.value)
                        }
                    />
                </Form.Group>

                <small className="text-muted">
                    Se enviará el listado completo de{" "}
                    <strong>{totalAlquileres}</strong> alquileres.
                </small>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="danger"
                    onClick={() => setMostrarModalCorreo(false)}
                >
                    Cancelar
                </Button>

                <Button
                    variant="primary"
                    onClick={enviarCorreoAlquileres}
                    disabled={enviandoCorreo}
                >
                    {enviandoCorreo
                        ? "Enviando..."
                        : "Enviar Correo"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEnvioCorreoAlquileres;
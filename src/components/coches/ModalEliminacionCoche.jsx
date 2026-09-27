import React, { useState } from "react";
import { Modal, Button, Spinner, Badge } from "react-bootstrap";

const ModalEliminacionCoche = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  cocheAEliminar,
  eliminarCoche,
}) => {
  const [cargando, setCargando] = useState(false);

  const handleEliminar = async () => {
    if (cargando) return;

    setCargando(true);
    try {
      await eliminarCoche();
    } catch (error) {
      console.error("Error al eliminar el vehículo:", error);
    } finally {
      setCargando(false);
    }
  };

  // Formateo seguro de fecha
  const fechaFormateada = cocheAEliminar?.fecha_registro
    ? cocheAEliminar.fecha_registro.split("T")[0]
    : "N/A";

  // Soporte para nombre de categoría directo o dentro de objeto
  const nombreCategoria =
    cocheAEliminar?.nombre_categoria ||
    cocheAEliminar?.categorias?.nombre_categoria ||
    cocheAEliminar?.categoria ||
    "Sin categoría";

  return (
    <Modal
      show={mostrarModalEliminacion}
      onHide={() => setMostrarModalEliminacion(false)}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton closeVariant="white" className="bg-danger text-white">
        <Modal.Title className="fs-5 fw-bold">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Confirmar Eliminación
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center py-4">
        <div className="mb-3">
          <i
            className="bi bi-trash3-fill text-danger"
            style={{ fontSize: "3rem" }}
          ></i>
        </div>

        <p className="text-secondary mb-2">
          ¿Seguro que deseas eliminar el siguiente vehículo?
        </p>

        {/* Nombre del Vehículo */}
        <h4 className="fw-bold text-dark mb-1">
          {cocheAEliminar?.marca} {cocheAEliminar?.modelo}
        </h4>

        {/* Categora en Badge Visual */}
        <div className="mb-3">
          <Badge bg="secondary" className="px-3 py-2 fw-normal">
            <i className="bi bi-tag-fill me-1"></i>
            Categoría: {nombreCategoria}
          </Badge>
        </div>

        {/* Detalles Adicionales */}
        <div className="bg-light p-3 rounded border text-start d-inline-block w-100 mb-2">
          <div className="d-flex justify-content-between mb-1">
            <span className="text-muted">Placa:</span>
            <span className="fw-semibold text-dark">{cocheAEliminar?.placa || "N/A"}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span className="text-muted">Fecha de registro:</span>
            <span className="fw-semibold text-dark">{fechaFormateada}</span>
          </div>
        </div>

        <small className="text-danger d-block mt-2">
          <i className="bi bi-info-circle me-1"></i>
          Esta acción no se puede deshacer.
        </small>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModalEliminacion(false)}
          disabled={cargando}
        >
          Cancelar
        </Button>

        <Button
          variant="danger"
          onClick={handleEliminar}
          disabled={cargando}
          className="d-flex align-items-center gap-2"
        >
          {cargando ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Eliminando...
            </>
          ) : (
            <>
              <i className="bi bi-trash-fill"></i>
              Eliminar Vehículo
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionCoche;
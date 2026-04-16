import React, { useState } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

/**
 * ModalEliminacionCoche
 * ──────────────────────
 * Props:
 *   mostrar           {boolean}  – controla la visibilidad
 *   cocheSeleccionado {object}   – coche a eliminar
 *   onCerrar          {function} – callback para cerrar
 *   onEliminado       {function} – callback tras eliminar exitosamente
 *   onNotificar       {function} – callback({ tipo, mensaje })
 */
const ModalEliminacionCoche = ({ mostrar, cocheSeleccionado, onCerrar, onEliminado, onNotificar }) => {
  const [eliminando, setEliminando] = useState(false);

  const eliminarCoche = async () => {
    if (!cocheSeleccionado) return;

    setEliminando(true);
    try {
      const { error } = await supabase
        .from("coches")
        .delete()
        .eq("id", cocheSeleccionado.id);

      if (error) throw error;

      onNotificar({
        tipo: "exito",
        mensaje: `Coche "${cocheSeleccionado.marca} ${cocheSeleccionado.modelo}" eliminado correctamente.`,
      });
      onCerrar();
      onEliminado(cocheSeleccionado.id);
    } catch (err) {
      console.error("Error al eliminar coche:", err.message);
      onNotificar({ tipo: "error", mensaje: "Error al eliminar el coche. Intente nuevamente." });
    } finally {
      setEliminando(false);
    }
  };

  return (
    <Modal show={mostrar} onHide={onCerrar} centered backdrop="static">
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>
          <i className="bi-exclamation-triangle-fill me-2"></i>
          Confirmar Eliminación
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Alert variant="danger">
          ¿Está seguro de eliminar el coche{" "}
          <strong>
            {cocheSeleccionado?.marca} {cocheSeleccionado?.modelo} ({cocheSeleccionado?.anio})
          </strong>
          ? Esta acción no se puede deshacer.
        </Alert>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onCerrar} disabled={eliminando}>
          <i className="bi-x-lg me-1"></i>Cancelar
        </Button>
        <Button variant="danger" onClick={eliminarCoche} disabled={eliminando}>
          {eliminando ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Eliminando...
            </>
          ) : (
            <>
              <i className="bi-trash-fill me-1"></i>Eliminar
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionCoche;

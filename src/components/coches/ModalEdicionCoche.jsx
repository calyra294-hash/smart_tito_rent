import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import FormularioRegistroCoche from "./FormularioRegistroCoche";
import { supabase } from "../../database/supabaseconfig";

/**
 * ModalEdicionCoche
 * ──────────────────
 * Props:
 *   mostrar       {boolean}  – controla la visibilidad
 *   cocheSeleccionado {object} – coche a editar
 *   onCerrar      {function} – callback para cerrar
 *   onActualizado {function} – callback tras actualizar exitosamente
 *   onNotificar   {function} – callback({ tipo, mensaje })
 */
const ModalEdicionCoche = ({ mostrar, cocheSeleccionado, onCerrar, onActualizado, onNotificar }) => {
  const [coche, setCoche] = useState({
    marca: "",
    modelo: "",
    anio: "",
    color: "",
    precio_por_dia: "",
    url_imagen: "",
    disponible: true,
  });
  const [guardando, setGuardando] = useState(false);

  // Carga los datos del coche seleccionado al abrir el modal
  useEffect(() => {
    if (cocheSeleccionado) {
      setCoche({
        marca: cocheSeleccionado.marca || "",
        modelo: cocheSeleccionado.modelo || "",
        anio: cocheSeleccionado.anio || "",
        color: cocheSeleccionado.color || "",
        precio_por_dia: cocheSeleccionado.precio_por_dia || "",
        url_imagen: cocheSeleccionado.url_imagen || "",
        disponible: cocheSeleccionado.disponible ?? true,
      });
    }
  }, [cocheSeleccionado]);

  const actualizarCoche = async () => {
    if (!coche.marca || !coche.modelo || !coche.anio || !coche.precio_por_dia) {
      onNotificar({ tipo: "advertencia", mensaje: "Por favor complete todos los campos obligatorios." });
      return;
    }

    setGuardando(true);
    try {
      const { data, error } = await supabase
        .from("coches")
        .update({
          marca: coche.marca.trim(),
          modelo: coche.modelo.trim(),
          anio: Number(coche.anio),
          color: coche.color.trim(),
          precio_por_dia: Number(coche.precio_por_dia),
          url_imagen: coche.url_imagen.trim(),
          disponible: coche.disponible,
        })
        .eq("id", cocheSeleccionado.id)
        .select();

      if (error) throw error;

      onNotificar({ tipo: "exito", mensaje: `Coche "${coche.marca} ${coche.modelo}" actualizado correctamente.` });
      onCerrar();
      onActualizado(data[0]);
    } catch (err) {
      console.error("Error al actualizar coche:", err.message);
      onNotificar({ tipo: "error", mensaje: "Error al actualizar el coche. Intente nuevamente." });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal show={mostrar} onHide={onCerrar} size="lg" centered backdrop="static">
      <Modal.Header closeButton className="bg-warning text-dark">
        <Modal.Title>
          <i className="bi-pencil-square me-2"></i>
          Editar Coche
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <FormularioRegistroCoche coche={coche} setCoche={setCoche} />
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onCerrar} disabled={guardando}>
          <i className="bi-x-lg me-1"></i>Cancelar
        </Button>
        <Button variant="warning" onClick={actualizarCoche} disabled={guardando}>
          {guardando ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Actualizando...
            </>
          ) : (
            <>
              <i className="bi-arrow-clockwise me-1"></i>Actualizar
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCoche;

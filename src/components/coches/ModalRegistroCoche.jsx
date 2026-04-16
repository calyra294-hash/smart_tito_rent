import React, { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import FormularioRegistroCoche from "./FormularioRegistroCoche";
import { supabase } from "../../database/supabaseconfig";

const estadoInicial = {
  marca: "",
  modelo: "",
  anio: "",
  color: "",
  precio_por_dia: "",
  url_imagen: "",
  disponible: true,
};

/**
 * ModalRegistroCoche
 * ────────────────────
 * Props:
 *   mostrar       {boolean}  – controla la visibilidad del modal
 *   onCerrar      {function} – callback para cerrar
 *   onRegistrado  {function} – callback tras registrar exitosamente
 *   onNotificar   {function} – callback({ tipo, mensaje }) para mostrar toast
 */
const ModalRegistroCoche = ({ mostrar, onCerrar, onRegistrado, onNotificar }) => {
  const [coche, setCoche] = useState(estadoInicial);
  const [guardando, setGuardando] = useState(false);

  const limpiarFormulario = () => setCoche(estadoInicial);

  const manejarCerrar = () => {
    limpiarFormulario();
    onCerrar();
  };

  const registrarCoche = async () => {
    // Validaciones básicas
    if (!coche.marca || !coche.modelo || !coche.anio || !coche.precio_por_dia) {
      onNotificar({ tipo: "advertencia", mensaje: "Por favor complete todos los campos obligatorios." });
      return;
    }

    setGuardando(true);
    try {
      const { data, error } = await supabase
        .from("coches")
        .insert([
          {
            marca: coche.marca.trim(),
            modelo: coche.modelo.trim(),
            anio: Number(coche.anio),
            color: coche.color.trim(),
            precio_por_dia: Number(coche.precio_por_dia),
            url_imagen: coche.url_imagen.trim(),
            disponible: coche.disponible,
          },
        ])
        .select();

      if (error) throw error;

      onNotificar({ tipo: "exito", mensaje: `Coche "${coche.marca} ${coche.modelo}" registrado correctamente.` });
      limpiarFormulario();
      onCerrar();
      onRegistrado(data[0]);
    } catch (err) {
      console.error("Error al registrar coche:", err.message);
      onNotificar({ tipo: "error", mensaje: "Error al registrar el coche. Intente nuevamente." });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal show={mostrar} onHide={manejarCerrar} size="lg" centered backdrop="static">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <i className="bi-plus-circle-fill me-2"></i>
          Registrar Coche
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <FormularioRegistroCoche coche={coche} setCoche={setCoche} />
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={manejarCerrar} disabled={guardando}>
          <i className="bi-x-lg me-1"></i>Cancelar
        </Button>
        <Button variant="primary" onClick={registrarCoche} disabled={guardando}>
          {guardando ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Guardando...
            </>
          ) : (
            <>
              <i className="bi-floppy-fill me-1"></i>Guardar
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCoche;

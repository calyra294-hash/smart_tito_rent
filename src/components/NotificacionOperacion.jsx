import React, { useState, useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

/**
 * NotificacionOperacion
 * ─────────────────────
 * Props:
 *   mostrar   {boolean}  – controla la visibilidad
 *   tipo      {string}   – "exito" | "advertencia" | "error"
 *   mensaje   {string}   – texto a mostrar en el cuerpo del toast
 *   onCerrar  {function} – callback al cerrar / expirar
 */
const NotificacionOperacion = ({ mostrar, tipo, mensaje, onCerrar }) => {
  const [visible, setVisible] = useState(false);

  // Sincroniza el estado interno con la prop `mostrar`
  useEffect(() => {
    setVisible(mostrar);
  }, [mostrar]);

  // Genera la marca de tiempo DD-MM-AAAA HH:mm
  const obtenerFechaHora = () => {
    const ahora = new Date();
    const dia = String(ahora.getDate()).padStart(2, "0");
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const anio = ahora.getFullYear();
    const horas = String(ahora.getHours()).padStart(2, "0");
    const minutos = String(ahora.getMinutes()).padStart(2, "0");
    return `${dia}-${mes}-${anio} ${horas}:${minutos}`;
  };

  // Determina el color de fondo según el tipo
  const obtenerBg = () => {
    switch (tipo) {
      case "exito":      return "success";
      case "advertencia": return "warning";
      case "error":      return "danger";
      default:           return "secondary";
    }
  };

  // Determina el ícono Bootstrap Icons según el tipo
  const obtenerIcono = () => {
    switch (tipo) {
      case "exito":      return "bi-check-circle-fill";
      case "advertencia": return "bi-exclamation-triangle-fill";
      case "error":      return "bi-x-circle-fill";
      default:           return "bi-info-circle-fill";
    }
  };

  // Título legible del tipo
  const obtenerTitulo = () => {
    switch (tipo) {
      case "exito":      return "Éxito";
      case "advertencia": return "Advertencia";
      case "error":      return "Error";
      default:           return "Notificación";
    }
  };

  const manejarCierre = () => {
    setVisible(false);
    if (onCerrar) onCerrar();
  };

  return (
    <ToastContainer
      position="top-end"
      className="p-3"
      style={{ zIndex: 9999, position: "fixed", top: 70, right: 10 }}
    >
      <Toast
        show={visible}
        onClose={manejarCierre}
        autohide
        delay={2500}
        bg={obtenerBg()}
      >
        <Toast.Header closeButton>
          <i className={`${obtenerIcono()} me-2`}></i>
          <strong className="me-auto">{obtenerTitulo()}</strong>
          <small className="text-muted">{obtenerFechaHora()}</small>
        </Toast.Header>
        <Toast.Body className="text-white fw-semibold">
          {mensaje}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default NotificacionOperacion;

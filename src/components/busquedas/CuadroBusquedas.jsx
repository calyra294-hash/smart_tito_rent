import React from "react";
import { Form, InputGroup } from "react-bootstrap";

/**
 * CuadroBusquedas
 * ────────────────
 * Props:
 *   placeholder {string}   – texto del input
 *   onBuscar    {function} – callback con el texto escrito
 */
const CuadroBusquedas = ({ placeholder = "Buscar...", onBuscar }) => {
  const manejarCambio = (e) => {
    if (onBuscar) onBuscar(e.target.value);
  };

  return (
    <InputGroup size="sm" style={{ minWidth: "220px", maxWidth: "320px" }}>
      <InputGroup.Text>
        <i className="bi-search"></i>
      </InputGroup.Text>
      <Form.Control
        type="text"
        placeholder={placeholder}
        onChange={manejarCambio}
      />
    </InputGroup>
  );
};

export default CuadroBusquedas;

import React from "react";
import { Form, Row, Col } from "react-bootstrap";

/**
 * FormularioRegistroCoche
 * ────────────────────────
 * Props:
 *   coche       {object}   – estado del formulario
 *   setCoche    {function} – setter del estado
 */
const FormularioRegistroCoche = ({ coche, setCoche }) => {
  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setCoche((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <Form>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="marca">
            <Form.Label>Marca</Form.Label>
            <Form.Control
              type="text"
              name="marca"
              placeholder="Ej. Toyota"
              value={coche.marca}
              onChange={manejarCambio}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="modelo">
            <Form.Label>Modelo</Form.Label>
            <Form.Control
              type="text"
              name="modelo"
              placeholder="Ej. Corolla"
              value={coche.modelo}
              onChange={manejarCambio}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group controlId="anio">
            <Form.Label>Año</Form.Label>
            <Form.Control
              type="number"
              name="anio"
              placeholder="Ej. 2022"
              value={coche.anio}
              onChange={manejarCambio}
              min={1990}
              max={2100}
              required
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="color">
            <Form.Label>Color</Form.Label>
            <Form.Control
              type="text"
              name="color"
              placeholder="Ej. Rojo"
              value={coche.color}
              onChange={manejarCambio}
              required
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="precio_por_dia">
            <Form.Label>Precio por día ($)</Form.Label>
            <Form.Control
              type="number"
              name="precio_por_dia"
              placeholder="Ej. 50.00"
              value={coche.precio_por_dia}
              onChange={manejarCambio}
              min={0}
              step={0.01}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={8}>
          <Form.Group controlId="url_imagen">
            <Form.Label>URL de Imagen</Form.Label>
            <Form.Control
              type="url"
              name="url_imagen"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={coche.url_imagen}
              onChange={manejarCambio}
            />
          </Form.Group>
        </Col>
        <Col md={4} className="d-flex align-items-end">
          <Form.Group controlId="disponible" className="mb-2">
            <Form.Check
              type="switch"
              name="disponible"
              label="Disponible"
              checked={coche.disponible}
              onChange={manejarCambio}
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

export default FormularioRegistroCoche;

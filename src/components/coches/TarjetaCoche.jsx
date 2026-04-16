import React from "react";
import { Card, Badge, Button } from "react-bootstrap";

/**
 * TarjetaCoche
 * ─────────────
 * Props:
 *   coche      {object}   – datos del coche
 *   onEditar   {function} – callback editar
 *   onEliminar {function} – callback eliminar
 */
const TarjetaCoche = ({ coche, onEditar, onEliminar }) => {
  const imagenPorDefecto =
    "https://via.placeholder.com/300x180?text=Sin+imagen";

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={coche.url_imagen || imagenPorDefecto}
        alt={`${coche.marca} ${coche.modelo}`}
        style={{ height: "180px", objectFit: "cover" }}
        onError={(e) => {
          e.target.src = imagenPorDefecto;
        }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="mb-1">
          {coche.marca} {coche.modelo}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {coche.anio} · {coche.color}
        </Card.Subtitle>
        <div className="mb-2">
          <span className="fw-bold text-primary">
            ${Number(coche.precio_por_dia).toFixed(2)}
          </span>
          <span className="text-muted"> / día</span>
        </div>
        <div className="mb-3">
          <Badge bg={coche.disponible ? "success" : "secondary"}>
            {coche.disponible ? "Disponible" : "No disponible"}
          </Badge>
        </div>
        <div className="mt-auto d-flex gap-2">
          <Button
            variant="outline-warning"
            size="sm"
            className="flex-fill"
            onClick={() => onEditar(coche)}
          >
            <i className="bi-pencil-fill me-1"></i>Editar
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            className="flex-fill"
            onClick={() => onEliminar(coche)}
          >
            <i className="bi-trash-fill me-1"></i>Eliminar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TarjetaCoche;

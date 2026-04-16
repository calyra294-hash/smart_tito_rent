import React from "react";
import { Card, Badge, Button } from "react-bootstrap";

/**
 * TarjetaCatalogo
 * ────────────────
 * Props:
 *   coche {object} – datos del coche disponible en el catálogo público
 */
const TarjetaCatalogo = ({ coche }) => {
  const imagenPorDefecto =
    "https://via.placeholder.com/300x180?text=Sin+imagen";

  return (
    <Card className="h-100 shadow border-0">
      <Card.Img
        variant="top"
        src={coche.url_imagen || imagenPorDefecto}
        alt={`${coche.marca} ${coche.modelo}`}
        style={{ height: "190px", objectFit: "cover" }}
        onError={(e) => {
          e.target.src = imagenPorDefecto;
        }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="mb-1">
          {coche.marca} {coche.modelo}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          <i className="bi-calendar3 me-1"></i>{coche.anio}
          <span className="mx-2">·</span>
          <i className="bi-palette-fill me-1"></i>{coche.color}
        </Card.Subtitle>
        <div className="mb-2 fs-5 fw-bold text-primary">
          ${Number(coche.precio_por_dia).toFixed(2)}
          <span className="fs-6 fw-normal text-muted"> / día</span>
        </div>
        <div className="mt-auto">
          <Badge bg={coche.disponible ? "success" : "secondary"} className="me-2">
            <i className={`bi-${coche.disponible ? "check-circle-fill" : "x-circle-fill"} me-1`}></i>
            {coche.disponible ? "Disponible" : "No disponible"}
          </Badge>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TarjetaCatalogo;

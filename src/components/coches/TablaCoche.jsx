import React from "react";
import { Table, Button, Badge, Spinner } from "react-bootstrap";

/**
 * TablaCoche
 * ───────────
 * Props:
 *   coches           {array}    – lista de coches desde Supabase
 *   cargando         {boolean}  – muestra spinner mientras carga
 *   onEditar         {function} – recibe el coche a editar
 *   onEliminar       {function} – recibe el coche a eliminar
 */
const TablaCoche = ({ coches, cargando, onEditar, onEliminar }) => {
  if (cargando) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Cargando coches...</p>
      </div>
    );
  }

  if (!coches || coches.length === 0) {
    return (
      <div className="text-center my-4 text-muted">
        <i className="bi-car-front fs-1"></i>
        <p className="mt-2">No hay coches registrados.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <Table striped bordered hover size="sm" className="align-middle">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Año</th>
            <th>Color</th>
            <th>Precio/día</th>
            <th>Disponible</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {coches.map((coche, index) => (
            <tr key={coche.id}>
              <td>{index + 1}</td>
              <td>{coche.marca}</td>
              <td>{coche.modelo}</td>
              <td>{coche.anio}</td>
              <td>{coche.color}</td>
              <td>${Number(coche.precio_por_dia).toFixed(2)}</td>
              <td className="text-center">
                <Badge bg={coche.disponible ? "success" : "secondary"}>
                  {coche.disponible ? "Sí" : "No"}
                </Badge>
              </td>
              <td className="text-center">
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => onEditar(coche)}
                  title="Editar"
                >
                  <i className="bi-pencil-fill"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onEliminar(coche)}
                  title="Eliminar"
                >
                  <i className="bi-trash-fill"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TablaCoche;

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import TarjetaCatalogo from "../components/catalogo/TarjetaCatalogo";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const Catalogo = () => {
  const [coches, setCoches] = useState([]);
  const [cochesFiltrados, setCochesFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const cargarCatalogo = async () => {
    setCargando(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase
        .from("coches")
        .select("*")
        .eq("disponible", true)
        .order("marca", { ascending: true });

      if (error) throw error;

      setCoches(data);
      setCochesFiltrados(data);
    } catch (err) {
      console.error("Error al cargar catálogo:", err.message);
      setErrorMsg("No se pudo cargar el catálogo. Intente nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCatalogo();
  }, []);

  const manejarBusqueda = (termino) => {
    const texto = termino.toLowerCase();
    const filtrados = coches.filter(
      (c) =>
        c.marca?.toLowerCase().includes(texto) ||
        c.modelo?.toLowerCase().includes(texto) ||
        c.color?.toLowerCase().includes(texto) ||
        String(c.anio).includes(texto)
    );
    setCochesFiltrados(filtrados);
  };

  return (
    <Container fluid className="mt-3">
      {/* ── Encabezado ── */}
      <Row className="align-items-center mb-4">
        <Col>
          <h2>
            <i className="bi-images me-2 text-primary"></i>
            Catálogo de Vehículos
          </h2>
          <p className="text-muted mb-0">
            Explora los vehículos disponibles para alquiler.
          </p>
        </Col>
        <Col xs="auto">
          <CuadroBusquedas
            placeholder="Buscar por marca, modelo, color..."
            onBuscar={manejarBusqueda}
          />
        </Col>
      </Row>

      {/* ── Estado: cargando ── */}
      {cargando && (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Cargando catálogo...</p>
        </div>
      )}

      {/* ── Estado: error ── */}
      {!cargando && errorMsg && (
        <Alert variant="danger">
          <i className="bi-exclamation-triangle-fill me-2"></i>
          {errorMsg}
        </Alert>
      )}

      {/* ── Estado: sin resultados ── */}
      {!cargando && !errorMsg && cochesFiltrados.length === 0 && (
        <div className="text-center my-5 text-muted">
          <i className="bi-car-front fs-1"></i>
          <p className="mt-2">No hay vehículos disponibles en este momento.</p>
        </div>
      )}

      {/* ── Tarjetas ── */}
      {!cargando && !errorMsg && cochesFiltrados.length > 0 && (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {cochesFiltrados.map((coche) => (
            <Col key={coche.id}>
              <TarjetaCatalogo coche={coche} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Catalogo;

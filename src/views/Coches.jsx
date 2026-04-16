import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import TablaCoche from "../components/coches/TablaCoche";
import TarjetaCoche from "../components/coches/TarjetaCoche";
import ModalRegistroCoche from "../components/coches/ModalRegistroCoche";
import ModalEdicionCoche from "../components/coches/ModalEdicionCoche";
import ModalEliminacionCoche from "../components/coches/ModalEliminacionCoche";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const Coches = () => {
  // ── Estado de datos ──────────────────────────────────────────────────────
  const [coches, setCoches] = useState([]);
  const [cochesFiltrados, setCochesFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);

  // ── Vista (tabla o tarjetas) ──────────────────────────────────────────────
  const [vistaTabla, setVistaTabla] = useState(true);

  // ── Modales ───────────────────────────────────────────────────────────────
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mostrarEdicion, setMostrarEdicion] = useState(false);
  const [mostrarEliminacion, setMostrarEliminacion] = useState(false);
  const [cocheSeleccionado, setCocheSeleccionado] = useState(null);

  // ── Notificación Toast ────────────────────────────────────────────────────
  const [notificacion, setNotificacion] = useState({
    mostrar: false,
    tipo: "exito",
    mensaje: "",
  });

  // ── Cargar coches desde Supabase ──────────────────────────────────────────
  const cargarCoches = async () => {
    setCargando(true);
    try {
      const { data, error } = await supabase
        .from("coches")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;

      setCoches(data);
      setCochesFiltrados(data);
    } catch (err) {
      console.error("Error al cargar coches:", err.message);
      mostrarNotificacion("error", "Error al cargar los coches.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCoches();
  }, []);

  // ── Notificación helper ───────────────────────────────────────────────────
  const mostrarNotificacion = (tipo, mensaje) => {
    setNotificacion({ mostrar: true, tipo, mensaje });
  };

  const cerrarNotificacion = () => {
    setNotificacion((prev) => ({ ...prev, mostrar: false }));
  };

  // ── Búsqueda ──────────────────────────────────────────────────────────────
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

  // ── Callbacks de modales ──────────────────────────────────────────────────
  const alRegistrar = (nuevoCoche) => {
    const actualizado = [...coches, nuevoCoche];
    setCoches(actualizado);
    setCochesFiltrados(actualizado);
  };

  const alActualizar = (cocheActualizado) => {
    const actualizado = coches.map((c) =>
      c.id === cocheActualizado.id ? cocheActualizado : c
    );
    setCoches(actualizado);
    setCochesFiltrados(actualizado);
  };

  const alEliminar = (idEliminado) => {
    const actualizado = coches.filter((c) => c.id !== idEliminado);
    setCoches(actualizado);
    setCochesFiltrados(actualizado);
  };

  const abrirEdicion = (coche) => {
    setCocheSeleccionado(coche);
    setMostrarEdicion(true);
  };

  const abrirEliminacion = (coche) => {
    setCocheSeleccionado(coche);
    setMostrarEliminacion(true);
  };

  return (
    <Container fluid className="mt-3">
      {/* ── Encabezado ── */}
      <Row className="align-items-center mb-3">
        <Col>
          <h2>
            <i className="bi-car-front-fill me-2 text-primary"></i>
            Coches
          </h2>
        </Col>
        <Col xs="auto" className="d-flex gap-2 flex-wrap">
          {/* Búsqueda */}
          <CuadroBusquedas
            placeholder="Buscar por marca, modelo, color..."
            onBuscar={manejarBusqueda}
          />

          {/* Toggle vista */}
          <ButtonGroup size="sm">
            <Button
              variant={vistaTabla ? "primary" : "outline-primary"}
              onClick={() => setVistaTabla(true)}
              title="Vista tabla"
            >
              <i className="bi-table"></i>
            </Button>
            <Button
              variant={!vistaTabla ? "primary" : "outline-primary"}
              onClick={() => setVistaTabla(false)}
              title="Vista tarjetas"
            >
              <i className="bi-grid-3x3-gap-fill"></i>
            </Button>
          </ButtonGroup>

          {/* Nuevo coche */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setMostrarRegistro(true)}
          >
            <i className="bi-plus-lg me-1"></i>Nuevo Coche
          </Button>
        </Col>
      </Row>

      {/* ── Contenido: tabla o tarjetas ── */}
      {vistaTabla ? (
        <TablaCoche
          coches={cochesFiltrados}
          cargando={cargando}
          onEditar={abrirEdicion}
          onEliminar={abrirEliminacion}
        />
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-3">
          {cargando ? (
            <Col className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </Col>
          ) : cochesFiltrados.length === 0 ? (
            <Col>
              <p className="text-muted">No se encontraron coches.</p>
            </Col>
          ) : (
            cochesFiltrados.map((coche) => (
              <Col key={coche.id}>
                <TarjetaCoche
                  coche={coche}
                  onEditar={abrirEdicion}
                  onEliminar={abrirEliminacion}
                />
              </Col>
            ))
          )}
        </Row>
      )}

      {/* ── Modales ── */}
      <ModalRegistroCoche
        mostrar={mostrarRegistro}
        onCerrar={() => setMostrarRegistro(false)}
        onRegistrado={alRegistrar}
        onNotificar={({ tipo, mensaje }) => mostrarNotificacion(tipo, mensaje)}
      />

      <ModalEdicionCoche
        mostrar={mostrarEdicion}
        cocheSeleccionado={cocheSeleccionado}
        onCerrar={() => setMostrarEdicion(false)}
        onActualizado={alActualizar}
        onNotificar={({ tipo, mensaje }) => mostrarNotificacion(tipo, mensaje)}
      />

      <ModalEliminacionCoche
        mostrar={mostrarEliminacion}
        cocheSeleccionado={cocheSeleccionado}
        onCerrar={() => setMostrarEliminacion(false)}
        onEliminado={alEliminar}
        onNotificar={({ tipo, mensaje }) => mostrarNotificacion(tipo, mensaje)}
      />

      {/* ── Toast de notificación ── */}
      <NotificacionOperacion
        mostrar={notificacion.mostrar}
        tipo={notificacion.tipo}
        mensaje={notificacion.mensaje}
        onCerrar={cerrarNotificacion}
      />
    </Container>
  );
};

export default Coches;

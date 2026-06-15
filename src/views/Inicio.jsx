import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Form,
  Button,
  Carousel,
} from "react-bootstrap";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { supabase } from "../database/supabaseconfig";
import * as XLSX from "xlsx";
import fondo from "../assets/Inicio_fondo.jpg";

const COLORES = [
  "#5e26b2",
  "#39ff95",
  "#ff6bc6",
  "#8b46ff",
  "#00d4ff",
  "#ffd93d",
];

const obtenerFechaLocalManagua = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "America/Managua" });

const formatearMoneda = (valor) =>
  Number(valor || 0).toLocaleString("es-NI", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const generarRangoFechas = (desde, hasta) => {
  if (!desde || !hasta) return [];

  const fechas = [];
  const inicio = new Date(`${desde}T00:00:00`);
  const fin = new Date(`${hasta}T00:00:00`);

  for (
    let fecha = new Date(inicio);
    fecha <= fin;
    fecha.setDate(fecha.getDate() + 1)
  ) {
    fechas.push(fecha.toISOString().slice(0, 10));
  }

  return fechas;
};

const Inicio = () => {
  const fechaActual = obtenerFechaLocalManagua();

  const [cargando, setCargando] = useState(true);
  const [fechaDesde, setFechaDesde] = useState(fechaActual);
  const [fechaHasta, setFechaHasta] = useState(fechaActual);
  const [estadisticas, setEstadisticas] = useState({
    totalAlquileres: 0,
    totalVehiculos: 0,
    totalUsuarios: 0,
    totalMantenimientos: 0,
    ingresosTotales: 0,
    alquileresPorEstado: [],
    ingresosPorDia: [],
    vehiculosMasAlquilados: [],
  });

  useEffect(() => {
    cargarDatos(fechaDesde, fechaHasta);
  }, [fechaDesde, fechaHasta]);

  const cargarDatos = async (desde, hasta) => {
    try {
      setCargando(true);

      const inicioRango = `${desde} 00:00:00`;
      const finRango = `${hasta} 23:59:59`;

      const [alquileresResp, vehiculosResp, usuariosResp, mantenimientosResp] =
        await Promise.all([
          supabase
            .from("alquiler")
            .select("id_alquiler, fecha_inicio, fecha_fin, estado")
            .gte("fecha_inicio", inicioRango)
            .lte("fecha_inicio", finRango)
            .order("fecha_inicio", { ascending: true }),
          supabase.from("coche").select("*", { count: "exact", head: true }),
          supabase.from("usuario").select("*", { count: "exact", head: true }),
          supabase
            .from("mantenimiento")
            .select("*", { count: "exact", head: true }),
        ]);

      const { data: alquileres, error: errorAlquileres } = alquileresResp;
      const { count: totalVehiculos } = vehiculosResp;
      const { count: totalUsuarios } = usuariosResp;
      const { count: totalMantenimientos } = mantenimientosResp;

      if (errorAlquileres) throw errorAlquileres;

      const idsAlquileres = alquileres?.map((alquiler) => alquiler.id_alquiler) || [];

      let detalleAlquileres = [];

      if (idsAlquileres.length > 0) {
        const { data: detalles, error: errorDetalles } = await supabase
          .from("detalle_alquiler")
          .select(
            `
              id_alquiler,
              precio_total,
              cantidad_dias,
              coche (
                marca,
                modelo
              )
            `
          )
          .in("id_alquiler", idsAlquileres);

        if (errorDetalles) throw errorDetalles;

        detalleAlquileres = detalles || [];
      }

      const ingresosTotales =
        detalleAlquileres.reduce(
          (suma, detalle) => suma + Number(detalle.precio_total || 0),
          0
        ) || 0;

      const alquileresPorEstado =
        alquileres?.reduce((acumulado, alquiler) => {
          const estado = alquiler.estado || "Sin estado";
          const existente = acumulado.find((item) => item.name === estado);

          if (existente) {
            existente.value += 1;
          } else {
            acumulado.push({ name: estado, value: 1 });
          }

          return acumulado;
        }, []) || [];

      const mapaIngresosPorDia = new Map();
      const mapaCoches = new Map();

      detalleAlquileres.forEach((detalle) => {
        const alquilerRelacionado = alquileres?.find(
          (alquiler) => alquiler.id_alquiler === detalle.id_alquiler
        );

        const fechaClave = alquilerRelacionado?.fecha_inicio
          ? String(alquilerRelacionado.fecha_inicio).slice(0, 10)
          : "Sin fecha";

        mapaIngresosPorDia.set(
          fechaClave,
          (mapaIngresosPorDia.get(fechaClave) || 0) + Number(detalle.precio_total || 0)
        );

        const nombreCoche = detalle.coche
          ? `${detalle.coche.marca || ""} ${detalle.coche.modelo || ""}`.trim()
          : "Sin vehículo";

        mapaCoches.set(nombreCoche, (mapaCoches.get(nombreCoche) || 0) + 1);
      });

      const fechasRango = generarRangoFechas(desde, hasta);

      const ingresosPorDia = fechasRango.map((fecha) => ({
        fecha,
        total: Math.round(mapaIngresosPorDia.get(fecha) || 0),
      }));

      const vehiculosMasAlquilados = Array.from(mapaCoches.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

      setEstadisticas({
        totalAlquileres: alquileres?.length || 0,
        totalVehiculos: totalVehiculos || 0,
        totalUsuarios: totalUsuarios || 0,
        totalMantenimientos: totalMantenimientos || 0,
        ingresosTotales,
        alquileresPorEstado,
        ingresosPorDia,
        vehiculosMasAlquilados,
      });
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    } finally {
      setCargando(false);
    }
  };

  const descargarExcel = async () => {
    try {
      setCargando(true);

      const inicioRango = `${fechaDesde} 00:00:00`;
      const finRango = `${fechaHasta} 23:59:59`;

      const { data: alquileres, error: errorAlquileres } = await supabase
        .from("alquiler")
        .select("*")
        .gte("fecha_inicio", inicioRango)
        .lte("fecha_inicio", finRango)
        .order("fecha_inicio", { ascending: false });

      if (errorAlquileres) throw errorAlquileres;

      const idsAlquileres = alquileres?.map((alquiler) => alquiler.id_alquiler) || [];

      const [detalleResp, cochesResp, usuariosResp, mantenimientosResp] =
        await Promise.all([
          idsAlquileres.length > 0
            ? supabase
                .from("detalle_alquiler")
                .select(
                  `
                    *,
                    coche (
                      marca,
                      modelo,
                      placa
                    )
                  `
                )
                .in("id_alquiler", idsAlquileres)
                .order("id_alquiler", { ascending: true })
            : Promise.resolve({ data: [], error: null }),
          supabase.from("coche").select("*").order("id_coche", { ascending: true }),
          supabase.from("usuario").select("*").order("id_usuario", { ascending: true }),
          supabase
            .from("mantenimiento")
            .select("*")
            .order("id_mantenimiento", { ascending: true }),
        ]);

      const { data: detalles, error: errorDetalles } = detalleResp;
      const { data: coches, error: errorCoches } = cochesResp;
      const { data: usuarios, error: errorUsuarios } = usuariosResp;
      const { data: mantenimientos, error: errorMantenimientos } = mantenimientosResp;

      if (errorDetalles) throw errorDetalles;
      if (errorCoches) throw errorCoches;
      if (errorUsuarios) throw errorUsuarios;
      if (errorMantenimientos) throw errorMantenimientos;

      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(
          alquileres && alquileres.length > 0
            ? alquileres
            : [{ mensaje: "No hay alquileres en este rango" }]
        ),
        "Alquileres"
      );

      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(
          detalles && detalles.length > 0
            ? detalles
            : [{ mensaje: "No hay detalles de alquiler" }]
        ),
        "Detalles_Alquiler"
      );

      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(
          coches && coches.length > 0 ? coches : [{ mensaje: "Sin vehículos" }]
        ),
        "Coches"
      );

      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(
          usuarios && usuarios.length > 0 ? usuarios : [{ mensaje: "Sin usuarios" }]
        ),
        "Usuarios"
      );

      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(
          mantenimientos && mantenimientos.length > 0
            ? mantenimientos
            : [{ mensaje: "Sin mantenimientos" }]
        ),
        "Mantenimientos"
      );

      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet([
          {
            rango: `${fechaDesde} a ${fechaHasta}`,
            totalAlquileres: estadisticas.totalAlquileres,
            totalVehiculos: estadisticas.totalVehiculos,
            totalUsuarios: estadisticas.totalUsuarios,
            totalMantenimientos: estadisticas.totalMantenimientos,
            ingresosTotales: estadisticas.ingresosTotales,
          },
        ]),
        "Resumen"
      );

      XLSX.writeFile(wb, `Reporte_Alquileres_${fechaDesde}_a_${fechaHasta}.xlsx`);
    } catch (error) {
      console.error("Error generando Excel:", error);
      alert("Error al generar el Excel. Revisa la consola.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="inicio-contenedor">
      <Carousel
        className="inicio-carousel"
        controls
        indicators
        interval={null}
        touch
        style={{ minHeight: "80vh" }}
      >
        <Carousel.Item>
          <div
            className="inicio-fondo"
            style={{
              backgroundImage: `url(${fondo})`,
            }}
          >
            <div className="inicio-fondo-overlay"></div>

            <div className="texto-inicio">
              
              <h3>Bienvenido al</h3>

              <h1>Sistema de Gestión</h1>

              <h2>Tito's Rent a Car</h2>

              <p>
                Gestiona alquileres, clientes, vehículos y mantenimientos desde una sola plataforma.
              </p>
            </div>
          </div>
        </Carousel.Item>

        <Carousel.Item>
          <div className="inicio-slide-dashboard">
            <div className="contenedor-dashboard dashboard-slide-panel">
              <div className="dashboard-slide-layout">
                <div className="mb-3">
                  <h2 className="fw-bold mb-1">Dashboard del Negocio</h2>
                  <p className="text-muted mb-0">
                    Fechas, exportación y métricas principales en una sola vista.
                  </p>
                </div>

                <Row className="g-3 align-items-end mb-3 dashboard-filtros-row">
                  <Col xs={6} md={3}>
                    <Form.Group>
                      <Form.Label>Desde</Form.Label>
                      <Form.Control
                        type="date"
                        value={fechaDesde}
                        onChange={(e) => setFechaDesde(e.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={6} md={3}>
                    <Form.Group>
                      <Form.Label>Hasta</Form.Label>
                      <Form.Control
                        type="date"
                        value={fechaHasta}
                        onChange={(e) => setFechaHasta(e.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3} className="d-flex align-items-end">
                    <Button variant="success" className="w-100" onClick={descargarExcel}>
                      <i className="bi bi-file-earmark-excel me-2"></i>
                      Descargar Excel
                    </Button>
                  </Col>
                </Row>

                {cargando ? (
                  <Container className="dashboard-slide-loading text-center py-4 d-flex flex-column justify-content-center align-items-center">
                    <Spinner animation="border" variant="primary" size="lg" />
                    <p className="mt-3 mb-0">Cargando estadísticas...</p>
                  </Container>
                ) : (
                  <div className="dashboard-slide-content">
                    <Row className="g-3 mb-3 dashboard-kpis-row">
                      <Col md={6} lg={3}>
                        <Card
                          className="h-100 text-white shadow border-0 dashboard-kpi-card"
                          style={{ background: "linear-gradient(135deg, #28a745, #34ce57)" }}
                        >
                          <Card.Body>
                            <h5>Alquileres</h5>
                            <h2>{estadisticas.totalAlquileres}</h2>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col md={6} lg={3}>
                        <Card
                          className="h-100 text-white shadow border-0 dashboard-kpi-card"
                          style={{ background: "linear-gradient(135deg, #0166d3, #3399ff)" }}
                        >
                          <Card.Body>
                            <h5>Vehículos</h5>
                            <h2>{estadisticas.totalVehiculos}</h2>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col md={6} lg={3}>
                        <Card
                          className="h-100 text-white shadow border-0 dashboard-kpi-card"
                          style={{ background: "linear-gradient(135deg, #5ea5f1, #94c0ec)" }}
                        >
                          <Card.Body>
                            <h5>Usuarios</h5>
                            <h2>{estadisticas.totalUsuarios}</h2>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col md={6} lg={3}>
                        <Card
                          className="h-100 text-white shadow border-0 dashboard-kpi-card"
                          style={{ background: "linear-gradient(135deg, #e27d01, #ffa500)" }}
                        >
                          <Card.Body>
                            <h5>Mantenimientos</h5>
                            <h2>{estadisticas.totalMantenimientos}</h2>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    <Row className="g-3 flex-grow-1 align-items-stretch dashboard-graficos-row">
                      <Col lg={8} className="d-flex">
                        <Card
                          className="shadow border-0 w-100 dashboard-chart-card"
                          style={{ minHeight: 420 }}
                        >
                          <Card.Body className="d-flex flex-column" style={{ height: "100%" }}>
                            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                              <div>
                                <h5 className="mb-1">Ingresos por día</h5>
                                <p className="text-muted mb-0">
                                  Total en el rango: C$ {formatearMoneda(estadisticas.ingresosTotales)}
                                </p>
                              </div>
                            </div>

                            <div style={{ height: 350, width: "100%" }}>
                              <ResponsiveContainer width="100%" height={320}>
                                <LineChart data={estadisticas.ingresosPorDia}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="fecha" />
                                  <YAxis tickFormatter={(valor) => `C$ ${valor}`} />
                                  <Tooltip
                                    formatter={(valor) => [`C$ ${formatearMoneda(valor)}`, "Ingresos"]}
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#5e26b2"
                                    strokeWidth={4}
                                    dot={{ r: 5 }}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col lg={4} className="d-flex">
                        <Card
                          className="shadow border-0 w-100 dashboard-chart-card"
                          style={{ minHeight: 420 }}
                        >
                          <Card.Body className="d-flex flex-column" style={{ height: "100%" }}>
                            <h5 className="mb-3">Vehículos más alquilados</h5>
                            <div style={{ height: 350, width: "100%" }}>
                              <ResponsiveContainer width="100%" height={320}>
                                <PieChart>
                                  <Pie
                                    data={
                                      estadisticas.vehiculosMasAlquilados.length > 0
                                        ? estadisticas.vehiculosMasAlquilados
                                        : [{ name: "Sin datos", value: 1 }]
                                    }
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={110}
                                    label
                                  >
                                    {(
                                      estadisticas.vehiculosMasAlquilados.length > 0
                                        ? estadisticas.vehiculosMasAlquilados
                                        : [{ name: "Sin datos", value: 1 }]
                                    ).map((_, indice) => (
                                      <Cell key={`cell-${indice}`} fill={COLORES[indice % COLORES.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip formatter={(valor) => [valor, "Alquileres"]} />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default Inicio;
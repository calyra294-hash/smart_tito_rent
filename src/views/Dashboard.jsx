import React, { useState, useMemo } from 'react';
import { Container, Card, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

// Importación de los archivos de datos al mismo nivel de la carpeta
import { datos_alquileres } from './datos_alquileres.js';
import { datos_reservas } from './datos_reservas.js';

const COLORES = ['#2563eb', '#f97316', '#16a34a', '#9333ea', '#e11d48', '#0891b2', '#ca8a04'];

const Dashboard = () => {
  // Filtros interactivos
  const [mesFiltro, setMesFiltro] = useState('');
  const [marcaFiltro, setMarcaFiltro] = useState('');
  const [agruparPor, setAgruparPor] = useState('marca_vehiculo'); // marca_vehiculo, modelo_vehiculo, mes
  const [tipoGrafico, setTipoGrafico] = useState('bar'); // bar, line, pie

  // Estados para el Análisis de la IA
  const [analisisIA, setAnalisisIA] = useState('');
  const [cargandoIA, setCargandoIA] = useState(false);
  const [errorIA, setErrorIA] = useState('');

  // Listas para los dropdowns
  const listaMeses = [9, 10]; // Meses presentes en el dataset
  const listaMarcas = useMemo(() => {
    const marcasAlq = datos_alquileres.map(d => d.marca_vehiculo);
    const marcasRes = datos_reservas.map(d => d.marca_vehiculo);
    return [...new Set([...marcasAlq, ...marcasRes])].filter(Boolean);
  }, []);

  // Normalización y filtrado
  const alquileresFiltrados = useMemo(() => {
    return datos_alquileres.filter(item => {
      const cumpleMes = !mesFiltro || item.mes_inicio === Number(mesFiltro);
      const cumpleMarca = !marcaFiltro || item.marca_vehiculo === marcaFiltro;
      return cumpleMes && cumpleMarca;
    });
  }, [mesFiltro, marcaFiltro]);

  const reservasFiltradas = useMemo(() => {
    return datos_reservas.filter(item => {
      const cumpleMes = !mesFiltro || item.mes_inicio === Number(mesFiltro);
      const cumpleMarca = !marcaFiltro || item.marca_vehiculo === marcaFiltro;
      return cumpleMes && cumpleMarca;
    });
  }, [mesFiltro, marcaFiltro]);

  // CÁLCULO DE KPIs DE NEGOCIO (Cruzando ambos hechos)
  const kpis = useMemo(() => {
    const ingresosAlquileres = alquileresFiltrados.reduce((sum, item) => sum + (Number(item.monto_final) || 0), 0);
    const montoTotalReservas = reservasFiltradas.reduce((sum, item) => sum + (Number(item.monto_total) || 0), 0);
    const totalReservas = reservasFiltradas.length;
    const alquileresEfectivos = alquileresFiltrados.filter(a => a.estado === 'completado' || a.estado === 'en_curso').length;
    const tasaConversion = totalReservas > 0 ? ((alquileresEfectivos / totalReservas) * 100).toFixed(1) : 0;

    return {
      ingresosAlquileres,
      montoTotalReservas,
      totalReservas,
      totalAlquileres: alquileresFiltrados.length,
      alquileresEfectivos,
      tasaConversion
    };
  }, [alquileresFiltrados, reservasFiltradas]);

  // AGRUPACIÓN MULTIDIMENSIONAL COMBINADA
  const datosGrafico = useMemo(() => {
    const mapa = {};

    alquileresFiltrados.forEach(item => {
      const clave = agruparPor === 'mes' ? `Mes ${item.mes_inicio}` : (item[agruparPor] || 'Sin dato');
      if (!mapa[clave]) {
        mapa[clave] = { etiqueta: clave, ingresosAlquiler: 0, montoReserva: 0, cantidadAlquileres: 0, cantidadReservas: 0 };
      }
      mapa[clave].ingresosAlquiler += Number(item.monto_final) || 0;
      mapa[clave].cantidadAlquileres += 1;
    });

    reservasFiltradas.forEach(item => {
      const clave = agruparPor === 'mes' ? `Mes ${item.mes_inicio}` : (item[agruparPor] || 'Sin dato');
      if (!mapa[clave]) {
        mapa[clave] = { etiqueta: clave, ingresosAlquiler: 0, montoReserva: 0, cantidadAlquileres: 0, cantidadReservas: 0 };
      }
      mapa[clave].montoReserva += Number(item.monto_total) || 0;
      mapa[clave].cantidadReservas += 1;
    });

    return Object.values(mapa);
  }, [alquileresFiltrados, reservasFiltradas, agruparPor]);

  const formatoMoneda = (val) => `$${Number(val).toLocaleString('es-NI')}`;

  // FUNCIÓN PARA GENERAR INTERPRETACIÓN CON GEMINI (API Interactions)
  const generarInterpretacionIA = async () => {
    setCargandoIA(true);
    setErrorIA('');

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.REACT_APP_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error("No se encontró la API Key en el archivo .env");
      }

      const ai = new GoogleGenAI({ apiKey });

      const promptText = `
        Actúa como un Analista de Negocios y Datos de Inteligencia Empresarial (BI).
        Analiza los siguientes datos de un Dashboard OLAP de alquileres y reservas de vehículos:

        - Criterio de Agrupación Actual: ${agruparPor.replace('_', ' ')}
        - Filtro de Mes: ${mesFiltro ? `Mes ${mesFiltro}` : 'Todos'}
        - Filtro de Marca: ${marcaFiltro || 'Todas'}

        KPIs Globales:
        - Ingresos Reales Alquileres: $${kpis.ingresosAlquileres}
        - Monto Solicitado Reservas: $${kpis.montoTotalReservas}
        - Tasa de Conversión: ${kpis.tasaConversion}% (${kpis.alquileresEfectivos} de ${kpis.totalReservas} reservas efectivas)

        Desglose por categoría (${agruparPor}):
        ${JSON.stringify(datosGrafico, null, 2)}

        Instrucción estricta: Analiza los datos provistos y genera un resumen ejecutivo directo y estrictamente centrado en los hallazgos clave. Omita saludos, introducciones, conclusiones de cortesía o cualquier referencia al modelo de IA. El texto final debe redactarse de forma fluida y precisa, conteniendo exactamente entre 40 y 60 palabras.
      `;
      
      const interaction = await ai.interactions.create({
        model: 'gemini-3.8-flash',
        input: promptText,
      });

      setAnalisisIA(interaction.output_text);
    } catch (err) {
      console.error("Error al conectar con Gemini API:", err);
      setErrorIA(err.message || 'Error al obtener la interpretación de la IA.');
    } finally {
      setCargandoIA(false);
    }
  };

  return (
    <div className="inicio-contenedor" style={{ padding: '20px', backgroundColor: '#f8fafc' }}>
      <div className="contenedor-dashboard">
        <Container fluid>
          <h2 className="mb-1 fw-bold">Dashboard Analítico de Alquileres vs Reservas</h2>
          <p className="text-muted mb-4">Métricas multidimensionales integradas a partir del Cubo OLAP</p>

          {/* PANEL DE FILTROS */}
          <Card className="p-3 mb-4 shadow-sm border-0">
            <Row className="g-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-bold fs-7">Filtrar por Mes</Form.Label>
                  <Form.Select value={mesFiltro} onChange={(e) => setMesFiltro(e.target.value)}>
                    <option value="">Todos los meses</option>
                    {listaMeses.map(m => (
                      <option key={m} value={m}>Mes {m}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-bold fs-7">Filtrar por Marca</Form.Label>
                  <Form.Select value={marcaFiltro} onChange={(e) => setMarcaFiltro(e.target.value)}>
                    <option value="">Todas las marcas</option>
                    {listaMarcas.map(marca => (
                      <option key={marca} value={marca}>{marca}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-bold fs-7">Agrupar por Dimensión</Form.Label>
                  <Form.Select value={agruparPor} onChange={(e) => setAgruparPor(e.target.value)}>
                    <option value="marca_vehiculo">Marca de Vehículo</option>
                    <option value="modelo_vehiculo">Modelo de Vehículo</option>
                    <option value="mes">Mes</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-bold fs-7">Tipo de Gráfico</Form.Label>
                  <Form.Select value={tipoGrafico} onChange={(e) => setTipoGrafico(e.target.value)}>
                    <option value="bar">Barras Comparativas</option>
                    <option value="line">Líneas de Tendencia</option>
                    <option value="pie">Circular (Monto Alquiler)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card>

          {/* TARJETAS KPI */}
          <Row className="mb-4 g-3">
            <Col md={3}>
              <Card className="p-3 shadow-sm border-0 text-center bg-white">
                <span className="text-muted fs-7 fw-semibold">Ingresos Reales (Alquileres)</span>
                <h3 className="fw-bold text-success mt-2 mb-0">{formatoMoneda(kpis.ingresosAlquileres)}</h3>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="p-3 shadow-sm border-0 text-center bg-white">
                <span className="text-muted fs-7 fw-semibold">Monto Total Solicitado (Reservas)</span>
                <h3 className="fw-bold text-primary mt-2 mb-0">{formatoMoneda(kpis.montoTotalReservas)}</h3>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="p-3 shadow-sm border-0 text-center bg-white">
                <span className="text-muted fs-7 fw-semibold">Tasa de Conversión a Alquiler</span>
                <h3 className="fw-bold text-warning mt-2 mb-0">{kpis.tasaConversion}%</h3>
                <small className="text-muted fs-8">{kpis.alquileresEfectivos} de {kpis.totalReservas} reservas efectivas</small>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="p-3 shadow-sm border-0 text-center bg-white">
                <span className="text-muted fs-7 fw-semibold">Total Alquileres vs Reservas</span>
                <h3 className="fw-bold text-dark mt-2 mb-0">{kpis.totalAlquileres} / {kpis.totalReservas}</h3>
                <small className="text-muted fs-8">Registros procesados</small>
              </Card>
            </Col>
          </Row>

          {/* GRÁFICO PRINCIPAL */}
          <Card className="p-4 shadow-sm border-0 mb-4" style={{ minHeight: '450px' }}>
            <h5 className="fw-bold mb-3 text-secondary">
              Comparativa: Alquileres (Efectivo) vs Reservas por {agruparPor.replace('_', ' ')}
            </h5>

            <div style={{ width: '100%', height: 360 }}>
              <ResponsiveContainer>
                {tipoGrafico === 'bar' ? (
                  <BarChart data={datosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="etiqueta" />
                    <YAxis tickFormatter={(v) => `$${v}`} />
                    <Tooltip formatter={(value) => formatoMoneda(value)} />
                    <Legend />
                    <Bar dataKey="ingresosAlquiler" name="Ingreso Alquileres ($)" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="montoReserva" name="Monto Reservado ($)" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : tipoGrafico === 'line' ? (
                  <LineChart data={datosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="etiqueta" />
                    <YAxis tickFormatter={(v) => `$${v}`} />
                    <Tooltip formatter={(value) => formatoMoneda(value)} />
                    <Legend />
                    <Line type="monotone" dataKey="ingresosAlquiler" name="Ingreso Alquileres ($)" stroke="#2563eb" strokeWidth={3} />
                    <Line type="monotone" dataKey="montoReserva" name="Monto Reservado ($)" stroke="#f97316" strokeWidth={3} />
                  </LineChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={datosGrafico}
                      dataKey="ingresosAlquiler"
                      nameKey="etiqueta"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label={(entry) => `${entry.etiqueta}: ${formatoMoneda(entry.ingresosAlquiler)}`}
                    >
                      {datosGrafico.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatoMoneda(value)} />
                    <Legend />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </Card>

          {/* CUADRO INFERIOR: ANÁLISIS E INTERPRETACIÓN DE IA (CON MARKDOWN) */}
          <Card className="p-4 shadow-sm border-0 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold mb-0 text-primary">Análisis he interpretación del gráfico</h5>
                <small className="text-muted">Interpretación automatizada para potenciar la toma de deciciones</small>
              </div>
              <Button 
                variant="primary" 
                onClick={generarInterpretacionIA} 
                disabled={cargandoIA}
                className="px-4 fw-semibold"
              >
                {cargandoIA ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Analizando datos...
                  </>
                ) : (
                  'Generar Análisis con IA'
                )}
              </Button>
            </div>

            {errorIA && (
              <Alert variant="danger" className="mb-3">
                {errorIA}
              </Alert>
            )}

            {analisisIA ? (
              <div 
                className="p-3 rounded bg-light border" 
                style={{ lineHeight: '1.6', fontSize: '0.95rem' }}
              >
                <ReactMarkdown>{analisisIA}</ReactMarkdown>
              </div>
            ) : (
              !cargandoIA && (
                <div className="text-center py-4 text-muted border border-dashed rounded bg-light">
                  Haz clic en "Generar Análisis con IA" para obtener una interpretación ejecutiva y recomendaciones basadas en los filtros seleccionados.
                </div>
              )
            )}
          </Card>

        </Container>
      </div>
    </div>
  );
};

export default Dashboard;

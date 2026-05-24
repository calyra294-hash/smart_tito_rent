import React, { useEffect, useState, useMemo } from "react";
import {
    Container,
    Row,
    Col,
    Spinner,
    Alert,
    Form,
} from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";

import TarjetaCatalogoCoche from
    "../components/catalogo/TarjetaCatalogoCoche";

import CuadroBusquedas from
    "../components/busquedas/CuadroBusquedas";

const Catalogo = () => {

    const [coches, setCoches] = useState([]);

    const [estadoSeleccionado, setEstadoSeleccionado] =
        useState("todos");

    const [textoBusqueda, setTextoBusqueda] =
        useState("");

    const [cargando, setCargando] =
        useState(true);

    const [error, setError] =
        useState(null);

    // 📌 CARGAR COCHES
    const cargarCoches = async () => {

        try {

            setCargando(true);

            const { data, error } = await supabase
                .from("coche")
                .select("*")
                .order("marca", { ascending: true });

            if (error) throw error;

            setCoches(data || []);

        } catch (err) {

            console.error(err.message);

            setError(
                "No se pudieron cargar los vehículos."
            );

        } finally {

            setCargando(false);
        }
    };

    useEffect(() => {
        cargarCoches();
    }, []);

    // 📌 FILTROS
    const cochesFiltrados = useMemo(() => {

        let filtrados = coches;

        // FILTRO ESTADO
        if (estadoSeleccionado !== "todos") {

            filtrados = filtrados.filter(
                (coche) =>
                    coche.estado === estadoSeleccionado
            );
        }

        // FILTRO BÚSQUEDA
        if (textoBusqueda.trim()) {

            const texto =
                textoBusqueda.toLowerCase().trim();

            filtrados = filtrados.filter((coche) => {

                const marca =
                    coche.marca?.toLowerCase() || "";

                const modelo =
                    coche.modelo?.toLowerCase() || "";

                const placa =
                    coche.placa?.toLowerCase() || "";

                const color =
                    coche.color?.toLowerCase() || "";

                return (
                    marca.includes(texto) ||
                    modelo.includes(texto) ||
                    placa.includes(texto) ||
                    color.includes(texto)
                );
            });
        }

        return filtrados;

    }, [
        coches,
        estadoSeleccionado,
        textoBusqueda,
    ]);

    // 📌 CAMBIO ESTADO
    const manejarCambioEstado = (e) => {

        setEstadoSeleccionado(e.target.value);
    };

    // 📌 CAMBIO BUSCADOR
    const manejarCambioBusqueda = (e) => {

        setTextoBusqueda(e.target.value);
    };

    return (

        <div className="contenido-principal">
            <Container fluid>

            {/* TÍTULO */}
            <Row className="text-center mb-3">

                <Col>

                    <h2>
                        <i className="bi bi-car-front-fill me-2 text-danger"></i>
                        Catálogo de Vehículos
                    </h2>

                    <p className="lead text-muted">
                        Explora nuestros vehículos disponibles
                    </p>

                </Col>

            </Row>

            {/* FILTROS */}
            <Row className="mb-3 align-items-end">

                {/* FILTRO ESTADO */}
                <Col md={4} lg={3} className="mb-2">

                    <Form.Group>

                        <Form.Select
                            value={estadoSeleccionado}
                            onChange={manejarCambioEstado}
                            className="shadow-sm"
                        >

                            <option value="todos">
                                Todos los estados
                            </option>

                            <option value="Disponible">
                                Disponible
                            </option>

                            <option value="En Alquiler">
                                En Alquiler
                            </option>

                            <option value="Mantenimiento">
                                Mantenimiento
                            </option>

                        </Form.Select>

                    </Form.Group>

                </Col>

                {/* BUSCADOR */}
                <Col md={6} lg={5} className="mb-2">

                    <CuadroBusquedas
                        textoBusqueda={textoBusqueda}
                        manejarCambioBusqueda={
                            manejarCambioBusqueda
                        }
                    />

                </Col>

            </Row>

            {/* CARGANDO */}
            {cargando && (

                <Row className="text-center my-5">

                    <Col>

                        <Spinner
                            animation="border"
                            variant="primary"
                            size="lg"
                        />

                        <p className="mt-3 text-muted">
                            Cargando vehículos...
                        </p>

                    </Col>

                </Row>

            )}

            {/* ERROR */}
            {error && (

                <Alert
                    variant="danger"
                    className="text-center"
                >

                    <i className="bi bi-exclamation-circle me-2"></i>

                    {error}

                </Alert>

            )}

            {/* VACÍO */}
            {!cargando &&
                cochesFiltrados.length === 0 && (

                <Alert
                    variant="info"
                    className="text-center"
                >

                    <i className="bi bi-info-circle me-2"></i>

                    No se encontraron vehículos.

                </Alert>

            )}

            {/* CATÁLOGO */}
            {!cargando &&
                cochesFiltrados.length > 0 && (

                <Row className="g-3">

                    {cochesFiltrados.map((coche) => (

                        <Col
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            key={coche.id_coche}
                        >

                            <TarjetaCatalogoCoche
                                coche={coche}
                            />

                        </Col>

                    ))}

                </Row>

            )}
        </Container>
        </div>
        
    );
};

export default Catalogo;
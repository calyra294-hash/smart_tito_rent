import React, { useState, useEffect } from "react";

import {
    Container,
    Row,
    Col,
    Card
} from "react-bootstrap";

import { supabase } from "../database/supabaseconfig";

const DashboardEstadistico = () => {

const [estadisticas, setEstadisticas] = useState({
    totalVehiculos: 0,
    totalAlquileres: 0,
    ingresosTotales: 0,
    totalClientes: 0
});

useEffect(() => {
    cargarEstadisticas();
}, []);

const cargarEstadisticas = async () => {
    try {

        // Vehículos
        const { count: totalVehiculos } = await supabase
            .from("coche")
            .select("*", {
                count: "exact",
                head: true
            });

        // Alquileres
        const { count: totalAlquileres } = await supabase
            .from("alquiler")
            .select("*", {
                count: "exact",
                head: true
            });

        // Clientes
        const { count: totalClientes } = await supabase
            .from("usuario")
            .select("*", {
                count: "exact",
                head: true
            });

        // Ingresos
        const { data: detalles } = await supabase
            .from("detalle_alquiler")
            .select("precio_total");

        const ingresosTotales =
            detalles?.reduce(
                (sum, item) =>
                    sum + Number(item.precio_total),
                0
            ) || 0;

        setEstadisticas({
            totalVehiculos,
            totalAlquileres,
            ingresosTotales,
            totalClientes
        });

    } catch (error) {
        console.error(error);
    }
};

    
        return (

            <div className="contenido-principal">

            <div className="contenedor-dashboard">
                
    <Container fluid className="py-4">

        {/* Encabezado */}
        <div className="mb-4">
            <h2 className="fw-bold">
                <i className="bi bi-graph-up-arrow me-2"></i>
                Dashboard Estadístico
            </h2>

            <p className="text-muted">
                Estadísticas generales de Tito's Rent a Car
            </p>
        </div>

        {/* KPIs */}
        <Row className="g-4 mb-4">

            <Col lg={3} md={6}>
                <Card className="shadow-sm border-0">
                    <Card.Body>
                        <h6 className="text-muted">
                            Vehículos Registrados
                        </h6>
                        <h2 className="fw-bold text-primary">
                            {estadisticas.totalVehiculos}
                        </h2>
                    </Card.Body>
                </Card>
            </Col>

            <Col lg={3} md={6}>
                <Card className="shadow-sm border-0">
                    <Card.Body>
                        <h6 className="text-muted">
                            Alquileres Realizados
                        </h6>
                        <h2 className="fw-bold text-success">
                            {estadisticas.totalAlquileres}
                        </h2>
                    </Card.Body>
                </Card>
            </Col>

            <Col lg={3} md={6}>
                <Card className="shadow-sm border-0">
                    <Card.Body>
                        <h6 className="text-muted">
                            Ingresos Totales
                        </h6>
                        <h2 className="fw-bold text-warning">
                            C$ {estadisticas.ingresosTotales.toFixed(2)}
                        </h2>
                    </Card.Body>
                </Card>
            </Col>

            <Col lg={3} md={6}>
                <Card className="shadow-sm border-0">
                    <Card.Body>
                        <h6 className="text-muted">
                            Clientes Registrados
                        </h6>
                        <h2 className="fw-bold text-danger">
                            {estadisticas.totalClientes}
                        </h2>
                    </Card.Body>
                </Card>
            </Col>

        </Row>

        {/* Gráfico principal */}
        <Row className="mb-4">
            <Col>
                <Card className="shadow-sm border-0">
                    <Card.Body>

                        <h5 className="fw-bold">
                            Alquileres por Mes
                        </h5>

                        <div
                            className="mt-3 rounded"
                            style={{
                                height: "350px",
                                backgroundColor: "#f8f9fa",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            Gráfico de Alquileres por Mes
                        </div>

                    </Card.Body>
                </Card>
            </Col>
        </Row>

        {/* Segunda fila */}
        <Row className="g-4">

            <Col lg={6}>
                <Card className="shadow-sm border-0">
                    <Card.Body>

                        <h5 className="fw-bold">
                            Vehículos Más Alquilados
                        </h5>

                        <div
                            className="mt-3 rounded"
                            style={{
                                height: "300px",
                                backgroundColor: "#f8f9fa",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            BarChart
                        </div>

                    </Card.Body>
                </Card>
            </Col>

            <Col lg={6}>
                <Card className="shadow-sm border-0">
                    <Card.Body>

                        <h5 className="fw-bold">
                            Estado de la Flota
                        </h5>

                        <div
                            className="mt-3 rounded"
                            style={{
                                height: "300px",
                                backgroundColor: "#f8f9fa",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            PieChart
                        </div>

                    </Card.Body>
                </Card>
            </Col>

        </Row>

        {/* Tercera fila */}
        <Row className="g-4 mt-1">

            <Col lg={6}>
                <Card className="shadow-sm border-0">
                    <Card.Body>

                        <h5 className="fw-bold">
                            Ingresos por Mes
                        </h5>

                        <div
                            className="mt-3 rounded"
                            style={{
                                height: "300px",
                                backgroundColor: "#f8f9fa",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            LineChart
                        </div>

                    </Card.Body>
                </Card>
            </Col>

            <Col lg={6}>
                <Card className="shadow-sm border-0">
                    <Card.Body>

                        <h5 className="fw-bold">
                            Costos de Mantenimiento
                        </h5>

                        <div
                            className="mt-3 rounded"
                            style={{
                                height: "300px",
                                backgroundColor: "#f8f9fa",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            BarChart
                        </div>

                    </Card.Body>
                </Card>
            </Col>

        </Row>

    </Container>

    </div>

    </div>
);
    
};

export default DashboardEstadistico;
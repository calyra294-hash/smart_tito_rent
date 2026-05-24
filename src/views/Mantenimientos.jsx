import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalRegistroMantenimiento from "../components/mantenimientos/ModalRegistroMantenimiento";
import ModalEdicionMantenimiento from "../components/mantenimientos/ModalEdicionMantenimiento";
import ModalEliminacionMantenimiento from "../components/mantenimientos/ModalEliminacionMantenimiento";
import ModalDetalleMantenimiento from "../components/mantenimientos/ModalDetalleMantenimiento";
import TablaMantenimientos from "../components/mantenimientos/TablaMantenimiento";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Mantenimientos = () => {
    const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
    const [detalleMantenimiento, setDetalleMantenimiento] = useState(null);

    const [nuevoMantenimiento, setNuevoMantenimiento] = useState({
        descripcion: "",
        justificacion: "",
        fecha_inicio: "",
        fecha_fin: "",
        costo: "",
        id_coche: "",
        id_empleado: "",
    });

    const [mantenimientos, setMantenimientos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
    const [mantenimientoAEliminar, setMantenimientoAEliminar] = useState(null);
    const [coches, setCoches] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

    const [mantenimientoEditar, setMantenimientoEditar] = useState({
        id_mantenimiento: "",
        descripcion: "",
        justificacion: "",
        fecha_inicio: "",
        fecha_fin: "",
        costo: "",
    });

    // Carga inicial de listas para los selectores
    const cargarListas = async () => {
        const { data: c } = await supabase.from("coche").select("*");
        // CAMBIO: Se usa "empleados" (plural)
        const { data: e } = await supabase.from("empleados").select("*");
        setCoches(c || []);
        setEmpleados(e || []);
    };

    const cargarMantenimientos = async () => {
        try {
            setCargando(true);
            const { data, error } = await supabase
                .from("mantenimiento")
                .select(`
                    *,
                    detalle_mantenimiento (
                        coche (*),
                        empleados (*)
                    )
                `);
            if (error) throw error;
            setMantenimientos(data || []);
        } catch (err) {
            console.error("Error en carga:", err);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarListas();
        cargarMantenimientos();
    }, []);

    const manejoCambioInput = (e) => {
        const { name, value } = e.target;
        setNuevoMantenimiento((prev) => ({ ...prev, [name]: value }));
    };

    const manejoCambioInputEdicion = (e) => {
        const { name, value } = e.target;
        setMantenimientoEditar((prev) => ({ ...prev, [name]: value }));
    };

    const agregarMantenimiento = async () => {
        try {
            if (!nuevoMantenimiento.id_coche || !nuevoMantenimiento.id_empleado) {
                setToast({ mostrar: true, mensaje: "Debes seleccionar un coche y un empleado", tipo: "error" });
                return;
            }

            // 1. Insertar Mantenimiento
            const { data: mantData, error: mantError } = await supabase
                .from("mantenimiento")
                .insert([{
                    descripcion: nuevoMantenimiento.descripcion,
                    justificacion: nuevoMantenimiento.justificacion,
                    fecha_inicio: nuevoMantenimiento.fecha_inicio,
                    fecha_fin: nuevoMantenimiento.fecha_fin,
                    costo: nuevoMantenimiento.costo,
                }])
                .select()
                .single();

            if (mantError) throw mantError;

            // 2. Insertar Detalle (Relacionando con la tabla revertida)
            const { error: detalleError } = await supabase
                .from("detalle_mantenimiento")
                .insert([{
                    id_mantenimiento: mantData.id_mantenimiento,
                    id_coche: nuevoMantenimiento.id_coche,
                    id_empleado: nuevoMantenimiento.id_empleado,
                    observaciones: "Mantenimiento inicializado",
                    recomendaciones: "Pendiente",
                    partes_cambiadas: "Ninguna"
                }]);

            if (detalleError) {
                await supabase.from("mantenimiento").delete().eq("id_mantenimiento", mantData.id_mantenimiento);
                throw detalleError;
            }

            setMostrarModal(false);
            setToast({ mostrar: true, mensaje: "¡Mantenimiento registrado con éxito!", tipo: "exito" });
            cargarMantenimientos();
            
            // Limpiar formulario
            setNuevoMantenimiento({
                descripcion: "", justificacion: "", fecha_inicio: "", 
                fecha_fin: "", costo: "", id_coche: "", id_empleado: ""
            });

        } catch (error) {
            console.error("Error completo:", error);
            setToast({ mostrar: true, mensaje: "Error: " + error.message, tipo: "error" });
        }
    };

    const actualizarMantenimiento = async () => {
        try {
            const { error } = await supabase
                .from("mantenimiento")
                .update(mantenimientoEditar)
                .eq("id_mantenimiento", mantenimientoEditar.id_mantenimiento);
            if (error) throw error;
            setMostrarModalEdicion(false);
            cargarMantenimientos();
            setToast({ mostrar: true, mensaje: "Mantenimiento actualizado.", tipo: "exito" });
        } catch (err) {
            setToast({ mostrar: true, mensaje: err.message, tipo: "error" });
        }
    };

    const eliminarMantenimiento = async () => {
        try {
            const { error } = await supabase
                .from("mantenimiento")
                .delete()
                .eq("id_mantenimiento", mantenimientoAEliminar.id_mantenimiento);
            if (error) throw error;
            setMostrarModalEliminacion(false);
            cargarMantenimientos();
            setToast({ mostrar: true, mensaje: "Mantenimiento eliminado.", tipo: "exito" });
        } catch (err) {
            setToast({ mostrar: true, mensaje: err.message, tipo: "error" });
        }
    };

    // Función para ver el detalle técnico
    const verDetalle = async (id) => {
        try {
            const { data, error } = await supabase
                .from("mantenimiento")
                .select(`
                    *,
                    detalle_mantenimiento!id_mantenimiento (
                        id_detalle_mantenimiento,
                        observaciones,
                        recomendaciones,
                        partes_cambiadas,
                        coche!id_coche (*),
                        empleados!id_empleado (*)
                    )
                `)
                .eq("id_mantenimiento", id)
                .single();

            if (error) throw error;
            setDetalleMantenimiento(data);
            setMostrarModalDetalle(true);
        } catch (error) {
            console.error("Error al obtener detalle:", error);
        }
    };

    const abrirModalEdicion = (m) => {
        setMantenimientoEditar(m);
        setMostrarModalEdicion(true);
    };

    const abrirModalEliminacion = (m) => {
        setMantenimientoAEliminar(m);
        setMostrarModalEliminacion(true);
    };

    return (
        <div className="contenido-principal">
            <div className="contenedor-dashboard">
        <Container className="mt-3">
            <Row className="align-items-center mb-3">
                <Col>
                    <h3 className="d-flex align-items-center">
                        <i className="bi bi-tools me-2"></i> Mantenimientos
                    </h3>
                    <small className="text-muted">
                                    Gestión de Mantenimientos
                                </small>
                </Col>

                <Col className="text-end">

                    <Button 
                    variant="danger"
                        className="rounded-pill px-4 shadow-sm"
                                    onClick={() => setMostrarModal(true)}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        Nuevo Mantenimiento
                    </Button>
                </Col>
            </Row>
            <hr />
            {cargando ? (
                <Spinner animation="border" />
            ) : (
                <TablaMantenimientos
                    mantenimientos={mantenimientos}
                    abrirModalEdicion={abrirModalEdicion}
                    abrirModalEliminacion={abrirModalEliminacion}
                    verDetalleMantenimiento={verDetalle}
                />
            )}
            
            <ModalRegistroMantenimiento
                mostrarModal={mostrarModal}
                setMostrarModal={setMostrarModal}
                nuevoMantenimiento={nuevoMantenimiento}
                manejoCambioInput={manejoCambioInput}
                agregarMantenimiento={agregarMantenimiento}
                coches={coches}
                empleados={empleados}
            />

            <ModalEdicionMantenimiento
                mostrarModalEdicion={mostrarModalEdicion}
                setMostrarModalEdicion={setMostrarModalEdicion}
                mantenimientoEditar={mantenimientoEditar}
                manejoCambioInputEdicion={manejoCambioInputEdicion}
                actualizarMantenimiento={actualizarMantenimiento}
            />

            <ModalEliminacionMantenimiento
                mostrarModalEliminacion={mostrarModalEliminacion}
                setMostrarModalEliminacion={setMostrarModalEliminacion}
                eliminarMantenimiento={eliminarMantenimiento}
                mantenimientoAEliminar={mantenimientoAEliminar}
            />

            <ModalDetalleMantenimiento
                mostrarModalDetalle={mostrarModalDetalle}
                setMostrarModalDetalle={setMostrarModalDetalle}
                detalleMantenimiento={detalleMantenimiento}
            />

            <NotificacionOperacion
                mostrar={toast.mostrar}
                mensaje={toast.mensaje}
                tipo={toast.tipo}
                onCerrar={() => setToast({ ...toast, mostrar: false })}
            />
        </Container>
        </div>
        </div>
    );
};

export default Mantenimientos;
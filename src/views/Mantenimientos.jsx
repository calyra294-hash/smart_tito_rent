import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalRegistroMantenimiento from "../components/mantenimientos/ModalRegistroMantenimiento";
import ModalEdicionMantenimiento from "../components/mantenimientos/ModalEdicionMantenimiento";
import ModalEliminacionMantenimiento from "../components/mantenimientos/ModalEliminacionMantenimiento";
import ModalDetalleMantenimiento from "../components/mantenimientos/ModalDetalleMantenimiento";
import TablaMantenimientos from "../components/mantenimientos/TablaMantenimiento";
import TarjetaMantenimiento from "../components/mantenimientos/TarjetaMantenimiento";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
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
    const [mantenimientosFiltrados, setMantenimientosFiltrados] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");
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
    // FILTRO: Ahora solo traerá los coches cuyo estado sea exactamente "Disponible"
    const { data: c, error: cocheError } = await supabase
        .from("coche")
        .select("*")
        .eq("estado", "Disponible");

    if (cocheError) {
        console.error("Error al cargar coches disponibles:", cocheError);
    }

    // Se mantiene igual para los empleados
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
            setMantenimientosFiltrados(data || []);
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

    useEffect(() => {
        const texto = textoBusqueda.toLowerCase();

        setMantenimientosFiltrados(
            mantenimientos.filter((m) => {
                const detalleTexto = JSON.stringify(m.detalle_mantenimiento || "").toLowerCase();
                return [
                    String(m.id_mantenimiento),
                    m.descripcion,
                    m.justificacion,
                    m.fecha_inicio,
                    m.fecha_fin,
                    String(m.costo),
                    detalleTexto,
                ]
                    .some((campo) => campo?.toLowerCase().includes(texto));
            })
        );
    }, [textoBusqueda, mantenimientos]);

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

        // 2. Insertar Detalle
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
            // Revertir mantenimiento si falla el detalle
            await supabase.from("mantenimiento").delete().eq("id_mantenimiento", mantData.id_mantenimiento);
            throw detalleError;
        }

        // 3. NUEVO: Actualizar el estado del coche en la base de datos
        const { error: cocheError } = await supabase
            .from("coche")
            .update({ estado: "En Mantenimiento" }) // O el nombre exacto de tu estado (ej: "Mantenimiento")
            .eq("id_coche", nuevoMantenimiento.id_coche);

        if (cocheError) {
            console.error("Error al cambiar el estado del coche:", cocheError);
            // Opcional: Podrías lanzar el error o dejar que pase si consideras que el mantenimiento ya se guardó
            throw cocheError;
        }

        // 4. Finalizar proceso con éxito
        setMostrarModal(false);
        setToast({ mostrar: true, mensaje: "¡Mantenimiento registrado y estado del vehículo actualizado!", tipo: "exito" });
        
        // Recargar datos locales
        cargarMantenimientos();
        cargarListas(); // Esto recargará tu estado 'coches' local con los nuevos datos

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
        // 1. Guardar los cambios del mantenimiento
        const { error } = await supabase
            .from("mantenimiento")
            .update(mantenimientoEditar)
            .eq("id_mantenimiento", mantenimientoEditar.id_mantenimiento);
        
        if (error) throw error;

        // 2. Si el usuario le puso una fecha de fin menor o igual a hoy, liberamos el coche
        const hoy = new Date().toISOString().split("T")[0];
        
        if (mantenimientoEditar.fecha_fin && mantenimientoEditar.fecha_fin <= hoy) {
            
            // Primero obtenemos el id_coche asociado a este mantenimiento desde su detalle
            const { data: detalle } = await supabase
                .from("detalle_mantenimiento")
                .select("id_coche")
                .eq("id_mantenimiento", mantenimientoEditar.id_mantenimiento)
                .single();

            if (detalle?.id_coche) {
                // Actualizamos el coche correspondiente a "Disponible"
                await supabase
                    .from("coche")
                    .update({ estado: "Disponible" })
                    .eq("id_coche", detalle.id_coche);
            }
        }

        setMostrarModalEdicion(false);
        cargarMantenimientos();
        if (typeof cargarListas === "function") cargarListas(); // Recarga los selectores si aplica
        setToast({ mostrar: true, mensaje: "Mantenimiento actualizado con éxito.", tipo: "exito" });
        
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
        <div className="inicio-contenedor">
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
                    <Row className="mb-3">
                        <Col xs={12} md={6} lg={4}>
                            <CuadroBusquedas
                                textoBusqueda={textoBusqueda}
                                manejarCambioBusqueda={(e) => setTextoBusqueda(e.target.value)}
                                placeholder="Buscar mantenimientos..."
                            />
                        </Col>
                    </Row>
                    {cargando ? (
                        <div className="text-center my-5">
                            <Spinner animation="border" variant="danger" />
                        </div>
                    ) : (
                        <>
                            {/* VISTA EN COMPUTADORA: Se muestra de 'md' en adelante, en móvil se oculta */}
                            <div className="d-none d-md-block">
                                <TablaMantenimientos
                                    mantenimientos={mantenimientosFiltrados}
                                    abrirModalEdicion={abrirModalEdicion}
                                    abrirModalEliminacion={abrirModalEliminacion}
                                    verDetalleMantenimiento={verDetalle}
                                />
                            </div>

                            {/* VISTA EN MÓVIL: Se muestra en pantallas chicas, de 'md' en adelante se oculta */}
                            <div className="d-block d-md-none">
                                <TarjetaMantenimiento
                                    mantenimientos={mantenimientosFiltrados}
                                    abrirModalEdicion={abrirModalEdicion}
                                    abrirModalEliminacion={abrirModalEliminacion}
                                    verDetalleMantenimiento={verDetalle}
                                />
                            </div>
                        </>
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
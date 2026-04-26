import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalRegistroMantenimiento from "../components/mantenimientos/ModalRegistroMantenimiento";
import ModalEdicionMantenimiento from "../components/mantenimientos/ModalEdicionMantenimiento";
import ModalEliminacionMantenimiento from "../components/mantenimientos/ModalEliminacionMantenimiento";
import TablaMantenimientos from "../components/mantenimientos/TablaMantenimiento";
import TarjetaMantenimiento from "../components/mantenimientos/TarjetaMantenimiento";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Mantenimientos = () => {
    const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
    const [mostrarModal, setMostrarModal] = useState(false);

    const [nuevoMantenimiento, setNuevoMantenimiento] = useState({
        descripcion: "",
        justificacion: "",
        fecha_inicio: "",
        fecha_fin: "",
        costo: "",
    });

    const [mantenimientos, setMantenimientos] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
    const [mantenimientoAEliminar, setMantenimientoAEliminar] = useState(null);

    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

    const [mantenimientoEditar, setMantenimientoEditar] = useState({
        id_mantenimiento: "",
        descripcion: "",
        justificacion: "",
        fecha_inicio: "",
        fecha_fin: "",
        costo: "",
    });

    // 🔥 CARGAR
    const cargarMantenimientos = async () => {
        try {
            setCargando(true);

            const { data, error } = await supabase
                .from("mantenimiento")
                .select("*")
                .order("id_mantenimiento", { ascending: true });

            if (error) throw error;

            setMantenimientos(data || []);
        } catch (err) {
            console.error(err);
            setToast({
                mostrar: true,
                mensaje: err.message,
                tipo: "error",
            });
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarMantenimientos();
    }, []);

    // INPUT REGISTRO
    const manejoCambioInput = (e) => {
        const { name, value } = e.target;
        setNuevoMantenimiento((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // INPUT EDICIÓN
    const manejoCambioInputEdicion = (e) => {
        const { name, value } = e.target;
        setMantenimientoEditar((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ✅ AGREGAR
    const agregarMantenimiento = async () => {
        if (
            !nuevoMantenimiento.descripcion ||
            !nuevoMantenimiento.justificacion ||
            !nuevoMantenimiento.fecha_inicio ||
            !nuevoMantenimiento.fecha_fin ||
            !nuevoMantenimiento.costo
        ) {
            setToast({
                mostrar: true,
                mensaje: "Debe llenar todos los campos.",
                tipo: "advertencia",
            });
            return;
        }

        try {
            const { error } = await supabase
                .from("mantenimiento")
                .insert([nuevoMantenimiento]);

            if (error) throw error;

            setToast({
                mostrar: true,
                mensaje: "Mantenimiento registrado.",
                tipo: "exito",
            });

            setMostrarModal(false);

            setNuevoMantenimiento({
                descripcion: "",
                justificacion: "",
                fecha_inicio: "",
                fecha_fin: "",
                costo: "",
            });

            cargarMantenimientos();
        } catch (err) {
            console.error(err);
            setToast({
                mostrar: true,
                mensaje: err.message,
                tipo: "error",
            });
        }
    };

    // ACTUALIZAR
    const actualizarMantenimiento = async () => {
        try {
            const { error } = await supabase
                .from("mantenimiento")
                .update(mantenimientoEditar)
                .eq("id_mantenimiento", mantenimientoEditar.id_mantenimiento);

            if (error) throw error;

            setMostrarModalEdicion(false);
            cargarMantenimientos();

            setToast({
                mostrar: true,
                mensaje: "Mantenimiento actualizado.",
                tipo: "exito",
            });
        } catch (err) {
            console.error(err);
            setToast({
                mostrar: true,
                mensaje: err.message,
                tipo: "error",
            });
        }
    };

    // ELIMINAR
    const eliminarMantenimiento = async () => {
        try {
            const { error } = await supabase
                .from("mantenimiento")
                .delete()
                .eq("id_mantenimiento", mantenimientoAEliminar.id_mantenimiento);

            if (error) throw error;

            setMostrarModalEliminacion(false);
            cargarMantenimientos();

            setToast({
                mostrar: true,
                mensaje: "Mantenimiento eliminado.",
                tipo: "exito",
            });
        } catch (err) {
            console.error(err);
            setToast({
                mostrar: true,
                mensaje: err.message,
                tipo: "error",
            });
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
        <Container className="mt-3">
            <Row className="align-items-center mb-3">
                <Col>
                    <h3 className="d-flex align-items-center">
                        <i className="bi bi-tools me-2"></i>
                        Mantenimientos
                    </h3>
                </Col>

                <Col className="text-end">
                    <Button onClick={() => setMostrarModal(true)}>
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
                />
            )}

            <ModalRegistroMantenimiento
                mostrarModal={mostrarModal}
                setMostrarModal={setMostrarModal}
                nuevoMantenimiento={nuevoMantenimiento}
                manejoCambioInput={manejoCambioInput}
                agregarMantenimiento={agregarMantenimiento}
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

            <NotificacionOperacion
                mostrar={toast.mostrar}
                mensaje={toast.mensaje}
                tipo={toast.tipo}
                onCerrar={() => setToast({ ...toast, mostrar: false })}
            />
        </Container>
    );
};

export default Mantenimientos;
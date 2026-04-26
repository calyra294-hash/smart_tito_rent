import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalRegistroCoche from "../components/coches/ModalRegistroCoche";
import ModalEdicionCoche from "../components/coches/ModalEdicionCoche";
import ModalEliminacionCoche from "../components/coches/ModalEliminacionCoche";
import TablaCoche from "../components/coches/TablaCoche";

import NotificacionOperacion from "../components/NotificacionOperacion";

const Coches = () => {
    const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

    const [mostrarModal, setMostrarModal] = useState(false);

    const [nuevoCoche, setNuevoCoche] = useState({
        marca: "",
        modelo: "",
        anio: "",
        placa: "",
        color: "",
        valor_dia: "",
        estado: "Disponible",
    });

    const [coches, setCoches] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
    const [cocheAEliminar, setCocheAEliminar] = useState(null);

    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [cocheEditar, setCocheEditar] = useState({});

    // 📌 CARGAR COCHES
    const cargarCoches = async () => {
        setCargando(true);

        const { data, error } = await supabase
            .from("coche")
            .select("*")
            .order("id_coche", { ascending: true });

        if (error) {
            setToast({
                mostrar: true,
                mensaje: "Error al cargar vehículos",
                tipo: "error",
            });
            setCargando(false);
            return;
        }

        setCoches(data || []);
        setCargando(false);
    };

    useEffect(() => {
        cargarCoches();
    }, []);

    // 📌 INPUT CREAR
    const manejoCambioInput = (e) => {
        const { name, value } = e.target;
        setNuevoCoche((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 📌 INPUT EDITAR
    const manejoCambioInputEdicion = (e) => {
        const { name, value } = e.target;
        setCocheEditar((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 📌 CREAR COCHE (CORREGIDO A DATE)
    const agregarCoche = async () => {
        if (
            !nuevoCoche.marca ||
            !nuevoCoche.modelo ||
            !nuevoCoche.anio ||
            !nuevoCoche.placa ||
            !nuevoCoche.valor_dia
        ) {
            setToast({
                mostrar: true,
                mensaje: "Debe llenar los campos obligatorios",
                tipo: "advertencia",
            });
            return;
        }

        const fechaHoy = new Date().toISOString().split("T")[0]; // ✅ SOLO DATE

        const { error } = await supabase.from("coche").insert([
            {
                ...nuevoCoche,
                fecha_registro: fechaHoy,
            },
        ]);

        if (error) {
            setToast({
                mostrar: true,
                mensaje: "Error al registrar vehículo",
                tipo: "error",
            });
            return;
        }

        setToast({
            mostrar: true,
            mensaje: "Vehículo registrado exitosamente",
            tipo: "exito",
        });

        setMostrarModal(false);

        setNuevoCoche({
            marca: "",
            modelo: "",
            anio: "",
            placa: "",
            color: "",
            valor_dia: "",
            estado: "Disponible",
        });

        cargarCoches();
    };

    // 📌 ACTUALIZAR COCHE
    const actualizarCoche = async () => {
        const { error } = await supabase
            .from("coche")
            .update({
                ...cocheEditar,
                fecha_actualizacion: new Date().toISOString().split("T")[0],
            })
            .eq("id_coche", cocheEditar.id_coche);

        if (error) {
            setToast({
                mostrar: true,
                mensaje: "Error al actualizar vehículo",
                tipo: "error",
            });
            return;
        }

        setMostrarModalEdicion(false);
        cargarCoches();

        setToast({
            mostrar: true,
            mensaje: "Vehículo actualizado",
            tipo: "exito",
        });
    };

    // 📌 ELIMINAR
    const eliminarCoche = async () => {
        const { error } = await supabase
            .from("coche")
            .delete()
            .eq("id_coche", cocheAEliminar.id_coche);

        if (error) {
            setToast({
                mostrar: true,
                mensaje: "Error al eliminar vehículo",
                tipo: "error",
            });
            return;
        }

        setMostrarModalEliminacion(false);
        cargarCoches();

        setToast({
            mostrar: true,
            mensaje: "Vehículo eliminado",
            tipo: "exito",
        });
    };

    // 📌 MODALES
    const abrirModalEdicion = (coche) => {
        setCocheEditar(coche);
        setMostrarModalEdicion(true);
    };

    const abrirModalEliminacion = (coche) => {
        setCocheAEliminar(coche);
        setMostrarModalEliminacion(true);
    };

    return (
        <Container className="mt-3">
            <Row className="align-items-center mb-3">
                <Col>
                    <h3>
                        <i className="bi bi-car-front me-2"></i> Vehículos
                    </h3>
                </Col>
                <Col className="text-end">
                    <Button onClick={() => setMostrarModal(true)}>
                        Nuevo Vehículo
                    </Button>
                </Col>
            </Row>

            <hr />

            {cargando ? (
                <Row className="text-center">
                    <Spinner animation="border" />
                </Row>
            ) : (
                <TablaCoche
                    coches={coches}
                    abrirModalEdicion={abrirModalEdicion}
                    abrirModalEliminacion={abrirModalEliminacion}
                />
            )}

            {/* MODALES */}
            <ModalRegistroCoche
                mostrarModal={mostrarModal}
                setMostrarModal={setMostrarModal}
                nuevoCoche={nuevoCoche}
                manejoCambioInput={manejoCambioInput}
                agregarCoche={agregarCoche}
            />

            <ModalEdicionCoche
                mostrarModalEdicion={mostrarModalEdicion}
                setMostrarModalEdicion={setMostrarModalEdicion}
                cocheEditar={cocheEditar}
                manejoCambioInputEdicion={manejoCambioInputEdicion}
                actualizarCoche={actualizarCoche}
            />

            <ModalEliminacionCoche
                mostrarModalEliminacion={mostrarModalEliminacion}
                setMostrarModalEliminacion={setMostrarModalEliminacion}
                eliminarCoche={eliminarCoche}
                coche={cocheAEliminar}
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

export default Coches;
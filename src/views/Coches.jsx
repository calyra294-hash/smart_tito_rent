import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalRegistroCoche from "../components/coches/ModalRegistroCoche";
import ModalEdicionCoche from "../components/coches/ModalEdicionCoche";
import ModalEliminacionCoche from "../components/coches/ModalEliminacionCoche";
import TablaCoche from "../components/coches/TablaCoche";

import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Coches = () => {

    const [toast, setToast] = useState({
        mostrar: false,
        mensaje: "",
        tipo: "",
    });

    const [mostrarModal, setMostrarModal] = useState(false);

    const [nuevoCoche, setNuevoCoche] = useState({
        marca: "",
        modelo: "",
        anio: "",
        placa: "",
        color: "",
        valor_dia: "",
        estado: "Disponible",
        archivo: null,
    });

    const [coches, setCoches] = useState([]);
    const [cochesFiltrados, setCochesFiltrados] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);

    const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
    const [cocheAEliminar, setCocheAEliminar] = useState(null);

    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [cocheEditar, setCocheEditar] = useState(null);

    // =========================
    // CARGAR
    // =========================
    const cargarCoches = async () => {
        setCargando(true);

        const { data, error } = await supabase
            .from("coche")
            .select("*")
            .order("id_coche", { ascending: true });

        if (error) {
            console.log(error);
            setToast({
                mostrar: true,
                mensaje: "Error al cargar vehículos",
                tipo: "error",
            });
            setCargando(false);
            return;
        }

        setCoches(data || []);
        setCochesFiltrados(data || []);
        setCargando(false);
    };

    useEffect(() => {
        cargarCoches();
    }, []);

    // =========================
    // FILTRO
    // =========================
    useEffect(() => {
        const texto = textoBusqueda.toLowerCase();

        setCochesFiltrados(
            coches.filter((c) =>
                [c.marca, c.modelo, c.placa, c.estado]
                    .some((campo) => campo?.toLowerCase().includes(texto))
            )
        );
    }, [textoBusqueda, coches]);

    // =========================
    // INPUT REGISTRO
    // =========================
    const manejoCambioInput = (e) => {
        const { name, value } = e.target;
        setNuevoCoche((prev) => ({ ...prev, [name]: value }));
    };

    const manejoCambioArchivo = (e) => {
        setNuevoCoche((prev) => ({
            ...prev,
            archivo: e.target.files[0] || null,
        }));
    };

    // =========================
    // INPUT EDICION (SOLO ESTADO)
    // =========================
    const manejoCambioInputEdicion = (e) => {
        const { name, value } = e.target;

        setCocheEditar((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // REGISTRAR
    // =========================
    const agregarCoche = async () => {

        try {
            let urlImagen = "";

            if (nuevoCoche.archivo) {
                const nombreArchivo = `${Date.now()}_${nuevoCoche.archivo.name}`;

                const { error: uploadError } = await supabase.storage
                    .from("imagenes_coche")
                    .upload(nombreArchivo, nuevoCoche.archivo);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from("imagenes_coche")
                    .getPublicUrl(nombreArchivo);

                urlImagen = data.publicUrl;
            }

            const { error } = await supabase.from("coche").insert([{
                marca: nuevoCoche.marca,
                modelo: nuevoCoche.modelo,
                anio: Number(nuevoCoche.anio),
                placa: nuevoCoche.placa,
                color: nuevoCoche.color,
                valor_dia: Number(nuevoCoche.valor_dia),
                estado: nuevoCoche.estado,
                fecha_registro: new Date().toISOString().split("T")[0],
                url_imagen: urlImagen,
            }]);

            if (error) throw error;

            setMostrarModal(false);

            setNuevoCoche({
                marca: "",
                modelo: "",
                anio: "",
                placa: "",
                color: "",
                valor_dia: "",
                estado: "Disponible",
                archivo: null,
            });

            cargarCoches();

            setToast({
                mostrar: true,
                mensaje: "Vehículo registrado",
                tipo: "exito",
            });

        } catch (err) {
            console.log(err);
            setToast({
                mostrar: true,
                mensaje: "Error al registrar vehículo",
                tipo: "error",
            });
        }
    };

    // =========================
    // ACTUALIZAR SOLO ESTADO
    // =========================
    const actualizarCoche = async () => {

        try {
            const { error } = await supabase
                .from("coche")
                .update({
                    estado: cocheEditar.estado,
                })
                .eq("id_coche", cocheEditar.id_coche);

            if (error) throw error;

            setMostrarModalEdicion(false);
            cargarCoches();

            setToast({
                mostrar: true,
                mensaje: "Estado actualizado",
                tipo: "exito",
            });

        } catch (err) {
            console.log(err);
            setToast({
                mostrar: true,
                mensaje: "Error al actualizar",
                tipo: "error",
            });
        }
    };

    // =========================
    // ELIMINAR
    // =========================
    const eliminarCoche = async () => {

        const { error } = await supabase
            .from("coche")
            .delete()
            .eq("id_coche", cocheAEliminar.id_coche);

        if (error) {
            setToast({ mostrar: true, mensaje: "Error al eliminar", tipo: "error" });
            return;
        }

        setMostrarModalEliminacion(false);
        cargarCoches();

        setToast({ mostrar: true, mensaje: "Eliminado", tipo: "exito" });
    };

    // =========================
    // UI
    // =========================
    return (
        <Container className="mt-3">

            <Row className="align-items-center mb-3">
                <Col>
                    <h3>
                        <i className="bi bi-car-front-fill me-2"></i>
                        Vehículos
                    </h3>
                </Col>

                <Col className="text-end">
                    <Button onClick={() => setMostrarModal(true)}>
                        <i className="bi bi-plus-circle me-2"></i>
                        Nuevo Vehículo
                    </Button>
                </Col>
            </Row>

            <hr />

            <Row className="mb-4">
                <Col md={5}>
                    <CuadroBusquedas
                        textoBusqueda={textoBusqueda}
                        manejarCambioBusqueda={(e) =>
                            setTextoBusqueda(e.target.value)
                        }
                        
    placeholder="Buscar Vehiculo..."
                    />
                </Col>
            </Row>

            {cargando ? (
                <Spinner animation="border" />
            ) : (
                <TablaCoche
                    coches={cochesFiltrados}
                    abrirModalEdicion={(c) => {
                        setCocheEditar(c);
                        setMostrarModalEdicion(true);
                    }}
                    abrirModalEliminacion={(c) => {
                        setCocheAEliminar(c);
                        setMostrarModalEliminacion(true);
                    }}
                />
            )}

            <ModalRegistroCoche
                mostrarModal={mostrarModal}
                setMostrarModal={setMostrarModal}
                nuevoCoche={nuevoCoche}
                manejoCambioInput={manejoCambioInput}
                manejoCambioArchivo={manejoCambioArchivo}
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
                cocheAEliminar={cocheAEliminar}
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
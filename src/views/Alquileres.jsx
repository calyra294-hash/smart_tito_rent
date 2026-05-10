import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalRegistroAlquiler from "../components/alquileres/ModalRegistroAlquiler";
import ModalEdicionAlquiler from "../components/alquileres/ModalEdicionAlquiler";
import ModalEliminacionAlquiler from "../components/alquileres/ModalEliminacionAlquiler";
import ModalDetalleAlquiler from "../components/alquileres/ModalDetalleAlquiler";
import TablaAlquileres from "../components/alquileres/TablaAlquileres";

import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Alquileres = () => {

    const [toast, setToast] = useState({
        mostrar: false,
        mensaje: "",
        tipo: "",
    });

    const [mostrarModal, setMostrarModal] = useState(false);

    const [nuevoAlquiler, setNuevoAlquiler] = useState({
        fecha_inicio: "",
        fecha_fin: "",
        estado: "En espera",

        id_usuario: "",
        id_coche: "",
        precio_total: "",
    });

    const [alquileres, setAlquileres] = useState([]);
    const [alquileresFiltrados, setAlquileresFiltrados] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");

    const [cargando, setCargando] = useState(true);

    const [usuarios, setUsuarios] = useState([]);
    const [coches, setCoches] = useState([]);

    const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
    const [alquilerAEliminar, setAlquilerAEliminar] = useState(null);

    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

    const [alquilerEditar, setAlquilerEditar] = useState({
        id_alquiler: "",
        fecha_inicio: "",
        fecha_fin: "",
        estado: "",
    });

    // =========================
    // MODAL DETALLE
    // =========================
    const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);

    const [detalleAlquiler, setDetalleAlquiler] = useState([]);

    // =========================
    // CARGAR ALQUILERES
    // =========================
    const cargarAlquileres = async () => {

        try {

            setCargando(true);

            const { data, error } = await supabase
                .from("alquiler")
                .select("*")
                .order("id_alquiler", { ascending: true });

            if (error) throw error;

            setAlquileres(data || []);
            setAlquileresFiltrados(data || []);

        } catch (error) {

            console.log(error);

            setToast({
                mostrar: true,
                mensaje: "Error al cargar alquileres",
                tipo: "error",
            });

        } finally {

            setCargando(false);
        }
    };

    // =========================
    // CARGAR USUARIOS Y COCHES
    // =========================
    const cargarDatos = async () => {

        const { data: usuariosData } = await supabase
            .from("usuario")
            .select("*");

        const { data: cochesData } = await supabase
            .from("coche")
            .select("*")
            .eq("estado", "Disponible");

        setUsuarios(usuariosData || []);
        setCoches(cochesData || []);
    };

    useEffect(() => {

        cargarAlquileres();
        cargarDatos();

    }, []);

    // =========================
    // FILTRO BUSQUEDA
    // =========================
    useEffect(() => {

        const texto = textoBusqueda.toLowerCase();

        setAlquileresFiltrados(
            alquileres.filter((a) =>
                [
                    a.estado,
                    a.fecha_inicio,
                    a.fecha_fin,
                    String(a.id_alquiler),
                ]
                    .some((campo) =>
                        campo?.toLowerCase().includes(texto)
                    )
            )
        );

    }, [textoBusqueda, alquileres]);

    // =========================
    // INPUTS REGISTRO
    // =========================
    const manejoCambioInput = (e) => {

        const { name, value } = e.target;

        setNuevoAlquiler((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // INPUTS EDICION
    // =========================
    const manejoCambioInputEdicion = (e) => {

        const { name, value } = e.target;

        setAlquilerEditar((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // REGISTRAR
    // =========================
    const agregarAlquiler = async () => {

        try {

            if (
                !nuevoAlquiler.fecha_inicio ||
                !nuevoAlquiler.fecha_fin ||
                !nuevoAlquiler.estado ||
                !nuevoAlquiler.id_usuario ||
                !nuevoAlquiler.id_coche ||
                !nuevoAlquiler.precio_total
            ) {

                setToast({
                    mostrar: true,
                    mensaje: "Debe completar todos los campos",
                    tipo: "advertencia",
                });

                return;
            }

            const { data, error } = await supabase
                .from("alquiler")
                .insert([
                    {
                        fecha_inicio: nuevoAlquiler.fecha_inicio,
                        fecha_fin: nuevoAlquiler.fecha_fin,
                        estado: nuevoAlquiler.estado,
                    },
                ])
                .select();

            if (error) throw error;

            const idAlquiler = data[0].id_alquiler;

            const { error: errorDetalle } = await supabase
                .from("detalle_alquiler")
                .insert([
                    {
                        id_alquiler: idAlquiler,
                        id_usuario: nuevoAlquiler.id_usuario,
                        id_coche: nuevoAlquiler.id_coche,
                        precio_total: nuevoAlquiler.precio_total,
                    },
                ]);

            if (errorDetalle) throw errorDetalle;

            await supabase
                .from("coche")
                .update({
                    estado: "En Alquiler",
                })
                .eq("id_coche", nuevoAlquiler.id_coche);

            setMostrarModal(false);

            setNuevoAlquiler({
                fecha_inicio: "",
                fecha_fin: "",
                estado: "En espera",

                id_usuario: "",
                id_coche: "",
                precio_total: "",
            });

            cargarAlquileres();
            cargarDatos();

            setToast({
                mostrar: true,
                mensaje: "Alquiler registrado correctamente",
                tipo: "exito",
            });

        } catch (error) {

            console.log(error);

            setToast({
                mostrar: true,
                mensaje: "Error al registrar alquiler",
                tipo: "error",
            });
        }
    };

    // =========================
    // ACTUALIZAR
    // =========================
    const actualizarAlquiler = async () => {

        try {

            const { error } = await supabase
                .from("alquiler")
                .update({
                    fecha_inicio: alquilerEditar.fecha_inicio,
                    fecha_fin: alquilerEditar.fecha_fin,
                    estado: alquilerEditar.estado,
                })
                .eq("id_alquiler", alquilerEditar.id_alquiler);

            if (error) throw error;

            setMostrarModalEdicion(false);

            cargarAlquileres();

            setToast({
                mostrar: true,
                mensaje: "Alquiler actualizado correctamente",
                tipo: "exito",
            });

        } catch (error) {

            console.log(error);

            setToast({
                mostrar: true,
                mensaje: "Error al actualizar alquiler",
                tipo: "error",
            });
        }
    };

    // =========================
    // ELIMINAR
    // =========================
    const eliminarAlquiler = async () => {

        try {

            if (!alquilerAEliminar?.id_alquiler) return;

            await supabase
                .from("detalle_alquiler")
                .delete()
                .eq("id_alquiler", alquilerAEliminar.id_alquiler);

            const { error } = await supabase
                .from("alquiler")
                .delete()
                .eq("id_alquiler", alquilerAEliminar.id_alquiler);

            if (error) throw error;

            setMostrarModalEliminacion(false);

            cargarAlquileres();

            setToast({
                mostrar: true,
                mensaje: "Alquiler eliminado correctamente",
                tipo: "exito",
            });

        } catch (error) {

            console.log(error);

            setToast({
                mostrar: true,
                mensaje: "Error al eliminar alquiler",
                tipo: "error",
            });
        }
    };

    // =========================
    // VER DETALLE ALQUILER
    // =========================
    const verDetalleAlquiler = async (id_alquiler) => {

        try {

            const { data, error } = await supabase
                .from("detalle_alquiler")
                .select("*")
                .eq("id_alquiler", id_alquiler);

            if (error) throw error;

            setDetalleAlquiler(data || []);

            setMostrarModalDetalle(true);

        } catch (error) {

            console.log(error);

            setToast({
                mostrar: true,
                mensaje: "Error al cargar detalles",
                tipo: "error",
            });
        }
    };

    // =========================
    // ABRIR MODALES
    // =========================
    const abrirModalEdicion = (alquiler) => {

        setAlquilerEditar(alquiler);
        setMostrarModalEdicion(true);
    };

    const abrirModalEliminacion = (alquiler) => {

        setAlquilerAEliminar(alquiler);
        setMostrarModalEliminacion(true);
    };

    // =========================
    // UI
    // =========================
    return (

        <Container className="mt-3">

            <Row className="align-items-center mb-3">

                <Col>
                    <h3>
                        <i className="bi bi-calendar-check me-2"></i>
                        Alquileres
                    </h3>
                </Col>

                <Col className="text-end">

                    <Button onClick={() => setMostrarModal(true)}>
                        <i className="bi bi-plus-circle me-2"></i>
                        Nuevo Alquiler
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
                        placeholder="Buscar alquiler..."
                    />

                </Col>

            </Row>

            {cargando ? (

                <div className="text-center">
                    <Spinner animation="border" />
                </div>

            ) : (

                <TablaAlquileres
                    alquileres={alquileresFiltrados}
                    abrirModalEdicion={abrirModalEdicion}
                    abrirModalEliminacion={abrirModalEliminacion}
                    verDetalleAlquiler={verDetalleAlquiler}
                />

            )}

            <ModalRegistroAlquiler
                mostrarModal={mostrarModal}
                setMostrarModal={setMostrarModal}
                nuevoAlquiler={nuevoAlquiler}
                manejoCambioInput={manejoCambioInput}
                agregarAlquiler={agregarAlquiler}
                usuarios={usuarios}
                coches={coches}
            />

            <ModalEdicionAlquiler
                mostrarModalEdicion={mostrarModalEdicion}
                setMostrarModalEdicion={setMostrarModalEdicion}
                alquilerEditar={alquilerEditar}
                manejoCambioInputEdicion={manejoCambioInputEdicion}
                actualizarAlquiler={actualizarAlquiler}
            />

            <ModalEliminacionAlquiler
                mostrarModalEliminacion={mostrarModalEliminacion}
                setMostrarModalEliminacion={setMostrarModalEliminacion}
                eliminarAlquiler={eliminarAlquiler}
                alquilerAEliminar={alquilerAEliminar}
            />

            <ModalDetalleAlquiler
                mostrarModalDetalle={mostrarModalDetalle}
                setMostrarModalDetalle={setMostrarModalDetalle}
                detalleAlquiler={detalleAlquiler}
            />

            <NotificacionOperacion
                mostrar={toast.mostrar}
                mensaje={toast.mensaje}
                tipo={toast.tipo}
                onCerrar={() =>
                    setToast({
                        ...toast,
                        mostrar: false,
                    })
                }
            />

        </Container>
    );
};

export default Alquileres;
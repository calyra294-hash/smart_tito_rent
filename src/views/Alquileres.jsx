import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import emailjs from "@emailjs/browser";
import ModalEnvioCorreoAlquileres from "../components/alquileres/ModalEnvioCorreoAlquileres";

import ModalRegistroAlquiler from "../components/alquileres/ModalRegistroAlquiler";
import ModalEdicionAlquiler from "../components/alquileres/ModalEdicionAlquiler";
import ModalEliminacionAlquiler from "../components/alquileres/ModalEliminacionAlquiler";
import ModalDetalleAlquiler from "../components/alquileres/ModalDetalleAlquiler";
import TarjetaAlquiler from "../components/alquileres/TarjetaAlquiler";
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
        valor_dia: 0,
        cantidad_dias: 0,
        precio_total: 0,
    });

    const [mostrarModalCorreo, setMostrarModalCorreo] = useState(false);
    const [emailDestino, setEmailDestino] = useState("");
    const [enviandoCorreo, setEnviandoCorreo] = useState(false);

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
    // CARGAR DATOS
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
    // FILTRO
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
    // INPUT REGISTRO
    // =========================
    const manejoCambioInput = (e) => {

        const { name, value } = e.target;

        setNuevoAlquiler((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // INPUT EDICIÓN
    // =========================
    const manejoCambioInputEdicion = (e) => {

        const { name, value } = e.target;

        setAlquilerEditar((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // /////////////// El coso de email ///////////////// //
    useEffect(() => {
        emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
    }, []);

    const abrirModalCorreo = () => {
        setEmailDestino("");
        setMostrarModalCorreo(true);
    };

    const formatearAlquileresParaCorreo = () => {

        if (alquileres.length === 0) {
            return "No hay alquileres registrados.";
        }

        let texto = `LISTADO DE ALQUILERES\n\n`;
        texto += `Fecha: ${new Date().toLocaleDateString("es-NI")}\n`;
        texto += `Total de alquileres: ${alquileres.length}\n\n`;

        alquileres.forEach((alquiler, index) => {

            texto += `${index + 1}. Alquiler #${alquiler.id_alquiler}\n`;
            texto += `   Fecha Inicio: ${alquiler.fecha_inicio}\n`;
            texto += `   Fecha Fin: ${alquiler.fecha_fin}\n`;
            texto += `   Estado: ${alquiler.estado}\n`;
            texto += `\n`;

        });

        return texto;
    };

    const enviarCorreoAlquileres = () => {

        if (!emailDestino.trim()) {

            setToast({
                mostrar: true,
                mensaje: "Por favor ingresa un correo destino.",
                tipo: "advertencia",
            });

            return;
        }

        setEnviandoCorreo(true);

        const mensaje = formatearAlquileresParaCorreo();

        const templateParams = {
            to_name: "Administrador",
            user_email: emailDestino,
            message: mensaje,
            fecha_envio: new Date().toLocaleDateString("es-NI"),
        };

        emailjs
            .send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                templateParams
            )
            .then(() => {

                setToast({
                    mostrar: true,
                    mensaje: "Correo enviado correctamente.",
                    tipo: "exito",
                });

                setMostrarModalCorreo(false);
                setEmailDestino("");

            })
            .catch((error) => {

                console.error("Error EmailJS:", error);

                setToast({
                    mostrar: true,
                    mensaje: "Error al enviar el correo.",
                    tipo: "error",
                });

            })
            .finally(() => {
                setEnviandoCorreo(false);
            });
    };

    useEffect(() => {

    if (
        nuevoAlquiler.id_coche &&
        nuevoAlquiler.fecha_inicio &&
        nuevoAlquiler.fecha_fin
    ) {

        const cocheSeleccionado = coches.find(
            c => c.id_coche === Number(nuevoAlquiler.id_coche)
        );

        if (!cocheSeleccionado) return;

        const valorDia = Number(cocheSeleccionado.valor_dia);

        const inicio = new Date(nuevoAlquiler.fecha_inicio);
        const fin = new Date(nuevoAlquiler.fecha_fin);

        // 👇 PONLO AQUÍ
        if (fin < inicio) {
            setNuevoAlquiler(prev => ({
                ...prev,
                cantidad_dias: 0,
                precio_total: 0
            }));
            return;
        }

        const cantidadDias =
            Math.floor(
                (fin - inicio) / (1000 * 60 * 60 * 24)
            ) + 1;

        const precioTotal = valorDia * cantidadDias;

        setNuevoAlquiler(prev => ({
            ...prev,
            valor_dia: valorDia,
            cantidad_dias: cantidadDias,
            precio_total: precioTotal,
        }));
    }

}, [
    nuevoAlquiler.id_coche,
    nuevoAlquiler.fecha_inicio,
    nuevoAlquiler.fecha_fin,
    coches
]);


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
                        id_usuario: parseInt(nuevoAlquiler.id_usuario),
                        id_coche: parseInt(nuevoAlquiler.id_coche),
                        valor_dia: parseFloat(nuevoAlquiler.valor_dia),
                        cantidad_dias: parseInt(nuevoAlquiler.cantidad_dias),
                        precio_total: parseFloat(nuevoAlquiler.precio_total),
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
                valor_dia: 0,
                cantidad_dias: 0,
                precio_total: 0,
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

            // buscar coche relacionado
            const { data: detalle } = await supabase
                .from("detalle_alquiler")
                .select("id_coche")
                .eq("id_alquiler", alquilerAEliminar.id_alquiler)
                .single();

            // cambiar estado del coche a disponible
            if (detalle) {

                await supabase
                    .from("coche")
                    .update({
                        estado: "Disponible",
                    })
                    .eq("id_coche", detalle.id_coche);
            }

            // eliminar detalle
            await supabase
                .from("detalle_alquiler")
                .delete()
                .eq("id_alquiler", alquilerAEliminar.id_alquiler);

            // eliminar alquiler
            const { error } = await supabase
                .from("alquiler")
                .delete()
                .eq("id_alquiler", alquilerAEliminar.id_alquiler);

            if (error) throw error;

            setMostrarModalEliminacion(false);

            cargarAlquileres();
            cargarDatos();

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
    // VER DETALLE
    // =========================
    const verDetalleAlquiler = async (id_alquiler) => {

        try {

            const { data, error } = await supabase
                .from("detalle_alquiler")
                .select(`
    id_detalle_alquiler,
    id_usuario,
    id_coche,
    valor_dia,
    cantidad_dias,
    precio_total,

    usuario:id_usuario (
        nombre1,
        apellido1
    ),

    coche:id_coche (
        marca,
        modelo
    )
`)
                .eq("id_alquiler", id_alquiler);

            if (error) throw error;

            console.log(data);

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

    const abrirModalEdicion = (alquiler) => {

        setAlquilerEditar(alquiler);
        setMostrarModalEdicion(true);
    };

    const abrirModalEliminacion = (alquiler) => {

        setAlquilerAEliminar(alquiler);
        setMostrarModalEliminacion(true);
    };

    return (

        <div className="contenido-principal">
            <div className="contenedor-dashboard">

                <Container fluid>

                    <div className="dashboard-card mb-4">

                        <Row className="align-items-center mb-3">


                            <Col>

                                <h3 className="fw-bold mb-0">
                                    <i className="bi bi-calendar-check-fill me-2 text-danger"></i>
                                    Alquileres
                                </h3>

                                <small className="text-muted">
                                    Gestión de alquileres registrados
                                </small>

                            </Col>

                            <Col className="text-end">

                                <Button
                                    variant="danger"
                                    className="rounded-pill px-4 shadow-sm me-2"
                                    onClick={abrirModalCorreo}
                                >
                                    <i className="bi bi-envelope-fill me-2"></i>
                                    Enviar Correo
                                </Button>

                                <Button
                                    variant="danger"
                                    className="rounded-pill px-4 shadow-sm"
                                    onClick={() => setMostrarModal(true)}
                                >
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Nuevo Alquiler
                                </Button>

                            </Col>

                        </Row>

                    </div>
                    <hr />

                    <div className="dashboard-card mb-4">

                        <Row>

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

                    </div>

                    <div className="dashboard-card">

                        {/* ... resto de tu código igual ... */}

                        <div className="dashboard-card">
                            {cargando ? (
                                <div className="text-center p-5">
                                    <Spinner animation="border" variant="success" />
                                </div>
                            ) : (
                                <>
                                    {/* VISTA DE ESCRITORIO (PC): Oculta en móviles */}
                                    <div className="d-none d-md-block">
                                        <TablaAlquileres
                                            alquileres={alquileresFiltrados}
                                            abrirModalEdicion={abrirModalEdicion}
                                            abrirModalEliminacion={abrirModalEliminacion}
                                            verDetalleAlquiler={verDetalleAlquiler} // <-- Agregado aquí también por si acaso
                                        />
                                    </div>

                                    {/* VISTA MÓVIL: Visible en smartphones */}
                                    <div className="d-block d-md-none">
                                        <TarjetaAlquiler
                                            alquileres={alquileresFiltrados}
                                            abrirModalEdicion={abrirModalEdicion}
                                            abrirModalEliminacion={abrirModalEliminacion}
                                            verDetalleAlquiler={verDetalleAlquiler} // <-- ¡Solucionado!
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* ... resto de los modales igual ... */}

                    </div>

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

                    <ModalEnvioCorreoAlquileres
                        mostrarModalCorreo={mostrarModalCorreo}
                        setMostrarModalCorreo={setMostrarModalCorreo}
                        emailDestino={emailDestino}
                        setEmailDestino={setEmailDestino}
                        enviandoCorreo={enviandoCorreo}
                        enviarCorreoAlquileres={enviarCorreoAlquileres}
                        totalAlquileres={alquileres.length}
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
            </div>
        </div>
    );
};

export default Alquileres;
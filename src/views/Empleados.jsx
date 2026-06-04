import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import emailjs from "@emailjs/browser";

import ModalEnvioCorreoEmpleados from "../components/empleados/ModalEnvioCorreoEmpleados";
import ModalRegistroEmpleado from "../components/empleados/ModalRegistroEmpleado";
import ModalEdicionEmpleado from "../components/empleados/ModalEdicionEmpleado";
import ModalEliminacionEmpleado from "../components/empleados/ModalEliminacionEmpleado";
import TarjetaEmpleado from "../components/empleados/TarjetaEmpleado";
import TablaEmpleado from "../components/empleados/TablaEmpleado";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Empleados = () => {
    const [toast, setToast] = useState({
        mostrar: false,
        mensaje: "",
        tipo: "",
    });

    const [mostrarModal, setMostrarModal] = useState(false);

    const [nuevoEmpleado, setNuevoEmpleado] = useState({
        rol: "",
        primer_nombre: "",
        segundo_nombre: "",
        primer_apellido: "",
        segundo_apellido: "",
        direccion: "",
        email: "",
        fecha_contratacion: "",
        contrasena: "",
        cedula: "",
    });

    const [empleados, setEmpleados] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
    const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);

    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

    const [empleadoEditar, setEmpleadoEditar] = useState({
        id_empleado: "",
        rol: "",
        primer_nombre: "",
        segundo_nombre: "",
        primer_apellido: "",
        segundo_apellido: "",
        direccion: "",
        email: "",
        fecha_contratacion: "",
        contrasena: "",
        cedula: "",
    });

    const [mostrarModalCorreo, setMostrarModalCorreo] = useState(false);
    const [emailDestino, setEmailDestino] = useState("");
    const [enviandoCorreo, setEnviandoCorreo] = useState(false);

    // 🔥 CARGAR EMPLEADOS (sin contraseña)
    const cargarEmpleados = async () => {
        try {
            setCargando(true);

            const { data, error } = await supabase
                .from("empleados")
                .select("id_empleado, rol, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, direccion, email, fecha_contratacion, cedula")
                .order("id_empleado", { ascending: true });

            if (error) throw error;

            setEmpleados(data || []);
        } catch (err) {
            console.error("Error cargar:", err);
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
        cargarEmpleados();
    }, []);

    // Inicializar EmailJS
    useEffect(() => {
        emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
    }, []);

    const abrirModalCorreo = () => {
        setEmailDestino("");
        setMostrarModalCorreo(true);
    };

    const formatearEmpleadosParaCorreo = () => {
        if (empleados.length === 0) return "No hay empleados registrados.";

        let texto = `LISTADO DE EMPLEADOS\n\n`;
        texto += `Fecha: ${new Date().toLocaleDateString("es-NI")}\n`;
        texto += `Total de empleados: ${empleados.length}\n\n`;

        empleados.forEach((empleado, index) => {
            const nombreCompleto = `${empleado.primer_nombre} ${empleado.segundo_nombre ? empleado.segundo_nombre + " " : ""}${empleado.primer_apellido} ${empleado.segundo_apellido}`.trim();
            texto += `${index + 1}. ${nombreCompleto}\n`;
            texto += `   Rol: ${empleado.rol}\n`;
            texto += `   Correo: ${empleado.email}\n`;
            texto += `   Cédula: ${empleado.cedula}\n`;
            texto += `   Fecha contratación: ${empleado.fecha_contratacion}\n`;
            if (empleado.direccion) {
                texto += `   Dirección: ${empleado.direccion}\n`;
            }
            texto += `\n`;
        });

        return texto;
    };

    const enviarCorreoEmpleados = () => {
        if (!emailDestino.trim()) {
            setToast({
                mostrar: true,
                mensaje: "Por favor ingresa un correo destino.",
                tipo: "advertencia",
            });
            return;
        }

        setEnviandoCorreo(true);

        const mensaje = formatearEmpleadosParaCorreo();

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

    // INPUT REGISTRO
    const manejoCambioInput = (e) => {
        const { name, value } = e.target;
        setNuevoEmpleado((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // INPUT EDICIÓN
    const manejoCambioInputEdicion = (e) => {
        const { name, value } = e.target;
        setEmpleadoEditar((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ✅ AGREGAR EMPLEADO CORREGIDO
    const agregarEmpleado = async () => {
        if (
            !nuevoEmpleado.rol ||
            !nuevoEmpleado.primer_nombre ||
            !nuevoEmpleado.primer_apellido ||
            !nuevoEmpleado.email ||
            !nuevoEmpleado.cedula ||
            !nuevoEmpleado.contrasena ||
            !nuevoEmpleado.fecha_contratacion
        ) {
            setToast({
                mostrar: true,
                mensaje: "Debe llenar todos los campos obligatorios.",
                tipo: "advertencia",
            });
            return;
        }

        try {
            const { error } = await supabase
                .from("empleados")
                .insert([nuevoEmpleado]);

            if (error) throw error;

            setToast({
                mostrar: true,
                mensaje: "Empleado registrado exitosamente.",
                tipo: "exito",
            });

            setMostrarModal(false);

            setNuevoEmpleado({
                rol: "",
                primer_nombre: "",
                segundo_nombre: "",
                primer_apellido: "",
                segundo_apellido: "",
                direccion: "",
                email: "",
                fecha_contratacion: "",
                contrasena: "",
                cedula: "",
            });

            cargarEmpleados();
        } catch (err) {
            console.error("Error insertar:", err);
            setToast({
                mostrar: true,
                mensaje: err.message,
                tipo: "error",
            });
        }
    };

    // ACTUALIZAR
    const actualizarEmpleado = async () => {
        try {
            const { error } = await supabase
                .from("empleados")
                .update(empleadoEditar)
                .eq("id_empleado", empleadoEditar.id_empleado);

            if (error) throw error;

            setMostrarModalEdicion(false);
            cargarEmpleados();

            setToast({
                mostrar: true,
                mensaje: "Empleado actualizado.",
                tipo: "exito",
            });
        } catch (err) {
            console.error("Error update:", err);
            setToast({
                mostrar: true,
                mensaje: err.message,
                tipo: "error",
            });
        }
    };

    // ELIMINAR
    const eliminarEmpleado = async () => {
        try {
            const { error } = await supabase
                .from("empleados")
                .delete()
                .eq("id_empleado", empleadoAEliminar.id_empleado);

            if (error) throw error;

            setMostrarModalEliminacion(false);
            cargarEmpleados();

            setToast({
                mostrar: true,
                mensaje: "Empleado eliminado.",
                tipo: "exito",
            });
        } catch (err) {
            console.error("Error delete:", err);
            setToast({
                mostrar: true,
                mensaje: err.message,
                tipo: "error",
            });
        }
    };

    const abrirModalEdicion = (empleado) => {
        setEmpleadoEditar(empleado);
        setMostrarModalEdicion(true);
    };

    const abrirModalEliminacion = (empleado) => {
        setEmpleadoAEliminar(empleado);
        setMostrarModalEliminacion(true);
    };

    return (
        <div className="contenido-principal">
            <div className="contenedor-dashboard">

                <Container fluid>

                    <div className="dashboard-card mb-4">
                        <Row className="align-items-center"></Row>
                    </div>


                    <Row className="align-items-center mb-3">
                        <Col xs={8} sm={8} md={8} lg={8} className="d-flex align-items-center">
                            <h3 className="mb-0">
                                <i className="bi bi-people-fill me-2"></i> Empleados
                            </h3>
                        </Col>
                        <Col xs={2} sm={2} md={2} lg={2} className="text-end">
                            <Button variant="primary" onClick={abrirModalCorreo} size="md">
                                <i className="bi bi-envelope"></i>
                                <span className="d-none d-lg-inline ms-2">Enviar por Correo</span>
                            </Button>
                        </Col>
                        <Col xs={2} sm={2} md={2} lg={2} className="text-end">
                            <Button
                                variant="danger"
                                onClick={() => setMostrarModal(true)}
                                size="md"
                            >
                                <i className="bi-plus-lg"></i>
                                <span className="d-none d-lg-inline ms-2">Nuevo Empleado</span>
                            </Button>
                        </Col>
                    </Row>


                    <hr />


                    {cargando ? (
    <div className="text-center my-5">
        <Spinner animation="border" variant="danger" />
    </div>
) : (
    <>
        {/* VISTA EN COMPUTADORA: Se muestra en pantallas medianas/grandes, en móvil se oculta */}
        <div className="d-none d-md-block">
            <TablaEmpleado
                empleados={empleados}
                abrirModalEdicion={abrirModalEdicion}
                abrirModalEliminacion={abrirModalEliminacion}
            />
        </div>

        {/* VISTA EN MÓVIL: Se muestra en pantallas chicas, en computadora se oculta */}
        <div className="d-block d-md-none">
            <TarjetaEmpleado
                empleados={empleados}
                abrirModalEdicion={abrirModalEdicion}
                abrirModalEliminacion={abrirModalEliminacion}
            />
        </div>
    </>
)}

                    <ModalRegistroEmpleado
                        mostrarModal={mostrarModal}
                        setMostrarModal={setMostrarModal}
                        nuevoEmpleado={nuevoEmpleado}
                        manejoCambioInput={manejoCambioInput}
                        agregarEmpleado={agregarEmpleado}
                    />

                    <ModalEdicionEmpleado
                        mostrarModalEdicion={mostrarModalEdicion}
                        setMostrarModalEdicion={setMostrarModalEdicion}
                        empleadoEditar={empleadoEditar}
                        manejoCambioInputEdicion={manejoCambioInputEdicion}
                        actualizarEmpleado={actualizarEmpleado}
                    />

                    <ModalEnvioCorreoEmpleados
                        mostrarModalCorreo={mostrarModalCorreo}
                        setMostrarModalCorreo={setMostrarModalCorreo}
                        emailDestino={emailDestino}
                        setEmailDestino={setEmailDestino}
                        enviandoCorreo={enviandoCorreo}
                        enviarCorreoEmpleados={enviarCorreoEmpleados}
                        totalEmpleados={empleados.length}
                    />

                    <ModalEliminacionEmpleado
                        mostrarModalEliminacion={mostrarModalEliminacion}
                        setMostrarModalEliminacion={setMostrarModalEliminacion}
                        eliminarEmpleado={eliminarEmpleado}
                        empleadoAEliminar={empleadoAEliminar}
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

export default Empleados;
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalRegistroUsuario from "../components/usuarios/ModalRegistroUsuario";
import ModalEdicionUsuario from "../components/usuarios/ModalEdicionUsuario";
import ModalEliminacionUsuario from "../components/usuarios/ModalEliminacionUsuario";
import TablaUsuarios from "../components/usuarios/TablaUsuarios";

import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Usuarios = () => {

    const [toast, setToast] = useState({
        mostrar: false,
        mensaje: "",
        tipo: "",
    });

    const [mostrarModal, setMostrarModal] = useState(false);

    const [nuevoUsuario, setNuevoUsuario] = useState({
        rol: "usuario",
        cedula: "",
        nombre1: "",
        nombre2: "",
        apellido1: "",
        apellido2: "",
        telefono: "",
        direccion: "",
        email: "",
        licencia: "",
        contrasena: "",
    });

    const [usuarios, setUsuarios] = useState([]);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);

    const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [usuarioEditar, setUsuarioEditar] = useState(null);

    // =========================
    // CARGAR USUARIOS
    // =========================
    const cargarUsuarios = async () => {
        try {
            setCargando(true);

            const { data, error } = await supabase
                .from("usuario")
                .select("*")
                .order("id_usuario", { ascending: true });

            console.log("USUARIOS CARGADOS:", data);
            console.log("ERROR CARGA:", error);

            if (error) throw error;

            setUsuarios(data || []);
            setUsuariosFiltrados(data || []);

        } catch (error) {
            console.log("ERROR CARGAR:", error);

            setToast({
                mostrar: true,
                mensaje: error.message || "Error al cargar usuarios",
                tipo: "error",
            });

        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    // =========================
    // FILTRO
    // =========================
    useEffect(() => {
        const texto = textoBusqueda.toLowerCase();

        setUsuariosFiltrados(
            usuarios.filter((u) =>
                [
                    u.nombre1,
                    u.apellido1,
                    u.cedula,
                    u.email,
                    u.telefono,
                ]
                    .some((campo) =>
                        campo?.toLowerCase().includes(texto)
                    )
            )
        );

    }, [textoBusqueda, usuarios]);

    // =========================
    // INPUT REGISTRO
    // =========================
    const manejoCambioInput = (e) => {
        const { name, value } = e.target;

        setNuevoUsuario((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // REGISTRAR USUARIO (CORREGIDO)
    // =========================
    const agregarUsuario = async () => {
        try {

            console.log("ENVIANDO USUARIO:", nuevoUsuario);

            const { data, error } = await supabase
                .from("usuario")
                .insert([nuevoUsuario])
                .select();

            console.log("DATA INSERT:", data);
            console.log("ERROR INSERT:", error);

            if (error) throw error;

            setMostrarModal(false);

            setNuevoUsuario({
                rol: "usuario",
                cedula: "",
                nombre1: "",
                nombre2: "",
                apellido1: "",
                apellido2: "",
                telefono: "",
                direccion: "",
                email: "",
                licencia: "",
                contrasena: "",
            });

            cargarUsuarios();

            setToast({
                mostrar: true,
                mensaje: "Usuario registrado correctamente",
                tipo: "exito",
            });

        } catch (error) {
            console.log("ERROR COMPLETO INSERT:", error);

            setToast({
                mostrar: true,
                mensaje: error.message || "Error al registrar usuario",
                tipo: "error",
            });
        }
    };

    // =========================
    // ACTUALIZAR
    // =========================
    const actualizarUsuario = async () => {
    try {

        const { id_usuario, ...datos } = usuarioEditar;

        const { error } = await supabase
            .from("usuario")
            .update(datos)
            .eq("id_usuario", id_usuario);

        if (error) throw error;

        setMostrarModalEdicion(false);
        cargarUsuarios();

        setToast({
            mostrar: true,
            mensaje: "Usuario actualizado correctamente",
            tipo: "exito",
        });

    } catch (error) {
        console.log(error);

        setToast({
            mostrar: true,
            mensaje: error.message || "Error al actualizar usuario",
            tipo: "error",
        });
    }
};

    // =========================
    // ELIMINAR
    // =========================
    const eliminarUsuario = async () => {
        try {

            const { error } = await supabase
                .from("usuario")
                .delete()
                .eq("id_usuario", usuarioAEliminar.id_usuario);

            if (error) throw error;

            setMostrarModalEliminacion(false);
            cargarUsuarios();

            setToast({
                mostrar: true,
                mensaje: "Usuario eliminado correctamente",
                tipo: "exito",
            });

        } catch (error) {
            console.log(error);

            setToast({
                mostrar: true,
                mensaje: error.message || "Error al eliminar usuario",
                tipo: "error",
            });
        }
    };

    // =========================
    // UI
    // =========================
    return (
        <div className="contenido-principal">
            <div className="contenedor-dashboard">
                <Container fluid>

                    {/* HEADER */}
                    <div className="dashboard-card mb-4">
                        <Row className="align-items-center">

                            <Col>
                                <h3 className="fw-bold mb-0">
                                    <i className="bi bi-people-fill me-2 text-danger"></i>
                                    Usuarios
                                </h3>
                                <small className="text-muted">
                                    Gestión de usuarios registrados
                                </small>
                            </Col>

                            <Col className="text-end">
                                <Button
                                    variant="danger"
                                    onClick={() => setMostrarModal(true)}
                                >
                                    Nuevo Usuario
                                </Button>
                            </Col>

                        </Row>
                    </div>
<hr />
                    {/* BUSCADOR */}
                    <div className="dashboard-card mb-4">
                        <Row>
                            <Col md={5}>
                                <CuadroBusquedas
                                    textoBusqueda={textoBusqueda}
                                    manejarCambioBusqueda={(e) =>
                                        setTextoBusqueda(e.target.value)
                                    }
                                />
                            </Col>
                        </Row>
                    </div>

                    {/* TABLA */}
                    <div className="dashboard-card">

                        {cargando ? (
                            <div className="text-center p-5">
                                <Spinner animation="border" variant="danger" />
                            </div>
                        ) : (
                            <TablaUsuarios
                                usuarios={usuariosFiltrados}
                                abrirModalEdicion={(u) => {
                                    setUsuarioEditar(u);
                                    setMostrarModalEdicion(true);
                                }}
                                abrirModalEliminacion={(u) => {
                                    setUsuarioAEliminar(u);
                                    setMostrarModalEliminacion(true);
                                }}
                            />
                        )}

                    </div>

                    {/* MODALES */}
                    <ModalRegistroUsuario
                        mostrarModal={mostrarModal}
                        setMostrarModal={setMostrarModal}
                        nuevoUsuario={nuevoUsuario}
                        manejoCambioInput={manejoCambioInput}
                        agregarUsuario={agregarUsuario}
                    />

                    <ModalEdicionUsuario
                        mostrarModalEdicion={mostrarModalEdicion}
                        setMostrarModalEdicion={setMostrarModalEdicion}
                        usuarioEditar={usuarioEditar}
                        manejoCambioInputEdicion={(e) => {
                            const { name, value } = e.target;
                            setUsuarioEditar((prev) => ({
                                ...prev,
                                [name]: value,
                            }));
                        }}
                        actualizarUsuario={actualizarUsuario}
                    />

                    <ModalEliminacionUsuario
                        mostrarModalEliminacion={mostrarModalEliminacion}
                        setMostrarModalEliminacion={setMostrarModalEliminacion}
                        usuarioAEliminar={usuarioAEliminar}
                        eliminarUsuario={eliminarUsuario}
                    />

                    {/* TOAST */}
                    <NotificacionOperacion
                        mostrar={toast.mostrar}
                        mensaje={toast.mensaje}
                        tipo={toast.tipo}
                        onCerrar={() =>
                            setToast({ ...toast, mostrar: false })
                        }
                    />

                </Container>
            </div>
        </div>
    );
};

export default Usuarios;
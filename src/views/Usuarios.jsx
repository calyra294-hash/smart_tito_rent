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
    // CARGAR
    // =========================
    const cargarUsuarios = async () => {

        setCargando(true);

        const { data, error } = await supabase
            .from("usuario")
            .select("*")
            .order("id_usuario", { ascending: true });

        if (error) {

            console.log(error);

            setToast({
                mostrar: true,
                mensaje: "Error al cargar usuarios",
                tipo: "error",
            });

            setCargando(false);
            return;
        }

        setUsuarios(data || []);
        setUsuariosFiltrados(data || []);
        setCargando(false);
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
                    u.telefono
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
    // INPUT EDICION
    // =========================
    const manejoCambioInputEdicion = (e) => {

        const { name, value } = e.target;

        setUsuarioEditar((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // REGISTRAR
    // =========================
    const agregarUsuario = async () => {

        try {

            const { error } = await supabase
                .from("usuario")
                .insert([nuevoUsuario]);

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

            console.log(error);

            setToast({
                mostrar: true,
                mensaje: "Error al registrar usuario",
                tipo: "error",
            });
        }
    };

    // =========================
    // ACTUALIZAR
    // =========================
    const actualizarUsuario = async () => {

        try {

            const { error } = await supabase
                .from("usuario")
                .update({
                    rol: usuarioEditar.rol,
                    cedula: usuarioEditar.cedula,
                    nombre1: usuarioEditar.nombre1,
                    nombre2: usuarioEditar.nombre2,
                    apellido1: usuarioEditar.apellido1,
                    apellido2: usuarioEditar.apellido2,
                    telefono: usuarioEditar.telefono,
                    direccion: usuarioEditar.direccion,
                    email: usuarioEditar.email,
                    licencia: usuarioEditar.licencia,
                    contrasena: usuarioEditar.contrasena,
                })
                .eq("id_usuario", usuarioEditar.id_usuario);

            if (error) throw error;

            setMostrarModalEdicion(false);

            cargarUsuarios();

            setToast({
                mostrar: true,
                mensaje: "Usuario actualizado",
                tipo: "exito",
            });

        } catch (error) {

            console.log(error);

            setToast({
                mostrar: true,
                mensaje: "Error al actualizar usuario",
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
                mensaje: "Usuario eliminado",
                tipo: "exito",
            });

        } catch (error) {

            console.log(error);

            setToast({
                mostrar: true,
                mensaje: "Error al eliminar usuario",
                tipo: "error",
            });
        }
    };

    // =========================
    // UI
    // =========================
    return (

        <Container className="mt-3">

            <Row className="align-items-center mb-3">

                <Col>
                    <h3>
                        <i className="bi bi-people-fill me-2"></i>
                        Usuarios
                    </h3>
                </Col>

                <Col className="text-end">

                    <Button onClick={() => setMostrarModal(true)}>
                        <i className="bi bi-plus-circle me-2"></i>
                        Nuevo Usuario
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
                    />

                </Col>

            </Row>

            {cargando ? (

                <Spinner animation="border" />

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

            {/* MODAL REGISTRO */}
            <ModalRegistroUsuario
                mostrarModal={mostrarModal}
                setMostrarModal={setMostrarModal}
                nuevoUsuario={nuevoUsuario}
                manejoCambioInput={manejoCambioInput}
                agregarUsuario={agregarUsuario}
            />

            {/* MODAL EDICION */}
            <ModalEdicionUsuario
                mostrarModalEdicion={mostrarModalEdicion}
                setMostrarModalEdicion={setMostrarModalEdicion}
                usuarioEditar={usuarioEditar}
                manejoCambioInputEdicion={manejoCambioInputEdicion}
                actualizarUsuario={actualizarUsuario}
            />

            {/* MODAL ELIMINACION */}
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
                    setToast({
                        ...toast,
                        mostrar: false,
                    })
                }
            />

        </Container>
    );
};

export default Usuarios;
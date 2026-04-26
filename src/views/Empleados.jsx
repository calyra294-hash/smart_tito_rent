import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalRegistroEmpleado from "../components/empleados/ModalRegistroEmpleado";
import ModalEdicionEmpleado from "../components/empleados/ModalEdicionEmpleado";
import ModalEliminacionEmpleado from "../components/empleados/ModalEliminacionEmpleado";
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
        <Container className="mt-3">
            <Row className="align-items-center mb-3">
                <Col>
                    <h3 className="d-flex align-items-center">
                        <i className="bi bi-people me-2"></i>
                        Empleados
                    </h3>
                </Col>

                <Col className="text-end">
                    <Button onClick={() => setMostrarModal(true)}>
                        Nuevo Empleado
                    </Button>
                </Col>
            </Row>

            <hr />

            {cargando ? (
                <Spinner animation="border" />
            ) : (
                <TablaEmpleado
                    empleados={empleados}
                    abrirModalEdicion={abrirModalEdicion}
                    abrirModalEliminacion={abrirModalEliminacion}
                />
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
    );
};

export default Empleados;
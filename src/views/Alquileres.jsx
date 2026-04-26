import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import ModalRegistroAlquiler from "../components/alquileres/ModalRegistroAlquiler";
import ModalEdicionAlquiler from "../components/alquileres/ModalEdicionAlquiler";
import ModalEliminacionAlquiler from "../components/alquileres/ModalEliminacionAlquiler";
import TablaAlquileres from "../components/alquileres/TablaAlquileres";
import TarjetaAlquiler from "../components/alquileres/TarjetaAlquiler";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Alquileres = () => {
    const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
    const [mostrarModal, setMostrarModal] = useState(false);


    const [nuevoAlquiler, setNuevoAlquiler] = useState({
        fecha_inicio: "",
        fecha_fin: "",
        estado: "En espera",
    });

    const [alquileres, setAlquileres] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
    const [alquilerAEliminar, setAlquilerAEliminar] = useState(null);

    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

    // 🔥 AGREGADO estado
    const [alquilerEditar, setAlquilerEditar] = useState({
        id_alquiler: "",
        fecha_inicio: "",
        fecha_fin: "",
        estado: "",
    });

    const cargarAlquileres = async () => {
        try {
            setCargando(true);
            const { data, error } = await supabase
                .from("alquileres")
                .select("*")
                .order("id_alquiler", { ascending: true });

            if (error) {
                setToast({
                    mostrar: true,
                    mensaje: "Error al cargar alquileres.",
                    tipo: "error",
                });
                return;
            }

            setAlquileres(data || []);
        } catch (err) {
            setToast({
                mostrar: true,
                mensaje: "Error inesperado.",
                tipo: "error",
            });
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarAlquileres();
    }, []);

    const manejoCambioInput = (e) => {
        const { name, value } = e.target;
        setNuevoAlquiler((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const manejoCambioInputEdicion = (e) => {
        const { name, value } = e.target;
        setAlquilerEditar((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const agregarAlquiler = async () => {
        
        if (
            !nuevoAlquiler.fecha_inicio ||
            !nuevoAlquiler.fecha_fin ||
            !nuevoAlquiler.estado
        ) {
            setToast({
                mostrar: true,
                mensaje: "Debe llenar todos los campos.",
                tipo: "advertencia",
            });
            return;
        }

        const { error } = await supabase
            .from("alquileres")
            .insert([nuevoAlquiler]);

        if (error) {
            setToast({
                mostrar: true,
                mensaje: "Error al registrar alquiler.",
                tipo: "error",
            });
            return;
        }

        setToast({
            mostrar: true,
            mensaje: "Alquiler registrado exitosamente.",
            tipo: "exito",
        });

        setMostrarModal(false);

        setNuevoAlquiler({
            fecha_inicio: "",
            fecha_fin: "",
            estado: "En espera",
        });

        cargarAlquileres();
    };

    const actualizarAlquiler = async () => {
        const { error } = await supabase
            .from("alquileres")
            .update({
                fecha_inicio: alquilerEditar.fecha_inicio,
                fecha_fin: alquilerEditar.fecha_fin,
                estado: alquilerEditar.estado, 
            })
            .eq("id_alquiler", alquilerEditar.id_alquiler);

        if (error) {
            setToast({
                mostrar: true,
                mensaje: "Error al actualizar.",
                tipo: "error",
            });
            return;
        }

        setMostrarModalEdicion(false);
        cargarAlquileres();

        setToast({
            mostrar: true,
            mensaje: "Alquiler actualizado.",
            tipo: "exito",
        });
    };

    const eliminarAlquiler = async () => {
        const { error } = await supabase
            .from("alquileres")
            .delete()
            .eq("id_alquiler", alquilerAEliminar.id_alquiler);

        if (error) {
            setToast({
                mostrar: true,
                mensaje: "Error al eliminar.",
                tipo: "error",
            });
            return;
        }

        setMostrarModalEliminacion(false);
        cargarAlquileres();

        setToast({
            mostrar: true,
            mensaje: "Alquiler eliminado.",
            tipo: "exito",
        });
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
        <Container className="mt-3">
            <Row className="align-items-center mb-3">
                <Col>
                    <h3>
                        <i className="bi-calendar-check me-2"></i> Alquileres
                    </h3>
                </Col>
                <Col className="text-end">
                    <Button onClick={() => setMostrarModal(true)}>
                        Nuevo Alquiler
                    </Button>
                </Col>
            </Row>

            <hr />

            {cargando && <Spinner animation="border" />}

            {!cargando && (
                <TablaAlquileres
                    alquileres={alquileres}
                    abrirModalEdicion={abrirModalEdicion}
                    abrirModalEliminacion={abrirModalEliminacion}
                />
            )}

            <ModalRegistroAlquiler
                mostrarModal={mostrarModal}
                setMostrarModal={setMostrarModal}
                nuevoAlquiler={nuevoAlquiler}
                manejoCambioInput={manejoCambioInput}
                agregarAlquiler={agregarAlquiler}
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

            <NotificacionOperacion
                mostrar={toast.mostrar}
                mensaje={toast.mensaje}
                tipo={toast.tipo}
                onCerrar={() => setToast({ ...toast, mostrar: false })}
            />
        </Container>
    );
};

export default Alquileres;
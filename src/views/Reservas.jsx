import React, { useEffect, useState } from "react";
import { supabase } from "../database/supabaseconfig";

const Reservas = () => {
    const [reservas, setReservas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [procesando, setProcesando] = useState(false);
    const [mensaje, setMensaje] = useState("");

    // =========================================================
    // CARGAR RESERVAS
    // =========================================================
    const cargarReservas = async () => {
        try {
            setCargando(true);

            const { data, error } = await supabase
                .from("reserva")
                .select(`
          id_reserva,
          fecha_inicio,
          fecha_fin,
          estado_aprobacion,
          monto_total,
          id_usuario,
          id_coche,
          usuario:id_usuario (
            nombre1,
            nombre2,
            apellido1,
            apellido2,
            email
          ),
          coche:id_coche (
            marca,
            modelo,
            placa,
            valor_dia,
            url_imagen
          )
        `)
                .order("id_reserva", { ascending: false });

            if (error) {
                console.error(error);
                setMensaje("Error al cargar las reservas.");
                return;
            }

            setReservas(data || []);
        } catch (error) {
            console.error(error);
            setMensaje("Error al cargar las reservas.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarReservas();
    }, []);

    // =========================================================
    // ACEPTAR RESERVA
    // =========================================================
    const aceptarReserva = async (reserva) => {
        try {
            setProcesando(true);
            setMensaje("");

            const { error } = await supabase
                .from("reserva")
                .update({
                    estado_aprobacion: "aceptada",
                })
                .eq("id_reserva", reserva.id_reserva);

            if (error) {
                throw error;
            }

            setMensaje(`Reserva #${reserva.id_reserva} aceptada correctamente.`);
            await cargarReservas();
        } catch (error) {
            console.error(error);
            setMensaje("No se pudo aceptar la reserva.");
        } finally {
            setProcesando(false);
        }
    };

    // =========================================================
    // RECHAZAR RESERVA
    // =========================================================
    const rechazarReserva = async (reserva) => {
        try {
            setProcesando(true);
            setMensaje("");

            const { error } = await supabase
                .from("reserva")
                .update({
                    estado_aprobacion: "rechazada",
                })
                .eq("id_reserva", reserva.id_reserva);

            if (error) {
                throw error;
            }

            setMensaje(`Reserva #${reserva.id_reserva} rechazada.`);
            await cargarReservas();
        } catch (error) {
            console.error(error);
            setMensaje("No se pudo rechazar la reserva.");
        } finally {
            setProcesando(false);
        }
    };

    // =========================================================
    // RETIRAR VEHÍCULO
    // RESERVA → ALQUILER + DETALLE_ALQUILER
    // =========================================================
    const registrarRetiro = async (reserva) => {
        try {
            setProcesando(true);
            setMensaje("");

            // Verificar que la reserva esté aceptada
            if (reserva.estado_aprobacion !== "aceptada") {
                setMensaje("Primero debes aceptar la reserva.");
                return;
            }

            // Verificar datos necesarios
            if (!reserva.id_usuario || !reserva.id_coche) {
                setMensaje("La reserva no tiene usuario o vehículo asociado.");
                return;
            }

            // Verificar que el vehículo exista
            const { data: coche, error: errorCoche } = await supabase
                .from("coche")
                .select(`
          id_coche,
          marca,
          modelo,
          placa,
          valor_dia,
          estado,
          url_imagen
        `)
                .eq("id_coche", reserva.id_coche)
                .single();

            if (errorCoche) {
                throw errorCoche;
            }

            // Verificar disponibilidad del vehículo
            if (
                coche.estado &&
                coche.estado !== "Disponible"
            ) {
                setMensaje(
                    `El vehículo ${coche.marca} ${coche.modelo} no está disponible.`
                );
                return;
            }

            // -----------------------------------------------------
            // USAR EL MONTO REAL DE LA RESERVA
            // -----------------------------------------------------
            const montoTotal = Number(reserva.monto_total || 0);
            const valorDia = Number(coche.valor_dia || 0);

            let cantidadDias = 1;

            if (valorDia > 0 && montoTotal > 0) {
                cantidadDias = Math.round(montoTotal / valorDia);
            }

            if (cantidadDias < 1) {
                cantidadDias = 1;
            }

            // -----------------------------------------------------
            // CREAR ALQUILER
            // -----------------------------------------------------
            const { data: alquilerCreado, error: errorAlquiler } = await supabase
                .from("alquiler")
                .insert([
                    {
                        id_reserva: reserva.id_reserva,
                        fecha_inicio: reserva.fecha_inicio,
                        fecha_fin: reserva.fecha_fin,
                        estado: "En curso",
                    },
                ])
                .select()
                .single();

            if (errorAlquiler) {
                throw errorAlquiler;
            }

            // -----------------------------------------------------
            // CREAR DETALLE DEL ALQUILER
            // -----------------------------------------------------
            const { error: errorDetalle } = await supabase
                .from("detalle_alquiler")
                .insert([
                    {
                        id_alquiler: alquilerCreado.id_alquiler,
                        id_usuario: reserva.id_usuario,
                        id_coche: reserva.id_coche,
                        valor_dia: valorDia,
                        cantidad_dias: cantidadDias,
                        precio_total: montoTotal,
                    },
                ]);

            if (errorDetalle) {
                // Intentar eliminar el alquiler creado si falla el detalle
                await supabase
                    .from("alquiler")
                    .delete()
                    .eq("id_alquiler", alquilerCreado.id_alquiler);

                throw errorDetalle;
            }

            // -----------------------------------------------------
            // CAMBIAR ESTADO DEL VEHÍCULO
            // -----------------------------------------------------
            const { error: errorEstadoCoche } = await supabase
                .from("coche")
                .update({
                    estado: "En Alquiler",
                })
                .eq("id_coche", reserva.id_coche);

            if (errorEstadoCoche) {
                throw errorEstadoCoche;
            }

            // -----------------------------------------------------
            // CAMBIAR ESTADO DE LA RESERVA
            // -----------------------------------------------------
            const { error: errorReserva } = await supabase
                .from("reserva")
                .update({
                    estado_aprobacion: "retirada",
                })
                .eq("id_reserva", reserva.id_reserva);

            if (errorReserva) {
                throw errorReserva;
            }

            setMensaje(
                `Reserva #${reserva.id_reserva} retirada y convertida en alquiler #${alquilerCreado.id_alquiler}.`
            );

            await cargarReservas();
        } catch (error) {
            console.error("Error al registrar retiro:", error);
            setMensaje(
                error.message || "No se pudo registrar el retiro del vehículo."
            );
        } finally {
            setProcesando(false);
        }
    };

    // =========================================================
    // FORMATO DE FECHA
    // =========================================================
    const formatearFecha = (fecha) => {
        if (!fecha) return "Sin fecha";

        const partes = fecha.split("-");

        if (partes.length !== 3) {
            return fecha;
        }

        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    };

    // =========================================================
    // NOMBRE DEL USUARIO
    // =========================================================
    const obtenerNombreUsuario = (usuario) => {
        if (!usuario) return "Sin usuario";

        return [
            usuario.nombre1,
            usuario.nombre2,
            usuario.apellido1,
            usuario.apellido2,
        ]
            .filter(Boolean)
            .join(" ");
    };

    // =========================================================
    // ESTILO DEL ESTADO
    // =========================================================
    const obtenerEstiloEstado = (estado) => {
        switch (estado) {
            case "aceptada":
                return {
                    background: "#d1e7dd",
                    color: "#0f5132",
                };

            case "rechazada":
                return {
                    background: "#f8d7da",
                    color: "#842029",
                };

            case "retirada":
                return {
                    background: "#cfe2ff",
                    color: "#084298",
                };

            case "pendiente":
            default:
                return {
                    background: "#fff3cd",
                    color: "#664d03",
                };
        }
    };

    // =========================================================
    // RENDER
    // =========================================================
    return (
        <div className="container-fluid py-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Reservas</h2>
                    <p className="text-muted mb-0">
                        Gestión de reservas de vehículos
                    </p>
                </div>

                <button
                    className="btn btn-outline-primary"
                    onClick={cargarReservas}
                    disabled={cargando || procesando}
                >
                    Actualizar
                </button>
            </div>

            {mensaje && (
                <div className="alert alert-info">
                    {mensaje}
                </div>
            )}

            {cargando ? (
                <div className="text-center py-5">
                    <div
                        className="spinner-border text-primary"
                        role="status"
                    ></div>

                    <p className="mt-3 text-muted">
                        Cargando reservas...
                    </p>
                </div>
            ) : reservas.length === 0 ? (
                <div className="alert alert-secondary">
                    No hay reservas registradas.
                </div>
            ) : (
                <div className="row g-4">

                    {reservas.map((reserva) => {
                        const estado = reserva.estado_aprobacion || "pendiente";
                        const estiloEstado = obtenerEstiloEstado(estado);

                        return (
                            <div
                                className="col-12 col-md-6 col-xl-4"
                                key={reserva.id_reserva}
                            >
                                <div className="card h-100 shadow-sm border-0">

                                    {reserva.coche?.url_imagen && (
                                        <img
                                            src={reserva.coche.url_imagen}
                                            alt={`${reserva.coche.marca} ${reserva.coche.modelo}`}
                                            className="card-img-top"
                                            style={{
                                                height: "210px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    )}

                                    <div className="card-body">

                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <h5 className="fw-bold mb-0">
                                                Reserva #{reserva.id_reserva}
                                            </h5>

                                            <span
                                                className="badge"
                                                style={estiloEstado}
                                            >
                                                {estado}
                                            </span>
                                        </div>

                                        <h6 className="fw-bold">
                                            {reserva.coche?.marca || "Sin marca"}{" "}
                                            {reserva.coche?.modelo || ""}
                                        </h6>

                                        <p className="mb-1">
                                            <strong>Placa:</strong>{" "}
                                            {reserva.coche?.placa || "Sin placa"}
                                        </p>

                                        <p className="mb-1">
                                            <strong>Cliente:</strong>{" "}
                                            {obtenerNombreUsuario(reserva.usuario)}
                                        </p>

                                        <p className="mb-1">
                                            <strong>Correo:</strong>{" "}
                                            {reserva.usuario?.email || "Sin correo"}
                                        </p>

                                        <hr />

                                        <p className="mb-1">
                                            <strong>Fecha inicio:</strong>{" "}
                                            {formatearFecha(reserva.fecha_inicio)}
                                        </p>

                                        <p className="mb-1">
                                            <strong>Fecha fin:</strong>{" "}
                                            {formatearFecha(reserva.fecha_fin)}
                                        </p>

                                        <p className="mb-3">
                                            <strong>Monto total:</strong>{" "}
                                            C$ {Number(reserva.monto_total || 0).toLocaleString(
                                                "es-NI",
                                                {
                                                    minimumFractionDigits: 2,
                                                }
                                            )}
                                        </p>

                                        <div className="d-grid gap-2">

                                            {estado === "pendiente" && (
                                                <>
                                                    <button
                                                        className="btn btn-success"
                                                        onClick={() => aceptarReserva(reserva)}
                                                        disabled={procesando}
                                                    >
                                                        Aceptar reserva
                                                    </button>

                                                    <button
                                                        className="btn btn-outline-danger"
                                                        onClick={() => rechazarReserva(reserva)}
                                                        disabled={procesando}
                                                    >
                                                        Rechazar reserva
                                                    </button>
                                                </>
                                            )}

                                            {estado === "aceptada" && (
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => registrarRetiro(reserva)}
                                                    disabled={procesando}
                                                >
                                                    Registrar retiro del vehículo
                                                </button>
                                            )}

                                            {estado === "retirada" && (
                                                <div className="alert alert-primary mb-0">
                                                    Esta reserva ya fue convertida en alquiler.
                                                </div>
                                            )}

                                            {estado === "rechazada" && (
                                                <div className="alert alert-danger mb-0">
                                                    Reserva rechazada.
                                                </div>
                                            )}

                                        </div>

                                    </div>
                                </div>
                            </div>
                        );
                    })}

                </div>
            )}

        </div>
    );
};

export default Reservas;
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const Devoluciones = () => {
    const [alquileres, setAlquileres] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [alquilerSeleccionado, setAlquilerSeleccionado] = useState(null);

    const [fechaDevolucion, setFechaDevolucion] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [montoFinal, setMontoFinal] = useState("");
    const [estadoGeneral, setEstadoGeneral] = useState("Bueno");
    const [kilometraje, setKilometraje] = useState("");
    const [nivelCombustible, setNivelCombustible] = useState("1/2");

    const cargarAlquileres = async () => {
        try {
            setCargando(true);

            const { data: alquileresData, error: alquileresError } =
                await supabase
                    .from("alquiler")
                    .select(
                        `
            id_alquiler,
            id_reserva,
            fecha_inicio,
            fecha_fin,
            estado,
            fecha_entrega,
            fecha_devolucion,
            monto_final
          `
                    )
                    .eq("estado", "En curso")
                    .order("id_alquiler", { ascending: false });

            if (alquileresError) {
                throw alquileresError;
            }

            if (!alquileresData || alquileresData.length === 0) {
                setAlquileres([]);
                return;
            }

            const idsAlquiler = alquileresData.map(
                (alquiler) => alquiler.id_alquiler
            );

            const { data: detallesData, error: detallesError } = await supabase
                .from("detalle_alquiler")
                .select(
                    `
          id_detalle_alquiler,
          id_alquiler,
          id_usuario,
          id_coche,
          precio_total,
          valor_dia,
          cantidad_dias,
          usuario:id_usuario (
            id_usuario,
            nombre1,
            nombre2,
            apellido1,
            apellido2,
            email
          ),
          coche:id_coche (
            id_coche,
            marca,
            modelo,
            placa,
            valor_dia,
            estado,
            url_imagen
          )
        `
                )
                .in("id_alquiler", idsAlquiler);

            if (detallesError) {
                throw detallesError;
            }

            const alquileresCompletos = alquileresData.map((alquiler) => {
                const detalle = (detallesData || []).find(
                    (item) => item.id_alquiler === alquiler.id_alquiler
                );

                return {
                    ...alquiler,
                    detalle: detalle || null,
                };
            });

            setAlquileres(alquileresCompletos);
        } catch (error) {
            console.error("Error al cargar alquileres:", error);
            alert("No se pudieron cargar los alquileres.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarAlquileres();
    }, []);

    const abrirDevolucion = (alquiler) => {
        setAlquilerSeleccionado(alquiler);

        setFechaDevolucion(
            new Date().toISOString().split("T")[0]
        );

        setMontoFinal(
            alquiler.monto_final ??
            alquiler.detalle?.precio_total ??
            ""
        );

        setEstadoGeneral("Bueno");
        setKilometraje("");
        setNivelCombustible("1/2");
    };

    const cerrarDevolucion = () => {
        setAlquilerSeleccionado(null);
    };

    const registrarDevolucion = async () => {
        if (!alquilerSeleccionado) {
            return;
        }

        if (!fechaDevolucion) {
            alert("Seleccione la fecha de devolución.");
            return;
        }

        if (!montoFinal || Number(montoFinal) < 0) {
            alert("Ingrese un monto final válido.");
            return;
        }

        if (!estadoGeneral) {
            alert("Seleccione el estado general del vehículo.");
            return;
        }

        try {
            const alquiler = alquilerSeleccionado;
            const detalle = alquiler.detalle;

            const especificaciones = {
                estado_general: estadoGeneral,
                kilometraje_devolucion:
                    kilometraje !== "" ? Number(kilometraje) : null,
                nivel_combustible: nivelCombustible,
            };

            const { error: alquilerError } = await supabase
                .from("alquiler")
                .update({
                    fecha_entrega: alquiler.fecha_entrega || alquiler.fecha_inicio,
                    fecha_devolucion: fechaDevolucion,
                    monto_final: Number(montoFinal),
                    especificaciones,
                    estado: "Finalizado",
                })
                .eq("id_alquiler", alquiler.id_alquiler);

            if (alquilerError) {
                throw alquilerError;
            }

            if (detalle?.id_coche) {
                const { error: cocheError } = await supabase
                    .from("coche")
                    .update({
                        estado: "Disponible",
                    })
                    .eq("id_coche", detalle.id_coche);

                if (cocheError) {
                    throw cocheError;
                }
            }

            alert("Devolución registrada correctamente.");

            cerrarDevolucion();
            await cargarAlquileres();
        } catch (error) {
            console.error("Error al registrar devolución:", error);
            alert("No se pudo registrar la devolución.");
        }
    };

    const nombreUsuario = (usuario) => {
        if (!usuario) {
            return "Sin usuario";
        }

        return [
            usuario.nombre1,
            usuario.nombre2,
            usuario.apellido1,
            usuario.apellido2,
        ]
            .filter(Boolean)
            .join(" ");
    };

    if (cargando) {
        return (
            <div className="container-fluid p-4">
                <h2>Devoluciones</h2>
                <p>Cargando alquileres...</p>
            </div>
        );
    }

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">Devoluciones</h2>
                    <p className="text-muted mb-0">
                        Registra la devolución y finalización de los alquileres.
                    </p>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={cargarAlquileres}
                >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Actualizar
                </button>
            </div>

            {alquileres.length === 0 ? (
                <div className="alert alert-info">
                    No hay alquileres en curso para registrar una devolución.
                </div>
            ) : (
                <div className="row g-4">
                    {alquileres.map((alquiler) => {
                        const detalle = alquiler.detalle;
                        const usuario = detalle?.usuario;
                        const coche = detalle?.coche;

                        return (
                            <div
                                className="col-12 col-md-6 col-xl-4"
                                key={alquiler.id_alquiler}
                            >
                                <div className="card shadow-sm h-100">
                                    {coche?.url_imagen && (
                                        <img
                                            src={coche.url_imagen}
                                            className="card-img-top"
                                            alt={`${coche.marca} ${coche.modelo}`}
                                            style={{
                                                height: "220px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    )}

                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="card-title mb-0">
                                                Alquiler #{alquiler.id_alquiler}
                                            </h5>

                                            <span className="badge bg-warning text-dark">
                                                En curso
                                            </span>
                                        </div>

                                        <p className="mb-2">
                                            <strong>Cliente:</strong>{" "}
                                            {nombreUsuario(usuario)}
                                        </p>

                                        <p className="mb-2">
                                            <strong>Correo:</strong>{" "}
                                            {usuario?.email || "Sin correo"}
                                        </p>

                                        <p className="mb-2">
                                            <strong>Vehículo:</strong>{" "}
                                            {coche
                                                ? `${coche.marca} ${coche.modelo}`
                                                : "Sin vehículo"}
                                        </p>

                                        <p className="mb-2">
                                            <strong>Placa:</strong>{" "}
                                            {coche?.placa || "Sin placa"}
                                        </p>

                                        <p className="mb-2">
                                            <strong>Inicio:</strong>{" "}
                                            {alquiler.fecha_inicio}
                                        </p>

                                        <p className="mb-3">
                                            <strong>Fin programado:</strong>{" "}
                                            {alquiler.fecha_fin}
                                        </p>

                                        <div className="border-top pt-3">
                                            <p className="mb-3">
                                                <strong>Monto del alquiler:</strong>{" "}
                                                C$ {Number(
                                                    detalle?.precio_total || 0
                                                ).toLocaleString("es-NI")}
                                            </p>

                                            <button
                                                className="btn btn-success w-100"
                                                onClick={() =>
                                                    abrirDevolucion(alquiler)
                                                }
                                            >
                                                <i className="bi bi-check-circle me-2"></i>
                                                Registrar devolución
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {alquilerSeleccionado && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Registrar devolución — Alquiler #
                                    {alquilerSeleccionado.id_alquiler}
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={cerrarDevolucion}
                                ></button>
                            </div>

                            <div className="modal-body">
                                <div className="alert alert-info">
                                    <strong>Vehículo:</strong>{" "}
                                    {alquilerSeleccionado.detalle?.coche?.marca}{" "}
                                    {alquilerSeleccionado.detalle?.coche?.modelo}
                                    <br />
                                    <strong>Cliente:</strong>{" "}
                                    {nombreUsuario(
                                        alquilerSeleccionado.detalle?.usuario
                                    )}
                                </div>

                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Fecha de entrega
                                        </label>

                                        <input
                                            type="date"
                                            className="form-control"
                                            value={
                                                alquilerSeleccionado.fecha_entrega ||
                                                alquilerSeleccionado.fecha_inicio
                                            }
                                            disabled
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Fecha de devolución
                                        </label>

                                        <input
                                            type="date"
                                            className="form-control"
                                            value={fechaDevolucion}
                                            onChange={(e) =>
                                                setFechaDevolucion(e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Monto final
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control"
                                            value={montoFinal}
                                            onChange={(e) =>
                                                setMontoFinal(e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Estado general del vehículo
                                        </label>

                                        <select
                                            className="form-select"
                                            value={estadoGeneral}
                                            onChange={(e) =>
                                                setEstadoGeneral(e.target.value)
                                            }
                                        >
                                            <option value="Excelente">
                                                Excelente
                                            </option>
                                            <option value="Bueno">Bueno</option>
                                            <option value="Regular">Regular</option>
                                            <option value="Malo">Malo</option>
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Kilometraje de devolución
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control"
                                            placeholder="Ej. 45750"
                                            value={kilometraje}
                                            onChange={(e) =>
                                                setKilometraje(e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Nivel de combustible
                                        </label>

                                        <select
                                            className="form-select"
                                            value={nivelCombustible}
                                            onChange={(e) =>
                                                setNivelCombustible(e.target.value)
                                            }
                                        >
                                            <option value="Lleno">Lleno</option>
                                            <option value="3/4">3/4</option>
                                            <option value="1/2">1/2</option>
                                            <option value="1/4">1/4</option>
                                            <option value="Vacío">Vacío</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={cerrarDevolucion}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={registrarDevolucion}
                                >
                                    <i className="bi bi-check-circle me-2"></i>
                                    Finalizar alquiler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Devoluciones;
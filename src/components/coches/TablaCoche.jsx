import React, { useState } from "react";
import { Table, Button, Image, Pagination } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaCoche = ({
    coches,
    abrirModalEdicion,
    abrirModalEliminacion,
}) => {

    // 📌 FORMATEAR FECHA
    const formatearFecha = (fecha) => {

        if (!fecha) return "-";

        return new Date(fecha).toLocaleDateString("es-NI");
    };

    // 📌 FORMATEAR MONEDA
    const formatearMoneda = (valor) => {

        if (!valor) return "C$ 0.00";

        return Number(valor).toLocaleString("es-NI", {
            style: "currency",
            currency: "NIO",
        });
    };

    // 📌 PAGINACIÓN
    const [paginaActual, setPaginaActual] = useState(1);

    const registrosPorPagina = 5;

    const indiceUltimo = paginaActual * registrosPorPagina;
    const indicePrimero = indiceUltimo - registrosPorPagina;

    const cochesPaginados = (coches || []).slice(
        indicePrimero,
        indiceUltimo
    );

    const totalPaginas = Math.ceil(
        (coches?.length || 0) / registrosPorPagina
    );

    return (
        <>
            {!coches || coches.length === 0 ? (

                <div className="text-center">
                    <h5>No hay vehículos registrados</h5>
                </div>

            ) : (

                <>
                    <Table
                        striped
                        hover
                        responsive
                        className="align-middle"
                    >

                        <thead className="table-light">

                            <tr>

                                <th>ID</th>

                                <th>Imagen</th>

                                <th>Marca</th>

                                <th>Modelo</th>

                                <th>Año</th>

                                <th>Placa</th>

                                <th className="d-none d-md-table-cell">
                                    Color
                                </th>

                                <th>Valor/Día</th>

                                <th>Estado</th>

                                <th className="d-none d-lg-table-cell">
                                    Fecha Registro
                                </th>

                                <th className="text-center">
                                    Acciones
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {cochesPaginados.map((coche) => (

                                <tr key={coche.id_coche}>

                                    <td>{coche.id_coche}</td>

                                    {/* 📌 IMAGEN */}
                                    <td>

                                        {coche.url_imagen ? (

                                            <Image
                                                src={coche.url_imagen}
                                                rounded
                                                width={70}
                                                height={50}
                                                style={{
                                                    objectFit: "cover",
                                                }}
                                            />

                                        ) : (

                                            <div
                                                className="
                                                    bg-light
                                                    rounded
                                                    d-flex
                                                    justify-content-center
                                                    align-items-center
                                                "
                                                style={{
                                                    width: "70px",
                                                    height: "50px",
                                                }}
                                            >

                                                <i
                                                    className="
                                                        bi bi-car-front
                                                        text-secondary
                                                    "
                                                ></i>

                                            </div>

                                        )}

                                    </td>

                                    <td>{coche.marca}</td>

                                    <td>{coche.modelo}</td>

                                    <td>{coche.anio}</td>

                                    <td>{coche.placa}</td>

                                    <td className="d-none d-md-table-cell">
                                        {coche.color}
                                    </td>

                                    {/* 💰 VALOR */}
                                    <td>
                                        {formatearMoneda(
                                            coche.valor_dia
                                        )}
                                    </td>

                                    {/* 📌 ESTADO */}
                                    <td>

                                        <span
                                            className={`badge px-3 py-2 ${
                                                coche.estado === "Disponible"
                                                    ? "bg-success"
                                                    : coche.estado === "En Alquiler"
                                                    ? "bg-danger"
                                                    : "bg-warning text-dark"
                                            }`}
                                        >

                                            {coche.estado}

                                        </span>

                                    </td>

                                    {/* 📅 FECHA */}
                                    <td className="d-none d-lg-table-cell">

                                        {formatearFecha(
                                            coche.fecha_registro
                                        )}

                                    </td>

                                    {/* 📌 BOTONES */}
                                    <td className="text-center">

                                        <Button
                                            variant="outline-warning"
                                            size="sm"
                                            className="me-1"
                                            onClick={() =>
                                                abrirModalEdicion(coche)
                                            }
                                        >

                                            <i className="bi bi-pencil"></i>

                                        </Button>

                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() =>
                                                abrirModalEliminacion(coche)
                                            }
                                        >

                                            <i className="bi bi-trash"></i>

                                        </Button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </Table>

                    {/* 📌 PAGINACIÓN */}
                    <div className="d-flex justify-content-center mt-3">

                        <Pagination>

                            <Pagination.Prev
                                disabled={paginaActual === 1}
                                onClick={() =>
                                    setPaginaActual(paginaActual - 1)
                                }
                            >
                                <i className="bi bi-chevron-left"></i>
                            </Pagination.Prev>

                            {[...Array(totalPaginas)].map((_, index) => (
                                <Pagination.Item
                                    key={index + 1}
                                    active={index + 1 === paginaActual}
                                    onClick={() =>
                                        setPaginaActual(index + 1)
                                    }
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}

                            <Pagination.Next
                                disabled={paginaActual === totalPaginas}
                                onClick={() =>
                                    setPaginaActual(paginaActual + 1)
                                }
                            >
                                <i className="bi bi-chevron-right"></i>
                            </Pagination.Next>

                        </Pagination>

                    </div>

                </>

            )}
        </>
    );
};

export default TablaCoche;
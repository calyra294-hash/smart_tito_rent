import React, { useState, useEffect } from "react";
import { Table, Spinner, Button, Badge, Pagination } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaAlquileres = ({
    alquileres,
    abrirModalEdicion,
    abrirModalEliminacion,
    verDetalleAlquiler,
}) => {

    const [loading, setLoading] = useState(true);

    const [paginaActual, setPaginaActual] = useState(1);

const registrosPorPagina = 6;

const indiceUltimo = paginaActual * registrosPorPagina;
const indicePrimero = indiceUltimo - registrosPorPagina;

const alquileresPaginados = alquileres.slice(
    indicePrimero,
    indiceUltimo
);

const totalPaginas = Math.ceil(
    alquileres.length / registrosPorPagina
);

    useEffect(() => {

        if (alquileres) {
            setLoading(false);
        }

    }, [alquileres]);


    // 🔥 COLORES ESTADO
    const obtenerColorEstado = (estado) => {

        if (estado === "En curso") return "success";

        if (estado === "Finalizado") return "primary";

        if (estado === "En espera") return "warning";

        return "danger";
    };

    return (
        <>
            {loading ? (

                <div className="text-center">

                    <h4>Cargando alquileres...</h4>

                    <Spinner
                        animation="border"
                        variant="success"
                    />

                </div>

            ) : (

                <>

                <Table
                    striped
                    borderless
                    hover
                    responsive
                    size="sm"
                >

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Fecha Inicio</th>

                            <th className="d-none d-md-table-cell">
                                Fecha Fin
                            </th>

                            <th>Estado</th>

                            <th className="text-center">
                                Acciones
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {alquileresPaginados.map((alquiler) => (

                            <tr key={alquiler.id_alquiler}>

                                <td>
                                    {alquiler.id_alquiler}
                                </td>

                                <td>
                                    {alquiler.fecha_inicio}
                                </td>

                                <td className="d-none d-md-table-cell">
                                    {alquiler.fecha_fin}
                                </td>

                                <td>

                                    <Badge bg={obtenerColorEstado(alquiler.estado)}>
                                        {alquiler.estado}
                                    </Badge>

                                </td>

                                <td className="text-center">

                                    {/* 🔵 DETALLE */}
                                    <Button
                                        variant="outline-info"
                                        size="sm"
                                        className="m-1"
                                        onClick={() =>
                                            verDetalleAlquiler(alquiler.id_alquiler)
                                        }
                                    >
                                        <i className="bi bi-eye"></i>
                                    </Button>

                                    {/* 🟡 EDITAR */}
                                    <Button
                                        variant="outline-warning"
                                        size="sm"
                                        className="m-1"
                                        onClick={() =>
                                            abrirModalEdicion(alquiler)
                                        }
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </Button>

                                    {/* 🔴 ELIMINAR */}
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        className="m-1"
                                        onClick={() =>
                                            abrirModalEliminacion(alquiler)
                                        }
                                    >
                                        <i className="bi bi-trash"></i>
                                    </Button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </Table>
                <div className="d-flex justify-content-center mt-3">
    <Pagination>

        <Pagination.Prev
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual(paginaActual - 1)}
        >
            <i className="bi bi-chevron-left"></i>
        </Pagination.Prev>

        {[...Array(totalPaginas)].map((_, index) => (
            <Pagination.Item
                key={index + 1}
                active={index + 1 === paginaActual}
                onClick={() => setPaginaActual(index + 1)}
            >
                {index + 1}
            </Pagination.Item>
        ))}

        <Pagination.Next
            disabled={paginaActual === totalPaginas}
            onClick={() => setPaginaActual(paginaActual + 1)}
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

export default TablaAlquileres;
import React from "react";
import { Table, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaCoche = ({
    coches,
    abrirModalEdicion,
    abrirModalEliminacion,
}) => {

    // 📌 Formato limpio DATE
    const formatearFecha = (fecha) => {
        if (!fecha) return "-";
        return fecha;
    };

    // 💰 Formato moneda
    const formatearMoneda = (valor) => {
        if (!valor) return "C$ 0.00";

        return Number(valor).toLocaleString("es-NI", {
            style: "currency",
            currency: "NIO",
        });
    };

    return (
        <>
            {!coches || coches.length === 0 ? (
                <div className="text-center">
                    <h5>No hay vehículos registrados</h5>
                </div>
            ) : (
                <Table striped borderless hover responsive size="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Año</th>
                            <th>Placa</th>
                            <th className="d-none d-md-table-cell">Color</th>
                            <th>Valor/Día</th>
                            <th>Estado</th>
                            <th>Fecha Registro</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {coches.map((coche) => (
                            <tr key={coche.id_coche}>
                                <td>{coche.id_coche}</td>
                                <td>{coche.marca}</td>
                                <td>{coche.modelo}</td>
                                <td>{coche.anio}</td>
                                <td>{coche.placa}</td>

                                <td className="d-none d-md-table-cell">
                                    {coche.color}
                                </td>

                                {/* 💰 VALOR CON MONEDA */}
                                <td>{formatearMoneda(coche.valor_dia)}</td>

                                <td>
                                    <span
                                        className={`badge ${
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
                                <td>{formatearFecha(coche.fecha_registro)}</td>

                                <td className="text-center">
                                    <Button
                                        variant="outline-warning"
                                        size="sm"
                                        className="m-1"
                                        onClick={() => abrirModalEdicion(coche)}
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </Button>

                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => abrirModalEliminacion(coche)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
};

export default TablaCoche;
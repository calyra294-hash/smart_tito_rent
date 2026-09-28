import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Image, Pagination, Badge } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaCoche = ( {
    coches = [],
    abrirModalEdicion,
    abrirModalEliminacion,
} ) => {

    // Helper defensivo para fechas (ISO YYYY-MM-DD -> Formato local)
    const formatearFecha = ( fecha ) => {
        if ( !fecha ) return "-";
        // Añadimos T00:00:00 para evitar despasajes por UTC/zona horaria
        const fechaObj = new Date( fecha.includes("T") ? fecha : `${fecha}T00:00:00` );
        return isNaN( fechaObj.getTime() ) ? "-" : fechaObj.toLocaleDateString( "es-NI" );
    };

    // Helper para formatear moneda en Córdobas (NIO)
    const formatearMoneda = ( valor ) => {
        const numero = parseFloat( valor );
        if ( isNaN( numero ) ) return "C$ 0.00";
        return numero.toLocaleString( "es-NI", {
            style: "currency",
            currency: "NIO",
        } );
    };

    // Parser seguro para el string JSON de detalles_tecnicos
    const parsearDetallesTecnicos = ( detallesRaw ) => {
        if ( !detallesRaw ) return null;
        if ( typeof detallesRaw === "object" ) return detallesRaw; // Por si en el futuro viene deserializado
        try {
            return JSON.parse( detallesRaw );
        } catch ( error ) {
            console.error( "Error al parsear detalles_tecnicos:", error );
            return null;
        }
    };

    const obtenerBadgeEstado = ( estado ) => {
        switch ( estado ) {
            case "Disponible":
                return "bg-success";
            case "En Alquiler":
                return "bg-danger";
            default:
                return "bg-warning text-dark";
        }
    };

    // 📌 PAGINACIÓN & ESTADO
    const [ paginaActual, setPaginaActual ] = useState( 1 );
    const registrosPorPagina = 5;

    const totalPaginas = Math.ceil( ( coches?.length || 0 ) / registrosPorPagina );

    // Reajuste de página activa si el array de vehículos cambia (ej. tras una eliminación)
    useEffect( () => {
        if ( paginaActual > totalPaginas && totalPaginas > 0 ) {
            setPaginaActual( totalPaginas );
        }
    }, [ coches?.length, totalPaginas, paginaActual ] );

    // Memoización del rebanado de datos (Slicing) para optimizar re-renders
    const cochesPaginados = useMemo( () => {
        const indiceUltimo = paginaActual * registrosPorPagina;
        const indicePrimero = indiceUltimo - registrosPorPagina;
        return ( coches || [] ).slice( indicePrimero, indiceUltimo );
    }, [ coches, paginaActual, registrosPorPagina ] );

    if ( !coches || coches.length === 0 ) {
        return (
            <div className="text-center my-4">
                <h5 className="text-muted">No hay vehículos registrados</h5>
            </div>
        );
    }

    return (
        <>
            <Table hover responsive className="align-middle">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Imagen</th>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>Categoría</th>
                        <th>Año</th>
                        <th>Placa</th>
                        <th className="d-none d-md-table-cell">Color</th>
                        <th className="d-none d-lg-table-cell">Especificaciones</th>
                        <th>Valor/Día</th>
                        <th>Estado</th>
                        <th className="d-none d-xl-table-cell">Fecha Registro</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    { cochesPaginados.map( ( coche ) => {
                        // Sombra defensiva de la categoría
                        const nombreCategoria =
                            coche.categorias?.nombre_categoria ||
                            coche.categoria ||
                            `Cat. ID: ${coche.id_categoria}` ||
                            "Sin categoría";

                        // Parsing seguro de los datos JSON
                        const detalles = parsearDetallesTecnicos( coche.detalles_tecnicos );

                        return (
                            <tr key={ coche.id_coche }>
                                <td>{ coche.id_coche }</td>

                                {/* 📌 IMAGEN */}
                                <td>
                                    { coche.url_imagen ? (
                                        <Image
                                            src={ coche.url_imagen }
                                            alt={ `${ coche.marca } ${ coche.modelo }` }
                                            rounded
                                            width={ 70 }
                                            height={ 50 }
                                            style={ { objectFit: "cover" } }
                                            onError={ ( e ) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/70x50?text=Auto";
                                            } }
                                        />
                                    ) : (
                                        <div
                                            className="bg-light rounded d-flex justify-content-center align-items-center"
                                            style={ { width: "70px", height: "50px" } }
                                        >
                                            <i className="bi bi-car-front fs-4 text-secondary"></i>
                                        </div>
                                    ) }
                                </td>

                                <td className="fw-semibold">{ coche.marca }</td>
                                <td>{ coche.modelo }</td>

                                {/* 🏷️ CATEGORÍA */}
                                <td>
                                    <span className="badge bg-light text-dark border">
                                        { nombreCategoria }
                                    </span>
                                </td>

                                <td>{ coche.anio }</td>
                                <td>{ coche.placa }</td>

                                <td className="d-none d-md-table-cell">
                                    { coche.color }
                                </td>

                                {/* ⚙️ DETALLES TÉCNICOS (JSON desestructurado) */}
                                <td className="d-none d-lg-table-cell">
                                    { detalles ? (
                                        <small className="text-muted d-block">
                                            <i className="bi bi-gear-wide-connected me-1"></i>
                                            { detalles.transmision } | { detalles.combustible }
                                            <br />
                                            <i className="bi bi-people me-1"></i>
                                            { detalles.pasajeros } Pasajeros
                                        </small>
                                    ) : (
                                        <small className="text-muted">N/A</small>
                                    ) }
                                </td>

                                {/* 💰 VALOR */}
                                <td className="fw-bold text-nowrap">
                                    { formatearMoneda( coche.valor_dia ) }
                                </td>

                                {/* 📌 ESTADO */}
                                <td>
                                    <Badge className={ `px-3 py-2 ${ obtenerBadgeEstado( coche.estado ) }` }>
                                        { coche.estado }
                                    </Badge>
                                </td>

                                {/* 📅 FECHA REGISTRO */}
                                <td className="d-none d-xl-table-cell">
                                    <small className="text-muted">
                                        { formatearFecha( coche.fecha_registro ) }
                                    </small>
                                </td>

                                {/* 📌 BOTONES ACCIONES */}
                                <td className="text-center">
                                    <Button
                                        variant="outline-warning"
                                        size="sm"
                                        className="me-1"
                                        onClick={ () => abrirModalEdicion( coche ) }
                                        title="Editar vehículo"
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </Button>

                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={ () => abrirModalEliminacion( coche ) }
                                        title="Eliminar vehículo"
                                    >
                                        <i className="bi bi-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        );
                    } ) }
                </tbody>
            </Table>

            {/* 📌 PAGINACIÓN */}
            { totalPaginas > 1 && (
                <div className="d-flex justify-content-center mt-3">
                    <Pagination>
                        <Pagination.Prev
                            disabled={ paginaActual === 1 }
                            onClick={ () => setPaginaActual( ( prev ) => prev - 1 ) }
                        >
                            <i className="bi bi-chevron-left"></i>
                        </Pagination.Prev>

                        { [ ...Array( totalPaginas ) ].map( ( _, index ) => (
                            <Pagination.Item
                                key={ index + 1 }
                                active={ index + 1 === paginaActual }
                                onClick={ () => setPaginaActual( index + 1 ) }
                            >
                                { index + 1 }
                            </Pagination.Item>
                        ) ) }

                        <Pagination.Next
                            disabled={ paginaActual === totalPaginas }
                            onClick={ () => setPaginaActual( ( prev ) => prev + 1 ) }
                        >
                            <i className="bi bi-chevron-right"></i>
                        </Pagination.Next>
                    </Pagination>
                </div>
            ) }
        </>
    );
};

export default TablaCoche;
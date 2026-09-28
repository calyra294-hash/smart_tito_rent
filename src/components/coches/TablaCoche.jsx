import React, { useState, useEffect } from "react";
import { Table, Button, Image, Pagination } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaCoche = ( {
    coches = [],
    abrirModalEdicion,
    abrirModalEliminacion,
} ) => {

    const formatearFecha = ( fecha ) => {
        if ( !fecha ) return "-";
        return new Date( fecha ).toLocaleDateString( "es-NI" );
    };


    const formatearMoneda = ( valor ) => {
        if ( !valor ) return "C$ 0.00";
        return Number( valor ).toLocaleString( "es-NI", {
            style: "currency",
            currency: "NIO",
        } );
    };


    const obtenerBadgeEstado = ( estado ) => {
        switch ( estado )
        {
            case "Disponible":
                return "bg-success";
            case "En Alquiler":
                return "bg-danger";
            default:
                return "bg-warning text-dark";
        }
    };

    // 📌 PAGINACIÓN
    const [ paginaActual, setPaginaActual ] = useState( 1 );
    const registrosPorPagina = 5;

    const totalPaginas = Math.ceil( ( coches?.length || 0 ) / registrosPorPagina );

    // Ajuste reactivo si se eliminan registros y la página actual queda fuera de rango
    useEffect( () => {
        if ( paginaActual > totalPaginas && totalPaginas > 0 )
        {
            setPaginaActual( totalPaginas );
        }
    }, [ coches?.length, totalPaginas, paginaActual ] );

    const indiceUltimo = paginaActual * registrosPorPagina;
    const indicePrimero = indiceUltimo - registrosPorPagina;
    const cochesPaginados = ( coches || [] ).slice( indicePrimero, indiceUltimo );

    if ( !coches || coches.length === 0 )
    {
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
                        <th>Valor/Día</th>
                        <th>Estado</th>
                        <th className="d-none d-lg-table-cell">Fecha Registro</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    { cochesPaginados.map( ( coche ) => {
                        // Sombra defensiva: soporta tanto objeto anidado (ej. coche.categorias.nombre_categoria)
                        // como un campo plano (ej. coche.categoria)
                        const nombreCategoria =
                            coche.categorias?.nombre_categoria ||
                            coche.categoria ||
                            "Sin categoría";

                        return (
                            <tr key={ coche.id_coche }>
                                <td>{ coche.id_coche }</td>

                                {/* 📌 IMAGEN */ }
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

                                {/* 🏷️ NUEVA COLUMNA CATEGORÍA */ }
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

                                {/* 💰 VALOR */ }
                                <td className="fw-bold">
                                    { formatearMoneda( coche.valor_dia ) }
                                </td>

                                {/* 📌 ESTADO */ }
                                <td>
                                    <span className={ `badge px-3 py-2 ${ obtenerBadgeEstado( coche.estado ) }` }>
                                        { coche.estado }
                                    </span>
                                </td>

                                {/* 📅 FECHA */ }
                                <td className="d-none d-lg-table-cell">
                                    <small className="text-muted">
                                        { formatearFecha( coche.fecha_registro ) }
                                    </small>
                                </td>

                                {/* 📌 BOTONES ACCIONES */ }
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

            {/* 📌 PAGINACIÓN */ }
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
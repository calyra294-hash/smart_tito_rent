import React from "react";
import { Row, Col, Button, Image, Badge } from "react-bootstrap";
import { useSeleccionTarjeta } from "../../components/herramientas/tarjetas/useSeleccionTarjeta";
import TarjetaBase from "../herramientas/tarjetas/TarjetaBase";

// Utilidad auxiliar para desempaquetar detalles_tecnicos sin romper el render
const parsearDetallesTecnicos = ( rawDetalles ) => {
    if ( !rawDetalles ) return { pasajeros: 5, combustible: "Gasolina", transmision: "Automático", equipamiento: [] };

    if ( typeof rawDetalles === "string" )
    {
        try
        {
            return JSON.parse( rawDetalles );
        } catch ( error )
        {
            console.error( "Error al parsear detalles_tecnicos en tarjeta:", error );
            return { pasajeros: 5, combustible: "Gasolina", transmision: "Automático", equipamiento: [] };
        }
    }
    return rawDetalles;
};

// Mapeo de badges de estado para coherencia visual de Bootstrap
const CONFIG_ESTADO = {
    Disponible: { bg: "success", text: "Disponible" },
    "En Alquiler": { bg: "warning", text: "En Alquiler" },
    Mantenimiento: { bg: "danger", text: "Mantenimiento" },
};

const TarjetaCoche = ( { coches, abrirModalEdicion, abrirModalEliminacion } ) => {
    const { idActivo, alternarActivo, cerrar } = useSeleccionTarjeta();

    if ( !coches || coches.length === 0 )
    {
        return (
            <div className="text-center py-4 text-muted">
                <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                No hay vehículos disponibles para mostrar.
            </div>
        );
    }

    return (
        <div className="d-flex flex-column gap-3">
            { coches.map( ( coche ) => {
                const detalles = parsearDetallesTecnicos( coche.detalles_tecnicos );
                const estadoInfo = CONFIG_ESTADO[ coche.estado ] || { bg: "secondary", text: coche.estado };

                return (
                    <TarjetaBase
                        key={ coche.id_coche }
                        id={ coche.id_coche }
                        esActivo={ idActivo === coche.id_coche }
                        alHacerClick={ () => alternarActivo( coche.id_coche ) }
                        ariaLabel={ `Vehículo ${ coche.marca } ${ coche.modelo }` }
                        acciones={
                            <>
                                <Button
                                    variant="outline-warning"
                                    size="sm"
                                    title="Editar vehículo"
                                    onClick={ () => {
                                        abrirModalEdicion( coche );
                                        cerrar();
                                    } }
                                >
                                    <i className="bi bi-pencil me-1"></i> Editar
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    title="Eliminar vehículo"
                                    onClick={ () => {
                                        abrirModalEliminacion( coche );
                                        cerrar();
                                    } }
                                >
                                    <i className="bi bi-trash me-1"></i> Eliminar
                                </Button>
                            </>
                        }
                    >
                        {/* Contenido enriquecido de la tarjeta */ }
                        <Row className="align-items-center g-3">
                            {/* Imagen principal / Thumbnail */ }
                            <Col xs={ 12 } sm={ 3 } className="text-center">
                                { coche.url_imagen ? (
                                    <Image
                                        src={ coche.url_imagen }
                                        alt={ `${ coche.marca } ${ coche.modelo }` }
                                        rounded
                                        fluid
                                        style={ {
                                            maxHeight: "85px",
                                            width: "100%",
                                            objectFit: "contain",
                                        } }
                                    />
                                ) : (
                                    <div
                                        className="bg-light d-flex align-items-center justify-content-center rounded border"
                                        style={ { height: "85px" } }
                                    >
                                        <i className="bi bi-car-front text-secondary fs-1"></i>
                                    </div>
                                ) }
                            </Col>

                            {/* Información central (Marca, Modelo, Especificaciones, Equipamiento) */ }
                            <Col xs={ 12 } sm={ 6 }>
                                <div className="d-flex align-items-center gap-2 mb-1">
                                    <h6 className="mb-0 fw-bold text-dark">
                                        { coche.marca } { coche.modelo }
                                    </h6>
                                    <span className="badge bg-light text-secondary border">
                                        { coche.anio }
                                    </span>
                                </div>

                                <div className="small text-muted mb-2">
                                    <span className="fw-medium text-dark">{ coche.placa }</span>
                                    <span className="mx-1">•</span>
                                    <span>{ coche.color }</span>
                                </div>

                                {/* Micro-specs de detalles técnicos */ }
                                <div className="d-flex flex-wrap gap-2 small text-secondary">
                                    <span>
                                        <i className="bi bi-people-fill me-1 text-primary"></i>
                                        { detalles.pasajeros } pas.
                                    </span>
                                    <span>
                                        <i className="bi bi-fuel-pump-fill me-1 text-primary"></i>
                                        { detalles.combustible }
                                    </span>
                                    <span>
                                        <i className="bi bi-gear-wide-connected me-1 text-primary"></i>
                                        { detalles.transmision }
                                    </span>
                                </div>

                                {/* Píldoras de Equipamiento (Si existen) */ }
                                { Array.isArray( detalles.equipamiento ) && detalles.equipamiento.length > 0 && (
                                    <div className="d-flex flex-wrap gap-1 mt-2">
                                        { detalles.equipamiento.slice( 0, 3 ).map( ( item, idx ) => (
                                            <Badge
                                                key={ idx }
                                                bg="light"
                                                text="dark"
                                                className="border fw-normal text-truncate"
                                                style={ { maxWidth: "120px", fontSize: "0.7rem" } }
                                            >
                                                { item }
                                            </Badge>
                                        ) ) }
                                        { detalles.equipamiento.length > 3 && (
                                            <Badge bg="light" text="muted" className="border fw-normal" style={ { fontSize: "0.7rem" } }>
                                                +{ detalles.equipamiento.length - 3 } más
                                            </Badge>
                                        ) }
                                    </div>
                                ) }
                            </Col>

                            {/* Precio y Estado (Columna Derecha) */ }
                            <Col xs={ 12 } sm={ 3 } className="text-sm-end d-flex flex-sm-column justify-content-between align-items-sm-end">
                                <Badge bg={ estadoInfo.bg } className="mb-2 align-self-start align-self-sm-end px-2 py-1">
                                    { estadoInfo.text }
                                </Badge>

                                <div>
                                    <div className="text-muted small">Tarifa diaria</div>
                                    <div className="fs-5 fw-bold text-primary">
                                        C$ { parseFloat( coche.valor_dia || 0 ).toLocaleString( "es-NI", { minimumFractionDigits: 2 } ) }
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </TarjetaBase>
                );
            } ) }
        </div>
    );
};

export default TarjetaCoche;
import React from "react";
import { Row, Col, Button, Image } from "react-bootstrap";
import { useSeleccionTarjeta } from "../../components/herramientas/tarjetas/useSeleccionTarjeta";
import TarjetaBase from "../herramientas/tarjetas/TarjetaBase";

const TarjetaCoche = ( {
    coches,
    abrirModalEdicion,
    abrirModalEliminacion,
} ) => {
    const { idActivo, alternarActivo, cerrar } = useSeleccionTarjeta();

    return (
        <div>
            { coches?.map( ( coche ) => (
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
                                onClick={ () => {
                                    abrirModalEdicion( coche );
                                    cerrar();
                                } }
                            >
                                <i className="bi bi-pencil"></i>
                            </Button>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={ () => {
                                    abrirModalEliminacion( coche );
                                    cerrar();
                                } }
                            >
                                <i className="bi bi-trash"></i>
                            </Button>
                        </>
                    }
                >
                    {/* Contenido específico del Vehículo */ }
                    <Row className="align-items-center gx-3">
                        {/* Imagen / Placeholder */ }
                        <Col xs={ 3 } className="text-center">
                            { coche.url_imagen ? (
                                <Image
                                    src={ coche.url_imagen }
                                    alt={ `${ coche.marca } ${ coche.modelo }` }
                                    rounded
                                    fluid
                                    style={ { maxHeight: "50px", objectFit: "cover" } }
                                />
                            ) : (
                                <div
                                    className="bg-light d-flex align-items-center justify-content-center rounded"
                                    style={ { height: "50px" } }
                                >
                                    <i className="bi bi-car-front text-muted fs-4"></i>
                                </div>
                            ) }
                        </Col>

                        {/* Detalles principales */ }
                        <Col xs={ 6 } className="text-start">
                            <div className="fw-semibold text-truncate">
                                { coche.marca } { coche.modelo }
                            </div>
                            <div className="small text-muted text-truncate">
                                { coche.placa } • { coche.color }
                            </div>
                            <div className="small text-primary fw-semibold">
                                ${ parseFloat( coche.valor_dia || 0 ).toFixed( 2 ) } / día
                            </div>
                        </Col>

                        {/* Estado del Vehículo */ }
                        <Col xs={ 3 } className="text-end">
                            <div
                                className={ `fw-semibold small ${ coche.estado === "Disponible"
                                        ? "text-success"
                                        : coche.estado === "En Alquiler"
                                            ? "text-warning"
                                            : "text-danger"
                                    }` }
                            >
                                { coche.estado }
                            </div>
                        </Col>
                    </Row>
                </TarjetaBase>
            ) ) }
        </div>
    );
};

export default TarjetaCoche;
import React from "react";
import { Form } from "react-bootstrap";

const CuadroBusquedas = ({
    textoBusqueda,
    manejarCambioBusqueda,
}) => {

    return (

        <Form.Control
            type="text"
            placeholder="Buscar vehículo..."
            value={textoBusqueda}
            onChange={manejarCambioBusqueda}
        />

    );
};

export default CuadroBusquedas;
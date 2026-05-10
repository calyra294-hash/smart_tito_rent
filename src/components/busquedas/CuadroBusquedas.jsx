import React from "react";
import { Form } from "react-bootstrap";

const CuadroBusquedas = ({
    textoBusqueda,
    manejarCambioBusqueda,
    placeholder = "Buscar..."
}) => {

    return (

        <Form.Control
            type="text"
            placeholder={placeholder}
            value={textoBusqueda}
            onChange={manejarCambioBusqueda}
        />

    );
};

export default CuadroBusquedas;
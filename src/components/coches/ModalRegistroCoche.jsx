import React, { useState } from "react";
import { Modal, Form, Button, Row, Col, InputGroup, Spinner } from "react-bootstrap";

const ModalRegistroCoche = ( {
    mostrarModal,
    setMostrarModal,
    nuevoCoche,
    manejoCambioInput,
    manejoCambioArchivo,
    categorias = [],
    agregarCoche,
    setMostrarModalCategoria,
} ) => {
    const [ deshabilitado, setDeshabilitado ] = useState( false );

    const handleRegistrar = async () => {
        if ( deshabilitado ) return;

        try
        {
            setDeshabilitado( true );
            await agregarCoche();
        } catch ( error )
        {
            console.error( "Error al registrar el vehículo:", error );
        } finally
        {
            setDeshabilitado( false );
        }
    };

    // Validación declarativa de campos obligatorios
    const esFormularioInvalido =
        !nuevoCoche?.marca?.trim() ||
        !nuevoCoche?.modelo?.trim() ||
        !nuevoCoche?.placa?.trim() ||
        !nuevoCoche?.valor_dia ||
        !nuevoCoche?.categoria_coche ||
        deshabilitado;

    return (
        <Modal
            show={ mostrarModal }
            onHide={ () => setMostrarModal( false ) }
            backdrop="static"
            keyboard={ false }
            centered
            size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="bi bi-car-front me-2"></i>
                    Registrar Vehículo
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    {/* FILA 1: Marca y Modelo */ }
                    <Row>
                        <Col xs={ 12 } md={ 6 }>
                            <Form.Group className="mb-3">
                                <Form.Label>Marca *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="marca"
                                    placeholder="Ej. Toyota, Hyundai..."
                                    value={ nuevoCoche?.marca || "" }
                                    onChange={ manejoCambioInput }
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={ 12 } md={ 6 }>
                            <Form.Group className="mb-3">
                                <Form.Label>Modelo *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="modelo"
                                    placeholder="Ej. Corolla, Accent..."
                                    value={ nuevoCoche?.modelo || "" }
                                    onChange={ manejoCambioInput }
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* FILA 2: Categoría, Año y Placa */ }
                    <Row>
                        <Col xs={ 12 } md={ 6 }>
                            <Form.Group className="mb-3">
                                <Form.Label>Categoría *</Form.Label>
                                <InputGroup>
                                    <Form.Select
                                        name="categoria_coche"
                                        value={ nuevoCoche?.categoria_coche || "" }
                                        onChange={ manejoCambioInput }
                                        required
                                    >
                                        <option value="">Seleccione...</option>
                                        { categorias.map( ( cat ) => (
                                            <option
                                                key={ cat.id_categoria }
                                                value={ cat.id_categoria }
                                            >
                                                { cat.nombre_categoria }
                                            </option>
                                        ) ) }
                                    </Form.Select>

                                    { setMostrarModalCategoria && (
                                        <Button
                                            variant="outline-primary"
                                            onClick={ () => setMostrarModalCategoria( true ) }
                                            title="Agregar nueva categoría"
                                        >
                                            <i className="bi bi-plus-lg"></i>
                                        </Button>
                                    ) }
                                </InputGroup>
                            </Form.Group>
                        </Col>

                        <Col xs={ 12 } md={ 3 }>
                            <Form.Group className="mb-3">
                                <Form.Label>Año</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="anio"
                                    placeholder="2024"
                                    min="1900"
                                    max={ new Date().getFullYear() + 1 }
                                    value={ nuevoCoche?.anio || "" }
                                    onChange={ manejoCambioInput }
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={ 12 } md={ 3 }>
                            <Form.Group className="mb-3">
                                <Form.Label>Placa *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="placa"
                                    placeholder="M 123456"
                                    value={ nuevoCoche?.placa || "" }
                                    onChange={ manejoCambioInput }
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* FILA 3: Color y Valor por Día */ }
                    <Row>
                        <Col xs={ 12 } md={ 6 }>
                            <Form.Group className="mb-3">
                                <Form.Label>Color</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="color"
                                    placeholder="Ej. Rojo, Blanco..."
                                    value={ nuevoCoche?.color || "" }
                                    onChange={ manejoCambioInput }
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={ 12 } md={ 6 }>
                            <Form.Group className="mb-3">
                                <Form.Label>Valor por Día (C$) *</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    name="valor_dia"
                                    placeholder="0.00"
                                    value={ nuevoCoche?.valor_dia || "" }
                                    onChange={ manejoCambioInput }
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* FILA 4: Estado y Archivo */ }
                    <Row>
                        <Col xs={ 12 } md={ 6 }>
                            <Form.Group className="mb-3">
                                <Form.Label>Estado</Form.Label>
                                <Form.Select
                                    name="estado"
                                    value={ nuevoCoche?.estado || "Disponible" }
                                    onChange={ manejoCambioInput }
                                >
                                    <option value="Disponible">Disponible</option>
                                    <option value="En Alquiler">En Alquiler</option>
                                    <option value="Mantenimiento">Mantenimiento</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col xs={ 12 } md={ 6 }>
                            <Form.Group className="mb-3">
                                <Form.Label>Imagen del Vehículo</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={ manejoCambioArchivo }
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={ () => setMostrarModal( false ) }
                    disabled={ deshabilitado }
                >
                    Cancelar
                </Button>

                <Button
                    variant="primary"
                    onClick={ handleRegistrar }
                    disabled={ esFormularioInvalido }
                >
                    { deshabilitado ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                            />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-save me-2"></i>
                            Guardar
                        </>
                    ) }
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalRegistroCoche;
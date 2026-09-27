import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";

const ModalEdicionCoche = ( {
  mostrarModalEdicion,
  setMostrarModalEdicion,
  cocheEditar,
  manejoCambioInputEdicion,
  manejoCambioArchivoActualizar,
  actualizarCoche,
  categorias = [],
} ) => {
  const [ cargando, setCargando ] = useState( false );

  // Ejecución directa de la función de actualización
  const handleActualizar = async () => {
    if ( cargando ) return;

    setCargando( true );
    try
    {
      await actualizarCoche();
    } catch ( error )
    {
      console.error( "Error al actualizar vehículo en BD:", error );
    } finally
    {
      setCargando( false );
    }
  };

  return (
    <Modal
      show={ mostrarModalEdicion }
      onHide={ () => setMostrarModalEdicion( false ) }
      backdrop="static"
      keyboard={ false }
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title className="fs-5 fw-bold text-primary">
          <i className="bi bi-pencil-square me-2"></i>
          Editar Vehículo
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 py-3">
        <Form>
          {/* FILA 1: Categoría, Marca y Modelo */ }
          <Row>
            <Col xs={ 12 } md={ 4 }>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Categoría *</Form.Label>
                <Form.Select
                  name="id_categoria" 
                  value={ cocheEditar?.id_categoria || "" }
                  onChange={ manejoCambioInputEdicion }
                  required
                >
                  <option value="">Seleccione...</option>
                  { categorias.map( ( cat ) => (
                    <option key={ cat.id_categoria } value={ cat.id_categoria }>
                      { cat.nombre_categoria }
                    </option>
                  ) ) }
                </Form.Select>
              </Form.Group>
            </Col>

            <Col xs={ 12 } md={ 4 }>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Marca *</Form.Label>
                <Form.Control
                  type="text"
                  name="marca"
                  value={ cocheEditar?.marca || "" }
                  onChange={ manejoCambioInputEdicion }
                  placeholder="Ej. Toyota"
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={ 12 } md={ 4 }>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Modelo *</Form.Label>
                <Form.Control
                  type="text"
                  name="modelo"
                  value={ cocheEditar?.modelo || "" }
                  onChange={ manejoCambioInputEdicion }
                  placeholder="Ej. Corolla"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* FILA 2: Año, Placa y Color */ }
          <Row>
            <Col xs={ 12 } md={ 4 }>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Año *</Form.Label>
                <Form.Control
                  type="number"
                  name="anio"
                  min="1900"
                  max={ new Date().getFullYear() + 1 }
                  value={ cocheEditar?.anio || "" }
                  onChange={ manejoCambioInputEdicion }
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={ 12 } md={ 4 }>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Placa *</Form.Label>
                <Form.Control
                  type="text"
                  name="placa"
                  value={ cocheEditar?.placa || "" }
                  onChange={ manejoCambioInputEdicion }
                  placeholder="Ej. M 123-456"
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={ 12 } md={ 4 }>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Color</Form.Label>
                <Form.Control
                  type="text"
                  name="color"
                  value={ cocheEditar?.color || "" }
                  onChange={ manejoCambioInputEdicion }
                  placeholder="Ej. Gris Metálico"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* FILA 3: Valor Día, Estado y Fecha Registro */ }
          <Row>
            <Col xs={ 12 } md={ 4 }>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Valor por Día ($) *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  name="valor_dia"
                  value={ cocheEditar?.valor_dia || "" }
                  onChange={ manejoCambioInputEdicion }
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={ 12 } md={ 4 }>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Estado *</Form.Label>
                <Form.Select
                  name="estado"
                  value={ cocheEditar?.estado || "" }
                  onChange={ manejoCambioInputEdicion }
                  required
                >
                  <option value="">Seleccione estado...</option>
                  <option value="Disponible">Disponible</option>
                  <option value="En Alquiler">En Alquiler</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col xs={ 12 } md={ 4 }>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold text-muted">
                  Fecha Registro
                </Form.Label>
                <Form.Control
                  type="date"
                  value={ cocheEditar?.fecha_registro ? cocheEditar.fecha_registro.split( "T" )[ 0 ] : "" }
                  readOnly
                  disabled
                  className="bg-light"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* FILA 4: Imagen Actual y Nueva Imagen (Opcional) */ }
          { manejoCambioArchivoActualizar && (
            <Row>
              <Col xs={ 12 } md={ 6 }>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Imagen Actual</Form.Label>
                  { cocheEditar?.imagen_url ? (
                    <div className="mb-2">
                      <img
                        src={ cocheEditar.imagen_url }
                        alt="Vehículo"
                        className="rounded img-thumbnail"
                        style={ { maxWidth: "140px", maxHeight: "100px", objectFit: "cover" } }
                      />
                    </div>
                  ) : (
                    <p className="text-muted small">Sin imagen asignada</p>
                  ) }
                </Form.Group>
              </Col>

              <Col xs={ 12 } md={ 6 }>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Nueva Imagen (Opcional)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={ manejoCambioArchivoActualizar }
                  />
                  <Form.Text className="text-muted small">
                    Si seleccionas un archivo, reemplazará la imagen actual.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          ) }
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={ () => setMostrarModalEdicion( false ) }
          disabled={ cargando }
        >
          Cancelar
        </Button>

        <Button
          variant="primary"
          onClick={ handleActualizar }
          disabled={ cargando }
        >
          { cargando ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Actualizando...
            </>
          ) : (
            <>
              <i className="bi bi-pencil-square me-2"></i>
              Actualizar Vehículo
            </>
          ) }
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCoche;
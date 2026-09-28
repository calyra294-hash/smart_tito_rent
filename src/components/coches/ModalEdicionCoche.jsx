import React, { useState, useMemo } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Badge } from "react-bootstrap";

const ModalEdicionCoche = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  cocheEditar,
  manejoCambioInputEdicion,
  manejoCambioArchivoActualizar,
  actualizarCoche,
  categorias = [],
}) => {
  const [cargando, setCargando] = useState(false);

  // 1. Deserialización segura del JSON 'detalles_tecnicos'
  const detalles = useMemo(() => {
    if (!cocheEditar?.detalles_tecnicos) {
      return {
        pasajeros: 5,
        combustible: "Gasolina",
        transmision: "Automatico",
        equipamiento: [],
      };
    }
    if (typeof cocheEditar.detalles_tecnicos === "string") {
      try {
        return JSON.parse(cocheEditar.detalles_tecnicos);
      } catch (e) {
        console.error("Error al parsear detalles_tecnicos:", e);
        return {
          pasajeros: 5,
          combustible: "Gasolina",
          transmision: "Automatico",
          equipamiento: [],
        };
      }
    }
    return cocheEditar.detalles_tecnicos;
  }, [cocheEditar?.detalles_tecnicos]);

  // 2. Evento sintético para actualizar 'detalles_tecnicos' en el estado padre
  const handleCambioDetalles = (e) => {
    const { name, value } = e.target;
    const nuevosDetalles = {
      ...detalles,
      [name]: name === "pasajeros" ? parseInt(value, 10) || 0 : value,
    };

    manejoCambioInputEdicion({
      target: {
        name: "detalles_tecnicos",
        value: JSON.stringify(nuevosDetalles),
      },
    });
  };

  // 3. Ejecución directa con prevención de doble submission
  const handleActualizar = async () => {
    if (cargando) return;

    setCargando(true);
    try {
      await actualizarCoche();
    } catch (error) {
      console.error("Error al actualizar vehículo en BD:", error);
    } finally {
      setCargando(false);
    }
  };

  // Validación declarativa de campos requeridos
  const esFormularioInvalido =
    !cocheEditar?.marca?.trim() ||
    !cocheEditar?.modelo?.trim() ||
    !cocheEditar?.placa?.trim() ||
    !cocheEditar?.valor_dia ||
    !cocheEditar?.id_categoria ||
    cargando;

  return (
    <Modal
      show={mostrarModalEdicion}
      onHide={() => setMostrarModalEdicion(false)}
      backdrop="static"
      keyboard={false}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title className="fs-5 fw-bold text-primary">
          <i className="bi bi-pencil-square me-2"></i>
          Editar Vehículo #{cocheEditar?.id_coche || ""}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 py-3">
        <Form>
          {/* SECCIÓN 1: DATOS GENERALES */}
          <h6 className="text-muted fw-bold mb-3">
            <i className="bi bi-info-circle me-1"></i> Información General
          </h6>

          {/* FILA 1: Categoría, Marca y Modelo */}
          <Row>
            <Col xs={12} md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Categoría *</Form.Label>
                <Form.Select
                  name="id_categoria"
                  value={cocheEditar?.id_categoria || ""}
                  onChange={manejoCambioInputEdicion}
                  required
                >
                  <option value="">Seleccione...</option>
                  {categorias.map((cat) => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nombre_categoria}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Marca *</Form.Label>
                <Form.Control
                  type="text"
                  name="marca"
                  value={cocheEditar?.marca || ""}
                  onChange={manejoCambioInputEdicion}
                  placeholder="Ej. Toyota"
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Modelo *</Form.Label>
                <Form.Control
                  type="text"
                  name="modelo"
                  value={cocheEditar?.modelo || ""}
                  onChange={manejoCambioInputEdicion}
                  placeholder="Ej. Corolla"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* FILA 2: Año, Placa y Color */}
          <Row>
            <Col xs={12} md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Año *</Form.Label>
                <Form.Control
                  type="number"
                  name="anio"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={cocheEditar?.anio || ""}
                  onChange={manejoCambioInputEdicion}
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Placa *</Form.Label>
                <Form.Control
                  type="text"
                  name="placa"
                  value={cocheEditar?.placa || ""}
                  onChange={manejoCambioInputEdicion}
                  placeholder="Ej. M 123-456"
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Color</Form.Label>
                <Form.Control
                  type="text"
                  name="color"
                  value={cocheEditar?.color || ""}
                  onChange={manejoCambioInputEdicion}
                  placeholder="Ej. Gris Metálico"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* FILA 3: Valor Día, Estado y Fecha Registro */}
          <Row>
            <Col xs={12} md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Valor por Día (C$) *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  name="valor_dia"
                  value={cocheEditar?.valor_dia || ""}
                  onChange={manejoCambioInputEdicion}
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Estado *</Form.Label>
                <Form.Select
                  name="estado"
                  value={cocheEditar?.estado || ""}
                  onChange={manejoCambioInputEdicion}
                  required
                >
                  <option value="">Seleccione estado...</option>
                  <option value="Disponible">Disponible</option>
                  <option value="En Alquiler">En Alquiler</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold text-muted">
                  Fecha Registro
                </Form.Label>
                <Form.Control
                  type="date"
                  value={
                    cocheEditar?.fecha_registro
                      ? cocheEditar.fecha_registro.split("T")[0]
                      : ""
                  }
                  readOnly
                  disabled
                  className="bg-light"
                />
              </Form.Group>
            </Col>
          </Row>

          <hr className="my-3" />

          {/* SECCIÓN 2: DETALLES TÉCNICOS */}
          <h6 className="text-muted fw-bold mb-3">
            <i className="bi bi-gear-wide-connected me-1"></i> Detalles Técnicos
          </h6>

          <Row>
            <Col xs={12} md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Pasajeros</Form.Label>
                <Form.Control
                  type="number"
                  name="pasajeros"
                  min="1"
                  max="60"
                  value={detalles.pasajeros ?? 5}
                  onChange={handleCambioDetalles}
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Combustible</Form.Label>
                <Form.Select
                  name="combustible"
                  value={detalles.combustible || "Gasolina"}
                  onChange={handleCambioDetalles}
                >
                  <option value="Gasolina">Gasolina</option>
                  <option value="Diésel">Diésel</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Eléctrico">Eléctrico</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Transmisión</Form.Label>
                <Form.Select
                  name="transmision"
                  value={detalles.transmision || "Automatico"}
                  onChange={handleCambioDetalles}
                >
                  <option value="Automatico">Automático</option>
                  <option value="Manual">Manual</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Badges de equipamiento */}
          {Array.isArray(detalles.equipamiento) && detalles.equipamiento.length > 0 && (
            <div className="mb-3">
              <Form.Label className="d-block text-muted small fw-semibold">
                Equipamiento detectado:
              </Form.Label>
              <div className="d-flex flex-wrap gap-1">
                {detalles.equipamiento.map((item, idx) => (
                  <Badge key={idx} bg="info" text="dark" className="fw-normal">
                    <i className="bi bi-check2 me-1"></i>
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <hr className="my-3" />

          {/* SECCIÓN 3: GESTIÓN DE IMAGEN */}
          {manejoCambioArchivoActualizar && (
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Imagen Actual</Form.Label>
                  {cocheEditar?.url_imagen ? (
                    <div className="mb-2">
                      <img
                        src={cocheEditar.url_imagen}
                        alt={`${cocheEditar.marca} ${cocheEditar.modelo}`}
                        className="rounded img-thumbnail shadow-sm"
                        style={{
                          maxWidth: "160px",
                          maxHeight: "100px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ) : (
                    <p className="text-muted small">Sin imagen asignada</p>
                  )}
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Nueva Imagen (Opcional)
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={manejoCambioArchivoActualizar}
                  />
                  <Form.Text className="text-muted small">
                    Si seleccionas un archivo, reemplazará la imagen actual en el bucket.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModalEdicion(false)}
          disabled={cargando}
        >
          Cancelar
        </Button>

        <Button
          variant="primary"
          onClick={handleActualizar}
          disabled={esFormularioInvalido}
        >
          {cargando ? (
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
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCoche;
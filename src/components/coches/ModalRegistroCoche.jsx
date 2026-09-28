import React, { useState, useMemo } from "react";
import {
  Modal,
  Form,
  Button,
  Row,
  Col,
  InputGroup,
  Spinner,
  Badge,
} from "react-bootstrap";

const ModalRegistroCoche = ({
  mostrarModal,
  setMostrarModal,
  nuevoCoche,
  manejoCambioInput,
  manejoCambioArchivo,
  categorias = [],
  agregarCoche,
  setMostrarModalCategoria,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  // 1. Deserialización segura de detalles_tecnicos (soporta String JSON o JS Object)
  const detalles = useMemo(() => {
    if (!nuevoCoche?.detalles_tecnicos) {
      return {
        pasajeros: 4,
        combustible: "Gasolina",
        transmision: "Manual",
        equipamiento: [],
      };
    }
    if (typeof nuevoCoche.detalles_tecnicos === "string") {
      try {
        return JSON.parse(nuevoCoche.detalles_tecnicos);
      } catch (e) {
        console.error("Error al parsear detalles_tecnicos:", e);
        return {
          pasajeros: 4,
          combustible: "Gasolina",
          transmision: "Manual",
          equipamiento: [],
        };
      }
    }
    return nuevoCoche.detalles_tecnicos;
  }, [nuevoCoche?.detalles_tecnicos]);

  const handleRegistrar = async () => {
    if (deshabilitado) return;

    try {
      setDeshabilitado(true);
      await agregarCoche();
    } catch (error) {
      console.error("Error al registrar el vehículo:", error);
    } finally {
      setDeshabilitado(false);
    }
  };

  // 2. Handler sintético para actualizar propiedades dentro de 'detalles_tecnicos'
  const handleCambioDetalles = (e) => {
    const { name, value } = e.target;
    const nuevosDetalles = {
      ...detalles,
      [name]: name === "pasajeros" ? parseInt(value, 10) || 0 : value,
    };

    // Propagamos hacia el padre como JSON stringify (manteniendo consistencia con la BD)
    manejoCambioInput({
      target: {
        name: "detalles_tecnicos",
        value: JSON.stringify(nuevosDetalles),
      },
    });
  };

  // 3. Validación declarativa corregida con los nombres de la BD (id_categoria)
  const esFormularioInvalido =
    !nuevoCoche?.marca?.trim() ||
    !nuevoCoche?.modelo?.trim() ||
    !nuevoCoche?.placa?.trim() ||
    !nuevoCoche?.valor_dia ||
    !nuevoCoche?.id_categoria ||
    deshabilitado;

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      keyboard={false}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title className="fs-5 fw-bold">
          <i className="bi bi-car-front-fill me-2 text-primary"></i>
          {nuevoCoche?.id_coche ? "Editar Vehículo" : "Registrar Vehículo"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {/* SECCIÓN 1: DATOS GENERALES */}
          <h6 className="text-muted fw-bold mb-3">
            <i className="bi bi-info-circle me-1"></i> Información General
          </h6>

          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Marca *</Form.Label>
                <Form.Control
                  type="text"
                  name="marca"
                  placeholder="Ej. Toyota, Hyundai..."
                  value={nuevoCoche?.marca || ""}
                  onChange={manejoCambioInput}
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Modelo *</Form.Label>
                <Form.Control
                  type="text"
                  name="modelo"
                  placeholder="Ej. Corolla, Accent..."
                  value={nuevoCoche?.modelo || ""}
                  onChange={manejoCambioInput}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Categoría *</Form.Label>
                <InputGroup>
                  <Form.Select
                    name="id_categoria"
                    value={nuevoCoche?.id_categoria || ""}
                    onChange={manejoCambioInput}
                    required
                  >
                    <option value="">Seleccione...</option>
                    {categorias.map((cat) => (
                      <option
                        key={cat.id_categoria}
                        value={cat.id_categoria}
                      >
                        {cat.nombre_categoria}
                      </option>
                    ))}
                  </Form.Select>

                  {setMostrarModalCategoria && (
                    <Button
                      variant="outline-primary"
                      onClick={() => setMostrarModalCategoria(true)}
                      title="Agregar nueva categoría"
                    >
                      <i className="bi bi-plus-lg"></i>
                    </Button>
                  )}
                </InputGroup>
              </Form.Group>
            </Col>

            <Col xs={12} md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Año</Form.Label>
                <Form.Control
                  type="number"
                  name="anio"
                  placeholder="2024"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={nuevoCoche?.anio || ""}
                  onChange={manejoCambioInput}
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Placa *</Form.Label>
                <Form.Control
                  type="text"
                  name="placa"
                  placeholder="M 123456"
                  value={nuevoCoche?.placa || ""}
                  onChange={manejoCambioInput}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={12} md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Color</Form.Label>
                <Form.Control
                  type="text"
                  name="color"
                  placeholder="Ej. Rojo, Blanco..."
                  value={nuevoCoche?.color || ""}
                  onChange={manejoCambioInput}
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Valor por Día (C$) *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  name="valor_dia"
                  placeholder="0.00"
                  value={nuevoCoche?.valor_dia || ""}
                  onChange={manejoCambioInput}
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  name="estado"
                  value={nuevoCoche?.estado || "Disponible"}
                  onChange={manejoCambioInput}
                >
                  <option value="Disponible">Disponible</option>
                  <option value="En Alquiler">En Alquiler</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <hr className="my-3" />

          {/* SECCIÓN 2: DETALLES TÉCNICOS (JSON anidado) */}
          <h6 className="text-muted fw-bold mb-3">
            <i className="bi bi-gear-wide-connected me-1"></i> Detalles Técnicos
          </h6>

          <Row>
            <Col xs={12} md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Pasajeros</Form.Label>
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
                <Form.Label>Combustible</Form.Label>
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
                <Form.Label>Transmisión</Form.Label>
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

          {/* Visualización rápida de equipamiento si existe */}
          {Array.isArray(detalles.equipamiento) && detalles.equipamiento.length > 0 && (
            <div className="mb-3">
              <Form.Label className="d-block text-muted small">Equipamiento incluido:</Form.Label>
              <div className="d-flex flex-wrap gap-1">
                {detalles.equipamiento.map((item, idx) => (
                  <Badge key={idx} bg="secondary" className="fw-normal">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <hr className="my-3" />

          {/* SECCIÓN 3: ARCHIVO / IMAGEN */}
          <Row>
            <Col xs={12}>
              <Form.Group className="mb-3">
                <Form.Label>Imagen del Vehículo</Form.Label>
                {nuevoCoche?.url_imagen && (
                  <div className="mb-2 d-flex align-items-center gap-3">
                    <img
                      src={nuevoCoche.url_imagen}
                      alt="Vista previa del coche"
                      style={{
                        width: "80px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                      className="border"
                    />
                    <span className="text-muted small">
                      Imagen actual. Sube un nuevo archivo para reemplazarla.
                    </span>
                  </div>
                )}
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={manejoCambioArchivo}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModal(false)}
          disabled={deshabilitado}
        >
          Cancelar
        </Button>

        <Button
          variant="primary"
          onClick={handleRegistrar}
          disabled={esFormularioInvalido}
        >
          {deshabilitado ? (
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
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCoche;
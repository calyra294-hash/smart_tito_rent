import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import fondo from "../assets/Resultado de imagen para imagenes para portada de pantalla.jpg"; // ajusta la ruta

const Inicio = () => {
  return (
    <div
  style={{
    backgroundImage: `url(${fondo})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    width: "100%",
    margin: 0,
    padding: 0
  }}
>
      <Container fluid className="p-0">
        <Row className="w-100">
          <Col>
            <h1></h1>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Inicio;
import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Pagina404 = () => {
  return (
    <Container className="mt-3">
      <Row className="align-items-center">
        <Col>
          <h2>
            <i className="bi bi-images me-2"></i> Página 404
          </h2>
        </Col>
      </Row>
    </Container>
  );
};

export default Pagina404;
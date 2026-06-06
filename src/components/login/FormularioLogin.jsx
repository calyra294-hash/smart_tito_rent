import React from "react";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Form, Button, Card, Alert } from "react-bootstrap";
import logo from "../../assets/logo-titos.png";


const FormularioLogin = ({
    usuario,
    contrasena,
    error,
    setUsuario,
    setContrasena,
    iniciarSesion,
}) => {

    const [mostrarContrasena, setMostrarContrasena] = useState(false);

    return (
        <Card
            className="login-card"
            style={{
                minWidth: "320px",
                maxWidth: "420px",
                width: "100%",
            }}
        >
            <Card.Body>

                <img
                    src={logo}
                    alt="Tito's Rent a Car"
                    className="logo-login"
                />

                <h2 className="text-center titulo-login">
                    Iniciar Sesión
                </h2>

                <p className="text-center subtitulo-login">
                    Bienvenido a Tito's Rent a Car
                </p>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Correo electrónico</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Ingresa tu correo"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Contraseña</Form.Label>

                        <div className="position-relative">
                            <Form.Control
                                type={mostrarContrasena ? "text" : "password"}
                                placeholder="Ingresa tu contraseña"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                style={{ paddingRight: "45px" }}
                            />

                            <span
                                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    right: "15px",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "#6c757d"
                                }}
                            >
                                {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </Form.Group>

                    <Button
                        className="btn-login"
                        onClick={iniciarSesion}
                    >
                        Iniciar Sesión
                    </Button>
                </Form>

            </Card.Body>
        </Card>
    );
};

export default FormularioLogin;
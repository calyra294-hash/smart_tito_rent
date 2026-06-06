import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Nav } from "react-bootstrap";
import logo from "../../assets/logo-titos.png";
import { supabase } from "../../database/supabaseconfig";

const Encabezado = () => {

    const navigate = useNavigate();

    const [usuarioLogueado, setUsuarioLogueado] = useState(false);
    const [temaOscuro, setTemaOscuro] = useState(
        localStorage.getItem("tema") === "dark"
    );

    useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
        setUsuarioLogueado(!!data.session);
    });

    const {
        data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
        setUsuarioLogueado(!!session);
    });

    return () => subscription.unsubscribe();
}, []);

    useEffect(() => {
        if (temaOscuro) {
            document.body.classList.add("dark-theme");
        } else {
            document.body.classList.remove("dark-theme");
        }

        localStorage.setItem(
            "tema",
            temaOscuro ? "dark" : "light"
        );
    }, [temaOscuro]);

    // =========================
    // NAVEGACIÓN
    // =========================
    const manejarNavegacion = (ruta) => {
        navigate(ruta);
    };

    // =========================
    // CERRAR SESIÓN
    // =========================
    const cerrarSesion = async () => {

        try {

            const { error } = await supabase.auth.signOut();

            if (error) throw error;

            localStorage.removeItem("usuario-supabase");

            navigate("/login");

        } catch (err) {

            console.error(
                "Error cerrando sesión:",
                err.message
            );
        }
    };

    const cambiarTema = () => {
        setTemaOscuro(!temaOscuro);
    };

    return (
        <>

            {/* ===== TOPBAR ===== */}
            <div className="topbar">

                <div
                    className="topbar-logo"
                    onClick={() => manejarNavegacion("/")}
                    style={{ cursor: "pointer" }}
                >

                    <img
                        src={logo}
                        alt="Logo Tito's Rent A Car"
                        className="logo-titos"
                    />

                </div>

                <div className="d-flex gap-2 align-items-center">
                    <button
                        className="btn btn-outline-light btn-sm"
                        type="button"
                        onClick={cambiarTema}
                    >
                        <i className={`bi ${temaOscuro ? "bi-moon-stars-fill" : "bi-sun-fill"}`}></i>
                    </button>
                    {usuarioLogueado && (
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={cerrarSesion}
                        >
                            <i className="bi bi-box-arrow-right me-2"></i>
                            Cerrar sesión
                        </button>
                    )}
                </div>

            </div>

            {/* ===== SIDEBAR ===== */}
            <div className="sidebar">

                <Nav className="flex-column">

                    <Nav.Link
                        onClick={() => manejarNavegacion("/")}
                        className="sidebar-link"
                    >
                        <i className="bi bi-house-fill me-2"></i>
                        Inicio
                    </Nav.Link>

                    <Nav.Link
                        onClick={() => manejarNavegacion("/alquileres")}
                        className="sidebar-link"
                    >
                        <i className="bi bi-bookmark-fill me-2"></i>
                        Alquileres
                    </Nav.Link>

                    <Nav.Link
                        onClick={() => manejarNavegacion("/coches")}
                        className="sidebar-link"
                    >
                        <i className="bi bi-car-front-fill me-2"></i>
                        Coches
                    </Nav.Link>

                    <Nav.Link
                        onClick={() => manejarNavegacion("/catalogo")}
                        className="sidebar-link"
                    >
                        <i className="bi bi-images me-2"></i>
                        Catálogo
                    </Nav.Link>

                    <Nav.Link
                        onClick={() => manejarNavegacion("/usuarios")}
                        className="sidebar-link"
                    >
                        <i className="bi bi-people-fill me-2"></i>
                        Usuarios
                    </Nav.Link>

                    <Nav.Link
                        onClick={() => manejarNavegacion("/empleados")}
                        className="sidebar-link"
                    >
                        <i className="bi bi-person-badge-fill me-2"></i>
                        Empleados
                    </Nav.Link>

                    <Nav.Link
                        onClick={() => manejarNavegacion("/dashboard")}
                        className="sidebar-link"
                    >
                        <i className="bi bi-person-badge-fill me-2"></i>
                        Dashboard
                    </Nav.Link>

                    <Nav.Link
                        onClick={() => manejarNavegacion("/mantenimientos")}
                        className="sidebar-link"
                    >
                        <i className="bi bi-tools me-2"></i>
                        Mantenimientos
                    </Nav.Link>

                </Nav>

            </div>

        </>
    );
};

export default Encabezado;
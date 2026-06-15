
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import { Nav } from "react-bootstrap";
import logo from "../../assets/logo-titos.png";
import { supabase } from "../../database/supabaseconfig";

const Encabezado = ({
    sidebarCollapsed,
    setSidebarCollapsed
}) => {

    
    const navigate = useNavigate();

    const location = useLocation();

    const [usuarioLogueado, setUsuarioLogueado] = useState(false);
    const [temaOscuro, setTemaOscuro] = useState(() => {
        return localStorage.getItem("tema") === "dark";
    });

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
        setTemaOscuro((prev) => !prev);
    };

    return (
        <>


            {/* ===== TOPBAR ===== */}
            <div className="topbar">

                <div className="d-flex align-items-center gap-3">

                    <button
                        className="btn btn-outline-light btn-sm"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    >
                        <i className="bi bi-list"></i>
                    </button>

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
            <div className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>

                <Nav className="flex-column">

                    <Nav.Link
                        title="Inicio"
                        onClick={() => manejarNavegacion("/")}
                        className="sidebar-link"
                    >
                        <i className="bi bi-house-fill"></i>
                        {!sidebarCollapsed && (
                            <span className="ms-2">Inicio</span>
                        )}
                    </Nav.Link>

                    <Nav.Link
                        title="Alquileres"
                        onClick={() => manejarNavegacion("/alquileres")}
                        className="sidebar-link"
                    >
                        <i className="bi bi-bookmark-fill"></i>
                        {!sidebarCollapsed && (
                            <span className="ms-2">Alquileres</span>
                        )}
                    </Nav.Link>

                    <Nav.Link
                        title="Coches"
                        onClick={() => manejarNavegacion("/coches")}
                        className="sidebar-link"
                    >
                        <i className="bi bi-car-front-fill"></i>
                        {!sidebarCollapsed && (
                            <span className="ms-2">Coches</span>
                        )}
                    </Nav.Link>

                    <Nav.Link
                        title="Catálogo"
                        onClick={() => manejarNavegacion("/catalogo")}
                        className="sidebar-link"
                    >
                        <i className="bi bi-images"></i>
                        {!sidebarCollapsed && (
                            <span className="ms-2">Catálogo</span>
                        )}
                    </Nav.Link>

                    <Nav.Link
                        title="Usuarios"
                        onClick={() => manejarNavegacion("/usuarios")}
                        className="sidebar-link"
                    >
                        <i className="bi bi-people-fill"></i>
                        {!sidebarCollapsed && (
                            <span className="ms-2">Usuarios</span>
                        )}
                    </Nav.Link>

                    <Nav.Link
                        title="Empleados"
                        onClick={() => manejarNavegacion("/empleados")}
                        className="sidebar-link"
                    >
                        <i className="bi bi-person-badge-fill"></i>
                        {!sidebarCollapsed && (
                            <span className="ms-2">Empleados</span>
                        )}
                    </Nav.Link>

                    <Nav.Link
                        title="Mantenimientos"
                        onClick={() => manejarNavegacion("/mantenimientos")}
                        className="sidebar-link"
                    >
                        <i className="bi bi-tools"></i>
                        {!sidebarCollapsed && (
                            <span className="ms-2">Mantenimientos</span>
                        )}
                    </Nav.Link>

                    <Nav.Link
                        title="Dashboard"
                        onClick={() => manejarNavegacion("/dashboard")}
                        className="sidebar-link"
                    >
                        <i className="bi bi-bar-chart-fill"></i>
                        {!sidebarCollapsed && (
                            <span className="ms-2">Dashboard</span>
                        )}
                    </Nav.Link>

                </Nav>

            </div>

        </>
    );
};

export default Encabezado;
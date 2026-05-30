import React from "react";
import fondo from "../assets/Inicio_fondo.jpg";

const Inicio = () => {
  return (
    <div className="contenido-principal">
      <div
        className="inicio-fondo"
        style={{
          backgroundImage: `url(${fondo})`
        }}
      >
        <div className="texto-inicio">
          <h3>Bienvenido al</h3>

          <h1>Sistema de Gestión</h1>

          <h2>Tito's Rent a Car</h2>

          <p>
            Gestiona alquileres, clientes, vehículos y
            mantenimientos desde una sola plataforma.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
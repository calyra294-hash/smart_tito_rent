import React from "react";
import fondo from "../assets/Resultado de imagen para imagenes para portada de pantalla.jpg";

const Inicio = () => {

  return (

    <div className="contenido-principal">

      <div
        className="inicio-fondo"
        style={{
          backgroundImage: `url(${fondo})`
        }}
      >

      </div>

    </div>

  );
};

export default Inicio;
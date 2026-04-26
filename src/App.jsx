import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Encabezado from "./components/navegation/Encabezado.jsx";

import Inicio from "./views/Inicio";
import Catalogo from "./views/Catalogo.jsx"; 
import Alquileres from "./views/Alquileres";
import Coches from "./views/Coches";
import Detalles_Alquiler from "./views/Detalles_Alquiler.jsx"; 
import Detalles_Mantenimiento from "./views/Detalles_Mantenimiento.jsx"; 
import Empleados from "./views/Empleados.jsx"; 
import Mantenimientos from "./views/Mantenimientos.jsx"; 
import Usuarios from "./views/Usuarios.jsx"; 

import Login from "./views/Login";
import RutaProtegida from "./components/rutas/RutaProtegida";
import Pagina404 from "./views/Pagina404";

import "./App.css";

import './App.css'

const App = () => {
  return (
    <Router>

      <Encabezado />

      <main className="margen-superior-main">
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RutaProtegida><Inicio /></RutaProtegida>} />
          <Route path="/catalogo" element={<Catalogo />} />

          <Route path="/alquileres" element={<RutaProtegida><Alquileres /></RutaProtegida>} />
          <Route path="/coches" element={<RutaProtegida><Coches /></RutaProtegida>} />
          <Route path="/detalles_alquiler" element={<RutaProtegida><Detalles_Alquiler /></RutaProtegida>} />
          <Route path="/detalles_mantenimiento" element={<RutaProtegida><Detalles_Mantenimiento /></RutaProtegida>} />
          <Route path="/empleados" element={<RutaProtegida><Empleados /></RutaProtegida>} />
          <Route path="/mantenimientos" element={<RutaProtegida><Mantenimientos /></RutaProtegida>} />
          <Route path="/usuarios" element={<RutaProtegida><Usuarios /></RutaProtegida>} />


          <Route path="*" element={<Pagina404 />} />

        </Routes>
      </main>
    </Router>
  );
}


export default App;